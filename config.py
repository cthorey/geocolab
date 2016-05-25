import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    PROD = False
    MODEL = 'LSA_500'
    SECRET_KEY = 'M4&*SKyjVtAam*6I%t@gqXx*qmED9dHLh6yGXib&p3Ce8G$DZoz3vw$Hc8xB&6LHvmB7Ntbw1O5^IDcUv@iSkVWKGq@1ujY#30ue'


class ProductionConfig(Config):
    DEBUG = False
    MODEL = 'LSA_500'
    PROD = True


class DevelopmentConfig(Config):
    DEBUG = True
    MODEL = 'LSA_500'
