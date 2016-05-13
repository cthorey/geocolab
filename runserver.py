from webapp import app
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--prod', dest='prod',
                        action='store_true', help='run in prod?')
    args = parser.parse_args()

    print 'starting flask!'
    app.run(port=args.port)
    app.debug = True
