var trainStationGroup = null

async function renderTrainStations() {
    // Read and parse data
    var stationData = document.getElementById("train-station-data").textContent
    var stationDataParsed = JSON.parse(stationData.replace(/&quot;/g, '"'))

    var arrivingDepartingTrainData = document.getElementById("train-routes-data").textContent
    var arrivingDepartingTrainDataParsed = JSON.parse(arrivingDepartingTrainData.replace(/&quot;/g, '"'))

    console.log(arrivingDepartingTrainDataParsed)

    if (!stationDataParsed || stationDataParsed.length == 0) {
        console.error("No Trainstation data available")
        return
    }

    if (!arrivingDepartingTrainDataParsed || arrivingDepartingTrainDataParsed.length == 0) {
        console.error("No arriving/departing train data available")
        return
    }

    // If layer not created, create one
    if (!trainStationGroup) {
        trainStationGroup = L.layerGroup();

        stationDataParsed.forEach(function(station) {

            // Matches station data with the arriving and departing trains, if they are stopping at a station (row.trainStopping === True)
            // Sources: https://www.w3schools.com/jsref/jsref_filter.asp, https://www.w3schools.com/jsref/jsref_some.asp
            var matchStations = arrivingDepartingTrainDataParsed.filter(function(train){
                return train.timeTableRows.some(function(row) {
                    return row.stationShortCode === station.stationShortCode && row.trainStopping
                })
            })

            // Formats the matching stations with the train data
            var trainInfo = matchStations.map(function(train) {
                var relevantRows = train.timeTableRows.filter(function(row) {
                    return row.stationShortCode === station.stationShortCode && row.trainStopping;
                });
    
                return `
                    <b>Train Number:</b> ${train.trainNumber}<br>
                    <b>Train Type:</b> ${train.trainType}<br>
                    ${relevantRows.map(row => `
                        <b>Type:</b> ${row.type}<br>
                        <b>Scheduled Time:</b> ${new Date(row.scheduledTime).toLocaleString()}<br>
                    `).join('<br><br>')}
                `;
            }).join('<hr>');

            var marker = L.circleMarker([station.latitude, station.longitude], {
                radius: 6,
                color: 'green',
                fillColor: 'white',
                fillOpacity: 0.8,
                maxHeight: 100
            });
            
            marker.bindPopup(
                `<div style="max-height: 240px; overflow-y: auto;">
                    <b>${station.stationName}</b><br>
                    <b>Short Code:</b> ${station.stationShortCode}<br>
                    <b>Latitude:</b> ${station.latitude}<br>
                    <b>Longitude:</b> ${station.longitude}<br>
                    <hr>
                    ${trainInfo || "No trains stopping at this station"}
                </div>`
            );
            trainStationGroup.addLayer(marker);
        });
    }

    if (trainStationGroup.getLayers().length > 0 && map.hasLayer(trainStationGroup)) {
        map.removeLayer(trainStationGroup)
    } else {
        map.addLayer(trainStationGroup)
    }
}