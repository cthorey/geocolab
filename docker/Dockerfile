FROM jupyter/scipy-notebook

MAINTAINER CLEMENT THOREY <clement.thorey@gmail.com>

USER root

# install google chrome
RUN apt-get -y update
RUN apt-get install -yqq unzip libxss1 libappindicator1 libindicator7 gconf-service libasound2 \
  libgconf-2-4 libnspr4 libnss3 libpango1.0-0 libxtst6 fonts-liberation xdg-utils
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome*.deb

# install chromedriver
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/

# install xvfb
RUN apt-get install -yqq xvfb

#==================
# Python 
#==================

RUN pip install --upgrade tqdm && \
    pip install boltons &&\
    pip install selenium &&\
    pip install bs4 &&\
    pip install pyyaml &&\
    pip install requests &&\

    ## NLP
    # pip install --upgrade gensim &&\

    # ## Jupyter stuff
    # pip install https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tarball/master &&\
    # pip install jupyter_nbextensions_configurator &&\
    # jupyter contrib nbextension install --user &&\
    # jupyter nbextensions_configurator enable --user &&\
    
    # clean up pip cache
    rm -rf /root/.cache/pip/*

RUN apt-get clean && rm -rf /var/lib/apt/lists/*
