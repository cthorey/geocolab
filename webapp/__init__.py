import os
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

# Load the model
RECOM = RecomendationSystem('LSA_500')
Qry = Query()

import webapp.routes
