from tornado.httpserver import HTTPServer
from tornado.web import Application
from tornado.ioloop import IOLoop
from httpserver.startpage import StartPage
from httpserver.websockethandler import WebSocketConnector
from httpserver.resultfiles import ResultFilesHandler
from httpserver.assetshandler import AssetsHandler
import os

class FrontendServer(Application):
    def __init__(self):
        super().__init__([
        (r"/index.html", StartPage),
        (r"/server", WebSocketConnector),
        (r"/resultfiles", ResultFilesHandler),
        (r".*((.css)|(.js)|(.woff2)|(.woff)|(.ttf))", AssetsHandler)])

        assetsPath = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../assets")
        AssetsHandler.setAssetsPath(assetsPath)

        http_server = HTTPServer(self)
        http_server.listen(8888)
        print("Listening on http://localhost:8888/index.html")
        IOLoop.current().start()

