function RoomApp () {
    this.createRoom = function (obj, cbs, cbe) {
        var ajax = new AjaxController();
        obj.action = 'create';
        ajax.requestPage({
            url : 'Room',
            data: obj,
            success: cbs,
            error: cbe
        });
    };
    
    this.deleteRoom = function (roomid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Room',
            data : {'id' : roomid, action : 'delete'},
            success: cbs,
            error: cbe
        });
    };
}