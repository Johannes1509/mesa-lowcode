from codegeneration.agentgenerator import AgentGenerator
from codegeneration.modelgenerator import ModelGenerator
from jinja2 import Environment, FileSystemLoader
import os, shutil
class CodeGenerator():
    def __init__(self):
        self.destinationFolder = "resultfiles"
        templateFileLoader = FileSystemLoader('assets/templates')
        env = Environment(loader=templateFileLoader)

        self.agentGenerator = AgentGenerator(env.get_template('agent.py'), self.destinationFolder)
        self.modelGenerator = ModelGenerator(env.get_template('model.py'))

    def generateModel(self, data):
        self.clearResultFolder()
        #generate python files
        files = []

        for agent in data.agents:
            agentResult = self.agentGenerator.generate(agent)

        return
        for agent in data.agents:
            agentResult = self.agentGenerator.generate(agent)

        result = self.modelGenerator.generate(data, agentResult)
        self.exportModelToFilesystem(result)

    def clearResultFolder(self):
        shutil.rmtree(self.destinationFolder)
        os.mkdir(self.destinationFolder)
        os.mkdir(os.path.join(self.destinationFolder, "agents"))

    def exportModelToFilesystem(self, result):
        pass