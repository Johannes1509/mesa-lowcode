from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.options import define, options
from tornado.web import Application
from tornado.web import RequestHandler
from tornado.web import StaticFileHandler
from tornado.websocket import WebSocketHandler
from jinja2 import Template
from jinja2 import Environment, FileSystemLoader
import os, time, json

import mesa.space

define("port", default=8888, help="port to listen on")



class StartPage(RequestHandler):
    def get(self):
        self.render("assets/html/index.html")

#Beispiel Websocket connector für websocket verbindung zur Webseite
class WebSocketConnector(WebSocketHandler):
    def open(self):
        print("New client connected")
        self.write_message("You are connected")


    def on_message(self, message):
        print("Message ist:", message)

        try:
            message = json.loads(message)
            print(type(message))
            
            #template laden aus datei
            file_loader = FileSystemLoader('assets/templates')
            env = Environment(loader=file_loader)
            template = env.get_template('test.txt')

            #template mit inhalt füllen
            output = template.render(lib2=message["content"], text1=message["content"])
            print(output)

        except Exception as e:
            pass

        print("received message {}".format(message))
        self.write_message("You said {}".format(message))
        self.last = time.time()
    
    def on_close(self):
        print("connection is closed")

class AssetsHandler(RequestHandler):
    @classmethod
    def setAssetsPath(currentClass, path):
    
        currentClass.assetsPath = path

    def prepare(self):
        requestType = os.path.splitext(self.request.uri)[1]
        if(requestType == ".js"):
            header = "Content-Type"
            body = "application/json"
            self.set_header(header, body)
        elif(requestType == ".css"):
            header = "Content-Type"
            body = "text/css"
            self.set_header(header, body)

    def get(self, *args):
        requestPath = self.request.uri[1:] if (self.request.uri[0] in (r"/", r"\\")) else self.request.uri
        destinationPath = os.path.join(AssetsHandler.assetsPath, requestPath)
        requestPrefix, requestType = os.path.splitext(self.request.uri)

        if(requestType in (".css", ".js")):
            self.render(destinationPath)
        else:
            if("?" in destinationPath):
                destinationPath = destinationPath.split("?")[0]
            destinationPath = destinationPath
            f = open(destinationPath, "rb")
            self.write(f.read())
            f.close()

def main():
    """Construct and serve the tornado application."""

    app = Application([
        (r"/index.html", StartPage),
        (r"/server", WebSocketConnector),
        (r".*((.css)|(.js)|(.woff2)|(.woff)|(.ttf))", AssetsHandler)
    ], )

    assetsPath = os.path.join(os.path.dirname(os.path.realpath(__file__)), "assets")
    AssetsHandler.setAssetsPath(assetsPath)

    http_server = HTTPServer(app)
    http_server.listen(options.port)
    print("Listening on http://localhost:{}/index.html".format(options.port))
    IOLoop.current().start()

main()



