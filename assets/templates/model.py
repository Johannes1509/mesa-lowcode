import random
from mesa import Model
from mesa.time import {{model.schedulerType}}
{%- if model.space != "none" %}
from mesa.space import {{model.spaceType}}
{%- endif %}
{%- for agent in agents %}
from agents.{{agent.fileNameShort}} import {{agent.name}}
{%- endfor %}

class {{model.name}}(Model):
    def __init__(self, numAgentTypes):
        self.schedule = {{model.schedulerType}}(self)
        self.numAgentTypes = numAgentTypes
        self.currentStep = 0
        self.agents = list()
        
        #add agents to the model
{%- filter indent(width=8) %}
currentAgentId = 0
for agentType, agentTypeNum in self.numAgentTypes.items():
{%- filter indent(width=4) %}
for i in range(agentTypeNum):
{%- filter indent(width=4) %}
{%- for agent in agents %}
if agentType == "{{agent.name}}":
{%- filter indent(width=4) %}
newAgent = {{agent.name}}(currentAgentId, self)
{%- endfilter -%}
{%- endfor %}
self.agents.append(newAgent)
currentAgentId = currentAgentId + 1
{%- if model.scheduler == "random" %}
self.schedule.add(newAgent)
{%- endif %}
{%- endfilter -%}
{%- endfilter -%}
{% if model.scheduler == "basic" %}
self.agents = self.__getOrderedAgents(self.agents)
for agent in self.agents:
{%- filter indent(width=4) %}
self.schedule.add(agent)
{%- endfilter -%}
{%- endif %}
print("Initializing agents completed.")
{% if model.space != "none" %}
#add agents to model space
self.space = {{model.spaceType}}({{model.spaceWidth}}, {{model.spaceHeight}}, False)
for agent in self.agents:
    agent.initPlacement()
print("Placing agents completed.")
{%- endif %}
{%- endfilter %}


    def step(self):
        print("Model step <"+str(self.currentStep)+">:")
        self.schedule.step()  
        self.currentStep = self.currentStep +1

{%- if model.scheduler == "basic" %}

    def __getOrderedAgents(self, agents):
        return sorted(agents, key=lambda agent: agent.orderNum)
{%- endif -%}
