######## IMPORT    #########
from __init__ import *
import os
import time
from tqdm import *
import numpy as np
import pandas as pd
import seaborn as sns
import sqlite3
import plotly
import plotly.plotly as py
import plotly.graph_objs as go
import pycountry
from helper import *
from sklearn.externals import joblib


class mydb(object):

    db_path = os.path.join(ROOT, 'data', 'database', 'geocolab.db')
    name_to_iso3 = {
        elt.name.upper(): elt.alpha3 for elt in pycountry.countries}
    iso3_to_name = {
        elt.alpha3: elt.name.upper() for elt in pycountry.countries}

    def _country_to_iso3(self, name):
        try:
            return self.name_to_iso3[name.upper()]
        except:
            return ''

    def iso3_to_country(self, iso3):
        try:
            return self.iso3_to_name[iso3.upper()].lower()
        except:
            return ''

    def get_db(self):
        db = sqlite3.connect(self.db_path)
        db.row_factory = sqlite3.Row
        return db

    def query_db(self, query, args=(), one=False):
        db = self.get_db()
        res = db.cursor().execute(query, args)
        rv = res.fetchall()
        db.close()
        return (rv[0] if rv else None) if one else rv

    def get_pie_spec_home(self):

        qry = 'select section,count(linkp) as n from papers ' +\
              'group by section ' +\
              'order by n'
        res = self.query_db(qry)
        df = pd.DataFrame([[row[f] for f in res[0].keys()]
                           for row in res], columns=res[0].keys())
        data = [{'label': row.section, 'value': row.n}
                for i, row in df.iterrows()]
        return data

    def get_map_spec_home(self):

        qry = 'select * from homemap'
        res = self.query_db(qry)
        df = pd.DataFrame([[row[f] for f in res[0].keys()]
                           for row in res], columns=res[0].keys())
        df['iso3'] = map(lambda x: self._country_to_iso3(x), df.country)

        # Initiate the data and fills
        data = {str(f): {"ntotal": 0,
                         "fillKey": str(f)}
                for f in self.name_to_iso3.values()}
        fills = {}

        values = list(set(df.ntotal.tolist()))
        values.sort()
        colors = sns.color_palette('Reds', len(values))
        colorscale = dict(
            zip(values, colors.as_hex()))

        keys = [f for f in df.columns if f not in ['country', 'iso3']]
        for i, row in df.iterrows():
            if row.iso3 not in ['']:
                data[row.iso3].update(row[keys].to_dict())
                fills[row.iso3] = str(colorscale[row.ntotal]).upper()

        fills.update({'defaultFill': 'grey'})
        return data, fills


class Query(mydb):
    ''' Handle the various kind of approaching the query
    by link,title, authors or simply specifyign a query '''

    def __init__(self):
        self.query = ""
        self.search = ""

    def query2query(self):
        query = self.search
        return query

    def link2query(self):
        link = self.search
        res = self.query_db(
            'select abstract from papers where linkp=?', [link])
        if len(res) == 0:
            query = ''
        else:
            query = res[0]['abstract']
        return query

    def title2query(self):
        title = self.search.lower()
        qry = 'select distinct(abstract) from papers where formatTitle=? '
        res = self.query_db(qry, [title])
        if len(res) == 0:
            query = ""
        else:
            query = res[0]['abstract']
        return query

    def author2query(self):
        author = self.search.lower()
        qry = 'select distinct(abstract) from papers,p2a ' +\
              'where p2a.linkp=papers.linkp and p2a.formatName = ?'
        res = self.query_db(qry, [author])
        if len(res) == 0:
            query = ""
        else:
            query = res[0]['abstract']
        return query

    def get_defaut_message(self, searchby):
        if searchby == 'query':
            return 'Query example: Dynamics of magmatic intrusions'
        elif searchby == 'author':
            return 'Author example: Clement Thorey'
        elif searchby == 'link':
            return 'Link example: https://agu.confex.com/agu/fm15/meetingapp.cgi/Paper/67077'
        elif searchby == 'title':
            return 'Title example: Floor-Fractured Craters through Machine Learning Methods'
        else:
            return ''

    def is_query(self):
        if self.search == "":
            return False
        else:
            return True

    def set_query(self, search, searchby):
        self.search = search
        self.query = getattr(self, searchby + '2query')()
        self.sby = 'by' + searchby

    def get_query(self):
        return self.query

    def get_sby(self):
        return self.sby


class RecomendationSystem(mydb):

    def __init__(self, name_model, min_score=0.3):
        self.min_score = min_score
        self.name = os.path.join(ROOT, 'models', name_model, name_model)
        self.db_path = os.path.join(ROOT, 'data', 'database', 'geocolab.db')

        # Load the titles and abstract + links
        qry = self.query_db('select title,linkp from papers')
        self.titles = [f['title'] for f in qry]
        self.links = [f['linkp'] for f in qry]

        # Load the necessary models, the lsi corpus and the corresponding index
        self.tokeniser = Tokenizer(False)
        self.dictionary = corpora.Dictionary.load(self.name + '.dict')
        self.tfidf = models.TfidfModel.load(self.name + '_tfidf.model')
        self.lsi = models.LsiModel.load(self.name + '_lsi.model')
        self.corpus = corpora.MmCorpus(self.name + '_lsi.mm')
        self.index = similarities.MatrixSimilarity.load(
            self.name + '_lsi.index')
        self.n_base_recom = 25

    def transform_query(self, query):
        # Transform the query in lsi space
        # Transform in the bow representation space
        vec_bow = self.dictionary.doc2bow(
            self.tokeniser.tokenize_and_stem(query))
        # Transform in the tfidf representation space
        vec_tfidf = self.tfidf[vec_bow]
        # Transform in the lsi representation space
        vec_lsi = self.lsi[vec_tfidf]
        return vec_lsi

    def recomendation(self, query):

        vec_lsi = self.transform_query(query)
        # Get the cosine similarity of the query against all the abstracts
        cosine = self.index[vec_lsi]
        # Sort them and return a nice dataframe
        results = pd.DataFrame(np.stack((np.sort(cosine)[::-1],
                                         np.array(self.titles)[
                                             np.argsort(cosine)[::-1]],
                                         np.array(self.links)[np.argsort(cosine)[::-1]])).T,
                               columns=['score', 'title', 'link'])
        results.score = map(lambda x: float(x), results.score)
        return results[results.score > self.min_score]

    def get_collaborators(self, query):
        ''' Return a list of the potential contributors based
        on the n first abstract proposed by the recommendation
        system '''

        df0 = self.recomendation(query).head(self.n_base_recom)
        df = pd.DataFrame()
        if len(df0) != 0:
            links = df0.link.tolist()
            qry = 'select p2a.name,p2a.inst,auth.country,p.title,p2a.linkp ' +\
                  'from p2a, authors as auth, papers as p ' +\
                  'where auth.name = p2a.name and p2a.linkp=p.linkp ' +\
                  'and p2a.linkp in (%s)' % (', '.join(['?'] * len(links)))
            res = self.query_db(qry, links)
            df = pd.DataFrame([[row[f] for f in res[0].keys()]
                               for row in res], columns=res[0].keys())
            df = df.rename(columns={'linkp': 'link'})
            df = pd.merge(df, df0[['link', 'score']],
                          on='link', how='outer')
            df.score = map(lambda x: float(x), df.score)
            df.index = df.name.tolist()
            df = df.sort_values(
                'score', ascending=False).drop_duplicates(subset=['name'])
        return df

    def get_nb_collaborators(self, query):
        df = self.get_collaborators(query)
        return len(df)

    def get_map_specification(self, query):
        df = self.get_collaborators(query)
        if len(df) == 0:
            data = {str(f): {"Nbcollab": 0,
                             "fillKey": str(f)}
                    for f in self.name_to_iso3.values()}
            fills = {}
        else:
            df['iso3'] = map(lambda x: self._country_to_iso3(x), df.country)

            gp = df.groupby('iso3')
            values = list(set(gp.size().tolist()))
            values.sort()
            colors = sns.color_palette('Reds', len(values))
            colorscale = dict(
                zip(values, colors.as_hex()))
            data = {str(f): {"Nbcollab": 0,
                             "fillKey": str(f)}
                    for f in self.name_to_iso3.values()}
            fills = {}

            for country, n in gp.size().iteritems():
                if country not in ['']:
                    data[country].update({"Nbcollab": n})
                    fills[country] = str(colorscale[n]).upper()

        fills.update({'defaultFill': 'grey'})
        return len(df), data, fills

    def get_number_results(self, query):
        df = self.recomendation(query).head(self.n_base_recom)
        return len(df)

    def get_schedule_bday(self, query, day):

        df0 = self.recomendation(query).head(self.n_base_recom)
        df = ""
        nb_res = 0
        if len(df0) != 0:
            links = df0.link.tolist()
            qry = 'select date,time,place,linkp,tag ' +\
                  'from papers ' +\
                  'where date like ?' +\
                  ' and linkp in (%s)' % (', '.join(['?'] * len(links)))
            res = self.query_db(qry, [day + '%'] + links)
            nb_res = len(res)
            if nb_res != 0:
                df = pd.DataFrame([[row[f] for f in res[0].keys()]
                                   for row in res], columns=res[0].keys())
                df = df.rename(columns={'linkp': 'link'})
                df = pd.merge(df, df0[['link', 'score', 'title']],
                              on='link', how='outer').dropna()
                df.score = map(lambda x: float(x), df.score)
                df = df.sort_values(by='score', ascending=False)
                df['room'] = map(get_room, df.place)
                df['type'] = map(get_type_pres, df.place)
                df['sess_time'] = map(get_sess_time, df.time)
        return nb_res, df
