from webapp import app
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--prod', dest='prod',
                        action='store_true', help='run in prod?')
    parser.add_argument('--port', dest='port', type=int,
                        default=5000, help='port to serve on')
    args = parser.parse_args()
    print args
    if args.prod:
        # run on Tornado instead, since running raw Flask in prod is not
        # recommended
        print 'starting tornado!'
        from tornado.wsgi import WSGIContainer
        from tornado.httpserver import HTTPServer
        from tornado.ioloop import IOLoop
        from tornado.log import enable_pretty_logging
        enable_pretty_logging()
        http_server = HTTPServer(WSGIContainer(app))
        http_server.listen(args.port)
        IOLoop.instance().start()
        #app.run(host='0.0.0.0', threaded=True)
    else:
        print 'starting flask!'
        app.debug = True
        app.run(port=args.port)
        args = parser.parse_args()
        app.run(debug=True)
