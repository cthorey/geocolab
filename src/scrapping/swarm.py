import machine
import docker
import time
import os
import boltons.iterutils as biter
import argparse
from tqdm import *


def create_selenium_container(name):
    '''
    Create a selenium container listening throuth port 4444.
    This port is map to the machine throught the variable port.
    name is the name of the container.
    '''
    host_config = client.create_host_config(publish_all_ports=True)
    container = client.create_container(
        image='danielfrg/selenium',
        ports=[4444],
        host_config=host_config,
        name=name)
    return container


def create_spyder_container(firstid, lastid, port, ip, name):
    '''
    Create a spyder container.
    Pass some environment variable to define the firstid lastid to process,
    the ip of the machine, the mapping port from the selenium serveur on
    the machine and a name for the container.
    '''
    environment = ['IP={}'.format(ip),
                   'PORT={}'.format(port),
                   'FIRSTID={}'.format(firstid),
                   'LASTID={}'.format(lastid)]
    host_config = client.create_host_config(binds={
        '{}/data/scrapped'.format(os.environ['PWD']): {
            'bind': '/tmp/working/data/scrapped',
            'mode': 'rw',
        }})
    container = client.create_container(
        image='cthorey/aguscrapper',
        name=name,
        environment=environment,
        volumes=['/tmp/working/data/scrapped'],
        host_config=host_config)
    return container


def try_until_success(func):
    '''
    handle error on the client side (docker).
    '''
    def func_wrapper(*args):
        passing = False
        i = 0
        while not passing:
            if i > 100:
                raise Exception('Sorry, has try the max number of times')
            try:
                res = func(*args)
                passing = True
            except:
                i += 1
                pass
        return res
    return func_wrapper


@try_until_success
def init_client(machine_name):
    '''
    Handle error with the client 
    '''
    m = machine.Machine(path="/usr/local/bin/docker-machine")
    client = docker.Client(**m.config(machine=machine_name))
    client.ping()
    return m, client


@try_until_success
def start_container(client, container):
    '''
    Handle error with the client 
    '''
    client.start(container)


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument('--machine', required=True, type=str)
    parser.add_argument('--start', required=True, type=int)
    parser.add_argument('--end', required=True, type=int)
    # Not the same that the one in scrapper
    parser.add_argument('--chunk_size', action="store",
                        default=10000, type=int)

    config = vars(parser.parse_args())

    # setup
    m, client = init_client(config['machine'])
    ip = m.ip(config['machine'])
    chunks = range(config['start'], config['end'])
    iterator = biter.chunked_iter(chunks,
                                  config['chunk_size'])
    for j, chunk in enumerate(tqdm(iterator, total=len(chunks) / config['chunk_size'])):
        firstid, lastid = chunk[0], chunk[-1]
        name = '{}_{}'.format(str(firstid), str(lastid))

        selenium_container = create_selenium_container(
            name='selenium_{}'.format(name))
        _ = start_container(client, selenium_container)

        # Get the port
        port = int(client.port('selenium_{}'.format(name), 4444)
                   [0]['HostPort'])

        # Get some time to the container to setup
        time.sleep(15)
        spyder_container = create_spyder_container(
            firstid=firstid,
            lastid=lastid,
            port=port,
            ip=ip,
            name='spyder_{}'.format(name))
        start_container(client, spyder_container)

        # Weird but for some reason.
        if len(client.containers()) < j * 2:
            start_container(client, spyder_container)
