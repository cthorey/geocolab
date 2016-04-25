from webapp import app, RECOM
from flask import Flask, render_template, request
import json
import sys


@app.route('/')
def home():
    return render_template('home.html')


@app.route("/search", methods=['GET'])
def search():

    # get the search request
    query = request.args.get('query', 'Dynamics of lunar magmatic intrusions')
    rquery = RECOM.get_recomendation(query, 10)
    return render_template('search.html', rquery=rquery)


@app.route("/collab", methods=['GET'])
def collab():

    # get the search request
    query = request.args.get('query', 'Dynamics of lunar magmatic intrusions')
    collabs = RECOM.get_collaborators(query, 10)
    data, colors = RECOM.get_map_specification(query)
    return render_template('collab.html', data=json.dumps(data), colors=json.dumps(colors), collabs=collabs)


@app.route("/about", methods=['GET'])
def about():
    return render_template('about.html')
