from mesa import Model
from mesa.time import {{model.schedulerType}}
import random

class {{model.name}}(Model):
    def __init__(self, numAgentTypes):
        self.schedule = {{model.schedulerType}}(self)
        self.agents = list()
{%- filter indent(width=8) %}
for AgentType, agentTypeNum in numAgentTypes.items():
{%- filter indent(width=4) %}
for i in agentTypeNum:
{%- filter indent(width=4) %}
newAgent = AgentType(i, self)
self.schedule.add(newAgent)
self.agents.add(newAgent)
{%- endfilter -%}
{%- endfilter -%}
{% endfilter %}

    def step(self):
        self.schedule.step()   
