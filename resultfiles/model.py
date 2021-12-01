from mesa import Model
from mesa.time import 
import random

class TestModel1(Model):
    def __init__(self, numAgentTypes):
        self.schedule = (self)
        self.agents = list()
        for AgentType, agentTypeNum in numAgentTypes.items():
            for i in agentTypeNum:
                newAgent = AgentType(i, self)
                self.schedule.add(newAgent)
                self.agents.add(newAgent)

    def step(self):
        self.schedule.step()   