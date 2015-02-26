function GameDB () {
    this.games = {};
    this.gamelist = [];
    
    this.empty = function () {
        this.games = {};
    };
    
    /**
     * 
     * @param {Number} id
     * @returns {Game}
     */
    this.getGame = function (id) {
        if (typeof this.games[id] !== 'undefined') {
            return this.games[id];
        }
        return null;
    };
    
    this.updateFromJSON = function (json, cleanup) {
        if (typeof cleanup === 'undefined') cleanup = false;
        var ids = [];
        for (var i = 0; i < json.length; i++) {
            if (typeof this.games[json[i].id] === 'undefined') {
                this.games[json[i].id] = new Game();
                this.gamelist.push(json[i].id);
            }
            this.games[json[i].id].updateFromJSON(json[i]);
            ids.push(this.games[json[i].id].id);
        }
        if (cleanup) {
            this.gamelist = ids;
        }
        if (json.length > 0) {
            var sortFunction = function (a, b) {
                var oa = window.app.gamedb.getGame(a);
                var ob = window.app.gamedb.getGame(b);
                if (oa.name < ob.name)
                    return -1;
                if (oa.name > ob.name)
                    return 1;
                return 0;
            };
            this.gamelist.sort(sortFunction);
        }
    };
}