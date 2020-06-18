from flask import Blueprint, request, jsonify, abort
from app.models.tables import Post
from app.models.tables import User
from app.ext.db import db
from datetime import datetime, date

PAGE = "/post"

bp_app = Blueprint("post", __name__, url_prefix='/api')

#https://www.restapitutorial.com/lessons/httpmethods.html

def configure(app):
    app.register_blueprint(bp_app)

@bp_app.route(PAGE, methods=["POST"])
def create():
    print(dict(request.form))
    user_uid = request.form.get('user_uid')

    user = User.query.filter(User.uid == user_uid).first()
    if user:
        user_id = user.id
        text = request.form.get('text')
        location_lat = request.form.get('location_lat')
        location_long = request.form.get('location_long')
        post = Post(user_id=user_id, text=text, location_lat=location_lat, location_long=location_long)
        db.session.add(post)
        db.session.commit()
        return (jsonify(post), 201)
    abort(404)

def validate_date(date_text):
    try:
        datetime.strptime(date_text, "%Y-%m-%d %H:%M:%S")
        return True
    except ValueError:
        return False

@bp_app.route(PAGE, methods=["GET"])
def read():
    requested_date = request.args.get('requested_date', default = None,  type = str)
    page = request.args.get('page', default = 1,  type = int)
    per_page = 20
    max_per_page = 20
    if requested_date and validate_date(requested_date):
        posts = Post.query.filter(Post.created_date < requested_date).order_by(Post.created_date.desc()).paginate(page=page,per_page=per_page,max_per_page=max_per_page,error_out=True).items
    else:
        posts = Post.query.order_by(Post.created_date.desc()).limit(10).all()
    
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
   
