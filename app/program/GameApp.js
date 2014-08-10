function GameApp () {
    this.updateLists = function (cbs, cbe) {
        cbs = window.app.emulateBind(function (data) {
            window.app.gamedb.updateFromJSON(data, true);
            this.cbs();
        }, {cbs : cbs});
        
        var ajaxObj = {
            url : 'GameList',
            dataType : 'json',
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.createGame = function (obj, cbs, cbe) {
        var ajaxObj = {
            url : 'CreateGame',
            data : obj,
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage(ajaxObj);
    };
    
    this.editGame = function (obj, cbs, cbe) {
        var ajaxObj = {
            url : 'EditGame',
            data : obj,
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage(ajaxObj);
    };
    
    this.createRoom = function (room, game, cbs, cbe) {
        var ajaxObj = {
            url : 'CreateRoom',
            data : obj,
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage(ajaxObj);
    };
    
    this.sendInvite = function (gameid, nickname, nicksufix, message, cbs, cbe) {
        var validator = new Validator();
        if (!validator.validate(nickname, 'nickname') || !validator.validate(nicksufix, 'nicksufix')) {
            cbe({status : 404});
            return false;
        }
        
        var data = {
            gameid : gameid,
            nickname : nickname,
            nicksufix : nicksufix
        };
        
        if (message !== '') {
            data.message = message;
        }
        
        var ajaxObj = {
            url : 'SendInvite',
            data : data,
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage(ajaxObj);
    };
    
    this.getInvites = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'InviteList',
            dataType : 'json',
            success: cbs,
            error: cbe
        });
    };
    
    this.acceptInvite = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'InviteAccept',
            data : {'gameid' : gameid},
            success: cbs,
            error: cbe
        });
    };
    
    this.rejectInvite = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'InviteReject',
            data : {'gameid' : gameid},
            success: cbs,
            error: cbe
        });
    };
    
    this.deleteGame = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'DeleteGame',
            data : {'id' : gameid},
            success: cbs,
            error: cbe
        });
    };
}