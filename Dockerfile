FROM jupyter/scipy-notebook

MAINTAINER CLEMENT THROEY <clement.thorey@gmail.com>

USER root

RUN apt-get update 
RUN apt-get install curl
# Install Firefox
RUN \
    curl 'https://download-installer.cdn.mozilla.net/pub/firefox/releases/35.0/linux-x86_64/en-US/firefox-35.0.tar.bz2' \
        -o firefox.tar.bz2 &&\
    bunzip2 firefox.tar.bz2 &&\
    tar xf firefox.tar &&\
    rm firefox.tar

RUN apt-get update && apt-get install -y \
    # Headless browser support
    xvfb \
    # Needed to launch firefox
    libasound2 \
    libgtk2.0-0 \
    libdbus-glib-1-2 \
    libxcomposite1

RUN pip install --upgrade tqdm && \
    pip install boltons &&\
    pip install selenium &&\
    pip install bs4 &&\

    ## NLP
    conda config --add channels spacy &&\
    conda install spacy &&\
    pip install --upgrade gensim &&\
    pip install fasttext &&\

    ## Jupyter stuff
    pip install https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tarball/master &&\
    pip install jupyter_nbextensions_configurator &&\
    jupyter contrib nbextension install --user &&\
    jupyter nbextensions_configurator enable --user &&\
    
    # clean up pip cache
    rm -rf /root/.cache/pip/*
