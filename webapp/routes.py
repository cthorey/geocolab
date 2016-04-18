from webapp import app
from flask import Flask, render_template, request
import sys
sys.path.append('../')
from geocolab.Data_Utils import *

path_model = '/Users/thorey/Documents/project/geocolab/data/model_abstract'
RECOM = RecomendationSystem(path_model)


@app.route('/')
def home():
    return render_template('home.html')


@app.route("/search", methods=['GET'])
def search():
    query = request.args.get('query', '')  # get the search request
    # perform the query and get sorted documents
    rquery = RECOM.get_recomendation(query, 10)
    return render_template('search.html', rquery=rquery)
