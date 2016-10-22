'''

[GoodRead1](http://danielfrg.com/blog/2015/09/28/crawling-python-selenium-docker/)
[GoodRead2](http://stackoverflow.com/questions/29781266/docker-using-container-with-headless-selenium-chromedriver)

Scrapper for AGU

2016
first= 100000
lastid = 200000

2015
first= 58180
lastid = 87000

2014
firstid = 2180
lastid = 35000


'''
import os
import sys
ROOT_DIR = os.environ['ROOT_DIR']
sys.path.append(ROOT_DIR)

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

import time
import datetime
import codecs
import json
from tqdm import *

import boltons.iterutils as biter

IP_SELENIUM = '192.168.99.100'
PORT_SELENIUM = '4444'


class AGUSpyder(object):

    def __init__(self, year, firstid=None, lastid=None, chunk_size=1000, port=PORT_SELENIUM, ip=IP_SELENIUM):
        self.wd = webdriver.Remote(command_executor='http://{}:{}/wd/hub'.format(ip, port),
                                   desired_capabilities=DesiredCapabilities.CHROME)
        self.ip = ip
        self.port = port
        self.chunk_size = chunk_size
        self.timeout = 6
        self.latency = 3
        self.base_url = self.get_base_url(year)
        self.cat = self.get_cat()
        self.firstid = firstid
        self.lastid = lastid
        self.name = self.base_url.split('/')[4]
        self.dirname = os.path.join(ROOT_DIR, 'data', 'scrapped', self.name)
        if not os.path.isdir(self.dirname):
            os.mkdir(self.dirname)

    def chunk2data(self, chunk, dump=False):
        papers = {}
        errors = []
        for pageid in tqdm(chunk, total=len(chunk)):
            link = os.path.join(self.base_url, str(pageid))
            try:
                papers.update({link: self.process_page(link)})
            except:
                errors.append(link)
        data = {'papers': papers, 'error': errors}
        jsonfile = os.path.join(self.dirname,
                                '{}_{}_{}_{}.json'.format(self.name,
                                                          self.cat,
                                                          str(chunk[0]),
                                                          str(chunk[-1])))
        if dump:
            json.dump(data,
                      open(jsonfile, 'w+'),
                      sort_keys=True,
                      indent=4,
                      ensure_ascii=False)
        return data

    def update_stdout(self, i, chunk):
        f = os.path.join(
            self.dirname, '{}_progress_{}_{}.txt'.format(self.cat, str(self.firstid), str(self.lastid)))
        if i == 0:
            stdout = open(f, 'w+')
            stdout.write('Processing {} from {} to {}\n'.format(
                self.cat, str(self.firstid), str(self.lastid)))
            stdout.close()

        stdout = open(f, 'a')
        stdout.write('{}\n'.format(datetime.datetime.now().isoformat()))
        stdout.write('Processing chunk {}: {} to {} \n'.format(
            i, chunk[0], chunk[-1]))
        stdout.write('-' * 50 + '\n')
        stdout.close()

    def scrap(self):
        for i, chunk in enumerate(biter.chunked_iter(range(self.firstid, self.lastid + 1), self.chunk_size)):
            self.update_stdout(i, chunk)
            _ = self.chunk2data(chunk, dump=True)


class PaperSpyder(AGUSpyder):

    def get_base_url(self, year):
        return 'https://agu.confex.com/agu/fm{}/meetingapp.cgi/Paper/'.format(str(year))

    def get_cat(self):
        return 'paper'

    def wait_for_elements(self):
        '''
        Wait for elements to appear on the page
        '''
        classes = ['itemTitle', 'SlotDate',
                   'SlotTime', 'propertyInfo', 'Additional',
                   'PersonList', 'SessionListItem', 'infoBox']
        for classe in classes:
            # wait for the different sections to download
            WebDriverWait(self.wd, self.timeout).until(
                EC.visibility_of_element_located((By.CLASS_NAME, classe)))
        time.sleep(self.latency)

    def process_page(self, link):
        '''
        Args:
        link (str): link to go scrap

        Returns:
        A dictionnary which contains information about
        the paper which is contained in link. In particular,
        the scrapper collects information about tag, title, date,
        time, place, abstract, reference, authors, session, section.

        Warning:
        Their is no tag in the title in AGU 2014 !!
        '''
        self.wd.get(link)
        self.wait_for_elements()
        data = {}

        data.update({'tag':
                     self.wd.find_element_by_class_name('itemTitle').text.split(':')[0]})
        data.update({'title':
                     self.wd.find_element_by_class_name('itemTitle').text.split(':')[1:]})
        data.update({'date':
                     self.wd.find_element_by_class_name('SlotDate').text})
        data.update({'time':
                     self.wd.find_element_by_class_name('SlotTime').text})
        data.update({'place':
                     self.wd.find_element_by_class_name('propertyInfo').text})
        data.update({'abstract':
                     self.wd.find_element_by_class_name('Additional').text.split('Reference')[0]})
        try:
            data.update({'reference':
                         self.wd.find_element_by_class_name('Additional').text.split('Reference')[1]})
        except:
            data.update({'reference': ''})
        authors = self.wd.find_elements_by_class_name('RoleListItem')
        data.update({'authors':
                     {author.text.split('\n')[0]: ', '.join(author.text.split('\n')[1:])
                      for author in authors}})
        data.update({'session':
                     self.wd.find_element_by_class_name('SessionListItem').text.split(':')[1]})
        data.update({'section':
                     self.wd.find_element_by_class_name('infoBox').text.split("\n")[2].split(':')[-1]})
        return data


class PaperSpyder(AGUSpyder):

    def get_base_url(self, year):
        return 'https://agu.confex.com/agu/fm{}/meetingapp.cgi/Paper/'.format(str(year))

    def get_cat(self):
        return 'paper'

    def wait_for_elements(self):
        '''
        Wait for elements to appear on the page
        '''
        classes = ['itemTitle', 'SlotDate',
                   'SlotTime', 'propertyInfo', 'Additional',
                   'PersonList', 'SessionListItem', 'infoBox']
        for classe in classes:
            # wait for the different sections to download
            WebDriverWait(self.wd, self.timeout).until(
                EC.visibility_of_element_located((By.CLASS_NAME, classe)))
        time.sleep(self.latency)

    def process_page(self, link):
        '''
        Args:
        link (str): link to go scrap

        Returns:
        A dictionnary which contains information about
        the paper which is contained in link. In particular,
        the scrapper collects information about tag, title, date,
        time, place, abstract, reference, authors, session, section.

        Warning:
        Their is no tag in the title in AGU 2014 !!
        '''
        self.wd.get(link)
        self.wait_for_elements()
        data = {}

        data.update({'tag':
                     self.wd.find_element_by_class_name('itemTitle').text.split(':')[0]})
        data.update({'title':
                     self.wd.find_element_by_class_name('itemTitle').text.split(':')[1:]})
        data.update({'date':
                     self.wd.find_element_by_class_name('SlotDate').text})
        data.update({'time':
                     self.wd.find_element_by_class_name('SlotTime').text})
        data.update({'place':
                     self.wd.find_element_by_class_name('propertyInfo').text})
        data.update({'abstract':
                     self.wd.find_element_by_class_name('Additional').text.split('Reference')[0]})
        try:
            data.update({'reference':
                         self.wd.find_element_by_class_name('Additional').text.split('Reference')[1]})
        except:
            data.update({'reference': ''})
        authors = self.wd.find_elements_by_class_name('RoleListItem')
        data.update({'authors':
                     {author.text.split('\n')[0]: ', '.join(author.text.split('\n')[1:])
                      for author in authors}})
        data.update({'session':
                     self.wd.find_element_by_class_name('SessionListItem').text.split(':')[1]})
        data.update({'section':
                     self.wd.find_element_by_class_name('infoBox').text.split("\n")[2].split(':')[-1]})
        return data


class PersonSpyder(AGUSpyder):

    def get_base_url(self, year):
        return 'https://agu.confex.com/agu/fm{}/meetingapp.cgi/Person/'.format(str(year))

    def get_cat(self):
        return 'person'

    def wait_for_elements(self, classes):
        '''
        Wait for elements to appear on the page
        '''
        for classe in classes:
            # wait for the different sections to download
            try:
                WebDriverWait(self.wd, self.timeout).until(
                    EC.visibility_of_element_located((By.CLASS_NAME, classe)))
            except:
                time.sleep(self.latency)

    def process_page(self, link):
        '''
        Args:
        link (str): link to go scrap

        Returns:
        A dictionnary which contains information about
        the paper which is contained in link. In particular,
        the scrapper collects information about tag, title, date,
        time, place, abstract, reference, authors, session, section.

        Warning:
        Their is no tag in the title in AGU 2014 !!
        '''
        self.wd.get(link)
        self.wait_for_elements()
        data = {}
        self.wait_for_elements(['AddressList'])
        data.update({'name':
                     wd.find_element_by_class_name('itemTitle').text})
        data.update({'address':
                     wd.find_element_by_class_name('AddressList').text})
        self.wait_for_elements(['SessionListItem', 'PaperListItem'])
        data.update({'name':
                     wd.find_element_by_class_name('itemTitle').text})
        data.update({'address':
                     wd.find_element_by_class_name('AddressList').text})
        data.update({'session': {f.text.split(' ')[0]: ' '.join(f.text.split(' ')[1:])
                                 for f
                                 in wd.find_elements_by_class_name('SessionListItem')}})
        data.update({'papers': {f.text.split(' ')[0]: ' '.join(f.text.split(' ')[1:])
                                for f in
                                wd.find_elements_by_class_name('PaperListItem')}})
        return data


if __name__ == "__main__":

    spyder = PaperSpyder(year=16, firstid=165160, lastid=165180, chunk_size=5)
    spyder.scrap()
