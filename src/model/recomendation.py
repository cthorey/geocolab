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


class Query(mydb):
    ''' Handle the various kind of approaching the query
    by link,title, authors or simply specifyign a query '''

    def __init__(self):
        self.query = ""

    def query2query(self, search):
        self.query = search

    def link2query(self, search):
        link = search
        res = self.query_db(
            'select abstract from papers where linkp=?', [link])
        if len(res) == 0:
            self.query = ''
        else:
            self.query = res[0]['abstract']

    def title2query(self, search):
        title = search.lower()
        qry = 'select distinct(abstract) from papers where formatTitle=? '
        res = self.query_db(qry, [title])
        if len(res) == 0:
            self.query = ""
        else:
            self.query = res[0]['abstract']

    def author2query(self, search):
        author = search.lower()
        qry = 'select distinct(abstract) from papers,p2a ' +\
              'where p2a.linkp=papers.linkp and p2a.formatName = ?'
        res = self.query_db(qry, [author])
        if len(res) == 0:
            self.query = ""
        else:
            self.query = res[0]['abstract']

    def get_query(self):
        return self.query


class RecomendationSystem(mydb):

    def __init__(self, name_model):
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
        self.name_to_iso3 = {
            elt.name.upper(): elt.alpha3 for elt in pycountry.countries}
        self.iso3_to_name = {
            elt.alpha3: elt.name.upper() for elt in pycountry.countries}
        self.n_base_recom = 25

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
        return results

    def get_recomendation(self, query):
        # produce a query of size 300
        query = ' '.join(query.split(' ') * (300 // len(query.split(' '))))
        df = self.recomendation(query).head(self.n_base_recom)
        return df

    def get_collaborators(self, query, threeshold_score=0.3):
        ''' Return a list of the potential contributors based
        on the n first abstract proposed by the recommendation
        system '''

        df0 = self.recomendation(query).head(self.n_base_recom)
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
        return df[df.score > threeshold_score]

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
        nb_collab = len(df)
        return nb_collab, data, fills
