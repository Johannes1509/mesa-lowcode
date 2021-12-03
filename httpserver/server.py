from tornado.httpserver import HTTPServer
from tornado.web import Application
from tornado.ioloop import IOLoop
from httpserver.startpage import StartPageHandler
from httpserver.modelpage import ModelPageHandler
from httpserver.downloadhandler import DownloadHandler
from httpserver.websockethandler import WebSocketConnector
from httpserver.resultfiles import ResultFilesHandler
from httpserver.assetshandler import AssetsHandler
from httpserver.dbconnector import DBConnector
from codegeneration.maingenerator import CodeGenerator
import os

class AppServer(Application):
    def __init__(self):
        super().__init__([
        (r".*((.css)|(.js)|(.woff2)|(.woff)|(.ttf)|(.svg))", AssetsHandler),
        (r"/", StartPageHandler, {"refObj": self}),
        (r"/model/([0-9]+)\/?", ModelPageHandler, {"refObj": self}),
        (r"/model/([0-9]+)\/download\/?", DownloadHandler, {"refObj": self}),
        (r"/server", WebSocketConnector, {"refObj": self}),
        (r"/resultfiles", ResultFilesHandler)])

        assetsPath = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../assets")
        AssetsHandler.setAssetsPath(assetsPath, "model")

        self.dbConnector = DBConnector("assets/modelstorage/models.db")
        self.codeGenerator = CodeGenerator()

        http_server = HTTPServer(self)
        http_server.listen(7700)
        print("Listening on http://localhost:7700/")
        IOLoop.current().start()

