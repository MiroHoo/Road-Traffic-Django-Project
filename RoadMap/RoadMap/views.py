from django.shortcuts import render
import requests
from django.http import HttpResponse
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User


weatherimages = {}
traffic_messages = {}
filteredStations = {}
roadWork = {}
trainLocations = {}
weightRestriction = {}
exemptedTransport = {}
arrivingAndDepartingTrains = {}

def home(request):
    gatherimages()
    gather_traffic_messages()
    gatherTrainStations()
    gatherRoadWork()
    gatherTrainLocations()
    gatherWeightRestriction()
    gatherExemptedTransport()
    gatherTrainRoutes()
    template = "index.html"
    context = {
        "ListOfImages": json.dumps(weatherimages, indent=1),
        "TrafficMessages": json.dumps(traffic_messages, indent=1),
        "TrainStations": json.dumps(filteredStations, indent=1),
        "RoadWorks": json.dumps(roadWork, indent=1),
        "TrainLocations": json.dumps(trainLocations, indent=1),
        "WeightRestrictions": json.dumps(weightRestriction, indent=1),
        "ExemptedTransports": json.dumps(exemptedTransport, indent=1),
        "TrainRoutes": json.dumps(arrivingAndDepartingTrains, indent=1),
    }
    return render(request, template, context)

def getcurrentuser(request): 
    user = request.user
    if user.username is not "AnonymousUser":
        data = {}
        data["username"] = user.username
        print(user)
        return HttpResponse(
            json.dumps(data), content_type="application/json"
        )
    else:
        data = {}
        data["username"] = ""
        print(user)
        return HttpResponse(
            json.dumps(data), content_type="application/json"
        )

def loginuser(request): 
    reqbody = json.loads(request.body.decode('UTF-8'))
    user = authenticate(request, username=reqbody["username"], password=reqbody["password"])
    print(user)
    if user is not None:
        login(request,user)
        data = {}
        data["response"] = True
        data["username"] = user.username
        return HttpResponse(
           json.dumps(data), content_type="application/json"
        )
    else: 
        data = {}
        data["response"] = False  
        return HttpResponse(
                json.dumps(data), content_type="application/json"
             )
def logoutuser(request): 
    logout(request)
    data = {}
    data["response"] = True  
    return HttpResponse(
           json.dumps(data), content_type="application/json"
        )
def register(request):
    reqbody = json.loads(request.body.decode('UTF-8'))
    user = User.objects.create_user(reqbody["username"],reqbody["email"],reqbody["password"])
    user.save()
    if user is not None:
        data = {}
        data["response"] = True
        return HttpResponse(
           json.dumps(data), content_type="application/json"
        )
    else: 
        data = {}
        data["response"] = False  
        return HttpResponse(
                json.dumps(data), content_type="application/json"
             )


def gatherimages(): 
    TMS_STATION_URL = 'https://tie.digitraffic.fi/api/weathercam/v1/stations'
    headers = {'Digitraffic-User': 'Junamies/FoobarApp 1.0'}
    r = requests.get(TMS_STATION_URL, headers=headers)
    j = r.json()
    for i in range(len(j["features"])): 
        imageurl =  "https://weathercam.digitraffic.fi/" + str(j["features"][i]["properties"]["presets"][0]["id"] + ".jpg")
        weatherimages[i] = {
            "coords": j["features"][i]["geometry"]["coordinates"],
            "imageurl": imageurl
        }

def gather_traffic_messages():
    global traffic_messages
    TRAFFIC_MESSAGE_URL = 'https://tie.digitraffic.fi//api/traffic-message/v1/messages?situationType=TRAFFIC_ANNOUNCEMENT'
    response = requests.get(TRAFFIC_MESSAGE_URL)
    data = response.json()
    
    traffic_messages = {}
    
    if "features" in data:
        for i, message in enumerate(data["features"]):
            geometry = message.get("geometry", {})
            if geometry is not None:
                if geometry.get("type") == "MultiLineString":
                    coords = geometry.get("coordinates", [[]])
                elif geometry.get("type") == "Point":
                    coords = geometry.get("coordinates", [])
            else:
                coords = []
            
            properties = message.get("properties", {})
            announcement = properties.get("announcements", [{}])[0]
            location = announcement.get("location")
            features_list = announcement.get("features", [])
            features = features_list[0] if features_list else ""
            name = features.get("name") if features else ""
            
            traffic_messages[i] = {
                "coords": coords,
                "title": announcement.get("title"),
                "description": location.get("description"),
                "name": name,
                "comment": announcement.get("comment", ""),
                "geometryType": geometry.get("type") if geometry else None
            }
    else:
        print("No features found in API response.")

def gatherTrainStations():
    global filteredStations
    TMS_TRAINSTATION_URL = 'https://rata.digitraffic.fi/api/v1/metadata/stations'
    headers = {'Digitraffic-User': 'Junamies/FoobarApp 1.0'}
    r = requests.get(TMS_TRAINSTATION_URL, headers=headers)
    stationsData = r.json()

    # Filter data to receive only name of the station, shortcode and coordinates and loop through data with a for-loop
    filteredStations = [
        {
            "stationName": station["stationName"],
            "stationShortCode": station["stationShortCode"],
            "longitude": station["longitude"],
            "latitude": station["latitude"]
        }
        for station in stationsData
    ]

def gatherRoadWork():
    global roadWork
    ROAD_WORK_URL = 'https://tie.digitraffic.fi/api/traffic-message/v1/messages'
    params = {'situationType': 'ROAD_WORK'}
    response = requests.get(ROAD_WORK_URL, params=params)
    data = response.json()

    roadWork = {}

    if "features" in data:
        for i, message in enumerate(data["features"]):
            geometry = message.get("geometry")
            
            if geometry is not None:
                if geometry.get("type") == "MultiLineString":
                    coords = geometry.get("coordinates", [[]])
                elif geometry.get("type") == "Point":
                    coords = geometry.get("coordinates", [])
                else:
                    coords = []
            else:
                coords = []

            properties = message.get("properties", {})
            announcement = properties.get("announcements", [{}])[0]
            location = announcement.get("location", {})
            features_list = announcement.get("features", [])
            features = features_list[0] if features_list else {}
            name = features.get("name", "")
            
            roadWork[i] = {
                "coords": coords,
                "title": announcement.get("title", ""),
                "description": location.get("description", ""),
                "name": name,
                "comment": announcement.get("comment", ""),
                "geometryType": geometry.get("type") if geometry else None
            }
    else:
        print("No features found in API response.")

def gatherTrainLocations():
    # This function gathers all trains active within the last 15 minutes
    global trainLocations
    TRAIN_LOCATION_URL = "https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest/"
    headers = {'Digitraffic-User': 'Junamies/FoobarApp 1.0'}
    r = requests.get(TRAIN_LOCATION_URL, headers=headers)
    trainLocationData = r.json()

    if "features" in trainLocationData:
        for i, message in enumerate(trainLocationData["features"]):
            geometry = message.get("geometry")

            if geometry is not None:
                if geometry.get("type") == "Point":
                    coords = geometry.get("coordinates", [])
                else:
                    coords = []

                properties = message.get("properties", {})

                trainLocations[i] = {
                    "coords": coords,
                    "trainNumber": properties.get("trainNumber", ""),
                    "departureDate": properties.get("departureDate", ""),
                    "timestamp": properties.get("timestamp", ""),
                    "currentSpeed": properties.get("speed", ""),
                    "geometryType": geometry.get("type") if geometry else None
                }
    else:
        print("No features found in API respone for TrainLocations")

def gatherWeightRestriction():
    global weightRestriction

    WEIGHT_RESTRICTION_URL = 'https://tie.digitraffic.fi/api/traffic-message/v1/messages'
    params = {'situationType': 'WEIGHT_RESTRICTION'}
    response = requests.get(WEIGHT_RESTRICTION_URL, params=params)
    data = response.json()

    weightRestriction = {}

    if "features" in data:
        for i, message in enumerate(data["features"]):
            geometry = message.get("geometry")
            
            if geometry is not None:
                if geometry.get("type") == "MultiLineString":
                    coords = geometry.get("coordinates", [[]])
                elif geometry.get("type") == "Point":
                    coords = geometry.get("coordinates", [])
                else:
                    coords = []
            else:
                coords = []

            properties = message.get("properties", {})
            announcement = properties.get("announcements", [{}])[0]
            location = announcement.get("location", {})
            features_list = announcement.get("features", [])
            features = features_list[0] if features_list else {}
            name = features.get("name", "")
            
            weightRestriction[i] = {
                "coords": coords,
                "title": announcement.get("title", ""),
                "description": location.get("description", ""),
                "name": name,
                "comment": announcement.get("comment", ""),
                "geometryType": geometry.get("type") if geometry else None,
                "quantity": features.get("quantity", ""),
                "unit": features.get("unit", "")
            }
    else:
        print("No features found in API response for weightRestrictions")

def gatherExemptedTransport():
    global exemptedTransport
    EXEMPTED_TRANSPORT_URL = 'https://tie.digitraffic.fi/api/traffic-message/v1/messages'
    params = {'situationType': 'EXEMPTED_TRANSPORT'}
    response = requests.get(EXEMPTED_TRANSPORT_URL, params=params)
    data = response.json()

    exemptedTransport = {}

    if "features" in data:
        for i, message in enumerate(data["features"]):
            geometry = message.get("geometry")
            
            if geometry is not None:
                if geometry.get("type") == "MultiLineString":
                    coords = geometry.get("coordinates", [[]])
                elif geometry.get("type") == "Point":
                    coords = geometry.get("coordinates", [])
                else:
                    coords = []
            else:
                coords = []

            properties = message.get("properties", {})
            announcement = properties.get("announcements", [{}])[0]
            location = announcement.get("location", {})
            features_list = announcement.get("features", [])
            features = features_list[0] if features_list else {}
            name = features.get("name", "")
            
            exemptedTransport[i] = {
                "coords": coords,
                "title": announcement.get("title", ""),
                "description": location.get("description", ""),
                "name": name,
                "comment": announcement.get("comment", ""),
                "geometryType": geometry.get("type") if geometry else None,
                "quantity": features.get("quantity", ""),
                "unit": features.get("unit", "")
            }
    else:
        print("No features found in API response for exemptedTransport")

def gatherTrainRoutes():
    global arrivingAndDepartingTrains
    GATHER_TRAIN_ROUTES_URL = "https://rata.digitraffic.fi/api/v1/live-trains"
    headers = {'Digitraffic-User': 'Junamies/FoobarApp 1.0'}
    r = requests.get(GATHER_TRAIN_ROUTES_URL, headers=headers)
    arrivingAndDepartingTrainsData = r.json()

    arrivingAndDepartingTrains = [
        {
            "trainNumber": train ["trainNumber"],
            "departureDate": train ["departureDate"],
            "trainType": train ["trainType"],
            "timeTableRows": [
                {
                    "stationShortCode": row["stationShortCode"],
                    "type": row["type"],
                    "scheduledTime": row["scheduledTime"],
                    "trainStopping": row["trainStopping"]
                }
                for row in train["timeTableRows"]
            ]
        }
        for train  in arrivingAndDepartingTrainsData
    ]