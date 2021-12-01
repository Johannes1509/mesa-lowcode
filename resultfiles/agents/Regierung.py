from mesa import Agent
import random
from random import randrage, randint, choice

class Regierung(Agent):
    """Agent type class <Regierung>"""

    def __init__(self, uniqueId, model):
        """Initialization of agent type <Regierung>"""

        super().__init__(uniqueId, model)
        self.name = "Test"
        self.geld = self.get_geld()
        self.orderNum = 0
        self.placement = self.model.space.place_agent()

    def step(self):
        """Main step function of the agent type <Regierung>"""

        self.do_manahmenumsetzen()

    def get_geld(self):
        """Initialization of property <geld>""" 
        return random.randint(34,345634)

    def do_manahmenumsetzen(self):
        """Process step <MaÃÅ¸nahmen umsetzen>""" 
        doSth() 
