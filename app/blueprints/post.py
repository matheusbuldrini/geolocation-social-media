from flask import Blueprint, request, jsonify, abort
from app.models.tables import Post
from app.ext.db import db

PAGE = "/post"

bp_app = Blueprint("post", __name__, url_prefix='/api')

#https://www.restapitutorial.com/lessons/httpmethods.html

def configure(app):
    app.register_blueprint(bp_app)

@bp_app.route(PAGE, methods=["POST"])
def create():
    user_id = request.form.get('user_id')
    text = request.form.get('text')
    location_lat = request.form.get('location_lat')
    location_long = request.form.get('location_long')
    post = Post(user_id=user_id, text=text, location_lat=location_lat, location_long=location_long)
    db.session.add(post)
    db.session.commit()
    return (jsonify(post), 201)

@bp_app.route(PAGE, methods=["GET"])
def read():
    posts = Post.query.all()
    return (jsonify(posts), 200)

@bp_app.route(PAGE + "/<int:id>", methods=["GET"])
def read_id(id):
    post = Post.query.get(id)
    if not post:
        abort(404)
    return (jsonify(post), 200)

@bp_app.route(PAGE + "/<int:id>", methods=["PUT"])
def update(id):
    abort(404)
    #post = Post.query.get(id)
    #if not user:
    #    abort(404)
    #user.username = request.form.get('username')
    #db.session.commit()
    #return (jsonify(user), 200)

@bp_app.route(PAGE + "/<int:id>", methods=["DELETE"])
def delete(id):
    post = Post.query.get(id)
    if not post:
        abort(404)
    db.session.delete(post)
    db.session.commit()
    return (jsonify(post), 200)
   
