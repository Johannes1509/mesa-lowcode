from mesa import Agent
import random
from random import randrage, randint, choice

class Person(Agent):
    """Agent type class <Person>"""

    def __init__(self, uniqueId, model):
        """Initialization of agent type <Person>"""

        super().__init__(uniqueId, model)
        self.mobility = self.get_mobility()
        self.infect = False
        self.orderNum = 1
        self.placement = self.model.space.place_agent(self.initSpacePosition())

    def step(self):
        """Main step function of the agent type <Person>"""

        self.do_sucheanderepersonen()
        self.do_steckeanwenninreichweite()

    def get_mobility(self):
        """Initialization of property <mobility>""" 
        return random.randint(3,6)

    def initSpacePosition(self):

        """Initialization placement of agent in model space"""
        for agent in agents[]:
                return true

    def do_sucheanderepersonen(self):
        """Process step <Suche andere Personen>""" 
         
    def do_steckeanwenninreichweite(self):
        """Process step <Stecke an wenn in Reichweite>""" 
        for agent in agents[]:
                return true 
