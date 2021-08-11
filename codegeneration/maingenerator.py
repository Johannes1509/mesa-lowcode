from codegeneration.agentgenerator import AgentGenerator
from codegeneration.modelgenerator import ModelGenerator

class CodeGenerator():
    def __init__(self):
        self.agentGenerator = AgentGenerator()
        self.modelGenerator = ModelGenerator()

    def generateModel(self, data):
        #generate python files
        return
        for agent in data.agents:
            agentResult = self.agentGenerator.generate(agent)

        result = self.modelGenerator.generate(data, agentResult)
        self.exportModelToFilesystem(result)

    def exportModelToFilesystem(self, result):
        pass