var roadWorkGroup = null;

async function renderRoadWorks() {
    var roadWorkData = document.getElementById("road-work-data").textContent;
    console.log(roadWorkData)
    var roadWorkMessages = JSON.parse(roadWorkData.replace(/&quot;/g, '"'));

    if (!roadWorkGroup) {
        roadWorkGroup = L.layerGroup();
        
        for (const key in roadWorkMessages) {
            const coords = roadWorkMessages[key]["coords"];
            const title = roadWorkMessages[key]["title"];
            const description = roadWorkMessages[key]["description"];
            const name = roadWorkMessages[key]["name"];
            const comment = roadWorkMessages[key]["comment"];
            const geometryType = roadWorkMessages[key]["geometryType"];

            if (geometryType === "Point") {
                var marker = L.circle([coords[1], coords[0]], {color: 'orange', weight: 4 })
                    .bindPopup(
                        "<div>" +
                        "<b>" + title + "</b><br>" +
                        "<div style='margin-top: 5px;'>" + description + "</div>" +
                        "<div style='margin-top: 5px;'>" + name + "</div>" +
                        "<div style='margin-top: 5px;'>" + comment + "</div>" +
                        "</div>",
                        { width: "auto" }
                    );

                roadWorkGroup.addLayer(marker);

            } else if (geometryType === "MultiLineString") {
                const polycoords = coords[0].map(coordPair => [coordPair[1], coordPair[0]]);
                var polyline = L.polyline(polycoords, { color: 'orange', weight: 4 })
                    .bindPopup(
                        "<div>" +
                        "<b>" + title + "</b><br>" +
                        "<div style='margin-top: 5px;'>" + description + "</div>" +
                        "<div style='margin-top: 5px;'>" + name + "</div>" +
                        "<div style='margin-top: 5px;'>" + comment + "</div>" +
                        "</div>",
                        { width: "auto" }
                    );
            
                roadWorkGroup.addLayer(polyline);

            } else {
                console.warn("Invalid geometry type for message:", roadWorkMessages[key]);
            }
        }
    }

    if (map.hasLayer(roadWorkGroup)) {
        map.removeLayer(roadWorkGroup);
    } else {
        map.addLayer(roadWorkGroup);
    }
}
