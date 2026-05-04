
function toggleMapLayer() {
    // Get the checkbox element
    var toggle = document.getElementById('toggleMap')
    var roadLayers = [weatherimagegroup, roadWorkGroup, trafficMessageGroup]
    var trainLayers = [trainStationGroup, trainLocationGroup]
    
    // Check the status of the checkbox
    if (toggle.checked) {
        // If checked, show the trainLayer and remove the roadLayer
        roadLayers.forEach(layer => {
            console.log(layer)
            if(layer != null ){
                console.log("here")
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer)
                }
            }
        })

        if (map.hasLayer(roadLayer)) {
            map.removeLayer(roadLayer)
        }

        toggleState = true
        burger.remove()
        burger._hide()
        initBurgerMenu()
        map.addLayer(trainLayer);
    } else {
        // If unchecked, show the roadLayer and remove the trainLayer
        trainLayers.forEach(layer => {
            if(layer != null ){
            if (map.hasLayer(layer)) {
                map.removeLayer(layer)
            }
        }
        })

        if (map.hasLayer(trainLayer)) {
            map.removeLayer(trainLayer)
        }
        
        toggleState = false
        burger.remove()
        burger._hide()
        initBurgerMenu()
        map.addLayer(roadLayer)
    }
}