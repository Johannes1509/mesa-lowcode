from tornado.web import RequestHandler
import os
from io import BytesIO
import logging
logger = logging.getLogger(__name__)

class DownloadHandler(RequestHandler):
    """Handler for downloading the result code files zip archive """
    def initialize(self, refObj):
        self.mainServer = refObj
        self.blockSize = 4096

    def get(self, modelId):
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + "result.zip")

        logger.info("Download of result files requested")
        resultZipPath = os.path.join(self.mainServer.codeGenerator.tempDir.name, str(modelId), "result.zip")

        #writing zip archive to the web client
        with open(resultZipPath, "rb") as f:
            while True:
                data = f.read(self.blockSize)
                if not data:
                    break
                self.write(data)
        self.finish()

        logger.info("Download of result files completed")
        

