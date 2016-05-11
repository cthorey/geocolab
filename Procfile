web: gunicorn webapp:app
init: python src/database/make_database.py --name='geocolab' --if_exist='replace'
init: python src/model/build_model.py --name='LSA'
