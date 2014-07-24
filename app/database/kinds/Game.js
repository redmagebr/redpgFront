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
    
    this.rooms = [];
    this.sheets = [];
    
    this.isOwner = function () {
        return window.app.loginapp.user.id === this.creatorid;
    };
    
    this.updateFromJSON = function (json) {
        var attributes = {
            id : 'id',
            name : 'nome',
            description : 'descricao',
            creatorid : 'creator',
            creatornick : 'creatorNick',
            creatorsufix : 'creatorSufix',
            createSheet : 'sheetCreator',
            editSheet : "sheetEditor",
            deleteSheet : 'sheetDeleter',
            createRoom : 'storyteller',
            invite : 'inviter',
            promote : 'promoter',
            storyteller : 'storyteller'
        };
        var i;
        for (i in attributes) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[i] = json[attributes[i]];
            }
        }
        if (typeof json.salas !== 'undefined') {
            this.rooms = [];
            for (i = 0; i < json.salas.length; i++) {
                this.rooms.push(json.salas[i].id);
                json.salas[i].gameid = this.id;
            }
            window.app.roomdb.updateFromJSON(json.salas);
            
            if (this.rooms.length > 0) {
                var sortFunction = window.app.emulateBind(function (a, b) {
                    var oa = this.roomdb.getRoom(a);
                    var ob = this.roomdb.getRoom(b);
                    if (oa.name < ob.name)
                        return -1;
                    if (oa.name > ob.name)
                        return 1;
                    return 0;
                }, {roomdb : window.app.roomdb});
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
                var sortFunction = window.app.emulateBind(function (a, b) {
                    var oa = this.sheetdb.getSheet(a);
                    var ob = this.sheetdb.getSheet(b);
                    if (oa.name < ob.name)
                        return -1;
                    if (oa.name > ob.name)
                        return 1;
                    return 0;
                }, {sheetdb : window.app.sheetdb});
                this.sheets.sort(sortFunction);
            }
        }
    };
}