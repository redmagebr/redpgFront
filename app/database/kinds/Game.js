function Game () {
    this.id;
    this.name;
    this.description;
    this.creatorid;
    this.creatornick;
    this.creatorsufix;
    
    // Permissions
    this.createSheet = false;
    this.editSheet = false;
    this.deleteSheet = false;
    this.createRoom = false;
    this.invite = false;
    this.promote = false;
    this.storyteller = false;
    
    this.freejoin = false;
    
    this.rooms = [];
    this.sheets = [];
    
    this.isOwner = function () {
        return window.app.loginapp.user.id === this.creatorid;
    };
    
    this.updateFromJSON = function (json) {
        var attributes = {
            id : 'id',
            name : 'name',
            description : 'descricao',
            creatorid : 'creatorid',
            creatornick : 'creatornick',
            creatorsufix : 'creatorsufix',
            createSheet : 'createSheet',
            editSheet : "editSheet",
            deleteSheet : 'deleteSheet',
            createRoom : 'createRoom',
            invite : 'invite',
            promote : 'promote',
            storyteller : 'createRoom',
            freejoin : 'freejoin'
        };
        var i;
        for (i in attributes) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[i] = json[attributes[i]];
            }
        }
        if (typeof json.rooms !== 'undefined') {
            this.rooms = [];
            for (i = 0; i < json.rooms.length; i++) {
                this.rooms.push(json.rooms[i].id);
                json.rooms[i].gameid = this.id;
            }
            window.app.roomdb.updateFromJSON(json.rooms);
            
            if (this.rooms.length > 0) {
                var sortFunction = function (a, b) {
                    var oa = window.app.roomdb.getRoom(a);
                    var ob = window.app.roomdb.getRoom(b);
                    if (oa.name < ob.name)
                        return -1;
                    if (oa.name > ob.name)
                        return 1;
                    return 0;
                };
                this.rooms.sort(sortFunction);
            }
        }
        if (typeof json.sheets !== 'undefined') {
            this.sheets = [];
            for (i = 0; i < json.sheets.length; i++) {
                this.sheets.push(json.sheets[i].id);
                json.sheets[i].gameid = this.id;
            }
            window.app.sheetdb.updateFromJSON(json.sheets);
            
            if (this.sheets.length > 0) {
                this.sheets.sort(function (a,b) {
                    var na = window.app.sheetdb.getSheet(a).name.toUpperCase();
                    var nb = window.app.sheetdb.getSheet(b).name.toUpperCase();
                    if (na < nb) return -1;
                    if (na > nb) return 1;
                    return 0;
                });
            }
        }
    };
}