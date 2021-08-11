from tornado.web import RequestHandler

class StartPage(RequestHandler):
    def get(self):
        self.render("../assets/html/index.html")