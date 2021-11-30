from mesa import Agent
import random
from random import randrage, randint, choice

class {{agentName}}(Agent):
    """Agent type class <{{agentName}}>"""
{% filter indent(width=4) %}
def __init__(self, uniqueId, model):
{% filter indent(width=4) %}
"""Initialization of agent type <{{agentName}}>"""
super().__init__(uniqueId, model)
{% for prop in properties -%}
{%- if prop.isCustomCode %}
self.{{ prop.name }} = self.{{ prop.methodCallerStr }}
{%- else %}
self.{{ prop.name }} = {{ prop.value }}
{%- endif %}
{%- endfor %}
{% endfilter %}

def step(self):
{{agentStep}}



{%- for prop in properties %}

{% if prop.isCustomCode %}
{{ prop.value["methodHeader"] }} 
{% filter indent(width=4) %}
{{ prop.value["methodComment"] }} 
{{ prop.value["methodContent"] }} 
{% endfilter %}
{% endif %}
{%- endfor %}
{% endfilter %}