from flask import Flask
from app.ext import db
from app.blueprints import user
from app.blueprints import post
from app.blueprints import website


def create_app():
    app = Flask(__name__)
    app.config.from_object("config")
    
    # Extensions
    db.configure(app)

    # Blueprints
    website.configure(app)
    user.configure(app)
    post.configure(app)

    return app
