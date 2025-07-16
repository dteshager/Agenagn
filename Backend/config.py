# config.py
print("Loaded config.py from:", __file__)
import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'agenagn.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
