from __init__ import *
import codecs
import os
import re
import time
from tqdm import *
import unicodedata
import pandas as pd
import gensim
from gensim import corpora, models, similarities
from sklearn.externals import joblib
from stop_words import get_stop_words
import Stemmer  # Load an inplementation of the snow-ball stemmer
import boto3


class Tokenizer(object):

    def __init__(self):
        self.stopwords = get_stop_words('english')
        self.stopwords += [u's', u't', u'can',
                           u'will', u'just', u'don', u'now']
        self.stemmer = Stemmer.Stemmer('english')

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
        return map(str, stems)


class MyCorpus(Tokenizer):

    def __init__(self, name):
        super(MyCorpus, self).__init__()
        self.name = name
        self.load_dict()
        self.load_bigrams()

    def load_bigrams(self):
        if not os.path.isfile(self.name + '_bigram.model'):
            print 'You should build the bigram first !'
        else:
            setattr(self, 'bigram',
                    models.Phrases.load(self.name + '_bigram.model'))

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
            yield self.dictionary.doc2bow(self.bigram[self.tokenize_and_stem(line)])

    def __str__(self, n):
        for i, line in enumerate(open(self.name + '_data.txt')):
            print line
            if i > n:
                break


class S3geocolab(object):

    def __init__(self):
        session = boto3.Session(
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"])
        self.bucket = session.resource('s3').Bucket('s3geocolab')
        self.init_working_tree()

    def init_working_tree(self):
        models = os.path.join(ROOT, 'models')
        if not os.path.isdir(models):
            os.mkdir(models)
        data = os.path.join(ROOT, 'data')
        if not os.path.isdir(data):
            os.mkdir(data)
            os.mkdir(os.path.join(data, 'database'))
        if not os.path.isdir(os.path.join(data, 'database')):
            os.mkdir(os.path.join(data, 'database'))

    def download_db(self):
        name = 'data/database/geocolab.db'
        self.bucket.download_file(name, os.path.join(ROOT, name))

    def download_model(self, name):
        name_model = os.path.join('models', name)
        path_model = os.path.join(ROOT, name_model)
        if not os.path.isdir(path_model):
            os.mkdir(path_model)

        file_ends = ['_lsi.index', '_lsi.index.index.npy']
        for obj in self.bucket.objects.all():
            if obj.key.startswith(name_model):
                if any([obj.key.endswith(f) for f in file_ends]):
                    self.bucket.download_file(
                        obj.key, os.path.join(ROOT, obj.key))


def write_clean_corpus(corpus, path):
    with open(path, 'w+') as f:
        for elt in corpus:
            f.write(elt + '\n')


def get_type_pres(x):
    room = x.split('-')[-1].strip()
    if room == "Poster Hall":
        return 'poster'
    else:
        return 'oral'


def get_room(x):
    room = x.split('-')[-1].strip()
    if room == 'Poster Hall':
        return room
    else:
        return 'Room %s' % (room)


def get_day(x):
    day = x.split(',')[0].strip()
    return day


def get_sess_time(t):
    time = int(t.split('-')[0].split(':')[0])
    if time >= 13:
        return 'afternoon'
    else:
        return 'morning'
