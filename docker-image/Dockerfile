FROM jupyter/scipy-notebook

MAINTAINER CLEMENT THOREY <clement.thorey@gmail.com>

USER $NB_USER

RUN pip install --upgrade pip &&\
    pip install --upgrade tqdm && \
    pip install boltons &&\
    pip install pyvirtualdisplay selenium &&\
    pip install pyyaml &&\
    pip install requests &&\
    ## NLP
    pip install --upgrade gensim &&\
    pip install pycountry &&\    
    pip install ftfy

