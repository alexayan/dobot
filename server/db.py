from peewee import *
from sae.const import (MYSQL_HOST, MYSQL_HOST_S,
    MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB
)
import MySQLdb
from flask import json

database = MySQLDatabase(MYSQL_DB,host=MYSQL_HOST, user=MYSQL_USER, password=MYSQL_PASS, port=int(MYSQL_PORT))  

class BaseModel(Model):
    class Meta:
        database = database
    @classmethod
    def getOne(cls, *query, **kwargs):
       try:
          return cls.get(*query,**kwargs)
       except DoesNotExist:
           return None
    
    def __str__(self):
        r = {}
        for k in self._data.keys():
            try:
                r[k] = str(getattr(self, k))
            except:
                r[k] = json.dumps(getattr(self, k))
        return str(r)
	
    def toJson(self):
        r = {}
        for k in self._data.keys():
            try:
                r[k] = str(getattr(self, k))
            except:
                r[k] = json.dumps(getattr(self, k))
        return r
        

class User(BaseModel):
    name = CharField(unique=True)
    password = CharField()
    email = CharField()
    
class Message(BaseModel):
    fid = IntegerField()
    tid = IntegerField()
    content = TextField()
    type = CharField()

class Command(BaseModel):
    uid = IntegerField()
    cmd = CharField()
    cfg = TextField()
    
class CustomCommand(BaseModel):
    name = CharField()
    response = TextField()
    auth = IntegerField()
    status = IntegerField()
    uid = IntegerField()
    description = TextField()
    
class Binding(BaseModel):
    uid = IntegerField()
    type = CharField()
    bid = IntegerField()

class Douyu(BaseModel):
    douyu_id = IntegerField()
    type = CharField()
    
def create_tables():
    database.connect()
    database.create_tables([User, Message, Command, Binding, Douyu, CustomCommand])
