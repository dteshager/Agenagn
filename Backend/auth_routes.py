# auth_routes.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models import db, User, Post, PostImage
import os
import uuid

auth_bp = Blueprint('auth', __name__)

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_IMAGES = 3

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'Username or email already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        # You can generate a JWT token here
        return jsonify({'message': 'Login successful', 'user_id': user.id, 'email': user.email})

    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/CreatePost', methods=['POST'])
def create_post():
    try:
        # Get form data
        title = request.form.get('title')
        content = request.form.get('content')
        post_type = request.form.get('post_type')
        location = request.form.get('location')
        contact_info = request.form.get('contact_info')
        user_email = request.form.get('user_email')

        if not title or not content or not post_type or not user_email:
            return jsonify({'error': 'Title, content, post type, and user email are required'}), 400

        # Find user by email
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 400

        # Create new post
        new_post = Post(
            title=title,
            content=content,
            post_type=post_type,
            location=location,
            contact_info=contact_info,
            user_id=user.id
        )
        
        db.session.add(new_post)
        db.session.flush()  # This gives us the post ID

        # Handle image uploads
        uploaded_files = request.files.getlist('images')
        if uploaded_files and len(uploaded_files) > MAX_IMAGES:
            return jsonify({'error': f'Maximum {MAX_IMAGES} images allowed'}), 400

        for uploaded_file in uploaded_files:
            if uploaded_file and uploaded_file.filename != '' and allowed_file(uploaded_file.filename):
                # Generate unique filename
                filename = secure_filename(uploaded_file.filename)
                unique_filename = f"{uuid.uuid4()}_{filename}"
                filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
                
                # Save file
                uploaded_file.save(filepath)
                
                # Save image record to database
                post_image = PostImage(
                    post_id=new_post.id,
                    image_url=f'/uploads/{unique_filename}',
                    image_filename=unique_filename
                )
                db.session.add(post_image)

        db.session.commit()
        return jsonify({'message': 'Post created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create post: {str(e)}'}), 500

@auth_bp.route('/posts/<post_type>', methods=['GET'])
def get_posts_by_type(post_type):
    posts = Post.query.filter_by(post_type=post_type).all()
    posts_data = []
    
    for post in posts:
        # Get all images for this post
        images = [{'url': img.image_url, 'filename': img.image_filename} for img in post.images]
        
        posts_data.append({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'post_type': post.post_type,
            'location': post.location,
            'contact_info': post.contact_info,
            'images': images,
            'created_at': post.created_at.isoformat() if post.created_at else None,
            'user_email': post.user.email
        })
    
    return jsonify({'posts': posts_data}), 200
