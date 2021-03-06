######## IMPORT    #########
from __init__ import *
import os
import time
from tqdm import *
import numpy as np
import pandas as pd
import seaborn as sns
import pycountry
from helper import *
from sklearn.externals import joblib
import random
import shlex

from psycopg2 import connect
from psycopg2.extras import DictCursor
import urlparse


class mydb(object):

    urlparse.uses_netloc.append("postgres")
    url = urlparse.urlparse(os.environ["DATABASE_URL"])

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

    def query_db(self, query, args=(), one=False):
        conn = connect(
            database=self.url.path[1:],
            user=self.url.username,
            password=self.url.password,
            host=self.url.hostname,
            port=self.url.port,
            sslmode='require',
            cursor_factory=DictCursor)
        dict_cur = conn.cursor()
        dict_cur.execute(query, args)
        res = dict_cur.fetchall()
        dict_cur.close()
        conn.close()
        return res

    def get_authors_autocomplete(self, typename):
        qry = ('select p2a.iname,papers.title,papers.abstract ' +
               'from p2a,papers ' +
               'where papers.linkp=p2a.linkp and ' +
               '(lower(p2a.name) like %s or lower(p2a.iname) like %s)')
        name = '%' + typename + '%'
        res = self.query_db(qry, (name.lower(), name.lower()))
        if len(res) > 0:
            df = pd.DataFrame([[row[f] for f in res[0].keys()]
                               for row in res], columns=res[0].keys())
            dfg = df.groupby('iname')
            suggestion = [{"value": name, "data": {'titles': gp.title.tolist(), 'abstracts': gp.abstract.tolist()}}
                          for name, gp in dfg]
        else:
            suggestion = []

        return suggestion

    def get_pie_spec_home(self):

        qry = ('select section,count(linkp) as n from papers ' +
               'group by section ' +
               'order by n')
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

    def _check_weight(self, s):
        try:
            if len(s.split(':')) == 1:
                return s + ' '
            else:
                return (s.split(':')[0] + ' ') * int(s.split(':')[-1])
        except:
            return s

    def query2query(self):
        query = self.search
        if len(shlex.split(query)) == 0:
            query = ''
        else:
            query = reduce(lambda a, b: a + b,
                           [self._check_weight(f) for f in shlex.split(query)])
        return query

    def abstract2query(self):
        title = self.search.lower()
        qry = ('select distinct(abstract) from papers where ftitle=%s')
        res = self.query_db(qry, (title,))
        if len(res) == 0:
            query = ""
        else:
            query = res[0]['abstract']
        return query

    def is_query(self):
        if self.search == "":
            return False
        else:
            return True

    def get_defaut_message(self, searchby):
        if searchby == 'query':
            return 'Query example: magma "magmatic intrusions":5 dynamics:2 granit folding'
        elif searchby == 'author':
            return 'Author example: Clement Thorey'
        else:
            return ''

    def init_query(self):
        self.search = ""
        self.query = ""

    def set_query(self, search):
        self.search = search
        self.query = getattr(self, self.sby[2:] + '2query')()

    def set_sby(self, searchby):
        self.sby = 'by' + searchby

    def get_query(self):
        return self.query

    def get_sby(self):
        return self.sby


class RecomendationSystem(mydb):

    def __init__(self, name_model, min_score=0.3, prod=False, verbose=False):
        self.min_score = min_score

        # Db local
        # Load the titles and abstract + links
        qry = self.query_db('select title,linkp from papers')
        self.titles = [f['title'] for f in qry]
        self.links = [f['linkp'] for f in qry]

        # Models
        self.name = os.path.join(ROOT, 'models', name_model, name_model)
        if prod:
            root = "s3://s3geocolab"
            self.name = os.path.join(root, 'models', name_model, name_model)
        # Load the necessary models, the lsi corpus and the corresponding index
        self.tokeniser = Tokenizer()
        self.bigram = models.Phrases.load(self.name + '_bigram.model')
        self.dictionary = corpora.Dictionary.load(self.name + '.dict')
        self.tfidf = models.TfidfModel.load(self.name + '_tfidf.model')
        self.lsi = models.LsiModel.load(self.name + '_lsi.model')
        self.index = similarities.MatrixSimilarity.load(
            self.name + '_lsi.index')
        self.n_base_recom = 25

    def transform_query(self, query):
        # Transform the query in lsi space
        # Transform in the bow representation space
        vec_bow = self.dictionary.doc2bow(
            self.bigram[self.tokeniser.tokenize_and_stem(query)])
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
                  'and p2a.linkp in (%s)' % (', '.join(['%s'] * len(links)))
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

    def init_map_spec(self):
        data = {str(f): {"Nbcollab": 0,
                         "fillKey": str(f)}
                for f in self.name_to_iso3.values()}
        fills = {'defaultFill': 'grey'}
        return data, fills

    def get_map_specification(self, query):
        df = self.get_collaborators(query)
        data, fills = self.init_map_spec()
        if len(df) != 0:
            df['iso3'] = map(lambda x: self._country_to_iso3(x), df.country)

            gp = df.groupby('iso3')
            values = list(set(gp.size().tolist()))
            values.sort()
            colors = sns.color_palette('Reds', len(values))
            colorscale = dict(
                zip(values, colors.as_hex()))
            for country, n in gp.size().iteritems():
                if country not in ['']:
                    data[country].update({"Nbcollab": n})
                    fills[country] = str(colorscale[n]).upper()
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
                  'where date like %s' +\
                  ' and linkp in (%s)' % (', '.join(['%s'] * len(links)))
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
