L.Control.BurgerMenu = L.Control.extend({
	options: {
		mapId: 'map',
		items: [],
		button: undefined,
	},
	statics: {
		CLASS : 'Burgeri',
	},
    initialize: function(map, options) {
        L.setOptions(this,options),
        this.map = map,
        this.menuItem = [],
		this.menu_div = L.DomUtil.create('div','menu',document.getElementById(this.options.mapId)),
        this.container()
        var doc = document.getElementsByClassName('Burgeri')[0].setAttribute("id", "burger");
        L.DomEvent.on(this.container,"click", this._clickFunc, this)
        for(const key in this.options.items){
            this.createMenu(key,this.options.items[key].onClick)
        }
    },
    container: function(){
        return this.container = L.DomUtil.create("div", L.Control.BurgerMenu.CLASS, this.menu_div),
        this.container.style.OverFlow_Y = "auto",
        this.container.style.OverFlow_X = "hidden",
        this.container.style.position = "absolute",
        this.container.style.display = "block",
        this.container.style.visibility = "hidden",
        this.container.style.flex = "1",
        this
    },
    createMenu: function(name, func) {
       var Burgeritem =  L.DomUtil.create("a", "MenuItems", this.container)
       name = name.replaceAll("_", " ")
       Burgeritem.text = name
       Burgeritem.id = name + "_burger"
       Burgeritem.onclick = func
    },
    _clickFunc: function(){
    },
    _hide: function() {
    L.DomUtil.addClass(L.DomUtil.get("burger"),"hidden")
    L.DomUtil.removeClass(L.DomUtil.get("burger"),"shown")
    setTimeout(() => this.container.style.visibility = "hidden", 200)
    },
    _show: function(){
    this.container.style.visibility = "visible"
    L.DomUtil.addClass(L.DomUtil.get("burger"),"shown")
    L.DomUtil.removeClass(L.DomUtil.get("burger"),"hidden")
    },
    
}), 
L.BurgerMenu = function(map, options) {
    return new L.Control.BurgerMenu(map,options)
};