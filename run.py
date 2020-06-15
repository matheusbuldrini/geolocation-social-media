from flask import Flask, flash, render_template, request, abort, send_file, redirect, url_for, send_from_directory
import os
import json

app = Flask(__name__)

app.secret_key = '3f578nd697rmnd90843mx0idjcm048xcr239048rcmiodmwxc12390xc90'

@app.route("/")
def home():
    return render_template('main.html')


@app.route("/p/<int:post_id>/")
def post(post_id):
    return render_template('main.html')

@app.route("/login")
def login():
    return render_template('main.html')


@app.route("/sair")
def sair():
    return redirect('/')

@app.route("/offline.html")
def offline():
    return render_template('offline.html')


@app.route("/api")
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

@app.route("/api/qr")
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

@app.route("/pwabuilder-sw.js")
def sw():
    return send_from_directory('static', 'pwabuilder-sw.js')

@app.route("/favicon.ico")
def favicon():
    return send_from_directory('static', 'favicon.ico')

if __name__ == "__main__":
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 80))
    app.run(host='0.0.0.0', port=port, debug=True)
