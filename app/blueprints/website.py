from flask import Blueprint, render_template, send_from_directory, send_file, session, request, abort, redirect, jsonify
import requests
import os

API_URL = os.environ['API_URL']

bp_app = Blueprint("website", __name__)

def configure(app):
    app.register_blueprint(bp_app)


@bp_app.route("/")
def home():
    return render_template('main.html')


@bp_app.route("/p/<int:post_id>/")
def post(post_id):
    return render_template('main.html')

def get_id_by_uid(uid):
    req = requests.get(API_URL+"/user/"+uid)
    if req:
        return req.json()['id']
    else:
        abort(404)

@bp_app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == 'POST':
        if session.get('uid'):
            abort(404)
        uid = request.form.get('uid')
        print(uid)
        _id = get_id_by_uid(uid)
        if uid and _id:
            session['uid'] = uid
            session['id'] = _id
            return (jsonify({'success':True}), 201)
        else:
            abort(404)
    else:
        return render_template('main.html')

@bp_app.route("/publish", methods=["GET", "POST"])
def publish():
    if request.method == 'POST':
        uid = session.get('uid')
        if uid:
            req = dict(request.form)
            req['user_uid'] = uid
            if requests.post(API_URL+"/post", data=req):
                return (jsonify({'success':True}), 201)
            else:
                abort(404)
        else:
            return (jsonify({'success':False, 'message': 'login-error'}), 404)
    else:
        return render_template('main.html')



@bp_app.route("/chat", methods=["GET"])
def chat():
    _id = session.get('id')
    print('*****************')
    print(_id)
    if _id:
        req = requests.get(API_URL+"/chat", {'user_id' : _id})
        if req:
            return ({'chats': req.json()}, 201)
        else:
            abort(404)
    else:
        return (jsonify({'success':False, 'message': 'login-error'}), 404)

@bp_app.route("/sair")
def sair():
    session['uid'] = None
    session['id'] = None
    session.clear()
    return render_template('main.html')

@bp_app.route("/offline.html")
def offline():
    return render_template('offline.html')

@bp_app.route("/service-worker.js")
def sw():
    return send_from_directory('static', 'service-worker.js')

@bp_app.route("/favicon.ico")
def favicon():
    return send_from_directory('static', 'favicon.ico')