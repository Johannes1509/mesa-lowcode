from mesa import Agent
import random
from random import randrage, randint, choice

class {{agentName}}(Agent):
    def __init__(self, uniqueId, model):
        super().__init__(uniqueId, model)
        {% for prop in properties %}
        self.{{ prop.name }} = {{ prop.value }}
        {%- endfor %}

    def step(self):
        {{agentStep}}
    
