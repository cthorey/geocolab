import os
from flask import Flask
import sys
sys.path.append('../')
from geocolab.Data_Utils import *

if os.path.isfile('secret_key.txt'):
    SECRET_KEY = open('secret_key.txt', 'r').read()
else:
    SECRET_KEY = 'devkey, should be in a file'

app = Flask(__name__)
app.config.from_object(__name__)

# Load the model
path_model = '/Users/thorey/Documents/project/agu_data/geocolab/data/model_abstract'
RECOM = RecomendationSystem(path_model)

import webapp.routes
