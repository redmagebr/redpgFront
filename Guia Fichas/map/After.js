/**
 * Handling the Map
 */
this.$mapCanvas = null;
this.$mapDiv = sheet.$visible.find('#mapMap');
this.$mapImg = null;
// Add trigger to update verything
sheet.$visible.on('viewing changedVariable', this.emulateBind(function () {
    this.style.updateMap(false);
}, {style : this}));
// Add trigger to remove map
sheet.$visible.on('editing', this.emulateBind(function () {
    this.style.updateMap(false);
}, {style : this}));