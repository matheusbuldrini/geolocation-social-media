from app.ext.db import db
from dataclasses import dataclass

#dataclass:
#https://stackoverflow.com/a/57732785

@dataclass
class User(db.Model):
    __tablename__ = "user"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username: str = db.Column(db.String)
