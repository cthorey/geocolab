import machine
import docker
import time
import os
import boltons.iterutils as biter


def create_selenium_container(port):
    host_config = client.create_host_config(port_bindings={4444: port})
    container = client.create_container(
        image='danielfrg/selenium',  ports=[4444],
        host_config=host_config)
    return container


def create_spyder_container(firstid, lastid, port, ip):
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
        image='test',
        environment=environment,
        volumes=['/tmp/working/data/scrapped'],
        host_config=host_config)
    return container

if __name__ == "__main__":

    droplet = 'ds'

    # setup
    m = machine.Machine(path="/usr/local/bin/docker-machine")
    client = docker.Client(**m.config(machine=droplet))
    client.ping()

    port, firstid, lastid = 4444, 210000, 210010

    selenium_container = create_selenium_container(port)
    print('-' * 50 + '\n')
    print('run selenium container\n')
    client.start(selenium_container)

    # Get some time to the container to setup
    time.sleep(15)
    spyder_container = create_spyder_container(
        firstid, lastid, port, m.ip(droplet))
    print('-' * 50 + '\n')
    print('run spyder container\n')
    client.start(spyder_container)
