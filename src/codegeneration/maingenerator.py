from codegeneration.agentgenerator import AgentGenerator
from codegeneration.modelgenerator import ModelGenerator
from codegeneration.startupgenerator import StartupGenerator
from jinja2 import Environment, FileSystemLoader
import os, shutil, pathlib, tempfile, logging

logger = logging.getLogger(__name__)

class CodeGenerator():
    """Main class for code generation"""

    def __init__(self):
        self.resultFilesDirName = "raw_result"
        self.resultZIPName = "result"
        self.tempDir = tempfile.TemporaryDirectory()
        templateFileLoader = FileSystemLoader('src/assets/templates')
        env = Environment(loader=templateFileLoader)

        self.agentGenerator = AgentGenerator(env.get_template('agent.py'))
        self.modelGenerator = ModelGenerator(env.get_template('model.py'))
        self.startupGenerator = StartupGenerator(env.get_template('main.py'))

    def generateModel(self, data, modelId):
        logger.info("Generating model files")
        
        destinationFolderFiles = os.path.join(self.tempDir.name, str(modelId), self.resultFilesDirName)
        pathlib.Path(destinationFolderFiles).mkdir(parents=True, exist_ok=True)   

        print("Generated Model will be saved in folder: ", destinationFolderFiles)
        self.clearResultFolder(destinationFolderFiles)
        
        #generate python files
        files = []

        #generate every agent
        for agent in data.agents:
            print("Generating the agent file for agent: ", agent.name)
            agentResult = self.agentGenerator.generate(agent, data.model, destinationFolderFiles)
            files.append({
                "name": agent.fileName,
                "code": agentResult
            })

        #generate the model
        print("Generating the model file")
        modelResult = self.modelGenerator.generate( data.model, data.agents, destinationFolderFiles)
        files.insert(0, {
            "name": "model.py",
            "code": modelResult
        })

        #generate the main file
        print("Generating the startup file")
        mainResult = self.startupGenerator.generate(data.model, data.agents, destinationFolderFiles)
        files.insert(0, {
            "name": "main.py",
            "code": mainResult
        })

        #generate result zip
        shutil.make_archive(os.path.join(self.tempDir.name, str(modelId), self.resultZIPName), "zip", destinationFolderFiles)
        
        #deliver generated content to frontend
        logger.info("Generating model files completed.")
        return files


    def clearResultFolder(self, destinationFolder):
        """clearing the model result folder with the result files to add new result files"""
        shutil.rmtree(destinationFolder)
        os.mkdir(destinationFolder)
        os.mkdir(os.path.join(destinationFolder, "agents"))
