from tornado.web import RequestHandler

class ResultFilesHandler(RequestHandler):
    def prepare(self):
        self.set_header("Content-Type", "application/zip")
    
    def get(self, *args):
        #hier kommen dann die ResultFiles rein, die als ZIP generiert werden
        f = open(r"C:\Users\johan\Desktop\Logo.zip", "rb")
        self.write(f.read())
        f.close()