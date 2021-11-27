# Attention:
# This is an auxiliary file. By executing the file, the model database is emptied or created if it does not exist.

import sqlite3

sqlCreateTable = """
CREATE TABLE IF NOT EXISTS `agentmodels` (
	`modelid` INTEGER PRIMARY KEY,
	`modelcode` MEDIUMTEXT
	);
"""

sqlClearTable = """
DELETE FROM `agentmodels`;
"""

connection = sqlite3.connect("assets/modelstorage/models.db")
cursor = connection.cursor()



cursor.execute(sqlCreateTable)
print("Created table 'agentmodels' if not existed")
cursor.execute(sqlClearTable)
print("Cleared table 'agentmodels'")

connection.close()