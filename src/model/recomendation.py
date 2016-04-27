######## IMPORT    #########
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
import gensim
from gensim import corpora, models, similarities
from helper import *
from sklearn.externals import joblib
from stop_words import get_stop_words
import Stemmer  # Load an inplementation of the snow-ball stemmer

ROOT = os.path.expanduser('~/Documents/project/agu_data/geocolab/')

###### Recom_utils #########


class Tokenizer(object):

    def __init__(self, add_bigram):
        self.add_bigram = add_bigram
        self.stopwords = get_stop_words('english')
        self.stopwords += [u's', u't', u'can',
                           u'will', u'just', u'don', u'now']
        self.stemmer = Stemmer.Stemmer('english')

    def bigram(self, tokens):
        if len(tokens) > 1:
            for i in range(0, len(tokens) - 1):
                yield tokens[i] + '_' + tokens[i + 1]

    def tokenize_and_stem(self, text):
        tokens = list(gensim.utils.tokenize(text))
        filtered_tokens = []
        bad_tokens = []
        # filter out any tokens not containing letters (e.g., numeric tokens, raw
        # punctuation)
        for token in tokens:
            if re.search('(^[a-z]+$|^[a-z][\d]$|^[a-z]\d[a-z]$|^[a-z]{3}[a-z]*-[a-z]*$)', token):
                filtered_tokens.append(token)
            else:
                bad_tokens.append(token)
        filtered_tokens = [
            token for token in filtered_tokens if token not in self.stopwords]
        stems = map(self.stemmer.stemWord, filtered_tokens)
        if self.add_bigram:
            stems += [f for f in self.bigram(stems)]
        return map(str, stems)


class MyCorpus(Tokenizer):

    def __init__(self, name, add_bigram):
        super(MyCorpus, self).__init__(add_bigram)
        self.name = name
        self.load_dict()

    def load_dict(self):
        if not os.path.isfile(self.name + '.dict'):
            print 'You should build the dictionary first !'
        else:
            setattr(self, 'dictionary',
                    corpora.Dictionary.load(self.name + '.dict'))

    def __iter__(self):
        for line in open(self.name + '_data.txt'):
            # assume there's one document per line, tokens separated by
            # whitespace
            yield self.dictionary.doc2bow(self.tokenize_and_stem(line))

    def __str__(self, n):
        for i, line in enumerate(open(self.name + '_data.txt')):
            print line
            if i > n:
                break


class RecomendationSystem(object):

    def __init__(self, path_model):
        self.model_saved = path_model
        self.abstractf = os.path.join(self.model_saved, 'abstract')
        self.db_path = os.path.join(ROOT, 'data', 'database', 'geocolab.db')

        # Load the titles and abstract + links
        self.sources = pd.read_csv(os.path.join(self.abstractf + '_sources.txt'),
                                   names=['title', 'link'])
        self.titles = self.sources.title.tolist()
        self.links = self.sources.link.tolist()

        # Load the necessary models, the lsi corpus and the corresponding index
        self.tokeniser = Tokenizer(False)
        self.dictionary = corpora.Dictionary.load(self.abstractf + '.dict')
        self.tfidf = models.TfidfModel.load(self.abstractf + '_tfidf.model')
        self.lsi = models.LsiModel.load(self.abstractf + '_lsi.model')
        self.corpus = corpora.MmCorpus(self.abstractf + '_lsi.mm')
        self.index = similarities.MatrixSimilarity.load(
            self.abstractf + '_lsi.index')
        self.name_to_iso3 = {
            elt.name.upper(): elt.alpha3 for elt in pycountry.countries}
        self.iso3_to_name = {
            elt.alpha3: elt.name.upper() for elt in pycountry.countries}
        self.n_base_recom = 25

    def get_db(self):
        db = sqlite3.connect(self.db_path)
        db.row_factory = sqlite3.Row
        return db

    def query_db(self, query, args=(), one=False):
        db = self.get_db()
        cur = db.cursor()
        query = cur.execute(query, args)
        rv = query.fetchall()
        cur.close()
        db.close()
        return (rv[0] if rv else None) if one else rv

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
        df.index = df.name.tolist()
        df = df.sort_values('score', ascending=False)
        return df[df.score > threeshold_score]

    def get_map_specification(self, query):
        df = self.get_collaborators(query)
        df['iso3'] = map(lambda x: self._country_to_iso3(x), df.country)

        gp = df.groupby('iso3')
        values = list(set(gp.size().tolist()))
        values.sort()
        colors = sns.color_palette('Reds', len(values))
        colorscale = dict(
            zip(values, colors.as_hex()))
        print colorscale
        data = {str(f): {"Nbcollab": 0,
                         "fillKey": str(f)}
                for f in self.name_to_iso3.values()}
        fills = {}

        for country, n in gp.size().iteritems():
            if country not in ['']:
                data[country].update({"Nbcollab": n})
                fills[country] = str(colorscale[n]).upper()

        fills.update({'defaultFill': 'grey'})
        return data, fills

    def plot_map_collaborator(self, query):
        collabs = self.collaborators(query)
        df = pd.DataFrame(collabs.values())
        df['name'] = collabs.keys()
        df['iso3'] = map(lambda x: self._country_to_iso3(x), df.country)

        counts = {f: 0 for f in self.name_to_iso3.values()}
        texts = {f: '' for f in self.name_to_iso3.values()}
        for key, group in df.groupby('iso3'):
            counts[key] = len(group)
            texts[key] = '<br>'.join(
                [name + ': ' + inst[:20] + '...' for (name, inst) in zip(group.name, group.inst)][: 30])
            colors = sns.color_palette('Blues', max(counts.values()))
            colorscale = zip(range(max(counts.values())), sns.color_palette(
                'Reds', max(counts.values())).as_hex())

        world = go.Choropleth(
            autocolorscale=True,
            colorscale=[list(f) for f in colorscale],
            locations=counts.keys(),
            showscale=False,
            z=counts.values(),
            locationmode='ISO-3',
            text=texts.values(),
            marker=dict(
                line=dict(
                    color='rgb(255,255,255)',
                    width=2)
            ))

        data = [world]

        layout = dict(
            title='Potential collaborators by country based on the first %d recommendations.' % (
                n),
            height=600,
            width=900,
            geo=dict(
                scope='world',
                projection=dict(type='mercator'),
                showframe=False,
                lataxis={'range': [-52, 80]},
                framecolor='grey'),
            margin={'b': 0, 'r': 0, 'l': 0, 't': 40})

        fig = dict(data=data, layout=layout)
        plotly.offline.iplot(fig, show_link=False)
