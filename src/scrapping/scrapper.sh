kpython(){
  docker run -e ROOT_DIR='/tmp/working' -v $PWD:/tmp/working -w=/tmp/working --rm -it $1 python $2
}
export PYTHON_SCRIPT='scrap_papers.py'
export HOST=4444
export FIRSTID=100000
export LASTID=100010
export CHUNK_SIZE=5
export YEAR=16
eval $(docker-machine env ds)
export IP='192.168.99.100'
docker run -d -p $HOST:4444 danielfrg/selenium
kpython cthorey/aguscrapper "$PYTHON_SCRIPT --year=$YEAR --firstid=$FIRSTID --lastid=$SECONDID --chunk_size=$CHUNK_SIZE --host=$HOST"
