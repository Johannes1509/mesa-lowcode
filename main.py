from httpserver.server import AppServer

# BLOCK NEEDED FOR COMPATIBILITY WITH WINDOWS/PYTHON 3.8 [START]
import asyncio
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
# BLOCK NEEDED FOR COMPATIBILITY WITH WINDOWS/PYTHON 3.8 [END]

if __name__ == "__main__":
    server = AppServer()



