1. project description
2. requirements
3. start project/start programme


1. project description
--
The "Mesa - Low Code" project is part of the bachelor thesis "Conception and prototypical implementation of a low-code development platform for the creation of agent-based modelling" by me. 
The software prototype enables the guided, visually-supported creation of agent-based simulation models based on the Python framework "Mesa". 
A client web interface and Python server software are implemented for this purpose. 
After completing the model creation in the web client, the configured model can be generated and exported as a Python Mesa programme. 


2. requirements
--
TESTED WITH:
    Python version: 3.9.5 64Bit on win32
    Python libraries required: asyncio, io, jinja2, json, os, pathlib, re, shutil, sqlite3, tempfile, time traceback, tornado.httpserver, tornado.ioloop, 
                                    tornado.web, tornado.websocket, unittest, websocket-client
    Web client: Google Chrome version 96.0.4664.110 (Official Build) (64-bit) or Edge version 96.0.1054.62 (Official Build) (64-bit)


3. start project/start programme
-- 
1. To start the server application, first change to the "mesa-lowcode" folder of this project directory via console. 
2. Then start the server software with the command "python src/main.py". 
3. The client application is available a few seconds later at the address "http://localhost:7700/".



