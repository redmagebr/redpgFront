function GameApp () {
    this.updateLists = function (cbs, cbe) {
        cbs = window.app.emulateBind(function (data) {
            window.app.gamedb.updateFromJSON(data, true);
            this.cbs();
        }, {cbs : cbs});
        
        var ajaxObj = {
            url : 'Game',
            dataType : 'json',
            data : {action : 'list'},
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.createGame = function (obj, cbs, cbe) {
        obj.action = 'create';
        var ajaxObj = {
            url : 'Game',
            data : obj,
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage(ajaxObj);
    };
    
    this.editGame = function (obj, cbs, cbe) {
        obj.action = 'edit';
        var ajaxObj = {
            url : 'Game',
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
        
        data.action = 'send';
        
        var ajaxObj = {
            url : 'Invite',
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
            url : 'Invite',
            dataType : 'json',
            data : {action : 'list'},
            success: cbs,
            error: cbe
        });
    };
    
    this.acceptInvite = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Invite',
            data : {'gameid' : gameid, action : 'accept'},
            success: cbs,
            error: cbe
        });
    };
    
    this.rejectInvite = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Invite',
            data : {'gameid' : gameid, action : 'reject'},
            success: cbs,
            error: cbe
        });
    };
    
    this.deleteGame = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Game',
            data : {'id' : gameid, action : 'delete'},
            success: cbs,
            error: cbe
        });
    };
    
    this.getPrivileges = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Game',
            data : {'id' : gameid, action : 'privileges'},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendPrivileges = function (gameid, permissions, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Game',
            data : {id : gameid, privileges : permissions, action : 'setPrivileges'},
            success: cbs,
            error: cbe
        });
    };
}