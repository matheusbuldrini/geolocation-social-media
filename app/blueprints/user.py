from flask import Blueprint, request, jsonify, abort
from app.models.tables import User
from app.ext.db import db

PAGE = "/user"

bp_app = Blueprint("user", __name__, url_prefix='/api')

#https://www.restapitutorial.com/lessons/httpmethods.html

def configure(app):
    app.register_blueprint(bp_app)


def get_uid():
    import uuid
    return uuid.uuid4().hex   

def get_rand_name():
    return "nomeeee"

def get_ticket_png(code):
    import segno
    import io
    import base64
    from PIL import Image

    #segno
    qr = segno.make_qr(code, error="H", version=6)
    buff = io.BytesIO()
    qr.save(buff, scale=5, kind='png', border=8) #, light='purple')
    #pillow
    im1 = Image.open('base.png')
    im2 = Image.open(buff)
    im1.paste(im2.resize( (169,169) ) , (104, 10))
    #to base64
    buff2 = io.BytesIO()
    im1.save(buff2, format="PNG")
    img_str = base64.b64encode(buff2.getvalue())
    return img_str.decode()

@bp_app.route(PAGE, methods=["POST"])
def create():
    uid = get_uid()
    name = get_rand_name()
    user = User(uid=uid, name=name)
    db.session.add(user)
    db.session.commit()

    img = get_ticket_png(uid)

    return (jsonify({'uid': uid, 'ticket': img}), 201)

@bp_app.route(PAGE, methods=["GET"])
def read():
    users = User.query.all()
    return (jsonify(users), 200)

@bp_app.route(PAGE + "/<string:id>", methods=["GET"])
@bp_app.route(PAGE + "/<int:id>", methods=["GET"])
def read_id(id):
    if type(id) == 'str':
        user = User.query.get(id)
    else:
        user = User.query.filter(User.uid == id).first()
    if not user:
        abort(404)
    return (jsonify(user), 200)




@bp_app.route(PAGE + "/<int:id>", methods=["PUT"])
def update(id):
    abort(404)
    #user = User.query.get(id)
    #if not user:
    #    abort(404)
    #user.username = request.form.get('username')
    #db.session.commit()
    #return (jsonify(user), 200)

@bp_app.route(PAGE + "/<int:id>", methods=["DELETE"])
def delete(id):
    user = User.query.get(id)
    if not user:
        abort(404)
    db.session.delete(user)
    db.session.commit()
    return (jsonify(user), 200)
   
