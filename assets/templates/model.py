from mesa import Model
import random

class AgentModel(Model):
    def __init__(self):
        self.schedule = {{modelScheduler}}(self)

    def step(self):
        self.schedule.step()   