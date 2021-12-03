from tornado.web import RequestHandler
import os
from io import BytesIO
class DownloadHandler(RequestHandler):
    def initialize(self, refObj):
        self.mainServer = refObj
        self.blockSize = 4096

    def get(self, modelId):
        print("Download of result files requested")
        resultZipPath = os.path.join(self.mainServer.codeGenerator.tempDir.name, str(modelId), "result.zip")
        
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + "result.zip")
        with open(resultZipPath, "rb") as f:
            while True:
                data = f.read(self.blockSize)
                if not data:
                    break
                self.write(data)
        self.finish()
        

