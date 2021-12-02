from model import CovidModel2021

if __name__ == "__main__":
    #init number of model steps to take
    stepsToTake  = 125

    #init agent-type <-> init number of agent type dict
    modelAgentNums = dict()
    initModelAgentNums["Person"] = 100
    initModelAgentNums["Government"] = 10

    model = CovidModel2021(initModelAgentNums)

    #take the defined model steps
    for step in range(stepsToTake):
        model.step()