from webapp import app, RECOM
from flask import Flask, render_template, request, jsonify
import json
import sys
import pandas as pd


@app.route('/')
def home():
    return render_template('home.html')


@app.route("/search", methods=['GET'])
def search():
    # get the search request
    query = request.args.get('query', 'Dynamics of lunar magmatic intrusions')
    rquery = RECOM.get_recomendation(query)
    return render_template('search.html', rquery=rquery)


@app.route("/collab/_refresh_collab", methods=['GET'])
def refresh_collab():
    iso3 = request.args.get('country', '')
    query = request.args.get('query', '')
    collabs = RECOM.get_collaborators(query)
    country = RECOM.iso3_to_country(iso3)
    return jsonify(collabs[collabs.country == country].to_dict('index'))


@app.route("/collab/_refresh_nb_collab", methods=['GET'])
def refresh_nb_collab():
    nb = request.args.get('nb', '')
    query = request.args.get('query', '')
    RECOM.n_base_recom = int(nb)
    nbcollabs, data, colors = RECOM.get_map_specification(query)
    return jsonify({'data': data, 'colors': colors, 'query': query, 'nbcollabs': nbcollabs})


@app.route("/collab", methods=['GET'])
def collab():
    # get the search request
    query = request.args.get(
        'query', 'Dynamics of magmatic intrusions: laccoliths')
    nb_collab, data, colors = RECOM.get_map_specification(query)
    return render_template('collab.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nb_collab=nb_collab,
                           query=query)


@app.route("/about", methods=['GET'])
def about():
    return render_template('about.html')
