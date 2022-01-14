from mesa import Agent
import random

class {{agent.name}}(Agent):
{%- filter indent(width=4) %}
"""Agent type class <{{agent.name}}>"""

def __init__(self, uniqueId, model):
{%- filter indent(width=4) %}
"""Initialization of agent type <{{agent.name}}>"""

super().__init__(uniqueId, model)
{%- for prop in agent.properties %}
{%- if prop.name != "" %}
{%- if prop.isCustomCode %}
self.{{ prop.name }} = self.{{ prop.methodCallerStr }}
{%- else %}
self.{{ prop.name }} = {{ prop.value }}
{%- endif %}
{%- endif %}
{%- endfor %}

{%- if "orderNum" in agent %}
self.orderNum = {{agent.orderNum}}
{% endif %}
{%- endfilter %}

def step(self):
{%- filter indent(width=4) %}
"""Main step function of the agent type <{{agent.name}}>"""
{% for step in agent.steps %}
self.{{ step.methodCallerStr }}
{%- endfor -%}
{%- endfilter %}
{%- for prop in agent.properties %}
{% if prop.isCustomCode %}
{{ prop.value["methodHeader"] }} 
{%- filter indent(width=4) %}
{{ prop.value["methodComment"] }} 
{{ prop.value["methodContent"] }} 
{%- endfilter %}
{%- endif %}
{%- endfor %}
{%- if model.space != "none" %}

def initPlacement(self):
{%- filter indent(width=4) %}
{%- if model.space == "single" %}
self.model.space.position_agent(self{%- if agent.placement.type == "custom" %}, self.initSpacePosition(){%- endif %})
{%- endif %}
{%- if model.space == "multi" %}
xPos = random.randInt(self.model.space.width)
yPos = random.randInt(self.model.space.height)
self.model.space.place_agent(self{%- if agent.placement.type == "custom" %}, self.initSpacePosition(){%- endif %}{%- if agent.placement.type != "custom" %}, (xPos, yPos){%- endif %})
{%- endif %}
{%- if model.space == "continuous" %}
xPos = random.uniform(self.model.space.width)
yPos = random.uniform(self.model.space.height)
self.model.space.place_agent(self{%- if agent.placement.type == "custom" %}, self.initSpacePosition(){%- endif %}{%- if agent.placement.type != "custom" %}, (xPos, yPos){%- endif %})
{%- endif %}
{%- endfilter %} 
{%- endif %}
{%- if model.space != "none" and agent.placement.type == "custom" %}

def initSpacePosition(self):
{%- filter indent(width=4) %}
{{agent.placement.methodComment}}
{{agent.placement.methodContent}}
{%- endfilter %}
{%- endif %}

{% for step in agent.steps -%}
{{ step.value["methodHeader"] }} 
{%- filter indent(width=4) %}
{{ step.value["methodComment"] }} 
{{ step.value["methodContent"] }} 

{% endfilter %}
{%- endfor %}
{%- endfilter -%}
