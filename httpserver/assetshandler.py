from tornado.web import RequestHandler
import os

class AssetsHandler(RequestHandler):
    """Handler for css/js/icon files for the frontend"""

    @classmethod
    def setAssetsPath(currentClass, path, stripPath):
    
        currentClass.assetsPath = path
        currentClass.stripPath = stripPath

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
        requestPath = requestPath[(1+len(AssetsHandler.stripPath)):] if requestPath.startswith(AssetsHandler.stripPath) else requestPath 

        destinationPath = os.path.join(AssetsHandler.assetsPath, requestPath)
        _, requestType = os.path.splitext(self.request.uri)

        if(requestType in (".css", ".js")):
            self.render(destinationPath)
        else:
            #for svg-icons
            if("?" in destinationPath):
                destinationPath = destinationPath.split("?")[0]
            destinationPath = destinationPath
            f = open(destinationPath, "rb")
            self.write(f.read())
            f.close()