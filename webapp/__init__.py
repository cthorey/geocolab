import os
import boto3
from flask import Flask
import sys
sys.path.append('../')
from src.model.recomendation import *
import time

app = Flask(__name__)

# Load the default configuration
app.config.from_object('config.default')

# Load the file specified by the APP_CONFIG_FILE environment variable
# Variables defined here will override those in the default configuration
app.config.from_envvar('APP_CONFIG_FILE')
# Load the db from s3

if app.config['PROD']:
    s3 = S3geocolab()
    s3.download_db()

# Load the model
print app.config['MODEL']
RECOM = RecomendationSystem(app.config['MODEL'],
                            prod=app.config['PROD'])
Qry = Query()

import webapp.routes
