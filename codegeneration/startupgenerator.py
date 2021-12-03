import jinja2
import os, re, logging
from codegeneration.gentools import GenTools 

logger = logging.getLogger(__name__)

class StartupGenerator():
    """Code generator for the main.py-startup file of the result files"""

    def __init__(self, template):
        self.template = template

    def generate(self, model, agents, destinationFolder):
        self.preprocessMainFile(model, agents)
        output = self.template.render(agents=agents, model=model)
        with open(os.path.join(destinationFolder, "main.py"), "w+", encoding='utf-8') as f:
            f.write(output)
            
        return output
    
    def preprocessMainFile(self, model, agents):
        logger.debug("Initial Step number the model should take: "+str(model.stepsToTake))
        if hasattr(model, "stepsToTake"):
            model.stepsCount = model.stepsToTake
        else:
            model.stepsCount = None
    

