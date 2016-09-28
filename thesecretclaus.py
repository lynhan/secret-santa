import webapp2
import jinja2 
import random
import json

from google.appengine.ext import db
from google.appengine.api import mail
from collections import OrderedDict

jinja = jinja2.Environment(loader = jinja2.FileSystemLoader('html'), autoescape = True) 

class Handler(webapp2.RequestHandler):
    def write(self, *tuple, **dict):
        self.response.out.write(*tuple, **dict)

    def render_params(self, template, **dict):
        temp = jinja.get_template(template)
        return temp.render(dict)

    def render(self, template, **dict): 
        self.write(self.render_params(template, **dict))

class HatModel(db.Model):
    title = db.TextProperty()
    stuffing = db.StringProperty() 
    created = db.DateTimeProperty(auto_now_add = True)

class Home(Handler):
    def get(self):
        self.render('home.html')

    def post(self):
        title = self.request.get("title")
        stuffing = self.request.get("stuffing")

        parsed = json.loads(stuffing)
        random.shuffle(parsed.items()) 
        parsed_dict = OrderedDict(parsed.items())

        names = parsed_dict.keys()
        emails = parsed_dict.values()

        for index, name in enumerate(names):
            sender = "elf@thesecretclaus.appspotmail.com"
            receiver = emails[index]
            subject = title + " Secret Santa" 
            body = "Hi {}! Your gift recipient is {}.".format(name, names[(index+1) % (len(names))])
            mail.send_mail(sender, receiver, subject, body)
        
        HatModel(title = title, stuffing = stuffing).put() 

application = webapp2.WSGIApplication([
    ('/', Home),
], debug=True)
