from tornado.httpserver import HTTPServer
from tornado.web import Application
from tornado.ioloop import IOLoop
from httpserver.startpage import StartPageHandler
from httpserver.modelpage import ModelPageHandler
from httpserver.downloadhandler import DownloadHandler
from httpserver.websockethandler import WebSocketConnector
from httpserver.assetshandler import AssetsHandler
from httpserver.dbconnector import DBConnector
from codegeneration.maingenerator import CodeGenerator
import os, logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()

class AppServer(Application):
    """Python tornado webserver handling all requests and hosting the web applications"""

    def __init__(self):

        #init python tornado webserver
        super().__init__([
        (r".*((.css)|(.js)|(.woff2)|(.woff)|(.ttf)|(.svg))", AssetsHandler),
        (r"/", StartPageHandler, {"refObj": self}),
        (r"/model/([0-9]+)\/?", ModelPageHandler, {"refObj": self}),
        (r"/model/([0-9]+)\/download\/?", DownloadHandler, {"refObj": self}),
        (r"/server", WebSocketConnector, {"refObj": self})])

        assetsPath = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../assets")
        AssetsHandler.setAssetsPath(assetsPath, "model")

        #connect tools for webservice connector
        self.dbConnector = DBConnector("assets/modelstorage/models.db")
        self.codeGenerator = CodeGenerator()

        #start the webserver
        http_server = HTTPServer(self)
        http_server.listen(7700)
        logger.info("Server started. Listening on http://localhost:7700/")
        IOLoop.current().start()

