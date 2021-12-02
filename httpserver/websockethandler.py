from tornado.websocket import WebSocketHandler
import json, time

class WebSocketConnector(WebSocketHandler):
    def initialize(self, refObj):
        self.mainServer = refObj 

    def open(self):
        print("New client connected")
        self.write_message('{"type":"welcome","data":"client connected successfully"}')


    def on_message(self, message):
        print("received message {}".format(message))
        
        try:
            message = json.loads(message)

            if(message["type"] == "load"):

                modelCode = self.mainServer.dbConnector.getModelCode(message["data"]["modelId"])
                writeMessage = {
                    "type": "loadedmodel",
                    "data": modelCode
                }
                self.write_message(json.dumps(writeMessage))

            if(message["type"] == "save"):
                self.mainServer.dbConnector.saveModelCode(message["data"]["model"]["id"], json.dumps(message["data"]))

            if(message["type"] == "generate"):
                generatedCode = self.mainServer.codeGenerator.generateModel(dict2obj(message["data"]), message["data"]["model"]["id"])
                writeMessage = {
                    "type": "generatedcode",
                    "data": generatedCode
                }
                self.write_message(json.dumps(writeMessage))
            

        except Exception as e:
            raise e

        writeMessage = {
            "type": "you_said",
            "data": message
        }
        self.write_message(json.dumps(writeMessage))
    
    def on_close(self):
        print("connection is closed", self.close_code, self.close_reason)

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