import machine
import docker
import time
import os
import boltons.iterutils as biter
import argparse
from tqdm import *


def create_selenium_container(port, name):
    host_config = client.create_host_config(port_bindings={4444: port})
    container = client.create_container(
        image='danielfrg/selenium',
        ports=[4444],
        host_config=host_config,
        name=name)
    return container


def create_spyder_container(firstid, lastid, ip, name):
    environment = ['IP={}'.format(ip),
                   'FIRSTID={}'.format(firstid),
                   'LASTID={}'.format(lastid)]
    host_config = client.create_host_config(binds={
        '{}/data/scrapped'.format(os.environ['PWD']): {
            'bind': '/tmp/working/data/scrapped',
            'mode': 'rw',
        }})
    container = client.create_container(
        image='test',
        name=name,
        environment=environment,
        volumes=['/tmp/working/data/scrapped'],
        host_config=host_config)
    return container

if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument('--machine', required=True)
    parser.add_argument('--start', required=True, type=int)
    parser.add_argument('--end', required=True, type=int)
    parser.add_argument('--port', required=True, type=int)
    parser.add_argument('--chunk_size', action="store",
                        default=10000, type=int)

    config = vars(parser.parse_args())

    # setup
    m = machine.Machine(path="/usr/local/bin/docker-machine")
    client = docker.Client(**m.config(machine=config['machine']))
    client.ping()

    port = config['port']
    chunks = range(config['start'], config['end'])
    iterator = biter.chunked_iter(chunks,
                                  config['chunk_size'])
    for chunk in tqdm(iterator, total=len(chunks) / config['chunk_size']):
        port, firstid, lastid = port, chunk[0], chunk[-1]
        name = '{}_{}'.format(str(firstid), str(lastid))

        selenium_container = create_selenium_container(
            port=port, name='selenium_{}'.format(name))
        client.start(selenium_container)

        # Get some time to the container to setup
        time.sleep(15)
        spyder_container = create_spyder_container(
            firstid,
            lastid,
            m.ip(config['machine']),
            name='spyder_{}'.format(name))
        client.start(spyder_container)
        port += 1
