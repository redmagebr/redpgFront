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
            var sortFunction = window.app.emulateBind(function (a, b) {
                var oa = this.gamedb.getGame(a);
                var ob = this.gamedb.getGame(b);
                if (oa.name < ob.name)
                    return -1;
                if (oa.name > ob.name)
                    return 1;
                return 0;
            }, {gamedb : this});
            this.gamelist.sort(sortFunction);
        }
    };
}