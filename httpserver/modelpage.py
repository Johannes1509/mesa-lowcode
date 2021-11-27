from tornado.web import RequestHandler

class ModelPage(RequestHandler):
    def initialize(self, refObj):
        self.mainServer = refObj

    def get(self, modelId):
        print("Requested page:", self.request.uri, "ModelId:", modelId)
        self.render("../assets/html/index.html")