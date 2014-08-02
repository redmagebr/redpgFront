function CacheDB () {
    this.games = new GameDB();
    this.rooms = new RoomDB();
    
    this.emptyCache = function () {
        this.users.empty();
        this.games.empty();
        this.rooms.empty();
    };
    
    this.updateFromJSON = function (json) {
        if (typeof json.games === 'array') {
            this.games.updateFromJSON[json.games];
        }
        if (typeof json.rooms === 'array') {
            this.rooms.updateFromJSON[json.rooms];
        }
    };
    
    this.getUser = function (id) {
        return this.users.getUser(id);
    };
    
    this.getGame = function (id) {
        return this.games.getGame(id);
    };
    
    this.rooms = function (id) {
        return this.rooms.getRoom(id);
    };
}