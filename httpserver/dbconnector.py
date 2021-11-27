import sqlite3

class DBConnector():
    sqlInsertNewModel = """
    INSERT INTO agentmodels (modelcode) VALUES (?)
    """
    sqlSelectModel = """
    SELECT modelcode FROM agentmodels WHERE modelid=?
    """
    sqlUpdateModel = """
    UPDATE agentmodels SET modelcode=? WHERE modelid=?
    """

    def __init__(self, connectionPath):
        self.connection = sqlite3.connect(connectionPath)
        self.cursor = self.connection.cursor()

    def insertNewModel(self):
        self.cursor.execute(DBConnector.sqlInsertNewModel, ("",))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def getModelCode(self, modelId):
        self.cursor.execute(DBConnector.sqlSelectModel, (modelId,))
        results = self.cursor.fetchall()

        if(len(results) != 1):
            raise Exception("getModelCode() for id <"+str(modelId)+"> returns more than one row! ModelId is not unique!")

        return results[0][0]

    def saveModelCode(self, modelId, modelCode):
        self.cursor.execute(DBConnector.sqlUpdateModel, (modelCode, modelId))
        self.connection.commit()