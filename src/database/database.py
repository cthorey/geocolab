import json
import codecs
import os
import re
import time
from tqdm import *
import numpy as np
import pandas as pd
import unicodedata
import sqlite3
import argparse
import pycountry

# root path
ROOT = os.path.expanduser('~/Documents/project/agu_data/geocolab/')

#### utils ####


def load_json(name):
    with codecs.open(name, 'r', 'utf8') as f:
        return json.load(f)

##### PAPERS ########


class Paper(object):
    ''' handle each paper submitted to AGU data base '''

    def __init__(self, link, data):
        self.link = link
        for key, val in data.iteritems():
            try:
                setattr(self, key, val.strip())
            except:
                setattr(self, key, val)
        self.title = ':'.join(self.title).strip()


def get_all_papers(path_data):
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

#### Annuary #####


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
        country = [f.name.lower() for f in pycountry.countries]
        ad = self.address.lower()
        try:
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


def pprogress(message):
    print('************************')
    print(message)
    print('************************\n')

if __name__ == "__main__":
    ''' Create the database '''
    # Parse parameters
    parser = argparse.ArgumentParser()
    parser.add_argument('--name', required=True, help='Name of the database')
    parser.add_argument('--if_exist', action="store", default='fail')

    conf = vars(parser.parse_args())
    pprogress("Name of the database %s.db" % (conf['name']))

    db_path = os.path.expanduser(os.path.join(ROOT, 'data', 'database'))
    conn = sqlite3.connect(os.path.join(db_path, conf['name'] + '.db'))
    c = conn.cursor()

    # Create the table for papers
    pprogress('Construction of the papers table')
    papers = get_all_papers(os.path.join(ROOT, 'data', 'scrapped', '2015'))
    # Get the keys of the table
    keys = [f for f in papers[0].__dict__.keys() if f not in ['authors']]
    keys_name = map(lambda x: 'linkp' if x == 'link' else x, keys)
    dfp = pd.DataFrame([[getattr(paper, feat) for feat in keys]
                        for paper in papers], columns=keys_name)
    dfp['id_paper'] = dfp.index
    dfp.to_sql('papers', con=conn, flavor='sqlite',
               if_exists=conf['if_exist'], index=False)

    # Create a table for authors
    pprogress('Construction of the authors table')
    authors = get_all_contrib(os.path.join(ROOT, 'data', 'scrapped', '2015'))
    keys = [f for f in authors[0].__dict__.keys() if f not in [
        'session', 'papers', 'tag_sections']]
    keys_name = map(lambda x: 'linka' if x == 'link' else x, keys)
    dfa = pd.DataFrame([[getattr(author, key) for key in keys]
                        for author in authors], columns=keys_name)
    dfa['id_author'] = dfa.index
    dfa.to_sql('authors', con=conn, flavor='sqlite',
               if_exists=conf['if_exist'], index=False)

    # Create paper2author
    pprogress('Construction of the p2a table')
    paper2author = [list(zip([paper.link] * len(paper.authors.keys()),
                             paper.authors.keys(), paper.authors.values())) for paper in papers]
    paper2author = pd.DataFrame(
        reduce(lambda a, b: a + b, paper2author), columns=['linkp', 'name', 'inst'])
    paper2author.to_sql('p2a', con=conn, flavor='sqlite',
                        if_exists=conf['if_exist'], index_label='id')

    # Insert primary keys into all tables
    pprogress('Insert primary keys in all tables')
    qry = open('insert_primary_keys.sql', 'r').read()
    conn.executescript(qry)
    conn.commit()

    # Close everything
    pprogress('Successs')
    c.close()
    conn.close()
