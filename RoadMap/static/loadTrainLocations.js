var trainLocationGroup = null

async function renderTrainLocations() {
    var trainLocationData = document.getElementById("train-location-data").textContent;
    var trainLocationDataParsed = JSON.parse(trainLocationData.replace(/&quot;/g, '"'));
    console.log(trainLocationDataParsed)

    if (!trainLocationGroup) {
        trainLocationGroup = L.layerGroup();
        
        for (const key in trainLocationDataParsed) {
            const coords = trainLocationDataParsed[key]["coords"];
            const trainNumber = trainLocationDataParsed[key]["trainNumber"];
            const departureDate = trainLocationDataParsed[key]["departureDate"];
            const timestamp = trainLocationDataParsed[key]["timestamp"];
            const currentSpeed = trainLocationDataParsed[key]["currentSpeed"];
            const geometryType = trainLocationDataParsed[key]["geometryType"];

            if (geometryType === "Point") {
                var marker = L.circleMarker([coords[1], coords[0]], {
                    radius: 6,
                    color: 'white',
                    fillColor: 'green',
                    fillOpacity: 1.0
                })
                    .bindPopup(
                        "<div>" +
                        "<b>Train: " + trainNumber + "</b>" +
                        "<br><b>Departure:</b> " + new Date(departureDate).toLocaleDateString() +
                        "<br><b>Timestamp:</b> " + new Date(timestamp).toLocaleTimeString() +
                        "<br><b>Speed:</b> " + currentSpeed + " km/h</div>",
                        { width: "auto" }
                    );

                trainLocationGroup.addLayer(marker);

            } else {
                console.warn("Invalid geometry type for message (TrainLocations):", trainLocationDataParsed[key]);
            }
        }
    }

    if (map.hasLayer(trainLocationGroup)) {
        map.removeLayer(trainLocationGroup);
    } else {
        map.addLayer(trainLocationGroup);
    }
}