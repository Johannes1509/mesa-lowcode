from mesa import Agent
import random
from random import randrage, randint, choice

class {{agent.name}}(Agent):
{%- filter indent(width=4) %}
"""Agent type class <{{agent.name}}>"""

def __init__(self, uniqueId, model):
{%- filter indent(width=4) %}
"""Initialization of agent type <{{agent.name}}>"""

super().__init__(uniqueId, model)
{%- for prop in agent.properties %}
{%- if prop.isCustomCode %}
self.{{ prop.name }} = self.{{ prop.methodCallerStr }}
{%- else %}
self.{{ prop.name }} = {{ prop.value }}
{%- endif %}
{%- endfor %}

{%- if "orderNum" in agent %}
self.orderNum = {{agent.orderNum}}
{%- endif %}
{%- if model.space != "none" %}
self.placement = self.model.space.place_agent({%- if agent.placement.type == "custom" %}self.initSpacePosition(){%- endif %})
{%- endif %}
{%- endfilter %}

def step(self):
{%- filter indent(width=4) %}
"""Main step function of the agent type <{{agent.name}}>"""
{% for step in agent.steps %}
self.{{ step.methodCallerStr }}
{%- endfor -%}
{%- endfilter %}
{% for prop in agent.properties -%}
{% if prop.isCustomCode %}
{{ prop.value["methodHeader"] }} 
{%- filter indent(width=4) %}
{{ prop.value["methodComment"] }} 
{{ prop.value["methodContent"] }} 
{%- endfilter %}
{%- endif %}
{%- endfor %}
{% if model.space != "none" and agent.placement.type == "custom" %}
def initSpacePosition(self):
{% endif %}
{%- filter indent(width=4) %}
{%- if model.space != "none" and agent.placement.type == "custom" %}
{{agent.placement.methodComment}}
{{agent.placement.methodContent}}
{% endif %}
{%- endfilter %}
{% for step in agent.steps -%}
{{ step.value["methodHeader"] }} 
{%- filter indent(width=4) %}
{{ step.value["methodComment"] }} 
{{ step.value["methodContent"] }} 
{% endfilter %}
{%- endfor %}
{%- endfilter -%}
