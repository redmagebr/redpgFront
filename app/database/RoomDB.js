function RoomDB () {
    this.rooms = {};
    
    this.empty = function () {
        this.rooms = {};
    };
    
    /**
     * 
     * @param {type} id
     * @returns {Room}
     */
    this.getRoom = function (id) {
        if (typeof this.rooms[id] !== 'undefined') {
            return this.rooms[id];
        }
        return null;
    };
    
    this.updateFromJSON = function (json) {
        for (var i = 0; i < json.length; i++) {
            if (typeof this.rooms[json[i].id] === 'undefined') {
                this.rooms[json[i].id] = new Room();
            }
            this.rooms[json[i].id].updateFromJSON(json[i]);
        }
    };
}