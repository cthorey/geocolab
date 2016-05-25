from __init__ import *
import os
import re
import time
import sys
import sklearn
import pickle
from sklearn import manifold
from sklearn.externals import joblib
from tqdm import *
import numpy as np
import gensim
from gensim import corpora, models, similarities
from pprint import pprint
from helper import *
import sqlite3
from src.scrapping.data_utils import *


def query_db(query, args=(), one=False):
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    res = db.cursor().execute(query, args)
    rv = res.fetchall()
    db.close()
    return (rv[0] if rv else None) if one else rv

if __name__ == "__main__":

    model_saved = os.path.join(ROOT, 'models')
    path_data = os.path.join(ROOT, 'data', 'scrapped')
    db_path = os.path.join(ROOT, 'data', 'database', 'geocolab.db')

    if not os.path.isdir(model_saved):
        os.mkdir(model_saved)

    ################################################
    # Get the args
    parser = argparse.ArgumentParser()
    parser.add_argument('--name', required=True, help='Name of the model')
    parser.add_argument('--ntopics', action="store", default=500)
    parser.add_argument('--tsne', action="store_true")
    parser.add_argument('--bow', action="store_true")
    parser.add_argument('--tfidf', action="store_true")
    parser.add_argument('--lsa', action="store_true")
    conf = vars(parser.parse_args())

    name_model = conf['name'] + '_' + str(conf['ntopics'])
    print('The model is called %s' % (name_model))
    if not os.path.isdir(os.path.join(model_saved, name_model)):
        os.mkdir(os.path.join(model_saved, name_model))

    abstractf = os.path.join(model_saved, name_model, name_model)

    ##################################################
    # Get the data
    papers = query_db('select title,abstract from papers')
    abstracts = [f['abstract'] for f in papers]
    titles = [f['title'] for f in papers]

    # Add the title to the end of the abstract.
    abstracts = [f + ' ' + g for f, g in zip(abstracts, titles)]

    # abstracts = abstracts[:500]
    # titles = titles[:500]

    ##################################################
    # Build Bow_To_Vec_Representation

    if conf['bow']:
        print 'Building the bow representation'
        # First, write the document corpus on a txt file, one document perline.
        write_clean_corpus(abstracts, abstractf + '_data.txt')

        # Initialize the model
        tokenizer = Tokenizer()

        # Initialize bigram finder.
        bigram = models.Phrases(tokenizer.tokenize_and_stem(line)
                                for line in open(abstractf + '_data.txt'))
        bigram.save(abstractf + '_bigram.model')
        # Next create the dictionary by iterating of the abstract, one per line in
        # the txt file

        dictionary = corpora.Dictionary(bigram[tokenizer.tokenize_and_stem(
            line)] for line in open(abstractf + '_data.txt'))
        dictionary.save(abstractf + '_raw.dict')
        dictionary.filter_extremes(no_below=5, no_above=0.80, keep_n=200000)
        dictionary.id2token = {k: v for v,
                               k in dictionary.token2id.iteritems()}
        dictionary.save(abstractf + '.dict')
        # Builde corpus
        bow_corpus = MyCorpus(abstractf)
        corpora.MmCorpus.serialize(abstractf + '_bow.mm', bow_corpus)
        # index for similarities
        index_bow = similarities.SparseMatrixSimilarity(bow_corpus,
                                                        num_features=len(dictionary))
        index_bow.save(abstractf + '_bow.index')

    ##################################################
    # Build Tf-idf representation

    if conf['tfidf']:
        print 'Building the tfidf representation'
        # First load the corpus and the dicitonary
        bow_corpus = corpora.MmCorpus(abstractf + '_bow.mm')
        dictionary = corpora.Dictionary.load(abstractf + '.dict')
        # Initialize the tf-idf model
        tfidf = models.TfidfModel(bow_corpus)
        # Compute the tfidf of the corpus itself
        tfidf_corpus = tfidf[bow_corpus]
        # Serialize both for reuse
        tfidf.save(abstractf + '_tfidf.model')
        corpora.MmCorpus.serialize(abstractf + '_tfidf.mm', tfidf_corpus)
        # index for similarities
        index_tfidf = similarities.SparseMatrixSimilarity(tfidf_corpus,
                                                          num_features=len(dictionary))
        index_tfidf.save(abstractf + '_tfidf.index')

    ##################################################
    # Build lsa representation

    if conf['lsa']:
        num_topics = int(conf['ntopics'])
        print 'Building the lsi representation'
        # First load the corpus and the dicitonary
        tfidf_corpus = corpora.MmCorpus(abstractf + '_tfidf.mm')
        dictionary = corpora.Dictionary.load(abstractf + '.dict')
        # dict the LSI model
        lsi = models.LsiModel(tfidf_corpus, id2word=dictionary,
                              num_topics=num_topics)
        # Compute the tfidf of the corpus itself
        lsi_corpus = lsi[tfidf_corpus]
        # Serialize both for reuse
        lsi.save(abstractf + '_lsi.model', separately=[""])
        corpora.MmCorpus.serialize(abstractf + '_lsi.mm', lsi_corpus)

        # index for similarities
        index_tfidf = similarities.MatrixSimilarity(lsi_corpus,
                                                    num_features=num_topics)
        index_tfidf.save(abstractf + '_lsi.index', separately=[""])

    ##################################################
    # Build the t-sne represenation
    if conf['tsne']:
        print 'Building the tsne representation'
        tsne = manifold.TSNE(n_components=2, init='pca',
                             random_state=0)
        lsi_corpus = corpora.MmCorpus(abstractf + '_lsi.mm')
        X = gensim.matutils.corpus2dense(
            lsi_corpus, num_terms=lsi_corpus.num_terms)
        X_data = np.asarray(X).astype('float64')
        X_tsne = tsne.fit_transform(X_data.T)
        joblib.dump(X, abstractf + '_X.pkl')
        joblib.dump(X_tsne, abstractf + '_Xtsne.pkl')
