from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from models import db
import os


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)
    
    # Configure CORS to allow all localhost origins
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "http://localhost:5179"], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    db.init_app(app)
    
    with app.app_context():
        from models import User, Post, PostImage
        db.create_all()

        from auth_routes import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api')

    @app.route('/')
    def home():
        return "Welcome to the Flask App!"
    
    # Route to serve uploaded images
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory('uploads', filename)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)