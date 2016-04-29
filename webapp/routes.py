from webapp import app, RECOM
from flask import Flask, render_template, request, jsonify
import json
import sys
import pandas as pd


class Query(object):

    def __init__(self):
        self.query = ""

    def set_query(self, query):
        self.query = query

    def get_query(self):
        return self.query

Q = Query()


@app.route('/')
def home():
    return render_template('home.html')


@app.route("/query_based/_refresh_collab", methods=['GET'])
def _refresh_collab():
    iso3 = request.args.get('country', '')
    collabs = RECOM.get_collaborators(Q.get_query())
    country = RECOM.iso3_to_country(iso3)
    return jsonify(collabs[collabs.country == country].to_dict('index'))


@app.route("/query_based/_refresh_nbcollab", methods=['GET'])
def _refresh_nbcollab():
    nb = request.args.get('nb', '')
    RECOM.n_base_recom = int(nb)
    nbcollabs, data, colors = RECOM.get_map_specification(Q.get_query())
    return jsonify({'data': data, 'colors': colors, 'query': Q.get_query(), 'nbcollabs': nbcollabs})


@app.route("/query_based", methods=['GET'])
def query_based():
    # get the search request
    search = request.args.get(
        'search', 'Dynamics of magmatic intrusions: laccoliths')
    Q.set_query(search)
    nbcollabs, data, colors = RECOM.get_map_specification(Q.get_query())
    return render_template('query_based.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           search=search,
                           query=Q.get_query())


@app.route("/abstract_based_sblink", methods=['GET'])
def abstract_based_sblink():
    # get the search request
    link = request.args.get(
        'query', 'https://agu.confex.com/agu/fm15/meetingapp.cgi/Paper/67077')
    # Look if the abstract exist
    query = 'select abstract from papers where linkp=?'
    res = RECOM.query_db(query, [link])
    Q.set_query(res[0]['abstract'])
    nbcollabs, data, colors = RECOM.get_map_specification(Q.get_query())
    return render_template('abstract_based_sblink.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           search=link,
                           query=Q.get_query())


@app.route("/abstract_based_sbtitle", methods=['GET'])
def abstract_based_sbtitle():
    # get the search request
    title = request.args.get(
        'query', '')
    # Look if the abstract exist
    query = 'select title from papers where title=?'
    recom.query_db(query, [title])
    nbcollabs, data, colors = RECOM.get_map_specification(query)
    return render_template('abstract_based_sbtitle.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           query=query)
