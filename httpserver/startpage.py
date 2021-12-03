from tornado.web import RequestHandler

class StartPageHandler(RequestHandler):
    def initialize(self, refObj):
        self.mainServer = refObj   
        
    def get(self):
        newModelId = self.mainServer.dbConnector.insertNewModel()
        self.redirect('/model/'+str(newModelId))

