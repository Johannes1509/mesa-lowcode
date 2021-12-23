import unittest
import sys
import os
import random
import string
import subprocess
import urllib.request
import websocket
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(os.path.dirname(SCRIPT_DIR)))

from src.codegeneration.gentools import GenTools


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
        result = GenTools.getStrNonSepcialChars(inputStr)
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
        ws.send(json.dumps({"type": "load", "data": {"modelId": 1}}))
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

        #saving a new model with the id 99
        ws = websocket.WebSocket()
        ws.connect("ws://localhost:7700/server")
        ws.recv()
        ws.send(json.dumps({"type": "save", "data": {"model": {"id": 99, "content": "AUTOMATICTEST"}}}))
        ws.recv()

        #loading the model with the id 99
        ws.send(json.dumps({"type": "load", "data": {"modelId": 99}}))
        response = json.loads(ws.recv())
        result = False
        try:
            loadedModel = json.loads(response["data"])
            result = True if int(loadedModel["model"]["id"]) == 99 else False
        except Exception as e:
            print(e)

        self.assertTrue(result, "Model could not be saved on server")
        ws.close()
        self.__stopServer(serverProcess)

    def __startServer(self):
        projectStartPath = os.path.dirname(os.path.dirname(SCRIPT_DIR))
        serverProcess = subprocess.Popen("python src/main.py", cwd=projectStartPath)
        return serverProcess
    
    def __stopServer(self, serverProcess):
        serverProcess.kill()
        serverProcess.wait()




class TestCodeGenerators(unittest.TestCase):

    def testAgentCodeGeneration(self):
        pass

    def testModelCodeGeneration(self):
        pass

    def testStartupCodeGeneration(self):
        pass

    def testResultFilesSaving(self):
        pass


class TestMainSoftwareStartup(unittest.TestCase):
    
    def testWebserverStarted(self):
        projectStartPath = os.path.dirname(os.path.dirname(SCRIPT_DIR))
        serverProcess = subprocess.Popen("python src/main.py", cwd=projectStartPath)
        result = urllib.request.urlopen("http://localhost:7700/model/99").getcode()
        self.assertEqual(result, 200, "Server http code is: "+str(result))
        serverProcess.kill()
        serverProcess.wait()


if __name__ == '__main__':
    unittest.main()