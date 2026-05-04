var weightRestrictionGroup = null;

async function renderWeightRestrictions() {
    var weightRestrictionData = document.getElementById("weight-restriction-data").textContent;
    var weightRestrictionMessages = JSON.parse(weightRestrictionData.replace(/&quot;/g, '"'));

    if (!weightRestrictionGroup) {
        weightRestrictionGroup = L.layerGroup();
        
        for (const key in weightRestrictionMessages) {
            const coords = weightRestrictionMessages[key]["coords"];
            const title = weightRestrictionMessages[key]["title"];
            const description = weightRestrictionMessages[key]["description"];
            const name = weightRestrictionMessages[key]["name"];
            const comment = weightRestrictionMessages[key]["comment"];
            const geometryType = weightRestrictionMessages[key]["geometryType"];
            const quantity = weightRestrictionMessages[key]["quantity"] || "";
            const unit = weightRestrictionMessages[key]["unit"] || "";         

            const fullName = quantity && unit ? `${name} ${quantity} ${unit}` : name;

            if (geometryType === "Point") {
                var marker = L.circle([coords[1], coords[0]], { color: 'green', weight: 4 })
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

                weightRestrictionGroup.addLayer(polyline);

            } else {
                console.warn("Invalid geometry type for message:", weightRestrictionMessages[key]);
            }
        }
    }

    if (map.hasLayer(weightRestrictionGroup)) {
        map.removeLayer(weightRestrictionGroup);
    } else {
        map.addLayer(weightRestrictionGroup);
    }
}
