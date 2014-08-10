function WsController () {
    this.connected = false;
    this.websocket = null;
    
    this.connect = function (url, onopen, onclose, onmessage, onerror) {
        if (this.connected) {
            return false;
        }
        url = window.app.wshost + url;
        if (window.app.loginapp.hasJsessid()) {
            url = url + ';jsessionid=' + window.app.loginapp.getJsessid();
        }
        this.websocket = new WebSocket(url);
        this.connected = true;
        
        this.websocket.onopen = onopen;
        this.websocket.onmessage = onmessage;
        this.websocket.onerror = onerror;
        
        this.websocket.onclose = window.app.emulateBind(function (event) {
            this.controller.connected = false;
            this.controller.websocket = null;
            this.onclose(event);
        }, {onclose : onclose, controller : this});
        
    };
    
    this.newConnection = function () {
        this.connected = false;
        this.websocket = null;
    };
    
    this.sendMessage = function (action, message) {
        if (!this.connected) {
            return false;
        }
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        this.websocket.send(action + ';' + message);
        return true;
    };
    
    this.sendAck = function () {
        if (!this.connected) {
            return false;
        }
        this.websocket.send("0");
        return true;
    };
    
    this.closeConnection = function () {
        this.websocket.close();
        this.connected = false;
        this.websocket = null;
    };
}