from mesa import Agent
import random
from random import randrage, randint, choice

class TestAgent(Agent):
    def __init__(self, uniqueId, model):
        super().__init__(uniqueId, model)
        
        self.name = "Rene"
        self.age = 3

    def step(self):
        
    