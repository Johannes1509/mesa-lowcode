import jinja2
import os, re
from codegeneration.stringtools import StrTools 

class ModelGenerator():
    def __init__(self, template):
        self.template = template
        self.schedulerTypes = {
            "basic": "BaseScheduler",
            "random": "RandomActivation"
        }
        self.spaceTypes = {
            "single": "SingleGrid",
            "multi": "MultiGrid",
            "continuous": "ContinuousSpace"
        }

    def generate(self, model, agents, destinationFolder):
        model = self.preprocessModel(model, agents)
        output = self.template.render(agents=agents, model=model)
        with open(os.path.join(destinationFolder, "model.py"), "w+", encoding='utf-8') as f:
            f.write(output)

        return output
    
    def preprocessModel(self, model, agents):
        #decode model name
        model.name = StrTools.getClassName(model.name)

        #add model scheduler
        if model.scheduler in self.schedulerTypes.keys():
            model.schedulerType = self.schedulerTypes[model.scheduler]
        else:
           raise Exception("No supported scheduler available!") 

        #add model space
        if model.space in self.spaceTypes.keys():
            model.spaceType = self.spaceTypes[model.space]
        else:
           raise Exception("No supported space available!") 
           
        #

        return model

    

