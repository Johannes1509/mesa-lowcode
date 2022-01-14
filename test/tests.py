import unittest
import sys
import os
import random
import string
import subprocess
import urllib.request
import websocket
import json
from jinja2 import Environment, FileSystemLoader

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_START_PATH = os.path.dirname(SCRIPT_DIR)
sys.path.append(os.path.join(PROJECT_START_PATH, "src"))
sys.path.append(PROJECT_START_PATH)

from codegeneration.gentools import GenTools
from codegeneration.agentgenerator import AgentGenerator
from codegeneration.startupgenerator import StartupGenerator
from codegeneration.modelgenerator import ModelGenerator

class TestGenTools(unittest.TestCase):
    allowedChars = r"[0-9a-zA-Z]+"
    methodHeader = r".*def.*:.*"

    def testVariableNameGeneration(self):
        inputStr = self.__generateRandomString()
        result = GenTools.getVarName(inputStr)
        self.assertRegex(result, TestGenTools.allowedChars, self.__getFailureMessage(inputStr, result))
        self.assertTrue(result[0].islower(), self.__getFailureMessage(inputStr, result))

    def testClassNameGeneration(self):
        inputStr = self.__generateRandomString()
        result = GenTools.getClassName(inputStr)
        self.assertRegex(result, TestGenTools.allowedChars, self.__getFailureMessage(inputStr, result))
        self.assertTrue(result[0].isupper(), self.__getFailureMessage(inputStr, result))

    def testCustomCodeHeaderRemovement(self):
        inputStrs = [
            "def getValue():\n    return 0.4",
            "def changeMovement():\n    self.mov = random.randint(0,4)\n    print('Changed movement speed of agent')",
            "def getVals:\n return self.__getStartupParameters()"
        ]

        for inputStr in inputStrs:
            result = GenTools.removeMethodHeader(inputStr)
            self.assertNotRegex(result, TestGenTools.methodHeader, self.__getFailureMessage(inputStr, result))

    def testSpecialCharsRemovement(self):
        inputStr = self.__generateRandomString()
        result = GenTools.getStrNonSpecialChars(inputStr)
        self.assertRegex(result, TestGenTools.allowedChars, self.__getFailureMessage(inputStr, result))

    def __generateRandomString(self):
        characters = string.ascii_letters + string.punctuation
        return (''.join(random.choice(characters) for i in range(random.randint(1,100)))).strip()

    def __getFailureMessage(self, input, result):
        return "Input: {} || Result: {}".format(input, result)


class TestWebSocketConnection(unittest.TestCase):

    def testLoadModel(self):
        serverProcess = self.__startServer()
        
        ws = websocket.WebSocket()
        ws.connect("ws://localhost:7700/server")
        ws.recv()
        ws.send(json.dumps({"type": "load", "data": {"modelId": 0}}))
        response = json.loads(ws.recv())
        result = False
        try:
            loadedModel = json.loads(response["data"])
            _t = int(loadedModel["model"]["id"])
            result = True
        except Exception as e:
            print(e)

        self.assertTrue(result, "Model could not be loaded from server")
        ws.close()
        self.__stopServer(serverProcess)
        

    def testSaveModel(self):
        serverProcess = self.__startServer()

        #saving a new model with the id 0
        ws = websocket.WebSocket()
        ws.connect("ws://localhost:7700/server")
        ws.recv()
        ws.send(json.dumps({"type": "save", "data": {"model": {"id": 0, "content": "AUTOMATICTEST"}}}))
        ws.recv()

        #loading the model with the id 0
        ws.send(json.dumps({"type": "load", "data": {"modelId": 0}}))
        response = json.loads(ws.recv())
        result = False
        try:
            loadedModel = json.loads(response["data"])
            result = True if int(loadedModel["model"]["id"]) == 0 else False
        except Exception as e:
            print(e)

        self.assertTrue(result, "Model could not be saved on server")
        ws.close()
        self.__stopServer(serverProcess)

    def __startServer(self):
        serverProcess = subprocess.Popen("python src/main.py", cwd=PROJECT_START_PATH)
        return serverProcess
    
    def __stopServer(self, serverProcess):
        serverProcess.kill()
        serverProcess.wait()




class TestCodeGenerators(unittest.TestCase):
    models = [
        {
            "id":62,
            "name":"T1",
            "description":"Desc1",
            "scheduler":"basic",
            "space":"none",
            "spaceWidth":"",
            "spaceHeight":"",
            "stepsToTake":"100"
        },
        {
            "id":61,
            "name":"T2",
            "description":"Desc3",
            "scheduler":"random",
            "space":"single",
            "spaceWidth":"100",
            "spaceHeight":"100",
            "stepsToTake":"500",
        }
    ]

    agents = [
        {
            "properties":[
            {
                "type":"float",
                "name":"transmissionProp",
                "value":"return None"
            }
            ],

            "placement":{
            "type":"random"
            },
            "nodes":{
            "3":{
                "stepname":"test1",
                "stepcode":"def do():\n    pass",
                "description":"test",
                "stepnumber":0
            },
            "7":{
                "stepname":"test2",
                "stepcode":"def do2():\n    pass",
                "description":"test",
                "stepnumber":1
            }
            },
            "id":0,
            "name":"TestAgent",
            "description":"TEST",
            "initNumber":"100"
        },
        {
            "properties":[
                {
                "type":"int",
                "name":"t",
                "value":"def getInt():\n    return random.randint(1, 2)"
                },
                {
                "type":"float",
                "name":"t",
                "value":"def getFloat():\n    return self.income+math.sqrt(3)"
                }
            ],
            "placement": {

            },
            "nodes":{
                "13":{
                "stepname":"1",
                "stepcode":"def d1():\n    pass",
                "description":"Desc#1",
                "stepnumber":1
                },
                "14":{
                "stepname":"2",
                "stepcode":"def d2():\n    pass",
                "description":"Desc#1",
                "stepnumber":2
                },
                "15":{
                "stepname":"0",
                "stepcode":"def d0():\n    print(\"Agent <\"+str(self.unique_id)+\"> test \")",
                "description":"Desc#1",
                "stepnumber":0
                }
            },
            "id":0,
            "name":"TAgent",
            "description":"Desc",
            "orderNum":1,
            "initNumber":"50"           
        }
    ]

    def testAgentCodeGeneration(self):
        templateFileLoader = FileSystemLoader('src/assets/templates')
        env = Environment(loader=templateFileLoader)
        agentGen = AgentGenerator(env.get_template('agent.py'))

        try:
            for agent in TestCodeGenerators.agents:
                agentGen.preprocessAgent(dict2obj(agent))
        except Exception as e:
            self.fail("Preprocessing agent failed, because an exception occured: "+e)


    def testModelCodeGeneration(self):
        templateFileLoader = FileSystemLoader('src/assets/templates')
        env = Environment(loader=templateFileLoader)
        modelGen = ModelGenerator(env.get_template('model.py'))

        try:
            for model in TestCodeGenerators.models:
                modelGen.preprocessModel(dict2obj(model), None)
        except Exception as e:
            self.fail("Preprocessing model failed, because an exception occured: "+e)

    def testStartupCodeGeneration(self): 
        templateFileLoader = FileSystemLoader('src/assets/templates')
        env = Environment(loader=templateFileLoader)
        startUpGen = StartupGenerator(env.get_template('main.py'))

        try:
            for model in TestCodeGenerators.models:
                startUpGen.preprocessMainFile(dict2obj(model), None)
        except Exception as e:
            self.fail("Preprocessing startup main file failed, because an exception occured: "+e)


class TestMainSoftwareStartup(unittest.TestCase):
    
    def testWebserverStarted(self):
        serverProcess = subprocess.Popen("python src/main.py", cwd=PROJECT_START_PATH)
        result = urllib.request.urlopen("http://localhost:7700/model/0").getcode()
        self.assertEqual(result, 200, "Server http code is: "+str(result))
        serverProcess.kill()
        serverProcess.wait()

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


if __name__ == '__main__':
    unittest.main()