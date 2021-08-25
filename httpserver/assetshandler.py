from tornado.web import RequestHandler
import os

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
        elif(requestType == ".svg"):
            header = "Content-Type"
            body = "image/svg+xml"
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