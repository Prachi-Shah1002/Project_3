from flask import Flask, jsonify, make_response, redirect, url_for
from flask_cors import CORS, cross_origin
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow all origins for routes under /api/
def get_database():
    CONNECTION_STRING = 'mongodb://localhost:27017'
    client = MongoClient(CONNECTION_STRING)
    return client['NYC_Acciedents']

@app.route('/', methods=['GET'])
def home():
    return redirect(url_for('get_accidents'))

@app.route('/api/accidents', methods=['GET'])
@cross_origin()
def get_accidents():
    dbname = get_database()
    accident_data = dbname["Acciedents_Data"]
    output = []
    for accident in accident_data.find():
        output.append({
            'Crash_Date': accident.get('Crash_Date', ''),
            'Crash_Time': accident.get('Crash_Time', ''),
            'City_Name': accident.get('City_Name', ''),
            'Zip_Code': accident.get('Zip_Code', ''),
            'Latitude': accident.get('Latitude', ''),
            'Longitude': accident.get('Longitude', ''),
            'Vehicle_Type': accident.get('Vechicle_Type', ''),
        })
    response = make_response(jsonify({'result': output}))
    return response

@app.route('/api/cities-accidents', methods=['GET'])
def get_city_accidents():
    dbname = get_database()
    accident_data = dbname['Acciedents_Data']
    pipeline = [
        {"$group": {"_id": "$City_Name",
                    "count": {"$sum": 1},
                    "avgLat": {"$avg": "$Latitude"},
                    "avgLon": {"$avg": "$Longitude"}}},
        {"$sort": {"count": -1}}
    ]
    cities_accidents = list(accident_data.aggregate(pipeline))
    result = [{"city": city["_id"],
               "count": city["count"],
               "latitude": city["avgLat"],
               "longitude": city["avgLon"]} for city in cities_accidents]
    response = make_response(jsonify({"result": result}))
    return response

@app.route('/api/vehicle-accidents', methods=['GET'])
def get_vehicle_accidents():
    dbname = get_database()
    accident_data = dbname['Acciedents_Data']
    pipeline = [
        {"$group": {"_id": "$Vechicle_Type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    vehicle_accidents = list(accident_data.aggregate(pipeline))
    result = [{"vehicleType": vehicle["_id"], "count": vehicle["count"]} for vehicle in vehicle_accidents]
    response = make_response(jsonify({"result": result}))
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)