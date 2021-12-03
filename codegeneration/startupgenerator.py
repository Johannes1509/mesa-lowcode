import jinja2
import os, re
from codegeneration.gentools import GenTools 

class StartupGenerator():
    def __init__(self, template):
        self.template = template

    def generate(self, model, agents, destinationFolder):
        self.preprocessMainFile(model, agents)
        output = self.template.render(agents=agents, model=model)
        with open(os.path.join(destinationFolder, "main.py"), "w+", encoding='utf-8') as f:
            f.write(output)
            
        return output
    
    def preprocessMainFile(self, model, agents):
        if hasattr(model, "stepsToTake"):
            model.stepsCount = model.stepsToTake
        else:
            model.stepsCount = None
    

