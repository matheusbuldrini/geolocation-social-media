from app.ext.db import db
from dataclasses import dataclass
from typing import List
from datetime import datetime

#dataclass:
#https://stackoverflow.com/a/57732785

@dataclass 
class Post(db.Model):
    __tablename__ = "post"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id: int = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text: str = db.Column(db.Text)
    location_lat: float = db.Column(db.Float)
    location_long: float = db.Column(db.Float)
    created_date: datetime = db.Column(db.DateTime(), server_default=db.func.now(), nullable=False)

@dataclass
class User(db.Model):
    __tablename__ = "user"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid: str = db.Column(db.String(40), unique=True, nullable=False)
    name: str = db.Column(db.String(40), nullable=False)
    posts: List[Post] = db.relationship('Post', backref='user', lazy=True)
