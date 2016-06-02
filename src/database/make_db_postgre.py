from __init__ import *
import json
import codecs
import tarfile
import os
import re
import time
from tqdm import *
import numpy as np
import pandas as pd
import unicodedata
import argparse
import pycountry
from src.scrapping.data_utils import *
from psycopg2 import connect
import sys
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine

#### utils ####


def pprogress(message):
    print('************************')
    print(message)
    print('************************\n')

if __name__ == "__main__":
    ''' Create the database '''
    # Parse parameters
    parser = argparse.ArgumentParser()
    parser.add_argument('--name', action="store",
                        default='geocolab', help='Name of the database')
    parser.add_argument('--if_exist', action="store", default='fail')
    parser.add_argument('--untar', action="store_true")

    conf = vars(parser.parse_args())
    pprogress("Name of the database %s.db" % (conf['name']))

    # Untar file
    if conf['untar']:
        pprogress('Untar data')
        p = os.path.join(ROOT, 'data', 'scrapped')
        tar = tarfile.open(os.path.join(p, '2015.tar.gz'))
        tar.extractall(path=p)
        tar.close()

    # Initialize the database

    con = None
    con = connect(user='thorey', host='localhost')
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        cur.execute('CREATE DATABASE ' + conf['name'])
    except:
        cur.execute('DROP DATABASE ' + conf['name'])
        cur.execute('CREATE DATABASE ' + conf['name'])
    cur.close()
    con.close()

    # Initialize database
    engine = create_engine('postgresql://thorey@localhost:5432/geocolab',
                           isolation_level='AUTOCOMMIT')
    con = connect(user='thorey', host='localhost', dbname='geocolab')
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    pprogress('Erase and initialize tables')
    qry = open(os.path.join(ROOT_DIR, 'create_tables.sql'), 'r').read()
    cur.execute(qry)
    con.commit()

    # Create the table for papers
    pprogress('Construction of the papers table')
    papers = get_all_papers(os.path.join(ROOT, 'data', 'scrapped', '2015'))
    # Get the keys of the table
    keys = [f for f in papers[0].__dict__.keys() if f not in ['authors']]
    keys_name = map(lambda x: 'linkp' if x == 'link' else x, keys)
    dfp = pd.DataFrame([[getattr(paper, feat) for feat in keys]
                        for paper in papers], columns=keys_name)
    dfp['ftitle'] = map(lambda x: x.lower(), dfp.title)
    dfp['id_paper'] = dfp.index
    dfp.to_sql('papers', con=engine, if_exists='append', index=False)

    # Create a table for authors
    pprogress('Construction of the authors table')
    authors = get_all_contrib(os.path.join(ROOT, 'data', 'scrapped', '2015'))
    keys = [f for f in authors[0].__dict__.keys() if f not in [
        'session', 'papers', 'tag_sections']]
    keys_name = map(lambda x: 'linka' if x == 'link' else x, keys)
    dfa = pd.DataFrame([[getattr(author, key) for key in keys]
                        for author in authors], columns=keys_name)
    dfa['id_author'] = dfa.index
    dfa.to_sql('authors', con=engine, if_exists='append', index=False)

    # Create paper2author
    pprogress('Construction of the p2a table')
    paper2author = [list(zip([paper.link] * len(paper.authors.keys()),
                             paper.authors.keys(), paper.authors.values())) for paper in papers]
    paper2author = pd.DataFrame(
        reduce(lambda a, b: a + b, paper2author), columns=['linkp', 'name', 'inst'])
    paper2author['nname'] = map(lambda x: x.lower(), paper2author.name)
    paper2author['iname'] = map(lambda f: f.split(
        ' ')[-1] + ' ' + ' '.join(f.split(' ')[:-1]), paper2author.name)
    paper2author['id'] = paper2author.index.tolist()
    paper2author.to_sql('p2a', con=engine,
                        if_exists='append', index=False)

    # Commit everything
    con.commit()

    # Close everything
    pprogress('Successs')
    con.close()
    cur.close()
