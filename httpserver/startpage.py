from tornado.web import RequestHandler
import logging
logger = logging.getLogger(__name__)
class StartPageHandler(RequestHandler):
    """Handler for web request if no model id is specified"""
    def initialize(self, refObj):
        self.mainServer = refObj   
        
    def get(self):
        logger.info("New request for new model id")
        newModelId = self.mainServer.dbConnector.insertNewModel()
        logger.info("Returning model id <"+str(newModelId)+"> back to client.")
        
        self.redirect('/model/'+str(newModelId))

