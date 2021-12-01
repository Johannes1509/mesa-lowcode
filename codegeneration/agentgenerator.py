import jinja2
import os, re
from stringtools import StrTools 

class AgentGenerator():
    def __init__(self, template, destinationFolder):
        self.template = template
        self.destinationFolder = destinationFolder

    def generate(self, agent, model):
        agent = self.preprocessAgent(agent)
        output = self.template.render(agent=agent, model=model)
        with open(os.path.join(self.destinationFolder, "agents", agent.name+".py"), "w+", encoding='utf-8') as f:
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
                prop.methodCallerStr = StrTools.getCustomCodeMethodName(prop.name)
                prop.value = StrTools.getCustomCodeMethodContent(prop)
            else:
                #get basic property value
                prop.isCustomCode = False
                prop.value = StrTools.getCastValue(prop.type, prop.value)

        #agent placement if necessary
        if agent.placement.type == "custom":
            agentInitSpaceMethodData = StrTools.getSpaceInitMethodContent(agent.placement.code)
            agent.placement.methodComment = agentInitSpaceMethodData["methodComment"]
            agent.placement.methodContent = agentInitSpaceMethodData["methodContent"]

        #agent steps
        agent.steps = list(agent.nodes.values())
        agent.steps = sorted(agent.steps, key=lambda step: step.stepnumber)

        for step in agent.steps:
            step.methodCallerStr = StrTools.getStepMethodName(step.stepname)
            step.value = StrTools.getStepMethodContent(step)
            pass


        return agent
    
    