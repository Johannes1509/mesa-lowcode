from tornado.web import RequestHandler
import logging
logger = logging.getLogger(__name__)
class ModelPageHandler(RequestHandler):
    """Handler for the main web application if an model id is given"""
    def initialize(self, refObj):
        self.mainServer = refObj

    def get(self, modelId):
        logger.info("Requested page <{}> ; model id <{}>".format(self.request.uri, modelId))
        self.render("../assets/html/index.html")