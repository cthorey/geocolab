FROM python:3.5

MAINTAINER CLEMENT THOREY <clement.thorey@gmail.com>

RUN pip install --upgrade pip &&\
    pip install --upgrade tqdm && \
    pip install boltons &&\
    pip install selenium &&\
    pip install pyyaml &&\
    pip install requests &&\
    ## NLP
    pip install pycountry &&\    
    pip install ftfy

ENV CHUNK_SIZE=1000
ENV YEAR=16
ENV PORT=4444
ENV IP=192.168.99.100
ENV FIRSTID=100000
ENV LASTID=100010

ENV ROOT_DIR=/tmp/working
RUN mkdir $ROOT_DIR
RUN mkdir $ROOT_DIR/data
RUN mkdir $ROOT_DIR/data/scrapped

VOLUME $ROOT_DIR/data/scrapped

ADD scrapper.py $ROOT_DIR
WORKDIR $ROOT_DIR

CMD python scrapper.py



