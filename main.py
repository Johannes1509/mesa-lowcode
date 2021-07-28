from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.options import define, options
from tornado.web import Application
from tornado.web import RequestHandler
from tornado.web import StaticFileHandler
import os

define("port", default=8888, help="port to listen on")



class StartPage(RequestHandler):
    def get(self):
        self.render("assets/html/index.html")




def main():
    """Construct and serve the tornado application."""

    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "assets")
    }

    app = Application([
        (r"/index.html", StartPage),
    ], **settings)



    http_server = HTTPServer(app)
    http_server.listen(options.port)
    print("Listening on http://localhost:{}/index.html".format(options.port))
    IOLoop.current().start()

main()

