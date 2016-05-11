from __init__ import *
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
from src.scrapping.data_utils import *
#### utils ####


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
    if not os.path.isdir(db_path):
        if not os.path.isdir(os.path.join(ROOT, 'data')):
            os.mkdir(os.path.join(ROOT, 'data'))
        os.mkdir(db_path)
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
    dfp['formatTitle'] = map(lambda x: x.lower(), dfp.title)
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
    paper2author['formatName'] = map(lambda x: x.lower(), paper2author.name)
    paper2author.to_sql('p2a', con=conn, flavor='sqlite',
                        if_exists=conf['if_exist'], index_label='id')

    # Insert primary keys into all tables
    pprogress('Insert primary keys in all tables')
    qry = open('insert_primary_keys.sql', 'r').read()
    conn.executescript(qry)
    conn.commit()

    # Create table homemap
    pprogress('Create homemap table')
    qry = open('create_homemap.sql', 'r').read()
    conn.executescript(qry)
    conn.commit()

    # Close everything
    pprogress('Successs')
    c.close()
    conn.close()
