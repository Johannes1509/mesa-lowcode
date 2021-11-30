import jinja2
import os, re
from stringtools import StrTools 
class AgentGenerator():
    def __init__(self, template, destinationFolder):
        self.template = template
        self.destinationFolder = destinationFolder

    def generate(self, agent):
        agent = self.preprocessAgent(agent)
        output = self.template.render(agentName=agent.name, properties=agent.properties)
        with open(os.path.join(self.destinationFolder, "agents", agent.name+".py"), "w+") as f:
            f.write(output)

    def preprocessAgent(self, agent):

        #remove special charaters
        agent.name = StrTools.getClassName(agent.name)

        #init properties
        for prop in agent.properties:
            #check if property is custom code
            if StrTools.isCustomCode(prop.value):
                #set custom code
                prop.isCustomCode = True
                prop.methodCallerStr = StrTools.getCustomCodeMethodName(prop.name, prop.value)
                prop.value = StrTools.getCustomCodeMethodContent(prop)
            else:
                #get basic property value
                prop.isCustomCode = False
                prop.value = StrTools.getCastValue(prop.type, prop.value)

        #order number if necessary
        #
        #agent placement if necessary
        #agent steps



        return agent