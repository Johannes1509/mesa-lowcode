import jinja2
import os, re

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
        agent.name = "".join([char for char in agent.name if re.match("[a-zA-Z0-9]", char)])

        for prop in agent.properties:
            prop.value = prop.value.strip()

            if("type" not in prop.keys()):
                continue

            try:
                if(prop.type == "str"):
                    prop.value = '"'+prop.value+'"'
                if(prop.type == "float"):
                    prop.value = float(prop.value)
                if(prop.type == "int"):
                    prop.value = int(prop.value)
                if(prop.type == "bool"):
                    if(prop.value.lower() in ("0", "false")):
                        prop.value = False
                    elif (prop.value.lower() in ("1", "true")):
                        prop.value = True
            except:
                pass
            

        return agent