from mesa import Agent
import random

class {{agentName}}(Agent):
    def __init__(self, uniqueId, model):
        super().__init__(uniqueId, model)
        {{agentProperties}}

    def step(self):
        {{agentStep}}