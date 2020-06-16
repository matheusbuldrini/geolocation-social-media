from flask import Blueprint, request, jsonify, abort
from app.models.tables import User
from app.ext.db import db

PAGE = "/user"

bp_app = Blueprint("user", __name__, url_prefix='/api')

#https://www.restapitutorial.com/lessons/httpmethods.html

def configure(app):
    app.register_blueprint(bp_app)

@bp_app.route(PAGE, methods=["POST"])
def create():
    username = request.form.get('username')
    user = User(username=username)
    db.session.add(user)
    db.session.commit()
    return (jsonify(user), 201)

@bp_app.route(PAGE, methods=["GET"])
def read():
    users = User.query.all()
    return (jsonify(users), 200)

@bp_app.route(PAGE + "/<int:id>", methods=["GET"])
def read_id(id):
    user = User.query.get(id)
    if not user:
        abort(404)
    return (jsonify(user), 200)

@bp_app.route(PAGE + "/<int:id>", methods=["PUT"])
def update(id):
    user = User.query.get(id)
    if not user:
        abort(404)
    user.username = request.form.get('username')
    db.session.commit()
    return (jsonify(user), 200)

@bp_app.route(PAGE + "/<int:id>", methods=["DELETE"])
def delete(id):
    user = User.query.get(id)
    if not user:
        abort(404)
    db.session.delete(user)
    db.session.commit()
    return (jsonify(user), 200)
   
