import os
from codegeneration.gentools import GenTools 
import logging
logger = logging.getLogger(__name__)

class AgentGenerator():
    """Generates the agent-type python files"""

    def __init__(self, template):
        self.template = template

    def generate(self, agent, model, destinationFolder):
        logger.debug("Generating agent type file for agent: "+agent.name)
        
        agent = self.preprocessAgent(agent)
        output = self.template.render(agent=agent, model=model)
        with open(os.path.join(destinationFolder, "agents", agent.fileName), "w+", encoding='utf-8') as f:
            f.write(output)
        
        logger.info("Generated agent type file for agent: "+agent.name)
        return output

    def preprocessAgent(self, agent):

        #remove special charaters
        agent.name = GenTools.getClassName(agent.name)
        agent.fileNameShort = agent.name.lower()
        agent.fileName = agent.fileNameShort+".py"

        #init properties
        logger.debug("Preprocessing agent type properties for agent: "+agent.name)
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
                if not "type" in prop:
                    prop.type = "text"
                
                prop.value = GenTools.getCastValue(prop.type, prop.value)

        #agent placement if necessary
        logger.debug("Preprocessing agent type placement for agent: "+agent.name)
        if agent.placement and hasattr(agent.placement, "type"):
            logger.debug("Agent placement type: "+agent.placement.type)
            if agent.placement.type == "custom":
                agentInitSpaceMethodData = GenTools.getCustomMethodContent(agent.placement.code, "", "Initialization placement of agent in model space")
                agent.placement.methodComment = agentInitSpaceMethodData["methodComment"]
                agent.placement.methodContent = agentInitSpaceMethodData["methodContent"]
        else:
            logger.info("Agent placement not specified.")

        #agent steps
        logger.debug("Preprocessing agent type steps for agent: "+agent.name)
        agent.steps = list(agent.nodes.values())
        agent.steps = sorted(agent.steps, key=lambda step: step.stepnumber)

        logger.debug("Agent steps: "+str(agent.steps))
        for step in agent.steps:
            step.methodCallerStr = GenTools.getCustomMethodName("do_", step.stepname)
            step.value = GenTools.getCustomMethodContent(step.stepcode, step.methodCallerStr[:-2], "Process step <"+step.stepname+">")
            pass


        return agent
    
    