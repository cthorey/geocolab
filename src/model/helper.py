import codecs
import os
import re
import time
from tqdm import *
import unicodedata
import pandas as pd


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


def load_source(path_data):
    data = get_all_data(path_data)
    sources = [df for df in data if (''.join(df.title) != "") and (
        df.abstract != '') and (len(df.abstract.split(' ')) > 100)]
    sections = [df.section for df in sources]
    abstracts = get_clean_abstracts(sources)
    titles = get_clean_titles(sources)
    return abstracts, titles
