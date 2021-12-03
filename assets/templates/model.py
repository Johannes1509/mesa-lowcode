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
        self.agents = list()
        
        #add agents to the model
{%- filter indent(width=8) %}
for AgentType, agentTypeNum in numAgentTypes.items():
{%- filter indent(width=4) %}
for i in agentTypeNum:
{%- filter indent(width=4) %}
newAgent = AgentType(i, self)
self.agents.add(newAgent)
{%- if model.scheduler == "random" %}
self.schedule.add(newAgent)
{%- endif %}
{%- endfilter -%}
{%- endfilter -%}
{% if model.scheduler == "basic" %}
self.agents = self.__getOrderedAgents(self.agents)
for agent in self.agents():
{%- filter indent(width=4) %}
self.schedule.add(agent)
{%- endfilter -%}
{%- endif %}
{% if model.space != "none" %}
#add agents to model space
self.space = {{model.spaceType}}({{model.spaceWidth}}, {{model.spaceHeight}}, False)
for agent in self.agents:
    agent.initPlacement()
{%- endif %}
{%- endfilter %}


    def step(self):
        self.schedule.step()  

{%- if model.scheduler == "basic" %}

    def __getOrderedAgents(agents):
        return sorted(agents, key=lambda agent: agent.orderNum)
{%- endif -%}
