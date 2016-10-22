FROM jupyter/scipy-notebook

MAINTAINER CLEMENT THOREY <clement.thorey@gmail.com>

USER $NB_USER

RUN pip install --upgrade pip &&\
    pip install --upgrade tqdm && \
    pip install boltons &&\
    pip install pyvirtualdisplay selenium &&\
    pip install bs4 &&\
    pip install pyyaml &&\
    pip install requests &&\
    ## NLP
    pip install --upgrade gensim &&\

    # ## Jupyter stuff
    pip install https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tarball/master &&\
    pip install jupyter_nbextensions_configurator &&\
    jupyter contrib nbextension install --user &&\
    jupyter nbextensions_configurator enable --user &&\

    pip install docker-py &&\
    pip install python-docker-machine
    

