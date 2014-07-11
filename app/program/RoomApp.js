function RoomApp () {
    this.createRoom = function (obj, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'CreateRoom',
            data: obj,
            success: cbs,
            error: cbe
        });
    };
    
    this.deleteRoom = function (roomid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'DeleteRoom',
            data : {'id' : roomid},
            success: cbs,
            error: cbe
        });
    };
}