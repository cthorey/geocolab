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


@app.route("/query_based/_get_nb_collabs", methods=['GET'])
def _get_nb_collabs():
    n = RECOM.get_nb_collaborators(Qry.get_query())
    return jsonify({'n': n, 'is_qry': Qry.is_query()})


@app.route("/query_based/_refresh_nbcollab", methods=['GET'])
def _refresh_nbcollab():
    nb = request.args.get('nb', '')
    RECOM.n_base_recom = int(nb)
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return jsonify({'data': data, 'colors': colors, 'query': Qry.get_query(), 'nbcollabs': nbcollabs})


@app.route("/query_based_<searchby>", methods=['GET'])
def query_based(searchby):
    # get the search request
    search = request.args.get('search', "")
    Qry.set_query(search, searchby.lower())
    nbcollabs, data, colors = RECOM.get_map_specification(Qry.get_query())
    return render_template('collaborators.html',
                           data=json.dumps(data),
                           colors=json.dumps(colors),
                           nbcollabs=nbcollabs,
                           search=search,
                           query=Qry.get_query(),
                           searchby=Qry.get_sby())


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
    RECOM.nb_collab = 25
    search = request.args.get('search', "")
    Qry.set_query(search, searchby.lower())
    df = RECOM.recomendation(Qry.get_query())
    if not Qry.is_query():
        search = Qry.get_defaut_message(searchby)
    return render_template('schedule.html',
                           nb=len(df),
                           search=search,
                           query=Qry.get_query(),
                           searchby=Qry.get_sby())
