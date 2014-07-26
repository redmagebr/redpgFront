function SheetApp () {
    this.loadStyle = function (styleid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'StyleRequest',
            dataType : 'script',
            data : {id : styleid},
            success: cbs,
            error: cbe
        });
    };
    
    this.loadSheet = function (sheetid, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            window.app.sheetdb.updateFromJSON(data);
            this.cbs(data);
        }, {cbs : cbs});
        
        ajax.requestPage({
            url : 'SheetRequest',
            data : {id : sheetid},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendSheet = function (sheetid, name, values, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'SheetUpdate',
            data : {id : sheetid, values : values, name : name},
            success: cbs,
            error: cbe
        });
    };
    
    
    
    
    
    this.callList = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'SheetList',
            success: cbs,
            error: cbe
        });
    };
    
    this.callCreation = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'StyleList',
            data: {id : gameid},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendDelete = function (sheetid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'SheetCreateDelete',
            data: {id : sheetid},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendCreation = function (gameid, sheetname, idstyle, publica, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'SheetCreateDelete',
            data: {gameid : gameid, name : sheetname, idstyle : idstyle, publica : publica},
            success: cbs,
            error: cbe
        });
    };
    
    this.callPermissions = function (id, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'SheetList',
            data : {id : id},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendPrivileges = function (idsheet, permissions, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'SheetUpdatePrivileges',
            data : {id : idsheet, privileges : permissions},
            success: cbs,
            error: cbe
        });
    };
}