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

# TO DO
def validate_login(uid):
    return True

@bp_app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == 'POST':
        if session.get('uid'):
            abort(404)
        uid = request.form.get('uid')
        if uid and validate_login(uid):
            session['uid'] = uid
            return (jsonify({'success':True}), 201)
        else:
            abort(404)
    else:
        return render_template('main.html')

@bp_app.route("/publish", methods=["GET", "POST"])
def publish():
    if request.method == 'POST':
        uid = session.get('uid')
        if uid and validate_login(uid):
            req = dict(request.form)
            req['user_uid'] = uid
            if requests.post(API_URL+"/post", data=req):
                return (jsonify({'success':True}), 201)
            else:
                abort(404)
        else:
            return (jsonify({'success':False, 'message': 'Usuario nao logado ou uid invalido'}), 404)
    else:
        return render_template('main.html')


@bp_app.route("/sair")
def sair():
    session['uid'] = None
    session.clear()
    return redirect('/')

@bp_app.route("/offline.html")
def offline():
    return render_template('offline.html')

@bp_app.route("/service-worker.js")
def sw():
    return send_from_directory('static', 'service-worker.js')

@bp_app.route("/favicon.ico")
def favicon():
    return send_from_directory('static', 'favicon.ico')


 



#TO DO: MOVE TO API

@bp_app.route("/api")
def api():
    #import time
    #time.sleep(1)
    return {
        'post_array' : [
                        {'post_id': 28, 'text': "Lorem ipsum bla bla"},
                        {'post_id': 29, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 30, 'text': "Lorem ipsum bla bla"},
                        {'post_id': 28, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 29, 'text': "Lorem ipsum bla bla"},
                        {'post_id': 30, 'text': "Lorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 28, 'text': "Lorem ipsum bla bla"},
                        {'post_id': 29, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 30, 'text': "Lorem ipsum bla bla"},
                        {'post_id': 28, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 29, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 30, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 28, 'text': "Lorem ipsum bla bla"},
                        {'post_id': 29, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                        {'post_id': 30, 'text': "Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla"},
                       ]
    }


#def serve_pil_image(pil_img, name):
#    import io
#    img_io = io.BytesIO()
#    pil_img.save(img_io, 'PNG')
#    img_io.seek(0)
#    return send_file(img_io, mimetype='image/png', attachment_filename=str(name)+'.png' , as_attachment=True)

#@bp_app.route("/api/qr")
#def api_qr():
#    import segno
#    import io
#    import base64
#    import uuid
#    from PIL import Image
#    #random md5
#    code = uuid.uuid4().hex
#    #print(code)
#    #segno
#    qr = segno.make_qr(code, error="H", version=6)
#    buff = io.BytesIO()
#    qr.save(buff, scale=5, kind='png', border=8) #, light='purple')
#    #pillow
#    im1 = Image.open('base.png')
#    im2 = Image.open(buff)
#    im1.paste(im2.resize( (169,169) ) , (104, 10))
#    #to base64
#    buff2 = io.BytesIO()
#    im1.save(buff2, format="PNG")
#    img_str = base64.b64encode(buff2.getvalue())
#    
#    #response = serve_pil_image(im1, "H")
#    #response.cache_control.max_age = 300
#    #response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
#    #response.headers['Pragma'] = 'no-cache'

    return img_str
