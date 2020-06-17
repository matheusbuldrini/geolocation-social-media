from flask import Blueprint, render_template, send_from_directory, send_file

bp_app = Blueprint("website", __name__)

def configure(app):
    app.register_blueprint(bp_app)


@bp_app.route("/")
def home():
    return render_template('main.html')


@bp_app.route("/p/<int:post_id>/")
def post(post_id):
    return render_template('main.html')

@bp_app.route("/login")
def login():
    return render_template('main.html')

@bp_app.route("/publish")
def publish():
    return render_template('main.html')


@bp_app.route("/sair")
def sair():
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


def serve_pil_image(pil_img, name):
    import io
    img_io = io.BytesIO()
    pil_img.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png', attachment_filename=str(name)+'.png' , as_attachment=True)

@bp_app.route("/api/qr")
def api_qr():
    import segno
    import io
    import base64
    import uuid
    from PIL import Image
    #random md5
    code = uuid.uuid4().hex
    print(code)
    #segno
    qr = segno.make_qr(code, error="H", version=6)
    buff = io.BytesIO()
    qr.save(buff, scale=5, kind='png', border=8) #, light='purple')
    #pillow
    im1 = Image.open('base.png')
    im2 = Image.open(buff)
    im1.paste(im2.resize( (169,169) ) , (104, 10))

    response = serve_pil_image(im1, "H")
    #response.cache_control.max_age = 300
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    return response
    #return serve_pil_image(im1, code)
