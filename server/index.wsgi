import sae
import sys
import os
sys.setdefaultencoding('utf-8')
app_root = os.path.dirname(__file__) 
sys.path.insert(0, os.path.join(app_root, 'requests-2.7.0')) 
sys.path.insert(0, os.path.join(app_root, 'peewee-2.6.3'))
sys.path.insert(0, os.path.join(app_root, 'passlib-1.6.5'))
sys.path.insert(0, os.path.join(app_root, 'six-1.9.0'))
sys.path.insert(0, os.path.join(app_root, 'Flask-RESTful-0.3.4'))
sys.path.insert(0, os.path.join(app_root, 'Flask-Cors-2.1.0'))
from app import app
import db

#db.create_tables()
application = sae.create_wsgi_app(app)

