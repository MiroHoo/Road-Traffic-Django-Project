var exemptedTransportGroup = null;

async function renderExemptedTransport() {
    var exemptedTransportData = document.getElementById("exempted-transport-data").textContent;
    console.log(exemptedTransportData)
    var exemptedTransportMessages = JSON.parse(exemptedTransportData.replace(/&quot;/g, '"'));

    if (!exemptedTransportGroup) {
        exemptedTransportGroup = L.layerGroup();
        
        for (const key in exemptedTransportMessages) {
            const coords = exemptedTransportMessages[key]["coords"];
            const title = exemptedTransportMessages[key]["title"];
            const description = exemptedTransportMessages[key]["description"];
            const name = exemptedTransportMessages[key]["name"];
            const comment = exemptedTransportMessages[key]["comment"];
            const geometryType = exemptedTransportMessages[key]["geometryType"];
            const quantity = exemptedTransportMessages[key]["quantity"] || "";
            const unit = exemptedTransportMessages[key]["unit"] || "";         

            const fullName = quantity && unit ? `${name} ${quantity} ${unit}` : name;

            if (geometryType === "Point") {
                var marker = L.circle([coords[1], coords[0]], { color: 'cyan', weight: 4 })
                    .bindPopup(
                        `<div>
                            <b>${title}</b><br>
                            <div style="margin-top: 5px;">${description}</div>
                            <div style="margin-top: 5px;">${fullName}</div>
                            <div style="margin-top: 5px;">${comment}</div>
                        </div>`,
                        { width: "auto" }
                    );

                weightRestrictionGroup.addLayer(marker);

            } else if (geometryType === "MultiLineString") {
                const polycoords = coords[0].map(coordPair => [coordPair[1], coordPair[0]]);
                var polyline = L.polyline(polycoords, { color: 'green', weight: 4 })
                    .bindPopup(
                        `<div>
                            <b>${title}</b><br>
                            <div style="margin-top: 5px;">${description}</div>
                            <div style="margin-top: 5px;">${fullName}</div>
                        </div>`,
                        { width: "auto" }
                    );

                exemptedTransportGroup.addLayer(polyline);

            } else {
                console.warn("Invalid geometry type for message:", exemptedTransportMessages[key]);
            }
        }
    }

    if (map.hasLayer(exemptedTransportGroup)) {
        map.removeLayer(exemptedTransportGroup);
    } else {
        map.addLayer(exemptedTransportGroup);
    }
}
