######## IMPORT    #########
import json
import codecs
import os
import re
import time
from tqdm import *
import numpy as np
import pandas as pd
import unicodedata
import seaborn as sns
import plotly
import plotly.plotly as py
import plotly.graph_objs as go
import pycountry
import gensim
from gensim import corpora, models, similarities
from sklearn.externals import joblib
from stop_words import get_stop_words
import Stemmer  # Load an inplementation of the snow-ball stemmer

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


def load_source(path_data):
    data = get_all_data(path_data)
    sources = [df for df in data if (''.join(df.title) != "") and (
        df.abstract != '') and (len(df.abstract.split(' ')) > 100)]
    sections = [df.section for df in sources]
    abstracts = get_clean_abstracts(sources)
    titles = get_clean_titles(sources)
    return abstracts, titles


class RecomendationSystem(object):

    def __init__(self, path_model):
        self.model_saved = path_model
        self.abstractf = os.path.join(self.model_saved, 'abstract')

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
        self.authors = joblib.load(self.abstractf + '_authors.dict')
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
            return self.iso3_to_name[iso3.upper()]
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
                               columns=['CosineSimilarity', 'title', 'link'])
        return results

    def get_recomendation(self, query):
        # produce a query of size 300
        query = ' '.join(query.split(' ') * (300 // len(query.split(' '))))
        df = self.recomendation(query).head(self.n_base_recom)
        return df

    def collaborators(self, query):
        ''' Return a list of the potential contributors based
        on the n first abstract proposed by the recommendation 
        system '''

        df = self.recomendation(query).head(self.n_base_recom)
        collab = {}
        for i, row in df.iterrows():
            try:
                collab.update(self.authors[row.title])
            except:
                pass

        return collab

    def get_collaborators(self, query):

        collab = self.collaborators(query)
        collab = pd.DataFrame(collab.values(), index=collab.keys())
        return collab

    def get_map_specification(self, query):
        collabs = self.collaborators(query)
        df = pd.DataFrame(collabs.values())
        df['name'] = collabs.keys()
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
                [name + ': ' + inst[:20] + '...' for (name, inst) in zip(group.name, group.inst)][:30])
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

###### Recom_utils #########


def load_json(name):
    with codecs.open(name, 'r', 'utf8') as f:
        return json.load(f)


def write_clean_corpus(corpus, path):
    with open(path, 'w+') as f:
        for elt in corpus:
            f.write(elt + '\n')


def clean_abstract(text):
    ''' Clean an abstract '''
    if text.split('\n')[0].split(' ')[0] == 'ePoster':
        text = ' '.join(text.split('\n')[1:])
    try:
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore')
    except:
        pass
    text = text.replace('\n', ' ')
    return text


def get_raw_titles(sources):
    raw_titles = [' '.join(df.title) for df in sources]
    return raw_titles


def clean_title(text):
    if text.split(' ')[-1] == '(Invited)':
        text = ' '.join(text.split(' ')[:-1])
    try:
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore')
    except:
        pass
    text = text.replace('\n', ' ')
    return text


def get_raw_abstracts(sources):
    raw_abstracts = [df.abstract for df in sources]
    return raw_abstracts


def get_clean_titles(sources):
    ''' Return a clean version of the  abstract corpus '''

    raw_titles = get_raw_titles(sources)
    titles = map(clean_title, raw_titles)
    return titles


def get_clean_abstracts(sources):
    ''' Return a clean version of the  abstract corpus '''

    raw_abstracts = get_raw_abstracts(sources)
    abstracts = map(clean_abstract, raw_abstracts)
    return abstracts

##### PAPERS ########


class Paper(object):
    ''' handle each paper submitted to AGU data base '''

    def __init__(self, link, data):
        self.link = link
        for key, val in data.iteritems():
            setattr(self, key, val)


def get_all_data(path_data):
    ''' Go looking for all the files and load it as a list of
    Paper object '''

    name = os.listdir(path_data)
    name = [f for f in name if f.split('_')[-1] == 'V3.json']
    papers = []
    for json in tqdm(name):
        json_file = os.path.join(path_data, json)
        papers += [Paper(key, val) for key, val
                   in load_json(json_file)['papers'].iteritems()]

    return papers

    #### Contributors #####


class Contributor(object):
    '''
    Handle each contributor

    '''

    def __init__(self, link, data):
        self.link = link
        for key, val in data.iteritems():
            try:
                setattr(self, key, clean(val))
            except:
                setattr(self, key, val)
        self._ientify_country()
        self._identify_sections()

    def _ientify_country(self):
        ''' return the country '''
        try:
            country = [f.name.lower() for f in pycountry.countries]
            ad = self.address.lower()
            self.country = country[
                map(lambda x: x in str(ad), country).index(True)]
        except:
            if 'taiwan' in ad:
                self.country = 'taiwan, province of china'
            elif 'south korea' in ad:
                self.country = "korea, democratic people's republic of"
            elif 'russia' in ad:
                self.country = 'russian federation'
            elif 'kyrgyz' in ad:
                self.country = 'kyrgyzstan'
            elif 'iran' in ad:
                self.country = 'iran, islamic republic of'
            elif 'tanzania' in ad:
                self.country = 'tanzania, united republic of'
            elif 'vietnam' in ad:
                self.country = 'viet nam'
            elif 'ivoire' in ad:
                self.country = "cote d'ivoire"
            elif 'bolivia' in ad:
                self.country = 'bolivia, plurinational state of'
            elif 'syria' in ad:
                self.country = 'syrian arab republic'
            elif 'north korea' in ad:
                self.country = 'korea, republic of'
            elif 'macedonia' in ad:
                self.country = 'macedonia, republic of'
            elif 'venezuela' in ad:
                self.country = 'venezuela, bolivarian republic of'
            elif 'usa' in ad:
                self.country = 'united states'
            elif 'lao' in ad:
                self.country = "lao people's democratic republic"
            elif 'reunion' in ad:
                self.country = 'reunion'
            elif 'brunei' in ad:
                self.country = 'brunei darussalam'
            elif 'virgin islands' in ad:
                self.country = 'virgin islands, british'
            elif 'micronesia' in ad:
                self.country = 'micronesia, federated states of'
            elif 'palestinian' in ad:
                self.country = 'palestine, state of'
            elif 'maryland eastern shore' in ad:
                self.country = 'united states'
            else:
                self.country = ad

    def _tag_to_tagsections(self, tag):
        tag_section = tag[:2]
        if tag[1] in [str(i) for i in range(10)]:
            tag_section = tag[0]
        return tag_section

    def _identify_sections(self):
        tags = [str(f).split(':')[0] for f in self.papers]
        self.tag_sections = [self._tag_to_tagsections(tag) for tag in tags]


def get_all_contrib(path_data):
    ''' Go looking for all the files and load it as a list of
    Paper object '''

    names = os.listdir(path_data)
    names = [f for f in names if f.split(
        '_')[-1] == 'V1.json' and f.split('_')[0] == 'Name']
    contributors = []
    for json in tqdm(names):
        json_file = os.path.join(path_data, json)
        try:
            contributors += [Contributor(key, val) for key, val
                             in load_json(json_file)['names'].iteritems()]
        except:
            pass

    # Missed one
    missed_contribs = [f for f in contributors if f.name.split(' ')[0] ==
                       'Test' or f.address == u'']

    [contributors.remove(miss) for miss in missed_contribs]

    return contributors
