from webapp import app, RECOM, Qry
from flask import Flask, render_template, request, jsonify
import json
import sys
import pandas as pd


####################################################
# Home
####################################################
@app.route('/_get_homemap_spec')
def _get_homemap_spec():
    data, fills = RECOM.get_map_spec_home()
    return jsonify({'data': data, 'fills': fills})


@app.route('/_get_homepie_spec')
def _get_homepie_spec():
    data = RECOM.get_pie_spec_home()
    return jsonify({'data': data})


@app.route('/')
def home():
    return render_template('home.html')

####################################################
# Query search
####################################################


@app.route("/_on_search", methods=['GET'])
def _on_search():
    search = request.args.get('search', "")
    Qry.set_query(search)
    if not Qry.is_query():
        search = Qry.get_defaut_message(Qry.get_sby())
    return jsonify({'search': search,
                    'query': Qry.get_query(),
                    'searchby': Qry.get_sby(),
                    'isquery': Qry.is_query()})


@app.route("/_modified_query", methods=['GET'])
def _modified_query():
    query = request.args.get('query', "")
    print query
    Qry.set_query(query)
    return jsonify({"query": Qry.get_query()})


@app.route("/_ajaxautocomplete_authors", methods=['POST', 'GET'])
def _ajaxautocomplete_authors():
    if request.method == 'POST':
        query = request.form['query']
        suggestion = RECOM.get_authors_autocomplete(query)
        return jsonify({"suggestions": suggestion})
    else:
        return 'ooops'

####################################################
# Collaborators search
####################################################


@app.route("/query_based/_get_thumbnails", methods=['GET'])
def _get_thumbnails():
    iso3 = request.args.get('country', '')
    collabs = RECOM.get_collaborators(Qry.get_query())
    country = RECOM.iso3_to_country(iso3)
    if len(collabs) == 0:
        result = {}
    else:
        result = collabs[collabs.country == country].to_dict('index')
    return jsonify({'result': result, 'is_qry': Qry.is_query()})


@app.route("/query_based/_get_nb_collabs", methods=['GET'])
def _get_nb_collabs():
    n = RECOM.get_nb_collaborators(Qry.get_query())
    return jsonify({'n': n, 'is_qry': Qry.is_query()})


@app.route("/query_based/_get_map_spec", methods=['GET'])
def _get_map_spec():
    _, data, colors = RECOM.get_map_specification(Qry.get_query())
    return jsonify({'data': data, 'colors': colors})


@app.route("/query_based_<searchby>", methods=['GET'])
def query_based(searchby):
    # get the search request
    RECOM.n_base_recom = 25
    Qry.set_sby(searchby.lower())
    Qry.init_query()
    data, fills = RECOM.init_map_spec()
    return render_template('collaborators.html',
                           searchby=Qry.get_sby(),
                           data=data,
                           fills=fills)


####################################################
# Plan your journey
####################################################


def get_sess(df, type_sess):
    am = ""
    pm = ""
    try:
        n = len(df.groupby(['type']).groups[type_sess])
    except:
        n = 0

    if n != 0:
        dfg = df.groupby(['type', 'sess_time'])
        try:
            am = dfg.get_group((type_sess, 'morning')).to_dict('index')
        except:
            am = ""
        try:
            pm = dfg.get_group((type_sess, 'afternoon')).to_dict('index')
        except:
            pm = ""

    return n, am, pm


@app.route("/_change_nb", methods=['POST'])
def _change_nb():
    nb = request.form.get('nb', '')
    RECOM.n_base_recom = int(nb)
    return 'success'


@app.route("/query_based_journey/_get_nb_results", methods=['GET'])
def _get_nb_results():
    n = RECOM.get_number_results(Qry.get_query())
    return jsonify({'n': n, 'is_qry': Qry.is_query()})


@app.route("/query_based_journey/_get_schedule_day", methods=['GET'])
def _get_schedule_day():
    day = request.args.get('day', 'Monday')
    nb_res, df = RECOM.get_schedule_bday(Qry.get_query(), day)
    if nb_res == 0:
        return jsonify({
            'orals': {'n': 0, 'am': "", 'pm': ""},
            'posters': {'n': 0, 'am': "", 'pm': ""}})
    else:
        n_posters, poster_am, poster_pm = get_sess(df, 'poster')
        n_orals, oral_am, oral_pm = get_sess(df, 'oral')
        return jsonify({
            'orals': {'n': n_orals, 'am': oral_am, 'pm': oral_pm},
            'posters': {'n': n_posters, 'am': poster_am, 'pm': poster_pm}})


@app.route("/query_based_journey_<searchby>", methods=['GET'])
def query_based_journey(searchby):
    # get the search request')
    RECOM.n_base_recom = 25
    Qry.set_sby(searchby.lower())
    Qry.init_query()
    return render_template('schedule.html',
                           searchby=Qry.get_sby())
