import random
from mesa import Model
from mesa.time import BaseScheduler
from mesa.time import SingleGridfrom agents.person.py import Personfrom agents.government.py import Government

class CovidModel2021(Model):
    def __init__(self, numAgentTypes):
        self.schedule = BaseScheduler(self)
        self.agents = list()
        
        #add agents to the model
        for AgentType, agentTypeNum in numAgentTypes.items():
            for i in agentTypeNum:
                newAgent = AgentType(i, self)
                self.agents.add(newAgent)
        self.agents = self.__getOrderedAgents(self.agents)
        for agent in self.agents():
            self.schedule.add(agent)

        #add agents to model space
        self.space = SingleGrid(, , False)
        for agent in self.agents:
            agent.initPlacement()


    def step(self):
        self.schedule.step()

    def __getOrderedAgents(agents):
        return sorted(agents, key=lambda agent: agent.orderNum)