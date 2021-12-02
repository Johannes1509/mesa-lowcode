from codegeneration.agentgenerator import AgentGenerator
from codegeneration.modelgenerator import ModelGenerator
from codegeneration.startupgenerator import StartupGenerator
from jinja2 import Environment, FileSystemLoader
import os, shutil, json, pathlib
class CodeGenerator():
    def __init__(self):
        self.mainDestinationFolder = "resultfiles"
        templateFileLoader = FileSystemLoader('assets/templates')
        env = Environment(loader=templateFileLoader)

        self.agentGenerator = AgentGenerator(env.get_template('agent.py'))
        self.modelGenerator = ModelGenerator(env.get_template('model.py'))
        self.startupGenerator = StartupGenerator(env.get_template('main.py'))

    def generateModel(self, data, modelId):
        destinationFolder = os.path.join(self.mainDestinationFolder, str(modelId))
        pathlib.Path(destinationFolder).mkdir(parents=True, exist_ok=True)    
        
        self.clearResultFolder(destinationFolder)
        #generate python files
        files = []

        #generate every agent
        for agent in data.agents:
            print("Generating the agent file for agent: ", agent.name)
            agentResult = self.agentGenerator.generate(agent, data.model, destinationFolder)
            files.append({
                "name": agent.fileName,
                "code": agentResult
            })

        #generate the model
        print("Generating the model file")
        modelResult = self.modelGenerator.generate( data.model, data.agents, destinationFolder)
        files.insert(0, {
            "name": "model.py",
            "code": modelResult
        })

        #generate the main file
        print("Generating the startup file")
        mainResult = self.startupGenerator.generate(data.model, data.agents, destinationFolder)
        files.insert(0, {
            "name": "main.py",
            "code": mainResult
        })
        
        #deliver generated content to frontend
        return files


    def clearResultFolder(self, destinationFolder):

        shutil.rmtree(destinationFolder)
        os.mkdir(destinationFolder)
        os.mkdir(os.path.join(destinationFolder, "agents"))

    def exportModelToFilesystem(self, result):
        pass

