from tornado.websocket import WebSocketHandler
import json, time, traceback
import logging
logger = logging.getLogger(__name__)
class WebSocketConnector(WebSocketHandler):
    """Handler for the websocket connection between server and clients"""
    def initialize(self, refObj):
        self.mainServer = refObj 

    def open(self):
        logger.info("New client connected")
        self.write_message('{"type":"welcome","data":"client connected successfully"}')


    def on_message(self, message):
        logger.debug("Received message from client {}".format(message))
        
        try:
            message = json.loads(message)

            if(message["type"] == "load"):
                #handling loading of model code to client
                logger.info("Client requested loading model code from database.")
                modelCode = self.mainServer.dbConnector.getModelCode(message["data"]["modelId"])
                writeMessage = {
                    "type": "loadedmodel",
                    "data": modelCode
                }
                self.write_message(json.dumps(writeMessage))

            if(message["type"] == "save"):
                #saving model code to databasse
                logger.info("Client requested saving model code to database.")
                self.mainServer.dbConnector.saveModelCode(message["data"]["model"]["id"], json.dumps(message["data"]))

            if(message["type"] == "generate"):
                #generating python-mesa code from client model inputs
                logger.info("Client requested code generation for builded model.")

                writeMessage = {
                    "type": "generatedcode",
                    "data": None
                }
                try:
                    generatedCode = self.mainServer.codeGenerator.generateModel(dict2obj(message["data"]), message["data"]["model"]["id"])
                    writeMessage["data"] = generatedCode
                    logger.info("Generated code for client successfully.")
                except Exception as e:
                    logger.error("Failed to generated model code!", exc_info=True)
                    writeMessage["data"] = [
                        {
                            "name": "ERROR DURING CODE GENERATION",
                            "code": traceback.format_exc()
                        }
                    ]
                self.write_message(json.dumps(writeMessage))
            

        except Exception as e:
            raise e

        writeMessage = {
            "type": "you_said",
            "data": message
        }
        self.write_message(json.dumps(writeMessage))
    
    def on_close(self):
        logger.info("Client connection is closed. Close code: {} | Close reason: {}".format(self.close_code, self.close_reason))

class dict2obj(dict):
    def __init__(self, dict_):
        super(dict2obj, self).__init__(dict_)
        for key in self:
            item = self[key]
            if isinstance(item, list):
                for idx, it in enumerate(item):
                    if isinstance(it, dict):
                        item[idx] = dict2obj(it)
            elif isinstance(item, dict):
                self[key] = dict2obj(item)

    def __getattr__(self, key):
        return self[key]