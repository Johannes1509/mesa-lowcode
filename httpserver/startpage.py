from tornado.web import RequestHandler
import random
class StartPage(RequestHandler):
    def get(self, **kwargs):
        print("modelId",kwargs.get("modelid"), kwargs, self.request.arguments)
        print("REquested Startpage: "+self.request.uri)
        modelId = random.randint(10000,99999)
        self.render("../assets/html/index.html")