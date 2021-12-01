import jinja2
import os, re
from stringtools import StrTools 

class StartupGenerator():
    def __init__(self, template, destinationFolder):
        self.template = template
        self.destinationFolder = destinationFolder

    def generate(self, model, agents):
        output = self.template.render(agent=agents, model=model)
        with open(os.path.join(self.destinationFolder, "main.py"), "w+", encoding='utf-8') as f:
            f.write(output)
    
    def preprocessModel(self, model, agents):
        pass
    

