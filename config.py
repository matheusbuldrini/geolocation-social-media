import os
import string
import random

BASE_DIR = os.path.abspath('.')

DEBUG = True

SECRET_KEY = ''.join(random.choice(string.ascii_letters) for i in range(42))

#SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite')
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://fqbm52xovhg5aqvg:dwa2nj7iana6cei1@un0jueuv2mam78uv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/kpwsnw49ild5dw7z'

SQLALCHEMY_TRACK_MODIFICATIONS = False
