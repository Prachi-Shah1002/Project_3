import numpy as np
from pymongo import MongoClient
from bson.objectid import ObjectId
from flasgger import Swagger

from flask import Flask, jsonify


app = Flask(__name__)
swagger = staggered(app)
app.config[‘MONGO_URL’] = ‘mongodb://localhost:27017/NYC_Acciedents’
mongo = PyMongo(app)
