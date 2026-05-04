var showweather = false
let weatherimagegroup = null;
let anim = false
async function renderimages(){
    var value = document.getElementById("hello-data").textContent;
    var value2 = JSON.parse(value.replace(/&quot;/g,'"'))
    weatherimagegroup = L.layerGroup();
    var markers = []
    for (const key in value2) {
        const src = value2[key]["imageurl"]
        const popupimage = document.createElement("div")
        popupimage.className = "weatherdiv"
        popupimage.onclick = function() { size() }
        popupimage.innerHTML = "<a target='_blank' class='popupa' id='popupimage''><img class='popupimage' id='popupclick' src='" + src + "'></a>"
        var marker = L.circle([value2[key]["coords"][1],value2[key]["coords"][0]])
        .bindPopup(popupimage, { maxWidth: "auto"})
        .openPopup();  
        marker.getPopup().on('remove', function() {
            setTimeout(()=> {
                const elem = L.DomUtil.get("popupclick")
                L.DomUtil.removeClass(L.DomUtil.get("popupclick"),"big")
                L.DomUtil.removeClass(L.DomUtil.get("popupclick"),"small")
                elem.style.width = "300px" 
            }, 175)
        });
        markers.push(marker)
        weatherimagegroup.addLayer(marker)
    }
    for (const key in markers) {
        markers[key].addTo(map)
    }
}
function size(){
    const elem = L.DomUtil.get("popupclick")
    if(!anim){
    if(elem.className == "popupimage big"){
        L.DomUtil.addClass(L.DomUtil.get("popupclick"),"small")
        L.DomUtil.removeClass(L.DomUtil.get("popupclick"),"big")
        anim = true
        onanimationend = (event) => {elem.style.width = "300px", anim=false};
    } else {
        L.DomUtil.removeClass(L.DomUtil.get("popupclick"),"small")
        L.DomUtil.addClass(L.DomUtil.get("popupclick"),"big")
        anim = true
        onanimationend = (event) => {elem.style.width = "500px", anim=false};
    }
}
}
function showweathertgl(){
    if(weatherimagegroup == null){
            renderimages()
    }
    showweather = !showweather
    if(showweather){
        map.addLayer(weatherimagegroup)
    } else {
        map.removeLayer(weatherimagegroup)
    }
}
