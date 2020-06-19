from flask import Blueprint, request, jsonify, abort
from app.models.tables import Post
from app.models.tables import Chat
from app.ext.db import db
from datetime import datetime, date

PAGE = "/chat"

bp_app = Blueprint("chat", __name__, url_prefix='/api')

#https://www.restapitutorial.com/lessons/httpmethods.html

def configure(app):
    app.register_blueprint(bp_app)

@bp_app.route(PAGE, methods=["POST"])
def create():
    abort(404)

@bp_app.route(PAGE, methods=["GET"])
def read():
    abort(404)

@bp_app.route(PAGE + "/<int:id>", methods=["GET"])
def read_id(id):
    abort(404)

@bp_app.route(PAGE + "/<int:id>", methods=["PUT"])
def update(id):
    abort(404)

@bp_app.route(PAGE + "/<int:id>", methods=["DELETE"])
def delete(id):
    abort(404)
