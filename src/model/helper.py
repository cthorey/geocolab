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
from helper import *
from sklearn.externals import joblib
from stop_words import get_stop_words
import Stemmer  # Load an inplementation of the snow-ball stemmer


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


def write_clean_corpus(corpus, path):
    with open(path, 'w+') as f:
        for elt in corpus:
            f.write(elt + '\n')
