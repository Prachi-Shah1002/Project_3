from flask import Flask, jsonify
# from pymongo import MongoClient
from flask_pymongo import PyMongo

app = Flask(__name__)

# Define the MongoDB Connection String
app.config['MONGO_URI'] = 'mongodb://localhost:27017/NYC_Acciedents'
mongo = PyMongo(app)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/Acciedents_Data<br/>"
    )

@app.route('/api/v1.0/Acciedents_Data', methods=['GET'])
def get_accidents():
     # Endpoint to Get All Accidents
    # Fetches and returns all the accidents data from the MongoDB Collection in JSON Format
     accidents = mongo.db.Acciedents_Data # Select the MongoDB Collection
     output = []  # Initialize the output list

    # Loop through the collection and append each document to the output list
     for accident in accidents.find():
         output.append({
              'Crash_Date' :accident['Crash_Date'],
              'Crash_Time': accident['Crash_Time'],
              'City_Name':accident['City_Name'],
              'Zip_Code':accident['Zip_Code'],
              'Latitude':accident['Latitude'],
              'Longitude' : accident['Longitude'],
              'Collision_id' :accident['Collision_id'],
              'Vechicle_Type' :accident['Vechicle_Type'],
         })
     return jsonify({'result':output})
if __name__ == '__main__':
     app.run(debug=True)
