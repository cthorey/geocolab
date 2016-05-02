from webapp import app, RECOM, Qry
from flask import Flask, render_template, request, jsonify
import json
import sys
import pandas as pd


####################################################
# Home
####################################################

@app.route('/')
def home():
    return render_template('home.html')

####################################################
# Collaborators search
####################################################


@app.route("/query_based/_refresh_collab", methods=['GET'])
def _refresh_collab():
    iso3 = request.args.get('country', '')
    collabs = RECOM.get_collaborators(Qry.get_query())
    country = RECOM.iso3_to_country(iso3)
    return jsonify(collabs[collabs.country == country].to_dict('index'))


@app.route("/query_based/_refresh_nbcollab", methods=['GET'])
def _refresh_nbcollab():
    nb = request.args.get('nb', '')
    RECOM.n_base_recom = int(nb)
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return jsonify({'data': data, 'colors': colors, 'query': Qry.get_query(), 'nbcollabs': nbcollabs})


@app.route("/query_based", methods=['GET'])
def query_based():
    # get the search request
    search = request.args.get(
        'search', 'Dynamics of magmatic intrusions: laccoliths')
    Qry.query2query(search)
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return render_template('query_based.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           search=search,
                           query=Qry.get_query())


@app.route("/abstract_based_sblink", methods=['GET'])
def abstract_based_sblink():
    # get the search request
    link = request.args.get(
        'search', 'https://agu.confex.com/agu/fm15/meetingapp.cgi/Paper/67077')
    # Look if the abstract exist
    Qry.link2query(link)
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return render_template('abstract_based_sblink.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           search=link,
                           query=Qry.get_query())


@app.route("/abstract_based_sbtitle", methods=['GET'])
def abstract_based_sbtitle():
    # get the search request
    title = request.args.get(
        'search', '')
    # Look if the abstract exist
    Qry.title2query(title)
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return render_template('abstract_based_sbtitle.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           search=title,
                           query=Qry.get_query())


@app.route("/abstract_based_sbauthor", methods=['GET'])
def abstract_based_sbauthor():
    # get the search request
    author = request.args.get(
        'search', 'Clement Thorey')
    # Look if the abstract exist
    Qry.author2query(author)
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return render_template('abstract_based_sbauthor.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           search=author,
                           query=Qry.get_query())

####################################################
# Plan your journey
####################################################


@app.route("/query_based_journey/_get_schedule_day", methods=['GET'])
def _get_schedule_day():
    day = request.args.get('day', 'Monday')
    df = RECOM.get_schedule_bday(Qry.get_query(), day)
    dfg = df.groupby('type')
    posters = dfg.get_group('poster').to_dict('index')
    orals = dfg.get_group('oral').to_dict('index')
    return jsonify({'orals': orals, 'posters': posters})


@app.route("/query_based_journey", methods=['GET'])
def query_based_journey():
    # get the search request
    search = request.args.get(
        'search', 'Dynamics of magmatic intrusions: laccoliths')
    Qry.query2query(search)
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return render_template('query_based_journey.html',
                           search=search,
                           query=Qry.get_query())
