import pymongo
import json
from pymongo import MongoClient, InsertOne

client = pymongo.MongoClient("mongodb+srv://Shriyash:shriyash1a2b@cluster0.1laezrl.mongodb.net/myData?retryWrites=true&w=majority")
db = client.Yearbook
collection = db.responses
requesting = []

with open(r"C:\atom\Web_developement\to-do-list_v2\Responses.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting.append(InsertOne(myDict))

result = collection.bulk_write(requesting)
client.close()