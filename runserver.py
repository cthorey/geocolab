from webapp import app
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', dest='port', type=int,
                        action='store', default=4000)
    args = parser.parse_args()
    app.run(port=args.port)
