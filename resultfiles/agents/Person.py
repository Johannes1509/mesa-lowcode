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


    def step(self):
        pass


    def get_mobility(self): 

        """Initialization of property <mobility>""" 
        return random.randint(3,6) 




