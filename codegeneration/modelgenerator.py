import jinja2
import os, re
from stringtools import StrTools 

class ModelGenerator():
    def __init__(self, template, destinationFolder):
        self.template = template
        self.destinationFolder = destinationFolder
        self.schedulerTypes = {
            "basic": "",
            "random": "",
            "simultaneous": "",
            "staged": ""
        }

    def generate(self, model, agents):
        model = self.preprocessModel(model, agents)
        output = self.template.render(agents=agents, model=model)
        with open(os.path.join(self.destinationFolder, "model.py"), "w+", encoding='utf-8') as f:
            f.write(output)
    
    def preprocessModel(self, model, agents):

        #add model scheduler
        if model.scheduler in self.schedulerTypes.keys():
            model.schedulerType = self.schedulerTypes[model.scheduler]
        else:
           raise Exception("No supported scheduler available!") 

        #add model space
        #TODO!!!!

        return model

    

