import jinja2
import os, re
from codegeneration.gentools import GenTools 

class AgentGenerator():
    def __init__(self, template):
        self.template = template

    def generate(self, agent, model, destinationFolder):
        agent = self.preprocessAgent(agent)
        output = self.template.render(agent=agent, model=model)
        with open(os.path.join(destinationFolder, "agents", agent.fileName), "w+", encoding='utf-8') as f:
            f.write(output)
        
        return output

    def preprocessAgent(self, agent):

        #remove special charaters
        agent.name = GenTools.getClassName(agent.name)
        agent.fileName = agent.name.lower()+".py"

        #init properties
        for prop in agent.properties:
            #check if property is custom code
            if GenTools.isCustomCode(prop.value):
                #set custom code
                prop.isCustomCode = True
                prop.methodCallerStr = GenTools.getCustomMethodName("get_", prop.name)
                prop.value = GenTools.getCustomMethodContent(prop.value, prop.methodCallerStr[:-2], "Initialization of property <"+prop.name+">")
            else:
                #get basic property value
                prop.isCustomCode = False
                prop.value = GenTools.getCastValue(prop.type, prop.value)

        #agent placement if necessary
        if agent.placement.type == "custom":
            agentInitSpaceMethodData = GenTools.getCustomMethodContent(agent.placement.code, "", "Initialization placement of agent in model space")
            agent.placement.methodComment = agentInitSpaceMethodData["methodComment"]
            agent.placement.methodContent = agentInitSpaceMethodData["methodContent"]

        #agent steps
        agent.steps = list(agent.nodes.values())
        agent.steps = sorted(agent.steps, key=lambda step: step.stepnumber)

        for step in agent.steps:
            step.methodCallerStr = GenTools.getCustomMethodName("do_", step.stepname)
            step.value = GenTools.getCustomMethodContent(step.stepcode, step.methodCallerStr[:-2], "Process step <"+step.stepname+">")
            pass


        return agent
    
    