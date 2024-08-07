// http://localhost:3000/api/flight/search?origin=DEL&destination=BOM&departureDate=2024-08-01&adults=1&returnDate=2024-08-02
var exRes ={
    "isOneWay": false,
    "departureFlights": [
        {
            "_id": "66ab55b6b785d6991753e249",
            "flight_number": "6E301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "07:00:00",
            "arrival_time": "08:30:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 5400000,
            "airline_name": "IndiGo"
        },
        {
            "_id": "66ab55b6b785d6991753e279",
            "flight_number": "G8301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "10:00:00",
            "arrival_time": "11:30:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 5400001,
            "airline_name": "GoAir"
        },
        {
            "_id": "66ab55b6b785d6991753e235",
            "flight_number": "AI101",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "06:00:00",
            "arrival_time": "07:40:00",
            "availableSeats": 10,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "Air India"
        },
        {
            "_id": "66ab55b6b785d6991753e259",
            "flight_number": "SG301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "08:00:00",
            "arrival_time": "09:40:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "SpiceJet"
        },
        {
            "_id": "66ab55b6b785d6991753e269",
            "flight_number": "UK301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "09:00:00",
            "arrival_time": "10:40:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "Vistara"
        }
    ],
    "returnFlights": [
        {
            "_id": "66ab55b6b785d6991753e249",
            "flight_number": "6E301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "07:00:00",
            "arrival_time": "08:30:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 5400000,
            "airline_name": "IndiGo"
        },
        {
            "_id": "66ab55b6b785d6991753e279",
            "flight_number": "G8301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "10:00:00",
            "arrival_time": "11:30:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 5400000,
            "airline_name": "GoAir"
        },
        {
            "_id": "66ab55b6b785d6991753e235",
            "flight_number": "AI101",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "06:00:00",
            "arrival_time": "07:40:00",
            "availableSeats": 10,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "Air India"
        },
        {
            "_id": "66ab55b6b785d6991753e259",
            "flight_number": "SG301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "08:00:00",
            "arrival_time": "09:40:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "SpiceJet"
        },
        {
            "_id": "66ab55b6b785d6991753e269",
            "flight_number": "UK301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "09:00:00",
            "arrival_time": "10:40:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "Vistara"
        }
    ]
}

//http://localhost:3000/api/flight/search?origin=DEL&destination=BOM&departureDate=2024-08-01&adults=1
res = {
    "isOneWay": true,
    "departureFlights": [
        {
            "_id": "66ab55b6b785d6991753e249",
            "flight_number": "6E301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "07:00:00",
            "arrival_time": "08:30:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 5400000,
            "airline_name": "IndiGo"
        },
        {
            "_id": "66ab55b6b785d6991753e279",
            "flight_number": "G8301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "10:00:00",
            "arrival_time": "11:30:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 5400000,
            "airline_name": "GoAir"
        },
        {
            "_id": "66ab55b6b785d6991753e235",
            "flight_number": "AI101",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "06:00:00",
            "arrival_time": "07:40:00",
            "availableSeats": 10,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "Air India"
        },
        {
            "_id": "66ab55b6b785d6991753e259",
            "flight_number": "SG301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "08:00:00",
            "arrival_time": "09:40:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "SpiceJet"
        },
        {
            "_id": "66ab55b6b785d6991753e269",
            "flight_number": "UK301",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "09:00:00",
            "arrival_time": "10:40:00",
            "availableSeats": 20,
            "__v": 0,
            "travel_time": 6000000,
            "airline_name": "Vistara"
        }
    ],
    "returnFlights": []
}