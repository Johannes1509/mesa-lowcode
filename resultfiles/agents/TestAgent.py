from mesa import Agent
import random

class TestAgent(Agent):
    def __init__(self, uniqueId, model):
        super().__init__(uniqueId, model)
        
        self.kater = 4
        self.miau = random.randint(3, 4)
        self.kotze = self.kater == 3

    def step(self):
        
    