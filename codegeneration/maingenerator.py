from agentgenerator import AgentGenerator
from modelgenerator import ModelGenerator
from startupgenerator import StartupGenerator
from jinja2 import Environment, FileSystemLoader
import os, shutil, json
class CodeGenerator():
    def __init__(self):
        self.destinationFolder = "resultfiles"
        templateFileLoader = FileSystemLoader('assets/templates')
        env = Environment(loader=templateFileLoader)

        self.agentGenerator = AgentGenerator(env.get_template('agent.py'), self.destinationFolder)
        self.modelGenerator = ModelGenerator(env.get_template('model.py'), self.destinationFolder)
        self.startupGenerator = StartupGenerator(env.get_template('main.py'), self.destinationFolder)

    def generateModel(self, data):
        self.clearResultFolder()
        #generate python files
        files = []

        #generate every agent
        for agent in data.agents:
            print("Generating agent file for agent: ", agent.name)
            agentResult = self.agentGenerator.generate(agent, data.model)

        #generate the model
        print("Generating the model file")
        modelResult = self.modelGenerator.generate( data.model, data.agents)

        #generate the main file
        print("Generating the startup file")
        mainResult = self.startupGenerator.generate(data.model, data.agents)
        #deliver generated content to frontend
        
        return

        result = self.modelGenerator.generate(data, agentResult)
        self.exportModelToFilesystem(result)

    def clearResultFolder(self):
        shutil.rmtree(self.destinationFolder)
        os.mkdir(self.destinationFolder)
        os.mkdir(os.path.join(self.destinationFolder, "agents"))

    def exportModelToFilesystem(self, result):
        pass


#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!
#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!
#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!
#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!
#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!
#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!
#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!
#TEST INIT AND USAGE FOR DEV/TEST ONLY!!!!!!!!


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

codeGen = CodeGenerator()
f = open('codegeneration/testfile.json')
jsonInput = json.load(f)

codeGen.generateModel(dict2obj(jsonInput["data"]))
print("Finished")
