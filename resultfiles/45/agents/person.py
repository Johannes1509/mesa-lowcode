from mesa import Agent
import random
from random import randrage, randint, choice

class Person(Agent):
    """Agent type class <Person>"""

    def __init__(self, uniqueId, model):
        """Initialization of agent type <Person>"""

        super().__init__(uniqueId, model)
        self.mobility = 0.4
        self.income = 400
        self.orderNum = 1

    def step(self):
        """Main step function of the agent type <Person>"""

        self.do_pruefeumgebung()
        self.do_steckeanwennmoeglich()


    def initPlacement(self):
        self.placement = self.model.space.place_agent()

    def do_pruefeumgebung(self):
        """Process step <pruefeUmgebung>""" 
        return self.model.agents.inrange() 

    def do_steckeanwennmoeglich(self):
        """Process step <steckeAnWennMoeglich>""" 
        return 4 

