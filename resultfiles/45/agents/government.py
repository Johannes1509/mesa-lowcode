from mesa import Agent
import random
from random import randrage, randint, choice

class Government(Agent):
    """Agent type class <Government>"""

    def __init__(self, uniqueId, model):
        """Initialization of agent type <Government>"""

        super().__init__(uniqueId, model)
        self.income = 3000000
        self.powerless = self.get_powerless()
        self.orderNum = 0

    def step(self):
        """Main step function of the agent type <Government>"""

        self.do_teststep1()

    def get_powerless(self):
        """Initialization of property <powerless>""" 
        return True

    def initPlacement(self):
        self.placement = self.model.space.place_agent(self.initSpacePosition())

    def initSpacePosition(self):
        """Initialization placement of agent in model space"""
        def getPosition:
            return 5

    def do_teststep1(self):
        """Process step <TestStep1>""" 
         

