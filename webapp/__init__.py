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

# Load the db from s3
name_model = 'LSA_500'
s3 = S3geocolab()
s3.download_db()

# Load the model
RECOM = RecomendationSystem(name_model, prod=True)
Qry = Query()

import webapp.routes
