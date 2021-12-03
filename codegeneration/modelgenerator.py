import jinja2
import os, re, logging
from codegeneration.gentools import GenTools 

logger = logging.getLogger(__name__)
class ModelGenerator():
    """Generator for the model.py file with the created agent-based model"""

    def __init__(self, template):
        self.template = template
        self.schedulerTypes = {
            "basic": "BaseScheduler",
            "random": "RandomActivation"
        }
        self.spaceTypes = {
            "none": None,
            "single": "SingleGrid",
            "multi": "MultiGrid",
            "continuous": "ContinuousSpace"
        }

    def generate(self, model, agents, destinationFolder):
        logger.debug("Generating model code file for model input")

        model = self.preprocessModel(model, agents)
        output = self.template.render(agents=agents, model=model)
        with open(os.path.join(destinationFolder, "model.py"), "w+", encoding='utf-8') as f:
            f.write(output)

        logger.info("Generation of model.py file completed")
        return output
    
    def preprocessModel(self, model, agents):
        #decode model name
        model.name = GenTools.getClassName(model.name)

        #add model scheduler
        logger.debug("Model scheduler type: "+model.scheduler)
        if model.scheduler in self.schedulerTypes.keys():
            model.schedulerType = self.schedulerTypes[model.scheduler]
        else:
           raise Exception("No supported model scheduler available!") 

        #add model space
        logger.debug("Model space type: "+model.space)
        if model.space in self.spaceTypes.keys():
            model.spaceType = self.spaceTypes[model.space]
        else:
           raise Exception("No supported model space available!") 
        
        return model

    

