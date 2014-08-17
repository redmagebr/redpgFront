function SheetApp () {
    this.loadStyle = function (styleid, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            eval(data);
            this.cbs();
        }, {cbs:cbs});
        
        ajax.requestPage({
            url : 'Style',
            dataType : 'text',
            data : {id : styleid, action : 'request'},
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
            url : 'Sheet',
            data : {id : sheetid, action : 'request'},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendSheet = function (sheetid, name, values, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Sheet',
            data : {id : sheetid, values : values, name : name, action : "update"},
            success: cbs,
            error: cbe
        });
    };
    
    
    
    
    
    this.callList = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Sheet',
            data : {action : 'list'},
            success: cbs,
            error: cbe
        });
    };
    
    this.callCreation = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Style',
            data: {id : gameid, action : 'list'},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendDelete = function (sheetid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Sheet',
            data: {id : sheetid, action : 'delete'},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendCreation = function (gameid, sheetname, idstyle, publica, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Sheet',
            data: {gameid : gameid, name : sheetname, idstyle : idstyle, publica : publica, action : 'create'},
            success: cbs,
            error: cbe
        });
    };
    
    this.callPermissions = function (id, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Sheet',
            data : {id : id, action : 'listPerm'},
            success: cbs,
            error: cbe
        });
    };
    
    this.sendPrivileges = function (idsheet, permissions, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Sheet',
            data : {id : idsheet, privileges : permissions, action : 'updatePerm'},
            success: cbs,
            error: cbe
        });
    };
}