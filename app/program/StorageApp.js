/**
 * 
 * @param {Application} app
 * @returns {StorageApp}
 */
function StorageApp (app) {
    this.app = app;
    
    this.updateStorage = function (id, cbs, cbe) {
        cbs = this.app.emulateBind(function (data) {
            var obj = {};
            obj[this.id] = data;
            window.app.storage.updateFromJSON(obj);
            this.cbs(data);
        }, {id : id, cbs : cbs});
        
        var ajax = new AjaxController();
        ajax.requestPage({
            url : 'Storage',
            dataType : 'json',
            data : {action : 'restore', id : id},
            success : cbs,
            error: cbe
        });
    };
    
    this.sendStorage = function (id, cbs, cbe) {
        var ajax = new AjaxController();
        ajax.requestPage({
            url : 'Storage',
            dataType : 'json',
            data : {action : 'store', id : id, storage : this.app.storage.get(id)},
            success : cbs,
            error: cbe
        });
    };
}