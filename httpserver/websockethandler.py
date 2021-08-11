from tornado.websocket import WebSocketHandler
import json, time
import codegeneration.maingenerator as codegenerator
class WebSocketConnector(WebSocketHandler):
    def __init__(self, *args):
        super().__init__(*args)
        self.codeGenerator = codegenerator.CodeGenerator()

    def open(self):
        print("New client connected")
        self.write_message("You are connected")


    def on_message(self, message):
        print("Message ist:", message)

        try:
            message = json.loads(message)

            if(message["type"] == "modelData"):
                self.codeGenerator.generateModel(dict2obj(message["data"]))
            
            

        except Exception as e:
            raise e

        print("received message {}".format(message))
        self.write_message("You said {}".format(message))
        self.last = time.time()
    
    def on_close(self):
        print("connection is closed")

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