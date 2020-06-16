from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def configure(app):
    db.init_app(app)
    app.db = db
    with app.app_context():
        db.create_all()
