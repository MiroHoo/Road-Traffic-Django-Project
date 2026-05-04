var trafficMessageGroup = null;

async function renderTrafficMessages() {
    var trafficData = document.getElementById("traffic-data").textContent;
    var trafficMessages = JSON.parse(trafficData.replace(/&quot;/g, '"'));

    if (!trafficMessageGroup) {
        trafficMessageGroup = L.layerGroup();
        
        for (const key in trafficMessages) {
            const coords = trafficMessages[key]["coords"];
            const title = trafficMessages[key]["title"];
            const description = trafficMessages[key]["description"];
            const name = trafficMessages[key]["name"];
            const comment = trafficMessages[key]["comment"];
            const geometryType = trafficMessages[key]["geometryType"];

            if (geometryType === "Point") {
                var marker = L.circle([coords[1], coords[0]], {color: 'red', weight: 8 })
                    .bindPopup(
                        "<div>" +
                        "<b>" + title + "</b><br>" +
                        "<div style='margin-top: 5px;'>" + description + "</div>" +
                        "<div style='margin-top: 5px;'>" + name + "</div>" +
                        "<div style='margin-top: 5px;'>" + comment + "</div>" +
                        "</div>",
                        { width: "auto" }
                    );

                trafficMessageGroup.addLayer(marker);

            } else if (geometryType === "MultiLineString") {
                const polycoords = coords[0].map(coordPair => [coordPair[1], coordPair[0]]);
                var polyline = L.polyline(polycoords, { color: 'red', weight: 8 })
                    .bindPopup(
                        "<div>" +
                        "<b>" + title + "</b><br>" +
                        "<div style='margin-top: 5px;'>" + description + "</div>" +
                        "<div style='margin-top: 5px;'>" + name + "</div>" +
                        "<div style='margin-top: 5px;'>" + comment + "</div>" +
                        "</div>",
                        { width: "auto" }
                    );
            
                trafficMessageGroup.addLayer(polyline);

            } else {
                console.warn("Invalid geometry type for message:", trafficMessages[key]);
            }
        }
    }

    if (map.hasLayer(trafficMessageGroup)) {
        map.removeLayer(trafficMessageGroup);
    } else {
        map.addLayer(trafficMessageGroup);
    }
}
