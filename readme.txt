1. Projektbeschreibung
2. Voraussetzungen
3. Projekt starten/Programm starten


1. Projektbeschreibung
--
Das "Mesa - Low Code"-Projekt ist Teil der Bachelor-Thesis "Konzeption und prototypische Implementierung einer Low-Code-Entwicklungsplattform zur Erstellung agentenbasierter Modellierungen" von Johannes Müller. 
Der Softwareprototyp ermöglicht die geführte, visuell-unterstützte Erstellung agentenbasierter Simulationsmodelle auf Basis des Python-Frameworks "Mesa". 
Hierzu ist eine Client-Weboberfläche sowie eine Python-Serversoftware implementiert. 
Nach Abschluss der Modellerstellung im Webclient, kann das konfigurierte Modell als Python-Mesa-Programm geniert und exportiert werden. 


2. Voraussetzungen
--
GETESTET MIT:
    Python-Version:                 3.9.5 64Bit on win32
    Benötigte Python-Bibliotheken:      asyncio, io, jinja2, json, os, pathlib, re, shutil, sqlite3, tempfile, time traceback, tornado.httpserver, tornado.ioloop, 
                                    tornado.web, tornado.websocket, unittest, websocket-client
    Web-Client:                     Google Chrome Version 96.0.4664.110 (Offizieller Build) (64-Bit) oder Edge Version 96.0.1054.62 (Offizielles Build) (64-Bit)


3. Projekt starten/Programm starten
-- 
1. Um die Serveranwendung zu starten, zunächst per Konsole in den "mesa-lowcode"-Ordner dieses Projektverzeichnis wechseln. 
2. Dann mit dem Befehl "python src/main.py" die Serversoftware starten. 
3. Die Clientanwendung steht wenige Sekunden später unter der Adresse "http://localhost:7700/" zur Verfügung.



