import os
import boto3
from flask import Flask
import sys
sys.path.append('../')
from src.model.recomendation import *

if os.path.isfile('secret_key.txt'):
    SECRET_KEY = open('secret_key.txt', 'r').read()
else:
    SECRET_KEY = 'devkey, should be in a file'

app = Flask(__name__)
app.config.from_object(__name__)

# Load file from s3 if not exist
name_model = 'LSA_500'
download_model(name_model)
dowload_db()

# Load the model
RECOM = RecomendationSystem(name_model)
Qry = Query()

import webapp.routes
