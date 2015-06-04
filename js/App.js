/** 
 * @param {boolean} debug
 * @class Application
 * @constructor
 * @requires UI
 */
function Application (debug) {
    /**
     * Major, Minor, Release
     * Major covers breakpoints.
     * Minor covers new functions.
     * Release covers bugfixes only.
     */
    this.version = [0, 54, 5];
    
    if (typeof debug === 'undefined' || debug) {
        this.debug = true;
    } else {
        this.debug = false;
        console.log = function () {};
    }
    
    /**
     * Is it Chrome?
     */
    this.isChrome = function () {
        return Boolean(window.chrome);
    };
    
    /**
     * Host must point to the server we're using.
     * It will be prepended to every AJAX url.
     */
    this.host = 'http://app.redpg.com.br/service/';
    this.staticHost = 'http://app.redpg.com.br/';
    this.imageHost = 'http://img.redpg.com.br/';
    this.wshostServer = 'ws://app.redpg.com.br';
    this.wshostContext = '/service/';
    this.wsHostPorts = [80, 8080, 8081];
    this.wshost = this.wshostServer + ':' + this.wsHostPorts[0] + this.wshostContext;
    
    /**
     * BETA
     */
//    this.host = 'http://app.redpg.com.br:8081/serviceBeta/';
//    this.wsHostPorts = [8081];
//    this.wshostContext = '/serviceBeta/';
    
    /**
     * Settings
     */
    this.config = new Config2();
    
    /**
     * Databases
     */
    this.storage = new Storage(this);
    this.sheetdb = new SheetDB();
    this.gamedb = new GameDB();
    this.roomdb = new RoomDB();
    this.userdb = new UserDB();
    this.sheetdb = new SheetDB();
    this.styledb = new StyleDB();
    this.imagedb = new ImageDB(this);
    this.memory = new Memory();
    
    /**
     * Apps
     */
    this.loginapp = new LoginApp();
    this.gameapp = new GameApp();
    this.roomapp = new RoomApp();
    this.chatapp = new ChatWsApp();
    this.sheetapp = new SheetApp();
    this.addonapp = new AddonApp();
    this.imageapp = new ImageApp();
    this.storageapp = new StorageApp(this);
    
    this.ui = new UI();
    
    this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
    };
    
    window.onbeforeunload = function (e) {
        if (window.app.ui.chat.cc.room === null) {
            var count = 0;
            for (var i in window.app.ui.sheetui.controller.$listed) {
                count++;
                break;
            }
            if (count < 1) {
                return null;
            }
        }
        var e = e || window.event;
        var msg = window.app.ui.language.getLingo("_LEAVING_");

        // For IE and Firefox
        if (e) {
            e.returnValue = msg;
        }

        // For Safari / chrome
        return msg;
    };
    
    this.init = function () {
        this.config.registerConfig('wsPort', this);
        
        this.memory.init();
        this.ui.init();
    };
    
    this.configChanged = function (id) {
        if (id === 'wsPort') {
            this.wshost = this.wshostServer + ':' + this.config.get("wsPort") + this.wshostContext;
        }
    };
    
    this.configValidation = function (id) {
        if (id === 'wsPort') {
            return (this.wsHostPorts.indexOf(this.config.get("wsPort")) !== -1);
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'wsPort') return this.wsHostPorts[0];
    };
} 
 
(function addXhrProgressEvent($) {
    var originalXhr = $.ajaxSettings.xhr;
    $.ajaxSetup({
        xhr: function() {
            var req = originalXhr(), that = this;
            if (req) {
                if (that.progress !== undefined) {
                    req.onprogress = that.progress;
                }
                if (typeof req.upload == "object" && that.progressUpload !== undefined) {
                    req.upload.onprogress = that.progressUpload;
                }
            }
            return req;
        }
    });
})(jQuery);

/**
 * @constructor
 * @returns {AjaxController}
 */
function AjaxController () {
    this.addSession = function (url) {
        if (window.app.loginapp.hasJsessid()) {
            url = url + ';jsessionid=' + window.app.loginapp.getJsessid();
        }
        return url;
    };
    
    this.requestPage = function (object) {
        object.crossDomain = true;
        
        
        if (object.url.indexOf('://') === -1) {
            object.url = window.app.host + object.url;
            object.url = this.addSession(object.url);
        }
        
        
        console.log("Ajax request for: " + object.url);
        
        
        if (typeof object.data !== 'undefined') {
            object.type = 'POST';
            if (!(object.data instanceof FormData)) {
                for (var i in object.data) {
                    if (typeof object.data[i] === 'object' || typeof object.data[i] === 'array') {
                        object.data[i] = JSON.stringify(object.data[i]);
                    }
                    // null gets turned into "null" on the form and that fucks things up.
                    if (object.data[i] === null) {
                        delete object.data[i];
                    }
                }
                console.log("Ajax request includes data:");
                console.log(object.data);
            } else {
                console.log("Ajax request includes FormData:");
                console.log(object.data);
                object.contentType = false;
                object.processData = false;
            }
        }
        
        if (typeof object.timeout === 'undefined') {
            object.timeout = 30000;
        } 
        
        $.ajax(object).done(function( data ) {
            if (typeof data === 'string')
                console.log( "Ajax request done. Sample of data:", data.slice( 0, 100 ) );
            else if (typeof data === 'object') {
                console.log("Ajax request done. Object received:");
                console.log(data);
            }
        }).error(function (data) {
            console.log("Ajax request resulted in error. Data:");
            console.log(data);
            if (data.status === 401) {
                window.app.loginapp.checkLogin();
            }
        });
    };
} 
 
function ChangelogAjax () {
    this.updateChangelog = function () {
        var ajax = new AjaxController();
        ajax.requestPage({
            url: window.app.staticHost + 'Changelog.html',
            dataType: 'html',
            success : function (data) {
                window.app.ui.changelogui.processUpdate(data);
            },
            error : function (data) {
                window.app.ui.changelogui.processError(data);
            }
        });
    };
    
    this.getFullLog = function () {
        var ajax = new AjaxController();
        ajax.requestPage({
            url: window.app.staticHost + 'app/ChangelogOld.html',
            dataType: 'html',
            success : function (data) {
                window.app.ui.changelogui.attach(data);
            },
            error : function (data) {
                window.app.ui.changelogui.attachError(data);
            }
        });
    };
} 
 
function ImageAjax () {
    this.grabLinks = function (url, folder, cbs, cbe) {
        if (url.indexOf('dropbox.com') !== -1) {
            return this.grabDropboxLinks(url, folder, cbs, cbe);
        }
        
        return this.grabIndexedLinks(url, folder, cbs, cbe);
    };
    
    this.grabIndexedLinks = function (url, folder, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            var url = this.url;
            if (url.charAt(url.length - 1) !== '/') {
                url = url + '/';
            }
            
            var $data = $(data).find('a[href]');
            var found = [];
            var $el;
            var link;
            var at;
            for (var i = 0; i < $data.length; i++) {
                $el = $($data[i]);
                link = $el.attr('href');
                if (link.indexOf('://') === -1) {
                    link = url + link;
                }
                if (found.indexOf(link) === -1) found.push(link);
            }
            
            console.log(found);
            
            var images = [];
            var extensions = ['JPG','JPEG','PNG','GIF','BMP'];
            var image;
            var ext;
            for (var i = 0; i < found.length; i++) {
                image = new Image_Link();
                image.url = found[i];
                image.name = decodeURI(found[i]).substring(found[i].lastIndexOf('/')+1);
                if (image.name.trim() === '') continue;
                ext = image.name.substring(image.name.lastIndexOf('.')+1);
                if (extensions.indexOf(ext.toUpperCase()) === -1) continue;
                image.name = image.name.substring(0, image.name.lastIndexOf('.'));
                image.folder = folder;
                image.id = window.app.imagedb.getFakeId();
                window.app.imagedb.addImage(image);
                window.app.imagedb.saveToStorage();
            }
            this.cbs();
        }, {cbs : cbs, url : url});
        
        ajax.requestPage({
            url : url,
            dataType : 'html',
            success : cbs,
            error: cbe
        });
    };
    
    this.grabDropboxLinks = function (url, folder, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            var $data = $(data).find('a.thumb-link');
            var found = [];
            var $el;
            var link;
            for (var i = 0; i < $data.length; i++) {
                $el = $($data[i]);
                link = $el.attr('href');
                link = window.app.imageapp.prepareUrl(link);
                if (found.indexOf(link) === -1) found.push(link);
            }
            
            var images = [];
            var extensions = ['JPG','JPEG','PNG','GIF','BMP'];
            var image;
            var ext;
            for (var i = 0; i < found.length; i++) {
                image = new Image_Link();
                image.url = found[i];
                image.name = decodeURI(found[i]).substring(found[i].lastIndexOf('/')+1);
                if (image.name.trim() === '') continue;
                ext = image.name.substring(image.name.lastIndexOf('.')+1);
                if (extensions.indexOf(ext.toUpperCase()) === -1) continue;
                image.name = image.name.substring(0, image.name.lastIndexOf('.'));
                image.folder = folder;
                image.id = window.app.imagedb.getFakeId();
                window.app.imagedb.addImage(image);
                window.app.imagedb.saveToStorage();
            }
            this.cbs();
        }, {cbs : cbs});
        
        ajax.requestPage({
            url : url,
            dataType : 'html',
            success : cbs,
            error: cbe
        });
    };
} 
 
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
 
function CacheDB () {
    this.games = new GameDB();
    this.rooms = new RoomDB();
    
    this.emptyCache = function () {
        this.users.empty();
        this.games.empty();
        this.rooms.empty();
    };
    
    this.updateFromJSON = function (json) {
        if (typeof json.games === 'array') {
            this.games.updateFromJSON[json.games];
        }
        if (typeof json.rooms === 'array') {
            this.rooms.updateFromJSON[json.rooms];
        }
    };
    
    this.getUser = function (id) {
        return this.users.getUser(id);
    };
    
    this.getGame = function (id) {
        return this.games.getGame(id);
    };
    
    this.rooms = function (id) {
        return this.rooms.getRoom(id);
    };
} 
 
function Config2 () {
    this.maxId = 20;
    this.maxLength = 1024; // This means 1024 characters, so at least 1kb and up to 8kb on UTF-8.
    this.maxLength = 102400; // Temporary solution to those holding Sounds
    
    this.config = {};
    this.registeredConfig = {};
    this.listeners = {};
    
    this.empty = function () {
        for (var id in this.config) {
            this.config[id] = this.registeredConfig[id].configDefault(id);
            this.registeredConfig[id].configChanged(id);
        }
    };
    
    this.get = function (id) {
        if (this.config[id] === undefined) {
            console.log("Failed attempt to get an unregistered Config at " + id);
            return null;
        }
        
        return this.config[id];
    };
    
    this.registerConfig = function (id, object) {
        if (typeof id !== 'string' || typeof object !== 'object' || 
                typeof object.configChanged !== 'function' || typeof object.configValidation !== 'function' ||
                typeof object.configDefault !== 'function') {
            console.log("Failed attempt to register Config, id and object:");
            console.log(id);
            console.log(object);
            return false;
        }
        
        if (this.config[id] !== undefined) {
            console.log("Failed attempt to overwrite Config registration on \"" + id + "\", object:");
            console.log(object);
            console.log("Config was already registered by:");
            console.log(this.registeredConfig[id]);
            return false;
        }
        
        if (id.length > this.maxId) {
            console.log("Failed attempt to register Config at \"" + id +"\". Ids can only be " + this.maxId + " characters long. Offending object:");
            console.log(object);
            return false;
        }
        
        this.config[id] = object.configDefault(id);
        this.registeredConfig[id] = object;
        return true;
    };
    
    this.store = function (id, value) {
        if (typeof id !== 'string') {
            console.log("Attempt to store a value to a Config ID which wasn't a string:");
            console.log(id);
            console.log(value);
            return false;
        }
        
        if (this.config[id] === undefined) {
            console.log("Attempt to store a value to an unregistered Config at " + id);
            console.log(value);
            return false;
        }
        
        if (value === null) {
            this.config[id] = this.registerConfig()[id].configDefault(id);
            this.registeredConfig[id].configChanged(id);
            return true;
        }
        
        // Is it valid? can we clean it?
        if (!this.registeredConfig[id].configValidation(id, value)) {
            console.log("Attempt to store invalid values to Config " + id + ", object:");
            console.log(value);
            if (typeof this.registeredConfig[id].configClean === 'function') {
                value = this.registeredConfig[id].configClean(id, value);
                if (!this.registeredConfig[id].configValidation(id, value)) {
                    return false;
                }
            } else {
                return false;
            }
        }
        
        var old = this.config[id];
        this.config[id] = value;
        
        if (typeof old !== typeof value
                || ((typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') && value !== old)) {
            this.registeredConfig[id].configChanged(id);
        } else if (!(typeof value === 'string' || typeof value === 'number') || typeof value === 'boolean') {
            this.registeredConfig[id].configChanged(id);
        }
        
        if (this.listeners[id] !== undefined) {
            for (var i = 0; i < this.listeners[id].length; i++) {
                this.listeners[id][i].configChanged(id);
            }
        }
        return;
    };
    
    this.updateFromJSON = function (json) {
        this.empty();
        for (var id in json) {
            this.store(id, json[id]);
        }
    };
    
    this.sendToServer = function (cbs, cbe) {
        var ajax = new AjaxController();
        ajax.requestPage({
            url : 'Account',
            data: {
                action : 'StoreConfig',
                config : this.config
            },
            success: cbs,
            error: cbe
        });
    };
    
    this.addListener = function (id, object) {
        if (typeof id !== 'string') {
            console.log("FAILED ATTEMPT TO ADD LISTENER TO NON-STRING ID. ID AND OFFENDER:");
            console.log(id);
            console.log(object);
            return false;
        }
        
        if (typeof object !== 'object' || typeof object.configChanged !== 'function') {
            console.log("FAILED ATTEMPT TO ADD LISTENER TO BAD OBJECT ON " + id + ". OFFENDER:");
            console.log(object);
            return false;
        }
        
        if (this.listeners[id] === undefined) this.listeners[id] = [];
        this.listeners[id].push(object);
        return true;
    };
} 
 
function ConfigDB () {
    this.config = {};
    this.changed = false;
    
    this.empty = function () {
        this.config = {};
        window.app.updateConfig();
    };
    
    this.updateFromJSON = function (json) {
        this.config = {};
        for (var i in json) {
            this.store(i, json[i]);
        }
        this.changed = false;
        window.app.updateConfig();
    };
    
    this.store = function (index, value) {
        if (typeof this.config[index] === 'undefined' || this.config[index] !== value) {
            this.changed = true;
        }
        this.config[index] = value;
        
        if (this.config[index] === null) {
            delete this.config[index];
        }
    };
    
    this.get = function (index, defaultValue) {
        if (typeof this.config[index] === 'undefined') {
            this.store(index, defaultValue);
            return defaultValue;
        }
        return this.config[index];
    };
    
    this.sendToServer = function (cbs, cbe) {
        var ajax = new AjaxController();
        ajax.requestPage({
            url : 'Account',
            data: {
                action : 'StoreConfig',
                config : this.config
            },
            success: cbs,
            error: cbe
        });
    };
} 
 
function GameDB () {
    this.games = {};
    this.gamelist = [];
    
    this.empty = function () {
        this.games = {};
    };
    
    /**
     * 
     * @param {Number} id
     * @returns {Game}
     */
    this.getGame = function (id) {
        if (typeof this.games[id] !== 'undefined') {
            return this.games[id];
        }
        return null;
    };
    
    this.updateFromJSON = function (json, cleanup) {
        if (typeof cleanup === 'undefined') cleanup = false;
        var ids = [];
        for (var i = 0; i < json.length; i++) {
            if (typeof this.games[json[i].id] === 'undefined') {
                this.games[json[i].id] = new Game();
                this.gamelist.push(json[i].id);
            }
            this.games[json[i].id].updateFromJSON(json[i]);
            ids.push(this.games[json[i].id].id);
        }
        if (cleanup) {
            this.gamelist = ids;
        }
        if (json.length > 0) {
            var sortFunction = function (a, b) {
                var oa = window.app.gamedb.getGame(a);
                var ob = window.app.gamedb.getGame(b);
                if (oa.name < ob.name)
                    return -1;
                if (oa.name > ob.name)
                    return 1;
                return 0;
            };
            this.gamelist.sort(sortFunction);
        }
    };
} 
 
/**
 * 
 * @param {Application} app
 * @returns {ImageDB}
 */
function ImageDB (app) {
    this.app = app;
    
    this.storageId = 'images';
    
    this.$trigger = $('#pictureTrigger');
    
    this.images = {};
    this.imagesOrdered = [];
    this.changedStorage = false;
    
    this.empty = function () {
        this.images = {};
        this.imagesOrdered = [];
    };
    
    this.fakeId = 0;
    
    this.listeners = [];
    
    this.addListener = function (handler) {
    	this.listeners.push(handler);
    };
    
    this.removeListener = function (handler) {
    	this.listeners.splice(this.listeners.indexOf(handler), 1);
    };
    
    this.triggerListeners = function () {
    	for (var i = 0; i < this.listeners.length; i++) {
    		try {
    			this.listeners[i].handleEvent();
    		} catch (e) {}
    	}
    };
    
    
    /**
     * 
     * @param {number} id
     * @returns {Image|Image_Link}
     */
    this.getImage = function (id) {
        if (typeof this.images[id] !== 'undefined') {
            return this.images[id];
        }
        return null;
    };
    
    this.deleteImage = function (id) {
        if (typeof this.images[id] !== 'undefined') {
            this.imagesOrdered.splice(this.imagesOrdered.indexOf(this.images[id]), 1);
            delete this.images[id];
            return true;
        }
        return false;
    };
    
    
    this.updateFromJSON = function (json, clean) {
        if (clean) this.empty();
        for (var i = 0; i < json.length; i++) {
            if (json[i].id === undefined) json[i].id = json[i].uuid;
            if (typeof this.images[json[i].id] === 'undefined') {
                if (json[i].id < 0) {
                    this.images[json[i].id] = new Image_Link();
                    this.imagesOrdered.push(this.images[json[i].id]);
                } else {
                    this.images[json[i].id] = new Image();
                    this.imagesOrdered.push(this.images[json[i].id]);
                }
            }
            if (json[i].id < this.fakeId) {
                this.fakeId = json[i].id;
            }
            this.images[json[i].id].updateFromJSON(json[i]);
        }
        
        this.sort();
        this.$trigger.trigger('loaded').off('loaded');
        this.triggerListeners();
    };
    
    this.sort = function () {
        this.imagesOrdered.sort(function (a,b) {
            var fa = a.folder.toUpperCase();
            var fb = b.folder.toUpperCase();
            if (fa < fb) return -1;
            if (fa > fb) return 1;
            var na = a.name.toUpperCase();
            var nb = b.name.toUpperCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
            return 0;
        });
    };
    
    /**
     * 
     * @param {Image|Image_Link} image
     * @returns {undefined}
     */
    this.addImage = function (image) {
        if (this.images[image.id] !== undefined) {
            this.imagesOrdered.splice(this.imagesOrdered.indexOf(this.images[image.id], 1));
            delete this.images[image.id];
        }
        this.images[image.id] = image;
        this.imagesOrdered.push(image);
        this.sort();
    };
    
    this.getFakeId = function () {
        return --this.fakeId;
    };
    
    this.createLink = function () {
        var image = new Image_Link();
        image.id = this.getFakeId();
        return image;
    };
    
    this.updateStorage = function (cbs, cbe) {
        this.app.storageapp.updateStorage(this.storageId, cbs, cbe);
    };
    
    this.saveStorage = function (cbs, cbe) {
        this.app.storageapp.sendStorage(this.storageId, cbs, cbe);
    };
    
    this.saveToStorage = function () {
        var fakeImages = [];
        //var attr = ['id', 'name', 'url', 'folder'];
        for (var id in this.images) {
            if (!(parseInt(id) < 0)) continue;
            fakeImages.push({
                id : this.images[id].id,
                name : this.images[id].name,
                url : this.images[id].url,
                folder : this.images[id].folder
            });
        }
        this.app.storage.store(this.storageId, fakeImages);
    };
    
    /**
     * Storage Requester Interface
     */
    
    /**
     * 
     * @returns {undefined}
     */
    this.storageChanged = function () {
        for (var id in this.images) {
            if (isNaN(id, 10) || parseInt(id) > 0) continue;
            console.log("Deleting " + id);
            this.deleteImage(id);
        }
        this.updateFromJSON(this.app.storage.get(this.storageId));
        this.changedStorage = true;
    };
    
    this.storageDefault = function () {
        return [];
    };
    
    this.storageValidation = function (list) {
        if (!(list instanceof Array)) return false;
        var attr = ['id', 'name', 'url', 'folder'];
        var types = ['number', 'string', 'string', 'string'];
        for (var i = 0; i < list.length; i++) {
            if (typeof list[i] !== 'object') return false;
            for (var id in list[i]) {
                if (attr.indexOf(id) === -1) return false;
                if (typeof list[i][id] !== types[attr.indexOf(id)]) return false;
            }
        }
        return true;
    };
    
    /**
     * Register itself as storage
     */
    this.app.storage.registerStorage(this.storageId, this);
} 
 
function RoomDB () {
    this.rooms = {};
    
    this.empty = function () {
        this.rooms = {};
    };
    
    /**
     * 
     * @param {type} id
     * @returns {Room}
     */
    this.getRoom = function (id) {
        if (typeof this.rooms[id] !== 'undefined') {
            return this.rooms[id];
        }
        return null;
    };
    
    this.updateFromJSON = function (json) {
        for (var i = 0; i < json.length; i++) {
            if (typeof this.rooms[json[i].id] === 'undefined') {
                this.rooms[json[i].id] = new Room();
            }
            this.rooms[json[i].id].updateFromJSON(json[i]);
        }
    };
} 
 
function SheetDB () {
    this.sheets = {};
    
    this.empty = function () {
        this.sheets = {};
    };
    
    /**
     * 
     * @param {int} id
     * @returns {Sheet_Instance}
     */
    this.getSheet = function (id) {
        if (typeof this.sheets[id] !== 'undefined') {
            return this.sheets[id];
        }
        return null;
    };
    
    this.deleteSheet = function (id) {
        if (typeof this.sheets[id] !== 'undefined') {
            delete this.sheets[id];
            return true;
        }
        return false;
    };
    
    
    this.updateFromJSON = function (json, clean) {
        if (clean === undefined) var clean = false;
        if (clean) {
            this.empty();
        }
        for (var i = 0; i < json.length; i++) {
            if (typeof this.sheets[json[i].id] === 'undefined') {
                this.sheets[json[i].id] = new Sheet_Instance();
            }
            this.sheets[json[i].id].updateFromJSON(json[i]);
        }
    };
    
    this.isLoaded = function (id) {
        var sheet = this.getSheet(id);
        return (sheet !== null) && (sheet.values !== null);
    };
} 
 
function Storage (app) {
    this.app = app;
    
    this.maxId = 20;
    this.maxLength = 60000;
    
    this.storage = {};
    this.registeredStorage = {};
    
    this.empty = function () {
        for (var id in this.storage) {
            this.storage[id] = this.registeredStorage[id].storageDefault();
            this.registeredStorage[id].storageChanged();
        }
    };
    
    this.get = function (id) {
        if (this.storage[id] === undefined) {
            console.log("Failed attempt to get an unregistered Storage at " + id);
            return null;
        }
        
        return this.storage[id];
    };
    
    /**
     * Register a storage space to an object
     * @param {string} id
     * @param {object} object
     * @returns {Boolean}
     */
    this.registerStorage = function (id, object) {
        if (typeof id !== 'string' || typeof object !== 'object' || 
                typeof object.storageChanged !== 'function' || typeof object.storageValidation !== 'function' ||
                typeof object.storageDefault !== 'function') {
            console.log("Failed attempt to register Storage, id and object:");
            console.log(id);
            console.log(object);
            return false;
        }
        if (this.storage[id] !== undefined) {
            console.log("Failed attempt to overwrite Storage registration on \"" + id + "\", object:");
            console.log(object);
            console.log("Storage was already registered by:");
            console.log(this.registeredStorage[id]);
            return false;
        }
        if (id.length > this.maxId) {
            console.log("Failed attempt to register Storage at \"" + id +"\". Ids can only be " + this.maxId + " characters long. Offending object:");
            console.log(object);
            return false;
        }
        
        this.storage[id] = object.storageDefault();
        this.registeredStorage[id] = object;
        return true;
    };
    
    this.store = function (id, value) {
        if (typeof id !== 'string') {
            console.log("Attempt to store a value to an Storage id which wasn't a string:");
            console.log(id);
            console.log(value);
            return false;
        }
        
        if (this.storage[id] === undefined) {
            console.log("Attempt to store a value to an unregistered storage at " + id);
            console.log(value);
            return false;
        }
        
        if (value === null) {
            this.storage[id] = this.registeredStorage[id].storageDefault();
            this.registeredStorage[id].storageChanged();
            return true;
        }
        
        // Is it valid? can we clean it?
        if (!this.registeredStorage[id].storageValidation(value)) {
            console.log("Attempt to store invalid values to Storage: " + id + ", object:");
            console.log(value);
            if (typeof this.registeredStorage[id].storageClean === 'function') {
                value = this.registeredStorage[id].storageClean(value);
                if (!this.registeredStorage[id].storageValidation(value)) {
                    return false;
                }
            } else {
                return false;
            }
        }
        
        this.storage[id] = value;
        this.registeredStorage[id].storageChanged();
    };
    
    this.updateFromJSON = function (json) {
        for (var id in json) {
            this.store(id, json[id]);
        }
    };
}

/**
 * Storage Requester Interface
 * 
 * this.storageDefault () - returns an appropriate value to this storage
 * this.storageChanged () - undefined, called when the value stored is changed
 * this.storageValidation (value) - boolean, called before storing a new value to see if it's valid
 * this.storageClean (value) - returns an appropriate value to this storage, optional, called when the storageValidation fails, can be used to prune bad values and reuse what's left
 * 
 * Must call window.app.storage.registerStorage(id, this) to work
 */ 
 
function StyleDB () {
    this.styles = {};
    this.empty = function () {
        this.styles = {};
    };
    
    /**
     * 
     * @param {number} id
     * @returns {Style_Instance}
     */
    this.getStyle = function (id) {
        if (this.styles[id] !== undefined) {
            return this.styles[id];
        }
        return null;
    };
    
    /**
     * 
     * @param {type} id
     * @returns {Boolean}
     */
    this.deleteStyle = function (id) {
        if (this.styles[id] !== undefined ){
            delete this.styles[id];
            return true;
        }
        return false;
    };
    
    this.isLoaded = function (id) {
        var style = this.getStyle(id);
        return (style !== null && style.isLoaded());
    };
    
    this.updateFromJSON = function (json, clean) {
        if (clean === undefined) var clean = false;
        if (clean) {
            this.empty();
        }
        for (var i = 0; i < json.length; i++) {
            if (typeof this.styles[json[i].id] === 'undefined') {
                this.styles[json[i].id] = new Style_Instance();
            }
            this.styles[json[i].id].updateFromJSON(json[i]);
        }
    };
} 
 
function UserDB () {
    this.users = {};
    
    this.empty = function () {
        this.users = {};
    };
    
    this.export = function () {
        var result = [];
        for (var id in this.users) {
            result.push(this.users[id].export());
        }
        return result;
    };
    
    this.updateFromJSON = function (json) {
        for (var i = 0; i < json.length; i++) {
            if (typeof this.users[json[i].id] === 'undefined') {
                this.users[json[i].id] = new User ();
            }
            this.users[json[i].id].updateFromJSON(json[i]);
            console.log(this.users[json[i].id]);
        }
    };
    
    this.updateFromJSONObject = function (json) {
        for (var i in json) {
            if (typeof this.users[i] === 'undefined') {
                this.users[i] = new User();
            }
            this.users[i].updateFromJSON(json[i]);
        }
    };
    
    this.getUser = function (id) {
        if (typeof this.users[id] === 'undefined') {
            return null;
        }
        return this.users[id];
    };
} 
 
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
 
function Image () {
    this.id = null;
    /** @type String */ this.uuid;
    /** @type String */ this.name = '';
    /** @type String */ this.folder = '';
    /** @type number */ this.size;
    /** @type number */ this.uploader;
    
    this.updateFromJSON = function (json) {
        var attr = ['uuid', 'name', 'folder', 'size', 'uploader'];
        var index;
        for (var i = 0; i < attr.length; i++) {
            index = attr[i];
            if (typeof json[index] !== 'undefined') {
                this[index] = json[index];
            }
        }
    };
    
    this.getName = function () {
        return this.name;
    };
    
    this.getUrl = function () {
        return window.app.imageHost + this.uploader + '_' + this.uuid;
    };
    
    this.getId = function () {
        return this.uuid;
    };
    
    this.isLink = function () {
        return false;
    };
} 
 
function Image_Link () {
    this.id = null;
    this.name = null;
    this.url = null;
    this.folder = '';
    
    this.updateFromJSON = function (json) {
        var attributes = ['id', 'name', 'url', 'folder'];
        for (var i = 0; i < attributes.length; i++) {
            if (json[attributes[i]] !== undefined) {
                this[attributes[i]] = json[attributes[i]];
            }
        }
    };
    
    this.getName = function () {
        return this.name;
    };
    
    this.getUrl = function () {
        return this.url;
    };
    
    this.getId = function () {
        return this.id;
    };
    
    this.isLink = function () {
        return true;
    };
} 
 
function Invite () {
    this.gameid = null;
    this.gamename = "?";
    this.creatornick = "????????";
    this.creatornicksufix = "????";
    this.message = "";
    
    this.updateFromJSON = function (json) {
        var attributes = {
            gameid : 'id',
            gamename : 'name',
            creatornick : 'creatornick',
            creatornicksufix : 'creatornicksufix',
            message : 'MensagemConvite'
        };
        var i;
        for (i in attributes) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[i] = json[attributes[i]];
            }
        }
    };
} 
 
function Message () {
    /**
     * Message ID on a relational database
     * @type int
     */
    this.id = null;
    this.localid = null;
    this.roomid = null;
    this.timeout = null;
    
    this.room = null;
    
    /**
     * Actual message content.
     * @type String
     */
    this.msg = 'Undefined';
    
    /**
     * Holds any kind of special value the module had to store.
     * @type object
     */
    this.special = {};
    
    /**
     * Cloned messages do not get sent back to the sender.
     * If destination is an array, messages after the first one do not get sent back to the sender.
     */
    this.clone = false;
    
    /**
     * Sender ID in the relational database.
     * @type int
     */
    this.origin = null;
    
    
    
    /**
     * Receiver ID in the relational database.
     * If null the message was public.
     * @type int
     */
    this.destination = null;
    
    /**
     * ID String of the module which created the message.
     * @type String
     */
    this.module = null;
    
    
    this.onSaved = [];
    this.onError = [];
    
    this.date = '';
    
    this.isWhisp = function () {
        return (this.destination !== null && this.destination.length > 0);
    };
    
    this.export = function () {
        var result = {};
        var attributes = [
            'destination', 'id', 'module', 'msg', 'origin', 'roomid', 'date'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (this[attributes[i]] !== undefined && this[attributes[i]] !== null) {
                result[attributes[i]] = this[attributes[i]];
            }
        }
        
        result.special = JSON.stringify(this.special);
        return result;
    };
    
    this.updateFromJSON = function (json) {
        var attributes = [
            'destination', 'id', 'module', 'msg', 'origin', 'roomid', 'date'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[attributes[i]] = json[attributes[i]];
            }
        }
        
        if (typeof json.special !== 'undefined') {
            this.special = JSON.parse(json.special);
        }
        
        if (typeof json.localid !== 'undefined') {
            console.log("Running saved");
            console.log(this.onSaved);
            
            for (var i = 0; i < this.onSaved.length; i++) {
                this.onSaved[i](this);
            }
            
            if (this.timeout !== null) {
                window.clearTimeout(this.timeout);
                this.timeout = null;
            }
        }
    };
    
    this.getSpecial = function (index, defaultValue) {
        if (typeof this.special[index] !== 'undefined') {
            return this.special[index];
        } else {
            return defaultValue;
        }
    };
    
    this.setSpecial = function (index, value) {
        this.special[index] = value;
    };
    
    this.unsetSpecial = function (index) {
        delete this.special[index];
    },
    
    /**
     * Getters and Setters
     */
    
    this.setOrigin = function (id) {
        this.origin = id;
    };
    
    this.setDestination = function (id) {
        this.destination = id;
    };
    
    this.getOrigin = function () {
        return this.origin;
    };
    
    this.getDestination = function () {
        return this.destination;
    };
    
    this.setId = function (id) {
        this.id = id;
    };
    
    this.setMessage = function (msg) {
        this.msg = msg;
    };
    
    this.getId = function () {
        return this.id;
    };
    
    this.getMessage = function () {
        return this.msg;
    };
    
    this.bindSaved = function (func) {
        this.onSaved.push(func);
    };
    
    this.bindError = function (func) {
        this.onError.push(func);
    };
    
    /**
     * 
     * @returns {User}
     */
    this.getUser = function () {
        if (this.origin === null) {
            return null;
        }
        if (this.room === null) {
            return null;
        }
        
        return this.room.getUser(this.origin);
    };
    
    /**
     * 
     * @returns {User}
     */
    this.getDestinationUser = function () {
        if (this.destination === null) {
            return null;
        }
        if (this.room === null) {
            return null;
        }
        
        if (typeof this.destination === 'number')
            return this.room.getUser(this.destination);
        return this.room.getUser(this.destination[0]);
    };
    
    this.set$ = function ($obj) {
        $obj.addClass('sendInProgress');
        
        if (this.id !== null) {
            $obj.attr('data-msgid', this.id);
        }
        
        this.bindSaved(window.app.emulateBind(function () {
            this.$msg.attr('data-msgid', this.message.id);
            var $next = this.$msg.next();
            var $last = null;
            while ($next.length > 0) {
                if ($next.attr('data-msgid') === undefined || parseInt($next.attr('data-msgid')) < this.message.id) {
                    $last = $next;
                }
                $next = $next.next();
            }
            if ($last !== null) {
                this.$msg.insertAfter($last);
            }
        }, {$msg : $obj, message : this}));
        
        this.bindSaved(window.app.emulateBind(
            function () {
                $obj.removeClass('sendInProgress');
            }, {$msg : $obj}
        ));

        this.bindError(window.app.emulateBind(
            function() {
                this.$message.removeClass('sendInProgress');
                this.$message.addClass('sendError');

                var $resend = $('<a class="retry language" data-langhtml="_CHATRESEND_" />');
                $resend.bind('click', window.app.emulateBind(
                    function () {
                        window.app.chatapp.sendMessage(this.message);
                        this.$message.removeClass('sendError').addClass('sendInProgress');
                        this.$resend.remove();
                        this.message.setTimeout();
                    }, {message : this.message, $message : this.$message, $resend : $resend}
                ));

                window.app.ui.language.applyLanguageOn($resend);

                this.$message.append(' ');
                this.$message.append($resend);
            }, {$message : $obj, message : this}
        ));

        

        this.setTimeout();
    };
    
    this.setTimeout = function () {
        this.timeout = window.setTimeout(window.app.emulateBind(function () {
            var errors = this.message.onError;
            
            for (var i = 0; i < errors.length; i++) {
                errors[i]();
            }
        }, {message : this}), 15000);
    };
    
} 
 
function Room () {
    this.users = new UserDB();
    this.memory = new Room_Memory(this);
    this.gameid = null;
    this.id = null;
    this.name = null;
    this.creatorid = null;
    this.description = null;
    this.private = false;
    this.streamable = false;
    this.logger = false;
    this.pbp = false;
    this.lastWhisper = null;
    
    this.persona = null;
    this.hidePersona = false;
    this.avatar = null;
    
    this.messages = [];
    this.messageHash = {};
    this.localMessages = [];
    
    this.lastUserRefresh = 0;
    this.requiresUsers = true;
    
    this.empty = function () {
        this.messages = [];
        this.messageHash = {};
        this.localMessages = [];
    };
    
    this.isOwner = function () {
        return window.app.loginapp.user.id === this.creatorid;
    };
    
    this.addLocal = function (message) {
        message.localid = this.localMessages.push(message) - 1;
    };
    
    this.emptyLocal = function () {
        for (var i = 0; i < this.localMessages.length; i++) {
            this.localMessages[i].localid = null;
        }
        this.localMessages = [];
    };
    
    this.getLocal = function (id) {
        return this.localMessages[id];
    };
    
    this.updateFromJSON = function (json, chat) {
        console.log("Updating room from json");
        console.log(json);
        if (typeof chat === 'undefined') chat = false;
        var attributes = {
            pbp : 'playByPost',
            streamable : 'streamable',
            description : 'description',
            private : 'privateRoom',
            logger : 'logger',
            creatorid : 'creatorid',
            id : 'id',
            name :  'name',
            gameid :  'gameid'
        };
        var i;
        for (i in attributes) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[i] = json[attributes[i]];
            }
        }
        
        
        if (typeof json.messages !== 'undefined') {
            var message;
            for (var i = 0; i < json.messages.length; i++) {
                if (typeof this.messageHash[json.messages[i].id] === 'undefined') {
                    if (typeof json.messages[i].localid !== 'undefined' 
                            && typeof this.localMessages[json.messages[i].localid] !== 'undefined') {
                        message = this.localMessages[json.messages[i].localid];
                    } else {
                        message = new Message();
                        message.roomid = this.id;
                        message.room = this;
                    }
                    message.updateFromJSON(json.messages[i]);
                    this.messageHash[message.getId()] = this.messages.push(message) - 1;
                } else {
                    this.messages[this.messageHash[message.getId()]].updateFromJSON(json.messages[i]);
                }
            }
        }
        if (typeof json.users !== 'undefined') {
            this.users.updateFromJSON(json.users);
            if (chat) {
                this.requiresUsers = false;
                if (typeof json.userTime !== 'undefined') {
                    this.lastUserRefresh = json.userTime;
                }
            }
        }
    };
    
    this.getUser = function (id) {
        var user = this.users.getUser(id);
        if (user === null || user.nickname === null) {
            this.requiresUsers = true;
        }
        return user;
    };
    
    this.getNewestMessageId = function () {
        if (this.messages.length === 0) {
            return -1;
        }
        return (this.messages[this.messages.length - 1].id);
    };
    
    this.getMessagePosition = function (id) {
        if (typeof this.messageHash[id] === 'undefined') {
            return -1;
        }
        return this.messageHash[id];
    };
    
    this.getMessagesFrom = function (lastid) {
        var idx = this.getMessagePosition(lastid);
        if (idx === -1) {
            return this.messages;
        } else {
            var messages = [];
            idx++;
            for (null; idx < this.messages.length; idx++) {
                messages.push(this.messages[idx]);
            }
            return messages;
        }
    };
    
    this.getStorytellers = function () {
        /** @type User */ var user;
        var result = [];
        for (var i in this.users.users) {
            user = this.users.users[i];
            if (user.isStoryteller()) {
                result.push(user.id);
            }
        }
        return result;
    };
    
    /**
     * 
     * @returns {User}
     */
    this.getMe = function () {
        var userid = window.app.loginapp.user.id;
        return this.users.getUser(userid);
    };
    
    /**
     * Exports an object as expected by updateFromJSON.
     * The Object does not contain messages.
     * @returns {Object}
     */
    this.export = function () {
        var result = {};
        
        var attributes = {
            pbp : 'playByPost',
            streamable : 'streamable',
            description : 'description',
            private : 'privateRoom',
            logger : 'logger',
            creatorid : 'creatorid',
            id : 'id',
            name :  'name',
            gameid :  'gameid'
        };
        var i;
        for (i in attributes) {
            if (this[i] === undefined || this[i] === null) continue;
            result[attributes[i]] = this[i];
        }
        
        result.users = this.users.export();
        
        return result;
    };
} 
 
function Room_Memory (room) {
    /** @type Room */ this.room = room;
    this.memory = {};
    
    this.updateFromJSON = function (json) {
        this.memory = {};
        for (var i in json) {
            if (typeof window.registeredRoomMemory[i] !== 'undefined') {
                this.setMemory(i, json[i], true);
            }
            console.log(i);
        }
        for (var i in window.registeredRoomMemory) {
            window.registeredRoomMemory[i].updateMemory(this);
        }
    };
    
    this.getMemory = function (id, def) {
        if (typeof this.memory[id] === 'undefined') {
            this.setMemory(id, def, false);
        } else {
            this.cleanMemory(id, def);
        }
        
        return this.memory[id];
    };
    
    this.cleanMemory = function (id, def) {
        var memory = this.memory[id];
        var changed = false;
        
        if (!memory instanceof Object && def instanceof Object) {
            memory = def;
            changed = true;
        } else if (!memory instanceof Array && def instanceof Array) {
            memory = def;
            changed = true;
        } else if (typeof memory !== typeof def) {
            memory = def;
            changed = true;
        }
        
        if (def instanceof Object) {
            // Remove unneeded fields
            for (var i in memory) {
                if (typeof def[i] === 'undefined') {
                    delete memory[i];
                    changed = true;
                }
            }

            // Add missing fields and correct mismatched ones
            for (var i in def) {
                if (typeof def[i] !== typeof memory[i]) {
                    memory[i] = def[i];
                    changed = true;
                } else if (typeof memory[i] === 'undefined') {
                    memory[i] = def[i];
                    changed = true;
                } else if (def[i] instanceof Array && !memory[i] instanceof Array) {
                    memory[i] = def[i];
                    changed = true;
                } else if (def[i] instanceof Object && !memory[i] instanceof Object) {
                    memory[i] = def[i];
                    changed = true;
                }
            }
        }
        
        var user = this.room.getMe();
        if (changed && user.isStoryteller()) {
            this.setMemory(id, memory, false);
        }
    };
    
    this.setMemory = function (id, value, skipSave) {
        console.log("Saving memory :" + id + (skipSave ? ' skip: true' : ' skip: false'));
        this.memory[id] = value;
        if (!skipSave) {
            window.app.chatapp.saveMemory();
        }
    };
}

window.registeredRoomMemory = {};
    
window.registerRoomMemory = function (id, obj) {
    window.registeredRoomMemory[id] = obj;
}; 
 
function Sheet_Instance () {
    this.gameid;
    
    this.folder = '';
    
    this.id;
    this.criador;
    this.criadorNick;
    this.criadorNickSufix;
    this.system;
    this.segura;
    this.publica;
    
    this.idStyleCreator;
    this.nickStyleCreator;
    this.nicksufixStyleCreator;
    this.styleName;
    
    this.visualizar;
    this.editable;
    this.deletar;
    this.promote;
    
    this.name;
    this.values = null;
    
    this.changed = false;
    
    this.isOwner = function () {
        return window.app.loginapp.user.id === this.criador;
    };
    
    this.updateFromJSON = function (json) {
        console.log("Updating Sheet from JSON");
        console.log(json);
        
        var attributes = [
            'folder', 'id', 'criador', 'segura', 'publica', 'visualizar', 'deletar', 
            'values', 'gameid', 'promote', 'criadorNick', 'criadorNickSufix',
            'idStyleCreator', 'nickStyleCreator', 'nicksufixStyleCreator', 'styleName'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[attributes[i]] = json[attributes[i]];
            }
        }
        
        if (typeof json['nome'] !== 'undefined') this.name = json['nome'];
        if (typeof json['idstyle'] !== 'undefined') this.system = json['idstyle'];
        if (typeof json['editar'] !== 'undefined') this.editable = json['editar'];
    };
    
    this.setValues = function (values) {
        this.values = values;
    };
} 
 
function Style_Instance () {
    this.id = null;
    this.name = null;
    
    this.html = null;
    this.css = null;
    
    this.beforeProcess = null;
    this.afterProcess = null;
    
    this.public = false;
    this.gameid = null;
    
    this.idCreator = 0;
    this.nickCreator = null;
    this.nicksufixCreator = null;
    
    this.updateFromJSON = function (json) {
        console.log("Updating Style from JSON");
        console.log(json);
        var attributes = [
            "id", "name", "html", "css", "beforeProcess", "afterProcess", 
            'idCreator', 'nickCreator', 'nicksufixCreator', 'gameid'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (json[attributes[i]] !== undefined) {
                this[attributes[i]] = json[attributes[i]];
            }
        }
    };
    
    this.isLoaded = function () {
        return this.html !== null;
    };
} 
 
function User () {
    this.id = null;
    this.nickname = null;
    this.nicknamesufix = null;
    this.nome = null;
    this.avatar = null;
    this.avatarS = null;
    this.persona = null;
    this.personaS = null;
    this.storyteller = false;
    this.lastrefresh = 0;
    this.lastupdate = 0;
    this.online = false;
    this.idle = false;
    this.level = 0;
    
    this.focused = true;
    this.typing = false;
    
    this.updateFromJSON = function (json) {
        var attributes = [
            'id',
            'nickname', 
            'nicknamesufix', 
            'name', 
            'avatar', 
            'persona', 
            'storyteller', 
            'lastrefresh',
            'lastupdate',
            'focused',
            'typing',
            'online',
            'idle',
            'level'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[attributes[i]] = json[attributes[i]];
            }
        }
        console.log(json['persona']);
        this.personaS = this.persona;
        this.avatarS = this.avatar;
    };
    
    this.export = function () {
        var result = {};
        var attributes = [
            'id',
            'nickname', 
            'nicknamesufix', 
            'name', 
            'avatar', 
            'persona', 
            'storyteller', 
            'lastrefresh',
            'lastupdate',
            'focused',
            'typing',
            'online',
            'idle',
            'level'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (this[attributes[i]] !== undefined && this[attributes[i]] !== null) {
                result[attributes[i]] = this[attributes[i]];
            }
        }
        
        return result;
    };
    
    this.hasAvatar = function () {
        return this.avatar !== null;
    };
    
    this.hasPersona = function () {
        return this.persona !== null;
    };
    
    this.isStoryteller = function () {
        return this.storyteller;
    };
    
    this.isOffline = function (currenttime, afktime) {
        return !this.online;
        return !(currenttime <= (this.lastrefresh + afktime));
    };
    
    this.specialSnowflakeCheck = function () {
        var users = window.app.userdb.users;
        
        for (var i in users) {
            if (users[i].id !== this.id && users[i].nickname === this.nickname) {
                return false;
            }
        }
        return true;
    };
    
    this.getFullName = function () {
        return this.nickname + "#" + this.nicknamesufix;
    };
} 
 
function UserSettings () {
    this.memory = {};
    this.registeredFields = {
        // fieldName : {objectRegisterer, callOnUpdate }
    };
    this.changeListeners = [];
    this.changed = false;
    
    this.updateFromJSON = function (json) {
        this.changed = false;
        for (var i in json) {
            if (this.set(i, json[i])) {
                this.changed = true;
            }
        }
        for (var i = 0; i < this.changeListeners.length; i++) {
            this.changeListeners[i].changedSettings(this);
        }
    };
    
    this.get = function (id) {
        if (this.registeredFields[id] === undefined) {
            return null;
        }
        if (this.memory[id] === undefined) {
            return this.registeredFields[id].default;
        }
        return this.memory[id];
    };
    
    this.set = function (id, value) {
        if (this.registeredFields[id] === undefined) {
            console.log("Attempt to store value to undefined Setting " + id);
            console.log(value);
            return false;
        }
        var validation = this.registeredFields[id].validation;
        if (validation === 'string' && typeof value === 'string') {
            return this.storeValue(id, value);
        } else if (validation === 'number' && typeof value === 'number') {
            return this.storeValue(id, value);
        } else if (this.registeredFields[id].caller.validateSettings(value)) {
            return this.storeValue(id, value);
        }
        console.log("Attempt to store invalid value to Setting " + id);
        console.log(value);
        return false;
    };
    
    this.storeValue = function (id, value) {
        if ((typeof value === 'string' || typeof value === 'number') && value === this.memory[id]) {
            return false;
        }
        this.memory[id] = value;
        this.changed = true;
        for (var i = 0; i < this.changeListeners.length; i++) {
            this.changeListeners[i].changedSettings(this);
        }
    };
    
    this.registerListener = function (obj) {
        this.changeListeners.push(obj);
    };
    
    this.register = function (obj) {
        if (obj.id === undefined) {
            console.log("Bad Request to register User memory:");
            console.log(obj);
            return false;
        }
        if (obj.caller === undefined) {
            obj.caller = null;
            obj.triggerUpdates = false;
        }
        if (obj.triggerUpdates === undefined) {
            obj.triggerUpdates = false;
        }
        if (obj.default === undefined) {
            obj.default = null;
        }
        if (obj.validation === undefined) {
            obj.validation = 'object';
        } else if (['string', 'number'].indexOf(obj.validation) === -1) {
            obj.validation = 'object';
        }
        
        this.registeredFields[obj.id] = {
            id : obj.id,
            caller : obj.caller,
            triggerUpdates : obj.triggerUpdates,
            'default' : obj.default,
            validation : obj.validation
        };
    };
} 
 
function AddonApp () {
    this.loadVantagens = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'http://rules.redpg.com.br/paginas/Vantagens.js',
            dataType : 'script',
            success : cbs,
            error: cbe
        });
    };
    
    this.loadTecnicas = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'http://rules.redpg.com.br/paginas/TecnicasAddons.js',
            dataType : 'script',
            success : cbs,
            error: cbe
        });
    };
} 
 
function ChatWsApp () {
    this.controller = new WsController();
    this.lastMessage = 0;
    this.typing = false;
    this.free = true;
    this.timeout = null;
    this.ackTimeout = null;
    this.focusFlag = true;
    this.idleFlag = false;
    this.notConnected = false;
    this.room = null;
    
    this.disconnectisExpected = false;
    
    $(window).bind('focus', function (e) {
        window.app.chatapp.focusFlag = true;
        window.app.chatapp.sendFocus();
    });
    
    $(window).bind('blur', function (e) {
        window.app.chatapp.focusFlag = false;
        window.app.chatapp.sendFocus();
    });
    
    $(window).idle({
        onIdle : function () {
            window.app.chatapp.idleFlag = true;
            window.app.chatapp.sendIdle();
        },
        onActive : function () {
            window.app.chatapp.idleFlag = false;
            window.app.chatapp.sendIdle();
        },
        events : "mouseover mouseout click keypress mousedown mousemove blur focus",
        idle: 40000
    });
    
    /**
     * 
     * @param {Room} room
     * @param {type} cbs
     * @param {type} cbe
     * @returns {undefined}
     */
    this.start = function (room, cbs, cbe) {
        this.room = room;
        this.cbs = cbs;
        this.cbe = cbe;
        
        if (this.controller.connected) {
            this.onopen();
        } else {
            this.connect();
        }
        var $html = $('<p class="chatSistema" />');
        $html.append($('<span class="language" data-langhtml="_CHATWSCONNECTING_" />'));
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.connect = function () {
        this.disconnectisExpected = false;
        this.clearAck();
        var onopen = function (event) {
            window.app.chatapp.onopen(event);
        };
        var onclose = function (event) {
            window.app.chatapp.onclose(event);
        };
        var onmessage = function (event) {
            window.app.chatapp.onmessage(event);
        };
        var onerror = function (event) {
            window.app.chatapp.onerror(event);
        };
        
        
        this.controller.connect("Chat", onopen, onclose, onmessage, onerror);
        window.app.ui.chat.showEverything();
    };
    
    this.onopen = function (event) {
        this.clearAck();
        console.log("Connected - ");
        console.log(event);
        this.notConnected = true;
        this.waitForAck();
        this.sendAction("room", this.room.id);
        window.app.ui.chat.cc.firstPrint = false;
        window.app.ui.chat.cc.ignoreTooMany = false;
    };
    
    this.onclose = function (event) {
        console.log("Disconnected - ");
        console.log(event);
        
        if (this.disconnectisExpected) return;
        
        var $html = $('<p class="chatSistema" />');
        $html.append($('<span class="language" data-langhtml="_CHATWSDISCONNECTED_" />'));
        var $a = $('<a class="language" data-langhtml="_CHATWSRECONNECT_" />').on('click', function () {
            window.app.chatapp.connect();
        });
        $html.append(" ").append($a);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
        this.clearAck();
        
        window.app.loginapp.checkLogin();
    };
    
    this.onerror = function (event) {
        console.log("Error - ");
        console.log(event);
        
        if (this.disconnectisExpected) return;
        
        this.clearAck();
        window.app.loginapp.checkLogin();
    };
    
    this.onmessage = function (event) {
        this.clearAck();
        console.log("Message received:");
        console.log(event.data);
        console.log("Response time: " + ((new Date().getTime()) - this.lastMessage));
        
        if (event.data === "1") {
            return;
        }
        
        var obj = JSON.parse(event.data);
        if (obj[0] === 'status') {
            /** @type User */ var user = this.room.users.getUser(obj[1]);
            user.typing = obj[2] === 1;
            user.idle = obj[3] === 1;
            user.focused = obj[4] === 1;
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'message') {
            if (obj[1].id < 0) {
                if (typeof obj[1].localid === 'undefined') {
                    var message = new Message();
                    message.updateFromJSON(obj[1]);
                    message.roomid = this.room.id;
                    window.app.ui.chat.cc.printMessage(message);
                    window.app.ui.chat.considerBottoming();
                } else {
                    this.room.updateFromJSON({'messages' : [obj[1]]});
                }
            } else {
                this.room.updateFromJSON({'messages' : [obj[1]]});
                window.app.ui.chat.cc.printMessages();
            }
        } else if (obj[0] === 'persona') {
            var user = this.room.users.getUser(obj[1]);
            if (typeof obj[2]['persona'] === 'undefined') {
                obj[2]['persona'] = null;
            }
            if (typeof obj[2]['avatar'] === 'undefined') {
                obj[2]['avatar'] = null;
            }
            user.updateFromJSON(obj[2]);
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'joined') {
            var user = {};
            user[obj[1].id] = obj[1];
            this.room.users.updateFromJSONObject(user, true);
            window.app.ui.chat.cc.checkUsers();
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'left') {
            this.room.users.getUser(obj[1]).online = false;
            window.app.ui.chat.cc.checkUsers();
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === "inroom") {
            this.updateUsers (obj[1]);
        } else if (obj[0] === 'memory') {
            window.app.roomdb.getRoom(obj[1]).memory.updateFromJSON(obj[2]);
        } else if (obj[0] === 'getroom') {
            this.updateUsers(obj[1]);
            this.room.memory.updateFromJSON(obj[2]);
            this.room.updateFromJSON({'messages' : obj[3]});
            window.app.ui.chat.cc.printMessages();
        }
    };
    
    this.updateUsers = function (json) {
        var users = this.room.users.users;
        for (var index in users) {
            users[index].online = false;
        }
        this.room.users.updateFromJSONObject(json, true);
        window.app.ui.chat.cc.checkUsers();
        window.app.ui.chat.cc.pc.checkUsers();
    };
    
    this.sendAction = function (action, message) {
            this.controller.sendMessage(action, message);
            this.lastMessage = new Date().getTime();
            console.log("Message sent:" + action + ';' + message);
    };
    
    this.sendMessage = function (message) {
        this.sendAction("message", JSON.stringify({
            localid : message.localid,
            destination : message.destination,
            message : message.msg,
            module : message.module,
            special : message.special,
            clone : message.clone
        }));
    };
    
    this.fixPrintAndSend = function (message, addlocal) {
        if (this.room !== null) {
            message.room = this.room;
            message.roomid = this.room.id;
            message.origin = window.app.loginapp.user.id;
            this.printAndSend(message, addlocal);
        }
    };
    
    this.printAndSend = function (message, addlocal) {
        var mod = window.app.ui.chat.mc.getModule(message.module);
        if (mod === null) {
            return;
        }
        if (addlocal) {
            window.app.ui.chat.cc.room.addLocal(message);
        }
        var $html = mod.get$(message);
        if ($html !== null) {
        message.set$($html);
            window.app.ui.language.applyLanguageOn($html);
            window.app.ui.chat.cc.hoverizeSender($html, message);
            window.app.ui.chat.appendToMessages($html);
        }
        this.sendMessage(message);
    };
    
    this.getAllMessages = function () {
        window.app.ui.chat.$chatMessages.empty();
        
        var cbs = function (data) {
            window.app.chatapp.room.empty();
            window.app.chatapp.room.updateFromJSON({messages : data}, true);
            window.app.ui.chat.cc.firstPrint = true;
            window.app.ui.chat.cc.ignoreTooMany = true;
            window.app.ui.chat.cc.lastMessage = -1;
            window.app.ui.chat.cc.printMessages();
            window.app.ui.chat.cc.clearUsers();
            window.app.ui.chat.cc.checkUsers();
            window.app.ui.chat.cc.pc.checkUsers();
            window.app.ui.chat.cc.firstPrint = false;
        };
        
        var cbe = function () {
            console.log("error");
        };
        
        var ajax = new AjaxController();
        
        var data = {
            roomid : this.room.id,
            action : 'messages'
        };
        
        ajax.requestPage({
            url : 'Room',
            data : data,
            success: cbs,
            error: cbe
        });
    };
    
    this.stop = function () {
        this.disconnectisExpected = true;
        if (this.controller.connected) {
            this.controller.closeConnection();
        }
        this.clearAck();
    };
    
    this.clear = function () {
        var cbe = function () {
            var $html = $('<p class="chatSistema language" data-langhtml="_CLEARFAIL_" />');
            window.app.ui.language.applyLanguageTo($html);
            window.app.ui.chat.appendToMessages($html);
        };
        
        var cbs = function () {
            window.app.chatapp.room.empty();
        };
        
        if (this.room === null) {
            cbe();
            return false;
        }
        
        var ajax = new AjaxController();
        ajax.requestPage({
            url : 'Room',
            data : {
                'roomid' : this.room.id,
                action : 'clear'
            },
            error: cbe,
            success: cbs
        });
    };
    
    this.sendStatus = function () {
        if (this.controller.connected) {
            var status = [];
            status.push(this.typing ? '1' : '0');
            status.push(this.idleFlag ? '1' : '0');
            status.push(this.focusFlag ? '1' : '0');
            this.sendAction("status", status.join(','));
        }
    };
    
    this.updateTyping = function (typing) {
        if (typing !== this.typing) {
            this.typing = typing;
            this.sendStatus();
        }
    };
    
    this.sendFocus = function () {
        this.sendStatus();
    };
    
    this.sendIdle = function () {
        this.sendStatus();
    };
    
    this.clearAck = function () {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
            console.log("No longer waiting for server message.");
        }
        if (this.ackTimeout !== null) {
            clearTimeout(this.ackTimeout);
            this.ackTimeout = null;
        }
        
        if (this.notConnected) {
            var $html = $('<p class="chatSistema" />');
            $html.append($('<span class="language" data-langhtml="_CHATWSCONNECTED_" />'));
            var $a = $('<a class="language" data-langhtml="_CHATWSGETOLDERMESSAGES_" />').on('click', function () {
                window.app.chatapp.getAllMessages();
            });
            $html.append(" ").append($a);
            window.app.ui.language.applyLanguageOn($html);
            window.app.ui.chat.appendToMessages($html);
            this.notConnected = false;
        }
        
        this.ackTimeout = setTimeout(function () {
            window.app.chatapp.ack();
        }, 5000);
        
        $('#chatNotConnError').hide();
        $('#chatNotLoad').hide();
    };
    
    this.waitForAck = function () {
        console.log("Waiting for server message.");
        this.timeout = setTimeout(function () {
            $('#chatNotLoad').show();
            $('#chatNotConnError').hide();
            window.app.chatapp.controller.sendAck();
            window.app.chatapp.timeout = setTimeout(function () {
                $('#chatNotConnError').show();
                $('#chatNotLoad').hide();
            }, 5000);
        }, 5000);
    };
    
    this.ack = function () {
       this.waitForAck();
       this.lastMessage = new Date().getTime();
       this.controller.sendAck();
    };
    
    this.saveMemory = function () {
        if(this.room.getMe().isStoryteller()) {
            this.sendAction("memory", JSON.stringify(this.room.memory.memory));
            this.room.memory.updateFromJSON(this.room.memory.memory);
        }
    };
} 
 
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
    
    this.leaveGame = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Game',
            data : {'id' : gameid, action : 'leave'},
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
 
function ImageApp () {
    this.updateDB = function (cbs, cbe) {
        
        // Disabled until implemented
        //return cbs(null);
        
        
        cbs = window.app.emulateBind(function (data) {
            window.app.imagedb.updateFromJSON(data['imagess3'], true);
            var obj = {"images" : data.images};
            window.app.storage.updateFromJSON(obj);
            this.cbs(data);
        }, {cbs : cbs});
        
        var ajaxObj = {
            url : 'Image',
            dataType : 'json',
            data : {action : 'list'},
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.deleteImage = function (uuid, cbs, cbe) {
        var ajaxObj = {
            url : 'Image',
            success: cbs,
            error: cbe,
            data: {
                action : "delete",
                uuid : uuid
            }
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.updateImage = function (data, cbs, cbe) {
        data.action = "update";
        var ajaxObj = {
            url : 'Image',
            success: cbs,
            error: cbe,
            data: data
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.uploadImage = function (formdata, cbs, cbe) {
        
        var ajaxObj = {
            url : 'ImageUpload',
//            xhr: function() {  // Custom XMLHttpRequest
//                var myXhr = $.ajaxSettings.xhr();
//                if(myXhr.upload){ // Check if upload property exists
//                    myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
//                }
//                return myXhr;
//            },
//            progressUpload : progress,
            success: cbs,
            error: cbe,
            data: formdata,
            timeout: 120 * 1000 // 120 seconds or 2 minutes
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.updateFromLocal = function () {
        var imageJSON = window.app.memory.getMemory('imageLinks', []);
        window.app.imagedb.updateFromJSON(imageJSON, false);
    };
    
    this.saveToLocal = function () {
        var images = window.app.imagedb.images;
        var toSave = [];
        for (var id in images) {
            if (images[id].id < 0) {
                toSave.push({
                    id : images[id].id,
                    name : images[id].name,
                    url : images[id].url
                });
            }
        }
        window.app.memory.setMemory('imageLinks', toSave);
    };
    
    this.prepareUrl = function (url) {
        if (url.indexOf('dropbox.com') !== -1) {
            if (url.indexOf('?dl=1') !== -1) {
                return url;
            }
            var at = url.lastIndexOf('?');
            at = at === -1 ? url.length : at;
            url = url.substring(0, at) + '?dl=1';
            return url;
        } else {
            return url;
        }
    };
} 
 
function LoginApp () {
    this.logged = false;
    this.user = new User();
    this.jsessid = null;
    this.timeout = null;
    this.loginListeners = [];
    
    if (localStorage.lastSession !== undefined && localStorage.lastSessionTime !== undefined && !isNaN(localStorage.lastSessionTime, 10) && (new Date().valueOf() - parseInt(localStorage.lastSessionTime)) < 108000) {
        this.jsessid = localStorage.lastSession;
    }
    
    this.onLoggedout = function () {};
    
    this.setJsessid = function (id) {
        this.jsessid = id;
        localStorage.lastSession = id;
        localStorage.lastSessionTime = new Date().valueOf();
    };
    
    this.getJsessid = function () {
        return this.jsessid;
    };
    
    this.hasJsessid = function () {
        return (this.jsessid !== null);
    };
    
    this.approvedLogin = function (json) {
        this.user.updateFromJSON(json['user']);
        window.app.config.updateFromJSON(json.user['config']);
        this.logged = true;
        this.jsessid = json['session'];
        localStorage.lastSession = this.jsessid;
        localStorage.lastSessionTime = new Date().valueOf();
        window.app.memory.init();
        this.setTimeout();
        
        this.callLoginListeners();
    };
    
    this.confirm = function (uuid, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'confirm', uuid: uuid},
            success : cbsuccess,
            error: cberror
        });
    };
    
    this.login = function (login, password, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        var cbs = window.app.emulateBind(
            function (data) {
                this.loginapp.approvedLogin(data);
                this.cbsuccess(data);
            },
            { loginapp : this,
            cbsuccess : cbsuccess }
        );
        
        var data = {};
        
        if (login !== null && password !== null) {
            data.login = login;
            data.password = password;
        }
        
        data.action = 'login';
        
        ajax.requestPage({
            url : 'Account',
            data : data,
            dataType : 'json',
            success : cbs,
            error: cberror
        });
    };
    
    this.createAccount = function (object, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        object.action = 'newAccount';
        
        ajax.requestPage({
            url : 'Account',
            data : object,
            success : cbsuccess,
            error: cberror
        });
    };
    
    this.changePassword = function (oldpassword, newpassword, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'changePassword', 
                    oldpass: oldpassword,
                    newpass: newpassword},
            success : cbsuccess,
            error: cberror
        });
    };
    
    this.logout = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            window.app.loginapp.clearTimeout();
            delete localStorage.lastSession;
            delete localStorage.lastSessionTime;
            this.cbs(data);
        }, {cbs : cbs});
        
        ajax.requestPage({
            url : 'Account',
            data: {action : 'logout'},
            success: cbs,
            error: cbe
        });
    };
    
    
    this.checkLogin = function () {
        window.app.ui.showLoading();
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'requestSession'},
            dataType : 'json',
            success : window.app.emulateBind(
                function (json) {
                    if (!json.logged) {
                        this.loginapp.logged = false;
                        this.loginapp.user = new User();
                        this.loginapp.jsessid = json.session;
                        this.loginapp.onLoggedout();
                    } else {
                        localStorage.lastSessionTime = new Date().valueOf();
                    }
                }, {loginapp : this}
            ),
            complete : function () {
                window.app.ui.hideLoading();
            }
        });
    };
    
    this.silentlyCheckLogin = function () {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'requestSession'},
            dataType : 'json',
            success : window.app.emulateBind(
                function (json) {
                    if (!json.logged) {
                        this.loginapp.logged = false;
                        this.loginapp.user = new User();
                        this.loginapp.jsessid = json.session;
                        this.loginapp.onLoggedout();
                        return;
                    } else {
                        localStorage.lastSessionTime = new Date().valueOf();
                    }
                    window.app.loginapp.setTimeout();
                }, {loginapp : this}
            )
        });
    };
    
    this.setTimeout = function () {
        this.clearTimeout();
        this.timeout = setTimeout(function () {
            window.app.loginapp.silentlyCheckLogin();
        }, 180000);
    };
    
    this.clearTimeout = function () {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
    };
    
    this.addLoginListener = function (object) {
        if (typeof object !== 'object' || typeof object.loginChanged !== 'function') {
            console.log("Attempt to register an invalid login listener:");
            console.log(object);
            return;
        }
        
        this.loginListeners.push(object);
    };
    
    this.callLoginListeners = function () {
        for (var i = 0; i < this.loginListeners.length; i++) {
            this.loginListeners[i].loginChanged();
        }
    };
} 
 
function Memory () {
    this.memory = null;
    
    this.init = function () {
        if (typeof localStorage[window.app.loginapp.user.id] === 'undefined') {
            localStorage[window.app.loginapp.user.id] = "{}";
            this.memory = {};
        } else {
            this.memory = JSON.parse(localStorage[window.app.loginapp.user.id]);
        }
    };
    
    this.hasMemory = function (id) {
    	return typeof this.memory[id] !== 'undefined';
    }
    
    this.getMemory = function (id, obj) {
        if (typeof this.memory[id] === 'undefined') {
            this.memory[id] = obj;
            this.saveMemory();
        }
        return this.memory[id];
    };
    
    this.setMemory = function (id, obj) {
        this.memory[id] = obj;
        this.saveMemory();
    };
    
    this.unsetMemory = function (id) {
    	delete this.memory[id];
    	this.saveMemory();
    };
    
    this.saveMemory = function () {
        localStorage[window.app.loginapp.user.id] = JSON.stringify(this.memory);
    };
} 
 
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
 
function SheetApp () {
    this.loadStyle = function (styleid, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            window.app.styledb.updateFromJSON([data]);
            this.cbs();
        }, {cbs:cbs});
        
        ajax.requestPage({
            url : 'Style',
            dataType : 'json',
            data : {id : styleid, action : 'request'},
            success: cbs,
            error: cbe
        });
    };
    
    this.loadMyStyles = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            window.app.styledb.updateFromJSON(data);
            this.cbs();
        }, {cbs:cbs});
        
        ajax.requestPage({
            url : 'Style',
            dataType : 'json',
            data : {action : 'listMine'},
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
    
    this.sendFolder = function (sheetid, folder, cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Sheet',
            data : {id : sheetid, folder : folder, action : 'folder'},
            success: cbs,
            error: cbe
        });
    };
    
    
    this.sendStyleUpdate = function (style, cbs, cbe) {
        var ajax = new AjaxController();
        
        var action = style.id !== 0 ? 'editAdvanced' : 'createAdvanced';
        
        ajax.requestPage({
            url : 'Style',
            data : {
                action : action,
                name : style.name,
                id : style.id,
                public : style.public ? '1' : '0',
                html : style.html,
                css : style.css,
                afterProcess : style.afterProcess,
                beforeProcess : style.beforeProcess,
                gameid : style.gameid
            },
            success: cbs,
            error: cbe
        });
    };
    
    
    this.callList = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            window.app.gamedb.updateFromJSON(data, true);
            this.cbs(data);
        }, {cbs : cbs});
        
        ajax.requestPage({
            url : 'Sheet',
            data : {action : 'list'},
            success: cbs,
            error: cbe
        });
    };
    
    this.callCreation = function (gameid, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            window.app.styledb.updateFromJSON(data);
            this.cbs(data);
        }, {cbs : cbs});
        
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
 
function Button_AddRow (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	this.list = this.parent.getField(this.visible.dataset['for']);
	if (!(this.list instanceof Sheet_List)) {
		console.log("Invalid Add Row button, pointing at " + this.visible.dataset['for'] + ". Ignoring.");
		return;
	}
	
	this.clickHandler = {
		list : this.list,
		row : this.parent,
		handleEvent : function () {
			this.list.addRow();
		}
	};
	
	this.visible.addEventListener('click', this.clickHandler);
	
	this.originalDisplay = this.visible.style.display;
	this.visible.style.display = 'none';
	
	this.update = function () {
		if (this.style.editing) {
			this.visible.style.display = this.originalDisplay;
		} else {
			this.visible.style.display = 'none';
		}
	};
} 
 
function Button_DeleteRow (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	this.list = this.parent.parent;
	if (!(this.list instanceof Sheet_List)) {
		console.log("Delete Row button added outside of a row. Ignoring.");
		return;
	}
	
	this.clickHandler = {
		list : this.list,
		row : this.parent,
		handleEvent : function () {
			this.list.removeRowByRow(this.row);
		}
	};
	
	this.visible.addEventListener('click', this.clickHandler);
	
	this.originalDisplay = this.visible.style.display;
	this.visible.style.display = 'none';
	
	this.update = function () {
		if (this.style.editing) {
			this.visible.style.display = this.originalDisplay;
		} else {
			this.visible.style.display = 'none';
		}
	};
} 
 
function Sheet (elements, style, parent) {
	this.style = style;
	this.visible = elements;
	
	this.nameField = null;
	
	this.parent = parent === undefined ? null : parent;
	
	if (this.parent === null) {
		this.id = "Base Sheet";
	} else {
		this.id = "Sheet for list " + this.parent.id;
	}
	
	this.buttons = [];
	this.fields = {};
	
	this.getField = function (id) {
		if (this.fields[id] === undefined) {
			return null;
		}
		return this.fields[id];
	};
	
	this.listeners = {
		'changedVariable' : []
	};
	
	/**
	 * Check whether this list is part of another list or not.
	 */
	this.isDeepList = function (element) {
		var parent = element.getParentElement;
		if (parent === null || parent === undefined) {
			return true;
		}
		if (parent.classList.contains('sheetList')) {
			return false;
		}
		return this.isDeepList(parent);
	};
	
	// Search each Child Node for variables
	for (var i = 0; i < this.visible.length; i++) {
		var element = this.visible[i];
		
		// Skip if it's not an element
		if (element.nodeType !== 1) continue;
		
		
		// Find and create Sheet_List objects
		var lists = element.getElementsByClassName('sheetList');
		for (var j = 0; j < lists.length; j++) {
			if (!this.isDeepList(lists[j])) continue;
			var newSheetList = new Sheet_List (lists[j], this.style, this);
			this.fields[newSheetList.id] = newSheetList;
		}
		
		// Find and create Sheet_Button objects
		var deleteButtons = element.getElementsByClassName('deleteRow');
		for (var j = 0; j < deleteButtons.length; j++) {
			var newButton = new Button_DeleteRow(deleteButtons[j], this.style, this);
			this.buttons.push(newButton);
		}
		

		var addButtons = element.getElementsByClassName('addRow');
		for (var j = 0; j < addButtons.length; j++) {
			var newButton = new Button_AddRow(addButtons[j], this.style, this);
			this.buttons.push(newButton);
		}
		
		// Sheet_List will remove themselves from the DOM
		// It is now possible to search for variables
		var variables = element.getElementsByClassName("sheetVariable");
		for (var j = 0; j < variables.length; j++) {
			var newVariable = this.style.varFactory.createVariable(variables[j], this.style, this);
			this.fields[newVariable.id] = newVariable;
		}
		
		// Should I hold a name?
		if (this.parent === null && this.nameField === null) {
			var nameElement = element.getElementsByClassName('sheetName');
			if (nameElement.length > 0) {
				this.nameField = this.style.varFactory.createNameVariable(nameElement[0], this.style, this);
			}
		}
	};
	
	this.updateSheetInstance = function () {
		this.storeValue(this.style.sheetInstance.values);
		if (this.nameField !== null) {
			this.nameField.storeValue(this.style.sheetInstance.name);
		}
	};
	
	this.reset = function () {
		for (var id in this.fields) {
			this.fields[id].reset();
		}
	};
	
	this.storeValue = function (value) {
		if (typeof value !== 'object') return;
		for (var id in this.fields) {
			if (value[id] !== undefined) {
				this.fields[id].storeValue(value[id]);
			} else {
				this.fields[id].reset();
			}
		}
	};
	
	this.getObject = function () {
		var obj = {};
		for (var id in this.fields) {
			obj[id] = this.fields[id].getObject();
		}
		return obj;
	};
	
	this.update = function () {
		for (var id in this.fields) {
			this.fields[id].update();
		}
		if (this.nameField !== null) {
			this.nameField.update();
		}
		
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].update();
		}
	};
	
	this.triggerChanged = function () {
		this.trigger('changedVariable');
	};
	
	this.addChangedListener = function (handler) {
		this.addEventListener('changedVariable', handler);
	};
	
	this.addEventListener = function (id, handler) {
		if (this.listeners[id] === undefined) {
			this.listeners[id] = [];
		}
		this.listeners[id].push(handler);
	};
	
	this.trigger = function (id) {
		var listr = this.listeners[id];
		for (var i = 0; i < listr.length; i++) {
			try {
				if (typeof listr[i] === 'function') {
					listr[i](this);
				} else {
					listr[i].handleEvent(this);
				}
			} catch (e) {
				alert("This style has a bugged " + id + " Event Handler. More information on console (if debug mode is active)");
				console.log("Error on event handler for " + this.id + " on Style " + this.style.styleInstance.name + " for event " + id + ". Offending handler:");
				console.log(listr[i]);
			}
		}
	};
	
	this.seppuku = function () {
		for (var id in this.fields) {
			this.fields[id].seppuku();
		}
	};
} 
 
function Sheet_List (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	this.listeners = {
		changedVariable : [],
		addedRow : [],
		removedRow : []
	};
	
	this.sheetElements = [];
	
	while (this.visible.firstChild) {
		this.sheetElements.push(this.visible.firstChild);
		this.visible.removeChild(this.visible.firstChild);
	}
	
	this.id = this.visible.dataset.id === undefined ? this.style.getCustomID : this.visible.dataset.id;
	try {
		this.defaultValue = this.visible.dataset['default'] === undefined ? [] : JSON.parse(this.visible.dataset['default']);
	} catch (e) {
		alert("Invalid Default Value for List " + this.id + " on style " + this.style.id + ", " + this.style.styleInstance.name + ".");
		this.defaultValue = [];
	}
	
	this.sheetPool = [];
	this.sheets = [];
	
	this.addRow = function () {
		if (this.sheetPool.length === 0) {
			var newElements = [];
			for (var i = 0; i < this.sheetElements.length; i++) {
				var newNode = this.sheetElements[i].cloneNode(true);
				this.visible.appendChild(newNode);
				newElements.push(newNode);
			}
			var newSheet = new Sheet (newElements, style, this);
			newSheet.update();
		} else {
			// Lavou tá novo
			var newSheet = this.sheetPool.pop();
			for (var i = 0; i < newSheet.visible.length; i++) {
				this.visible.appendChild(newSheet.visible[i]);
			}
		}
		this.sheets.push(newSheet);
		this.triggerAddedRow(newSheet);
	};
	
	this.removeLastRow = function () {
		this.removeRow(this.sheets.length - 1);
	};
	
	this.removeRowByRow = function (row) {
		this.removeRow(this.sheets.indexOf(row));
	};
	
	this.removeRow = function (index) {
		if (index >= 0 && index < this.sheets.length) {
            oldRow = this.sheets[index];
            this.sheets.splice(index, 1);
            for (var i = 0; i < oldRow.visible.length; i++) {
				this.visible.removeChild(oldRow.visible[i]);
			}
            this.sheetPool.push(oldRow);
            this.triggerRemovedRow(oldRow);
        }
	};
	
	this.storeValue = function (value) {
		if (!Array.isArray(value)) return;
		if (this.sheets.length !== value.length) {
			this.setChanged();
		}
		for (var i = 0; i < value.length; i++) {
			if ((i + 1) > this.sheets.length) {
				this.addRow();
			}
			this.sheets[i].storeValue(value[i]);
		}
		while (this.sheets.length > value.length) {
			this.removeLastRow();
		}
	};
	
	this.reset = function () {
		this.storeValue(this.defaultValue);
	};
	
	this.update = function () {
		for (var i = 0; i < this.sheets.length; i++) {
			this.sheets[i].update();
		}
	};
	
	this.getObject = function () {
		var obj = [];
		for (var i = 0; i < this.sheets.length; i++) {
			obj.push(this.sheets[i].getObject());
		}
		return obj;
	};
	
	this.setChanged = function () {
		this.style.triggerChanged(this);
	};
	
	this.triggerChanged = function () {
		this.trigger('changedVariable');
	};
	
	this.triggerAddedRow = function (row) {
		this.trigger('addedRow', row);
	};
	
	this.triggerRemovedRow = function (row) {
		this.trigger('removedRow', row);
	};
	
	this.addChangedListener = function (handler) {
		this.addEventListener('changedVariable', handler);
	};
	
	this.addAddedRowListener = function (handler) {
		this.addEventListener('addedRow', handler);
	};
	
	this.addRemovedRowListener = function (handler) {
		this.addEventListener('removedRow', handler);
	};
	
	this.addEventListener = function (id, handler) {
		if (this.listeners[id] === undefined) {
			this.listeners[id] = [];
		}
		this.listeners[id].push(handler);
	};
	
	this.trigger = function (id, extra) {
		var listr = this.listeners[id];
		for (var i = 0; i < listr.length; i++) {
			try {
				if (typeof listr[i] === 'function') {
					listr[i](this, extra);
				} else {
					listr[i].handleEvent(this, extra);
				}
			} catch (e) {
				alert("This style has a bugged " + id + " Event Handler. More information on console (if debug mode is active)");
				console.log("Error on event handler for " + this.id + " on Style " + this.style.styleInstance.name + " for event " + id + ". Offending handler:");
				console.log(listr[i]);
			}
		}
	};
	
	this.seppuku = function () {
		for (var i = 0; i < this.sheets.length; i++) {
			this.sheets[i].seppuku();
		}
		for (var i = 0; i < this.sheetPool.length; i++) {
			this.sheetPool[i].seppuku();
		}
	};
} 
 
function Sheet_Style (sheetInstance, styleInstance) {
	var start = new Date().getTime();
	this.varFactory = new VariableFactory();
	
	this.sheetInstance = sheetInstance;
	this.styleInstance = styleInstance;
	this.id = styleInstance.id;
	this.editing = false;
	this.loading = true;
	
	this.visible = document.createElement('div');
	this.visible.id = 'sheetDiv';
	this.visible.innerHTML = styleInstance.html;
	
	this.css = document.createElement('style');
	this.css.type = 'text/css';
	this.css.innerHTML = styleInstance.css;
	
	this.$visible = $(this.visible);
	this.$css = $(this.css);
	
	this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
        console.log("Please consider not using emulateBind.");
    };
    
    this.switchInstance = function (sheetInstance) {
    	var start = new Date().getTime();
		var parent = this.visible.parentNode;
		if (parent !== null && parent !== undefined) parent.removeChild(this.visible);
		this.loading = true;
    	this.sheetInstance = sheetInstance;
    	this.sheet.updateSheetInstance();
    	this.loading = false;
    	if (parent !== null && parent !== undefined) parent.appendChild(this.visible);
    	var finish = new Date().getTime();
    	console.log("SwitchInstance Process took " + (finish - start) + " ms to finish for Style " + this.id + ", " + this.styleInstance.name + ".");
    };
	
	this.toggleEdit = function () {
		var start = new Date().getTime();
		var parent = this.visible.parentNode;
		parent.removeChild(this.visible);
		this.editing = !this.editing;
		this.sheet.update();
		parent.appendChild(this.visible);
		var finish = new Date().getTime();
		console.log("ToggleEdit Process took " + (finish - start) + " ms to finish for Style " + this.id + ", " + this.styleInstance.name + ".");
	};
    
    this.getObject = function () {
        var obj = this.sheet.getObject();
        this.sheetInstance.values = obj;
        return obj;
    };
    
    this.counter = 0;
    this.getCustomID = function () {
    	return "field" + this.styleInstance.id + "_" + this.counter++;
    };
    
    /**
     * Triggers change going up a chain.
     */
    this.changedVariables = [];
    this.triggerChanged = function (varb) {
    	if (varb === null) {
    		for (var i = 0; i < this.changedVariables.length; i++) {
    			this.changedVariables[i].triggerChanged();
    		}
    	} else {
	    	while (varb !== null) {
	    		if (!this.loading) {
	    			varb.triggerChanged();
	    		} else {
		    		if (this.changedVariables.indexOf(varb) !== -1)  break;
		    		this.changedVariables.push(varb);
	    		}
	    		varb = varb.parent;
	    	}
    	}
    };
    
    // SHEET
    try {
    	eval(this.styleInstance.beforeProcess);
    } catch (e) {
    	console.log("Before Process Error for Style " + this.id + ", " + this.styleInstance.name + ".");
    	console.log(e);
    	console.log(e.stack);
    	if (window.location.hash.substr(1).toUpperCase().indexOf("DEBUG") !== -1)
    		alert("Before Process Error for Style " + this.id + ", " + this.styleInstance.name + ".\nError: " + e.message + e.lineNumber + ".\n More details on Console.");
    }
	this.sheet = new Sheet([this.visible], this);
	try {
    	eval(this.styleInstance.afterProcess);
    } catch (e) {
    	console.log("After Process Error for Style " + this.id + ", " + this.styleInstance.name + ".");
    	console.log(e);
    	console.log(e.stack);
    	if (window.location.hash.substr(1).toUpperCase().indexOf("DEBUG") !== -1)
    		alert("After Process Error for Style " + this.id + ", " + this.styleInstance.name + ".\nError: " + e.message + ".\n More details on Console.");
    }
	this.sheet.updateSheetInstance();
	this.loading = false;
	this.triggerChanged(null);
	this.sheet.addChangedListener({
		style : this,
		sheet : this.sheet,
		handleEvent : function () {
			if (!this.style.loading) {
				var obj = this.style.sheet.getObject();
				this.style.sheetInstance.changed = true;
				this.style.sheetInstance.values = obj;
				//window.app.memory.setMemory("Sheet_" + this.style.sheetInstance.id, obj);
			}
		}
	});
	var finish = new Date().getTime();
	console.log("Sheet Generation Process took " + (finish - start) + " ms to finish for Style " + this.id + ", " + this.styleInstance.name + ".");
	
	this.updateSheetInstance = function () {
		this.sheet.updateSheetInstance();
	};
	
	this.seppuku = function () {
		this.sheet.seppuku();
	};
} 
 
function Variable (element, style, parent, createInput, createTextnode) {
	createInput = createInput === undefined ? true : createInput;
	createTextnode = createTextnode === undefined ? true : createTextnode;
	this.style = style;
	this.visible = element;
	this.parent = parent;
	
	this.editing = false;
	
	/**
	 * Listeners
	 */
	this.listeners = {
		"changedVariable" : []
	};
	
	/**
	 * Dataset from element
	 */
	var data = this.visible.dataset;
	this.id = data.id === undefined ? this.style.getCustomID() : data.id;
	this.placeholder = data.placeholder === undefined ? "" : data.placeholder;
	this.defaultValue = data['default'] === undefined ? "" : data["default"];
	this.editable = data.editable === undefined ? true : (data.editable === "1" || data.editable === 'true');
	this.value = this.defaultValue;
	
	
	/**
	 * Input Element
	 */
	if (createInput) {
		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.value = this.defaultValue;
		this.input.placeholder = this.placeholder;
		
		this.inputListener = {
			variable : this,
			input : this.input,
			handleEvent : function () {
				this.variable.storeValue(this.input.value);
			}
		};
		
		this.input.addEventListener("change", this.inputListener);
	}
	
	/**
	 * Text Node
	 */
	if (createTextnode) {
		this.textNode = document.createTextNode(this.defaultValue);
		while (this.visible.firstChild) {
			this.visible.removeChild(this.visible.firstChild);
		}
		this.visible.appendChild(this.textNode);
	}
	
	
	/**
	 * Default update function
	 */
	this.update = function () {
		if (this.editing !== this.style.editing) this.toggleEdit();
		if (this.editing && this.editable) {
			this.input.value = this.value;
		} else {
			this.textNode.nodeValue = this.getValue();
		}
	};
	
	/**
	 * Makes either the Input or the TextNode visible
	 */
	this.toggleEdit = function () {
		while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
		this.editing = !this.editing;
		if (this.editing && this.editable) {
			this.visible.appendChild(this.input);
		} else {
			this.visible.appendChild(this.textNode);
		}
	}
	
	/**
	 * Stores a new value
	 */
	this.storeValue = function (value) {
		if (this.value !== value) {
			this.value = value;
			this.update();
			this.setChanged();
		}
	};
	
	this.reset = function () {
		this.storeValue(this.defaultValue);
	};
	
	/**
	 * Get the object that will be stored
	 */
	this.getObject = function () {
		return this.value;
	};
	
	/**
	 * Get useable value, often the same as the actual value
	 */
	this.getValue = function () {
		return this.value;
	};
	
	/**
	 * Utilize functions to avoid magic strings
	 */
	this.addChangedListener = function (handler) {
		this.addEventListener('changedVariable', handler);
	};
	
	this.triggerChanged = function () {
		this.trigger('changedVariable');
	};
	
	this.setChanged = function () {
		this.style.triggerChanged(this);
	};
	
	/**
	 * Trigger function.
	 * Treat as private.
	 */
	this.trigger = function (id) {
		var listr = this.listeners[id];
		for (var i = 0; i < listr.length; i++) {
			try {
				if (typeof listr[i] === 'function') {
					listr[i](this);
				} else {
					listr[i].handleEvent(this);
				}
			} catch (e) {
				alert("This style has a bugged " + id + " Event Handler. More information on console (if debug mode is active)");
				console.log("Error on event handler for " + this.id + " on Style " + this.style.styleInstance.name + " for event " + id + ". Offending handler:");
				console.log(listr[i]);
			}
		}
	};
	
	this.addEventListener = function (id, handler) {
		if (this.listeners[id] === undefined) {
			this.listeners[id] = [];
		}
		this.listeners[id].push(handler);
	};
	
	this.takeMe = function (newMe) {
		for (var key in this) {
			newMe[key] = this[key];
		}
	};
	
	this.seppuku = function () {
		
	};
};

if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['text'] = Variable; 
 
function VariableFactory () {
	this.defaultType = "text";
	
	this.createVariable = function (element, style, parent) {
		type = element.dataset.type;
		if (type === undefined || window.sheetVariableTypes[type] === undefined) {
			 var type = this.defaultType;
		}
		
		return new window.sheetVariableTypes[type](element, style, parent);
	}
	
	this.createNameVariable = function (element, style, parent) {
		return new window.sheetVariableTypes['name'](element, style, parent);
	};
	
	this.createNull = function () {
		return new Variable_Null();
	};
}

if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {}; 
 
if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['boolean'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	var data = this.visible.dataset;
	if (data['default'] !== undefined) {
		this.defaultValue = data['default'] === "1" || data['default'].toUpperCase() === 'TRUE';
	} else {
		this.defaultValue = false;
	}
	this.value = this.defaultValue;
	
	this.personalid = this.style.getCustomID();
	
	
	this.checkbox = document.createElement("input");
	this.checkbox.type = "checkbox";
	this.checkbox.id = this.personalid;
	this.checkbox.checked = this.value;
	this.checkbox.disabled = true;
	this.visible.appendChild(this.checkbox);
	
	this.inputListener = {
		variable : this,
		checkbox : this.checkbox,
		handleEvent : function () {
			this.variable.storeValue(this.checkbox.checked);
		}
	};
	
	this.checkbox.addEventListener("change", this.inputListener);
	
	// Backwards compatibility
	if (data.labelhtml !== undefined) data.label = data.labelhtml;
	
	if (data.label !== undefined) {
		this.label = document.createElement("label");
		this.label.appendChild(document.createTextNode(data.label));
		this.label.setAttribute('for', this.personalid);
		this.visible.appendChild(this.label);
	}
	
	this.update = function () {
		this.checkbox.checked = this.value;
		if (this.editing !== this.style.editing) this.toggleEdit();
	};
	
	this.toggleEdit = function () {
		this.editing = !this.editing;
		this.checkbox.disabled = !this.editing && this.editable;
	}
	
	this.storeValue = function (value) {
		if (typeof value !== 'boolean') {
			value = (value === '1') || (value.toUpperCase() === "TRUE");
		}
		
		if (value !== this.value) {
			this.value = value;
			this.update();
			this.setChanged();
		}
	};
} 
 
if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['image'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	this.defaultValue = ['0', null];
	this.value = ['0', null];
	
	this.input = document.createElement("select");
	this.updateOptions = function (lazy) {
		lazy = lazy === undefined ? false : lazy;
		if (lazy) {
			for (var i = 0; i < this.input.options.length; i++) {
				if (this.input.options[i].value === this.value[0]) {
					return;
				}
			}
		}
		while (this.input.firstChild) this.input.removeChild(this.input.firstChild);
		var option = document.createElement("option");
		option.className = "language";
		option.dataset['langhtml'] = "_SHEETCOMMONSPICKIMAGENONE_";
		option.value = '0';
		option.appendChild(document.createTextNode(window.app.ui.language.getLingo("_SHEETCOMMONSPICKIMAGENONE_")));
		this.input.appendChild(option);
		
		var folders = {};
		var foldersOrdered = [];
		var currentOption = null;
		for (var i = 0; i < window.app.imagedb.imagesOrdered.length; i++) {
            var image = window.app.imagedb.imagesOrdered[i];
            var imageo = document.createElement("option");
            imageo.value = image.getUrl();
            imageo.appendChild(document.createTextNode(image.getName()));
            if (folders[image.folder] === undefined) {
            	folders[image.folder] = document.createElement("optgroup");
            	if (image.folder === '') {
                	folders[image.folder].setAttribute('label', window.app.ui.language.getLingo("_SHEETCOMMONSPICKIMAGENOFOLDER_"));
            	} else {
            		folders[image.folder].setAttribute('label', image.folder);
            	}
            	foldersOrdered.push(image.folder);
            }
            folders[image.folder].appendChild(imageo);
            
            if (imageo.value === this.value[0]) {
            	currentOption = imageo;
            }
		}
		
		
		
		foldersOrdered.sort();
		
		for (var i = 0; i < foldersOrdered.length; i++) {
			this.input.appendChild(folders[foldersOrdered[i]]);
		}
		
		if (currentOption === null) {
			if (this.value[0] !== '0') {
				var imageo = document.createElement("option");
				imageo.value = this.value[0];
				imageo.appendChild(document.createTextNode(this.value[1]));
				if (this.input.childNodes.length > 1) {
					this.input.insertBefore(imageo, this.input.childNodes[1]);
				} else {
					this.input.appendChild(imageo);
				}
			}
		} else {
			currentOption.selected = true;
		}
		
		if (i === 0) {
			// LOAD IMAGES
		}
	};
	this.updateOptions();
	
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			var index = this.input.selectedIndex;
			
			this.variable.storeValue([this.input.value, this.input.options[index].firstChild.nodeValue]);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);
	
	while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
	
	this.textNode = document.createElement("img");
	if (this.value[0] !== "0") {
		this.textNode.src = this.value[0];
		this.textNode.style.display = '';
	} else {
		this.textNode.style.display = "none";
	}
	this.visible.appendChild(this.textNode);
	
//	this.textNode.nodeValue = this.options[this.value];
//	this.visible.appendChild(this.textNode);

	this.update = function () {
		if (this.editing !== this.style.editing) {
			this.toggleEdit();
		}
		if (this.editing) {
			this.input.value = this.value[0];
		} else {
			this.textNode.src = this.value[0];
			this.textNode.style.display = (this.value[0] !== '0') ? '' : 'none';
		}
	};
	
	this.storeValue = function (obj) {
		if (!Array.isArray(obj) || obj.length !== 2
				|| (obj[0] === this.value[0] && obj[1] === this.value[1])      ) {
			return false;
		}
		this.value = obj;
		this.updateOptions(true);
		this.update();
		this.setChanged();
	};
	
	this.imageListUpdateHandler = {
		variable : this,
		handleEvent : function () {
			this.variable.updateOptions();
		}
	};
	
	window.app.imagedb.addListener(this.imageListUpdateHandler);
	
	this.seppuku = function () {
		window.app.imagedb.removeListener(this.imageListUpdateHandler);
	};
} 
 
if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['integer'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, true, true);
	varb.takeMe(this);
	varb = null;
	
	var data = this.visible.dataset;
	this.defaultValue = data['default'];
	
	if (isNaN(this.defaultValue, 10)) {
		this.defaultValue = 0;
	} else {
		this.defaultValue = parseInt(this.defaultValue);
	}
	
	this.storeValue = function (value) {
		if (typeof value === 'string') {
			value = value.replace(/,/g, '.');
		}
		if (value === null || isNaN(value, 10)) {
			this.update();
		} else {
			value = parseInt(value);
			if (value !== this.value) {
				this.value = value;
				this.update();
				this.setChanged();
			}
		}
	};
} 
 
if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['longtext'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	var data = this.visible.dataset;
	this.autoresize = data.autoresize === undefined ? true : (data.autoresize === "1" || data.autoresize === 'true');
	this.emptyParagraph = data.emptyparagraph === undefined ? true : (data.emptyparagraph === "1" || data.emptyparagraph === 'true');

	while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
	
	// P = {p : DOMElement, text : DOMtext}
	this.pool = [];
	this.p = [];
	
	this.createP = function (value) {
		// Add non-breaking space
		if (this.pool.length > 0) {
			var p = this.pool.pop();
			p.text.nodeValue = value;
		} else {
			var p = {
				p : document.createElement("p"),
				text : document.createTextNode(value)
			};
			p.p.appendChild(p.text);
		}
		return p;
	};
	
	this.input = document.createElement("textarea");
	this.input.value = this.defaultValue;
	this.input.placeholder = this.placeholder;
	
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			this.variable.storeValue(this.input.value);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);
	
	this.resize = function () {
		this.input.style.height = 'auto';
		if (this.input.scrollHeight < 20) {
			this.input.style.heigher = "1em";
		} else {
			this.input.style.height = this.input.scrollHeight + "px";
		}
	};
	
	this.autoresizer = {
		variable : this,
		handleEvent : function () {
			this.variable.resize();
		}
	};

	this.input.addEventListener("change", this.autoresizer);
	this.input.addEventListener("keyup", this.autoresizer);
	this.input.addEventListener("click", this.autoresizer);
	
	this.update = function () {
		if (this.editing !== this.style.editing) this.toggleEdit();
		if (this.editing) {
			this.input.value = this.value;
			this.resize();
		} else {
			var lines = this.value.split(/\r\n|\r|\n/);
			var goodlines = [];
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].trim();
				if (line === "") {
					if (!this.emptyParagraph) continue;
					line = String.fromCharCode(160);
				}
				goodlines.push(line);
			}
			while (goodlines.length < this.p.length) {
				var p = this.p.pop();
				this.pool.push(p);
				this.visible.removeChild(p.p);
			}
			for (var i = 0; i < goodlines.length; i++) {
				var line = goodlines[i];
				if ((i+1) > this.p.length) {
					var p = this.createP(line);
					this.visible.appendChild(p.p);
					this.p.push(p);
				} else {
					this.p[i].text.nodeValue = line;
				}
			}
		}
	}
	
	this.toggleEdit = function () {
		while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
		this.editing = !this.editing;
		if (this.editing) {
			this.visible.appendChild(this.input);
		} else {
			for (var i = 0; i < this.p.length; i++) {
				this.visible.appendChild(this.p[i].p);
			}
		}
	};
} 
 
if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['name'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent);
	for (var key in varb) {
		this[key] = varb[key];
	}
	varb = null;


	/**
	 * Settings
	 */
	var data = this.visible.dataset;
	
	this.id = "SheetName_" + style.id;
	this.placeholder = data.placeholder === undefined ? "" : data.placeholder;
	this.defaultValue = data['default'] === undefined ? "" : data["default"];
	

	/**
	 * Input Element
	 */
	this.input = document.createElement("input");
	this.input.type = "text";
	this.input.value = this.defaultValue;
	this.input.placeholder = this.placeholder;

	/**
	 * Input Change Listener
	 */
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			this.variable.storeValue(this.input.value);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);

	/**
	 * Text Node
	 */
	this.textNode = document.createTextNode(this.defaultValue);
	while (this.visible.firstChild) {
		this.visible.removeChild(this.visible.firstChild);
	}
	this.visible.appendChild(this.textNode);
	
	this.editing = false;

	/**
	 * Updates the visible element
	 */
	this.update = function () {
		if (this.editing !== this.style.editing) this.toggleEdit();
		if (this.editing) {
			this.input.value = this.value;
		} else {
			this.textNode.nodeValue = this.value;
		}
	};
	
	/**
	 * Stores a new value
	 */
	this.storeValue = function (str) {
		if (this.value !== str) {
			this.value = str;
			this.update();
			this.style.sheetInstance.name = this.value;
			this.setChanged();
		}
	};
	
	/**
	 * Makes either the Input or the TextNode visible
	 */
	this.toggleEdit = function () {
		this.visible.removeChild(this.visible.firstChild);
		this.editing = !this.editing;
		if (this.editing) {
			this.visible.appendChild(this.input);
		} else {
			this.visible.appendChild(this.textNode);
		}
	};
} 
 
function Variable_Null () {
	this.getObject = function () {
		return null;
	};
	
	this.seppuku = function () {};
}

if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['null'] = Variable_Null; 
 
if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['number'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, true, true);
	varb.takeMe(this);
	varb = null;
	
	var data = this.visible.dataset;
	this.defaultValue = data['default'];
	
	if (isNaN(this.defaultValue, 10)) {
		this.defaultValue = 0;
	} else {
		this.defaultValue = parseFloat(this.defaultValue);
	}
	
	this.storeValue = function (value) {
		if (typeof value === 'string') {
			value = value.replace(/,/g, '.');
		}
		if (value === null || isNaN(value, 10)) {
			this.update();
		} else {
			value = parseFloat(value);
			value = +(value.toFixed(2));
			if (value !== this.value) {
				this.value = value;
				this.update();
				this.setChanged();
			}
		}
	};
} 
 
if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['select'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, true);
	varb.takeMe(this);
	varb = null;
	
	
	
	this.defaultValue = isNaN(this.defaultValue, 10) ? 0 : parseInt(this.defaultValue);
	this.options = this.visible.dataset.options === undefined ? ["Undefined"] : this.visible.dataset.options.split(";");
	if (this.defaultValue < 0 || this.defaultValue > this.options.length) {
		this.defaultValue = 0;
	}
	
	this.input = document.createElement("select");
	this.updateOptions = function () {
		while (this.input.firstChild) this.input.removeChild(this.input.firstChild);
		for (var i = 0; i < this.options.length; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.appendChild(document.createTextNode(this.options[i]));
			this.input.appendChild(option);
		}
	};
	this.updateOptions();
	
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			this.variable.storeValue(this.input.value);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);
	
	while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
	
	this.textNode.nodeValue = this.options[this.value];
	this.visible.appendChild(this.textNode);
	
	this.getValue = function () {
		return this.options[this.value];
	};

	this.update = function () {
		if (this.editing !== this.style.editing) {
			this.toggleEdit();
		}
		if (this.editing) {
			this.input.value = this.value;
		} else {
			this.textNode.nodeValue = this.getValue();
		}
	};
	
	this.storeValue = function (idx) {
		idx = parseInt(idx);
		if (idx !== this.value && idx >= 0 && idx < this.options.length) {
			this.value = idx;
			this.update();
			this.setChanged();
		}
	};
} 
 
/**
 * Creates a validator around $form.
 * Meant to be created and thrown away when no longer needed.
 * 
 * Inputs that require validation need to contain the class "validate".
 * Attribute data-validationtype sets the kind of validation it uses.
 * Valid types:
 * "shortname" : A-Za-z0-9, maximum of 10 characters, minimum of 3.
 * "login" : a-z0-9, doesn't start with numbers, maximum of 10 characters, minimum of 3.
 * "name" : A-Za-z0-9, Space and portuguese characters, maximum of 30 characters.
 * "longname" : same as name, but goes to 200 characters.
 * "notnull" : anything that isn't blank.
 * 
 * @param {jQuery} $form
 * @constructor
 * @returns {FormValidator}
 */
function FormValidator ($form) {
    this.$errors = [];
    this.validated = true;
    this.validator = new Validator();
    
    this.validate = function (object) {
        var $object = $(object);
        var val = $object.val();
        var valtype = $object.attr('data-validationtype');
        if (!this.validator.validate(val, valtype)) {
            this.$errors.push($object);
            this.validated = false;
        }
        console.log(val + ' - ' + valtype);
    };
    
    var $list = $form.find('.validate');
    
    for (var i = 0; i < $list.length; i++) {
        this.validate($list[i]);
    }
} 
 
/**
 * Controlador geral da interface com o usuário.
 * @class UI
 * @constructor
 * @requires Chat
 */
function UI () {
    /**
     * @type Chat
     */
    this.chat = new Chat();
    /**
     * @type Language
     */
    this.language = new Language();
    
    /**
     * 
     * @type LoginUI
     */
    this.loginui = new LoginUI();
    
    this.intro = new IntroUI();
    
    /**
     * @type ChangelogUI
     */
    this.changelogui = new ChangelogUI();
    
    this.forumui = new ForumUI();
    
    
    this.soundui = new SoundUI();
    
    this.imageui = new ImageUI();
    
    this.configui = new ConfigUI();
    
    this.gameui = new GameUI();
    
    this.youtubeui = new YoutubeUI();
    
    this.sheetui = new SheetUI();
    
    this.navigator = new Navigator();
    
    this.addonui = new AddonUI();
    
    this.styleui = new StyleUI();
    
    this.pictureui = new PictureUI();
    
    
    this.simplefloater = new SimpleFloater();
    
    /**
     * Only call element once.
     */
    this.$loading;
    this.loadingCount = 1;
    this.$leftWindow;
    this.$rightWindow;
    this.$leftHandler;
    this.$rightHandler;
    this.$pictureContainer;
    this.$window;
    this.$leftBlocker;
    this.leftBlockCount = 0;
    this.$rightBlocker;
    this.rightBlockCount = 0;
    
    this.hasFocus = true;
    this.title = "RedPG";
    this.nonotifications = false;
    this.notificationLingo = "_NEWMESSAGES_";
    
    this.widthInterval;
    this.lastWidth;
    this.lastHeight = 0;
    this.lastWidth = 0;
    this.$singletonCss = $('<style type="text/css" />');
    this.$removeAvatarCss = $('<style type="text/css" />');
    
    this.lastLeft = '';
    this.lastRight = '';
    
    /**
     * Configurators
     */
    this.configChanged = function (id) {
        if (id === 'fsmode') {
            this.handleResize();
            this.checkWidth();
        }
    };
    
    this.configValidation = function (id, value) {
        if (id === 'fsmode') {
            if (value === 0 || value === 1) return true;
            return false;
        }
    };
    
    this.configDefault = function (id) {
        //window.app.configdb.get('fullscreenmode', 'auto')
        if (id === 'fsmode') return 0;
    };
    
    
    /**
     * Initializes User Interface. Applies bindings and such.
     * Also calls init on every child.
     * @returns {void}
     */
    this.init = function () {
        window.app.config.registerConfig("fsmode", this);
        
        $('head').append(this.$singletonCss)
                 .append(this.$removeAvatarCss);
        
        if (jQuery.browser.mobile) {
            $('body').addClass('mobile');
            
            // Some mobile browsers DO NOT inform width changes because they are dirty little assholes
            this.widthInterval = setInterval(function () {
                if (window.app.ui.$window.width() !== window.app.ui.lastWidth) {
                    window.app.ui.handleResize();
                }
            }, 3000);
        }
        
        $(window).focus(function() {
            window.app.ui.hasFocus = true;
            window.app.ui.removeNotifications();
        })
        .blur(function() {
            window.app.ui.hasFocus = false;
        });
        
        this.$pictureContainer = $('#pictureContainer');
        this.$pictureContainer.css('visibility', 'hidden');
        this.$pictureContainer.css('opacity', 0);
        this.$loading = $('#loading');
        this.$leftWindow = $('#leftWindow');
        this.$rightWindow = $('#rightWindow');
        this.$leftHandler = $('#leftHandler');
        this.$rightHandler = $('#rightHandler');
        this.$window = $(window);
        this.hideLoading();
        this.applyBindings();
        this.configui.init();
        this.language.init();
        this.chat.init();
        this.changelogui.init();
        this.gameui.init();
        this.soundui.init();
        this.loginui.init();
        this.intro.init();
        this.youtubeui.init();
        this.sheetui.init();
        this.navigator.init();
        this.pictureui.init();
        this.handleResize();
        
        this.$leftBlocker = $('#leftBlock');
        this.$rightBlocker = $('#rightBlock');
        
        if (typeof localStorage.lastLogin !== 'undefined') {
            $('#loginInput').val(localStorage.lastLogin);
            $('#passwordInput').focus();
        } else {
            $('#loginInput').focus();
        }
        
        this.callLeftWindow('changelogWindow');
        this.callRightWindow('homeWindow');
    };
    
    this.unblockLeft = function () {
        if (--this.leftBlockCount === 0) {
            this.$leftBlocker.finish().fadeOut();
        }
    };
    
    this.blockLeft = function () {
        if (++this.leftBlockCount > 0) {
            this.$leftBlocker.show();
        }
    };
    
    this.unblockRight = function () {
        if (--this.rightBlockCount === 0) {
            this.$rightBlocker.finish().fadeOut();
        }
    };
    
    this.blockRight = function () {
        if (++this.rightBlockCount > 0) {
            this.$rightBlocker.show();
        }
    };
    
    this.hideLoading = function () {
        if (--this.loadingCount < 1) {
            this.$loading.stop(true, true).fadeOut(200);
        }
    };
    
    this.showLoading = function () {
        if (++this.loadingCount > 0) {
            this.$loading.stop(true, true).fadeIn(200);
        }
    };
    
    this.debugIndex = function () {
        $('div').each(function() {
            var $this = $(this);
            if ($this.css('z-index') && $this.css('z-index') !== 'auto') {
               console.log($this.attr('id') + ' - ' + $this.css('z-index'));
            }
        });
    };
    
    this.hideUI = function () {
        this.$leftHandler.css("visibility", "hidden");
        this.$rightHandler.css("visibility", "hidden");
        this.$leftWindow.css("visibility", "hidden");
        this.$rightWindow.css("visibility", "hidden");
        this.$pictureContainer.css("visibility", "hidden");
        this.$pictureContainer.css("opacity", 0);
    };
    
    this.showUI = function () {
        this.$leftHandler.css("visibility", "visible");
        this.$rightHandler.css("visibility", "visible");
        this.$leftWindow.css("visibility", "visible");
        this.$rightWindow.css("visibility", "visible");
    };
    
    
    /**
     * Handles UI resizes and updates UI to work with it.
     * Also calls upon handleResize of children.
     * @returns {void}
     */
    this.handleResize = function () {
        console.log('Handling resize');
        var height = window.app.ui.$window.height();
        if (height !== this.lastHeight) {
            this.lastHeight = height;
            height -= 50;
            this.$singletonCss.empty().append("div.styledWindow > div.singleton { height: " + parseInt(height) + "px; }");
            
            if (this.lastHeight < 500) {
                this.$removeAvatarCss.empty().append("#avatarContainer { display: none; } #areaChat { top: 10px; }");
            } else {
                this.$removeAvatarCss.empty();
            }
        }
        var width = window.app.ui.$window.width();
        if (width !== this.lastWidth) {
            this.lastWidth = width;
            this.checkWidth();
        }
        this.chat.handleResize();
        this.pictureui.handleResize();
    };
    
    /**
     * Checks current screen width and adds fullscreen tags to the windows if needed.
     * @returns {void}
     */
    this.checkWidth = function () {
        if (window.app.config.get("fsmode") === 1 || this.lastWidth < 1240) {
            this.$leftWindow.addClass('fullScreen');
            this.$rightWindow.addClass('fullScreen');
            this.$leftHandler.addClass('fullScreen');
            this.$leftHandler.removeAttr('style');
            this.$rightHandler.addClass('fullScreen');
            this.$rightHandler.removeAttr('style');
            this.$pictureContainer.addClass('fullScreen');
            this.pictureui.fullscreen(true);
            this.$pictureContainer.css('width', '');
            this.$rightWindow.css('width', '');
            this.$leftWindow.css('right', '');
        } else {
            this.$leftWindow.removeClass('fullScreen');
            this.$rightWindow.removeClass('fullScreen');
            this.$leftHandler.removeClass('fullScreen');
            this.$rightHandler.removeClass('fullScreen');
            this.$pictureContainer.removeClass('fullScreen');
            this.pictureui.fullscreen(false);
            this.$leftHandler.css('left', '-100px');
            this.$rightHandler.css('right', '-100px');
            var available = this.lastWidth - 720;
            if (available <= 636) {
                this.$leftWindow.css('right', '720px');
                this.$rightWindow.css('width', '715px');
            } else {
                var avatarSize = 90;
                available -= 636;
                var right = 720;
                if (available > (avatarSize * 3)) {
                    right += available/2;
                } else if (available > (avatarSize * 2)) {
                    right += available/4;
                }
                right = parseInt (right);
                /* Right - Margin center - avatar buttons - margin left - margin right of window */
                var avatarRoom = this.lastWidth - right - 60 - 10 - 10 - 8;
                var avatarAmount = 1;
                while (avatarAmount * avatarSize <= avatarRoom) { avatarAmount++; }
                var giveBack = avatarRoom - (--avatarAmount * avatarSize);
                right += giveBack;
                this.$leftWindow.css('right', (right) + 'px');
                this.$rightWindow.css('width', (right - 5) + 'px');
                if (!window.app.ui.chat.mc.getModule('stream').isStream) {
                    this.$pictureContainer.css({"width" : (right - 10)});
                }
            }
        }
    };
    
    this.isStreaming = function () {
        if (window.app.ui.chat.mc.getModule('stream') === null) return false;
        return window.app.ui.chat.mc.getModule('stream').isStream;
    };
    
    /**
     * Applies bindings to every general User Interface element.
     * Elements that fit better into children need to be bound by the appropriate class.
     * @returns {void}
     */
    this.applyBindings = function () {
        this.$pictureContainer.bind('click', function () {
            $(this).animate({
                'opacity' : 0
            }, 200, function () {
                $(this).css('visibility', 'hidden');
            });
        });
        
        /**
         * Left and Right handlers must move in and out as the mouse targets them.
         */
        this.$leftHandler.bind('mouseenter', function () {
            window.app.ui.$leftHandler.stop(true, false).animate({
                left: '0px'
            }, {
                duration: 100
            });
        });
        
        this.$leftHandler.bind('mouseleave', function () {
            if (!window.app.ui.$leftHandler.hasClass('fullScreen'))
            window.app.ui.$leftHandler.stop(true, false).animate({
                left: '-100px'
            }, {
                duration: 100
            });
        });
        
        this.$rightHandler.bind('mouseenter', function () {
            window.app.ui.$rightHandler.stop(true, false).animate({
                right: '0px'
            }, {
                duration: 100
            });
        });
        
        this.$rightHandler.bind('mouseleave', function () {
            if (!window.app.ui.$rightHandler.hasClass('fullScreen'))
            window.app.ui.$rightHandler.stop(true, false).animate({
                right: '-100px'
            }, {
                duration: 100
            });
        });
        
        /**
         * Keep track of window resizes.
         */
        $(window).on("resize", function () {
            window.app.ui.handleResize();
        });
    };
    
    this.hideRightWindows = function (cbs) {
        if (typeof cbs === 'undefined') cbs = function () {};
        
        this.$rightWindow.children('div.window').animate(
            {   
                left: '100%'
            }, 300, window.app.emulateBind(
                function () {
                    $(this).css('visibility', 'hidden');
                    this.cbs();
                }, {cbs : cbs})
        );

        this.lastRight = '';
    };
    
    this.isFullscreen = function () {
        return this.$leftWindow.hasClass('fullScreen');
    };
    
    /**
     * Hides every window on the left side that is not #windowid.
     * If #windowid is hidden, shows it.
     * @param {String} windowid div.window ID
     * @returns {void}
     */
    this.callLeftWindow = function (windowid, history) {
        if (history === undefined) history = true;
        if (windowid === this.lastLeft) return;
        if (history && windowid !== this.lastLeft) {
            this.lastLeft = windowid;
            this.addHistory(windowid);
        } else {
            this.lastLeft = windowid;
        }
        var $target = $('#'+windowid);
        this.$leftWindow.children('div.window:visible').not($target).trigger('beforeUnload.UI').stop(true, false).animate(
            {   
                right: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden').trigger('hidden.UI');
            }
        );

        $target.css('visibility', 'visible');
        
        $target.stop(true, false).animate(
            {   
                right: '0px'
            }, 300, function () {
                $(this).trigger('shown.UI');
            }
        );
        if (this.isFullscreen()) {
            this.hideRightWindows();
        }
    };
    
    this.closeLeftWindow = function (history) {
        if (history === undefined) history = true;
        this.$leftWindow.children('div.window:visible').stop(true, false).animate(
            {   
                right: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden').trigger('hidden.UI');
            }
        );

        this.lastLeft = '';
        if (history) {
            this.addHistory();
        }
    };
    
    this.stopRightUnload = false;
    this.callRightWindow = function (windowid, history) {
        if (history === undefined) history = true;
        if (windowid === this.lastRight) return;
        if (history && windowid !== this.lastRight) {
            this.lastRight = windowid;
            this.addHistory();
        } else {
            this.lastRight = windowid;
        }
        var $target = $('#'+windowid);
        this.stopRightUnload = false;
        var $windows = this.$rightWindow.children('div.window:visible').not($target).trigger('beforeUnload.UI');
        if (this.stopRightUnload) {
            return;
        }
        $windows.stop(true, false).animate(
            {   
                left: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden').trigger('hidden.UI');
            }
        );

        $target.css('visibility', 'visible');
        
        $target.stop(true, false).animate(
            {   
                left: '0px'
            }, 300, function () {
                $(this).trigger('shown.UI');
            }
        );
    };
    
    this.closeRightWindow = function (history) {
        if (history === undefined) history = true;
        this.stopRightUnload = false;
        var $windows = this.$rightWindow.children('div.window');
        if (this.stopRightUnload) return;
        $windows.stop(true, false).animate(
            {   
                left: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden');
            }
        );
        this.lastRight = '';
        this.addHistory();
    };
    
    this.updateConfig = function () {
//        this.configui.updateConfig();
//        
//        window.app.ui.configui.$configlist.append("<p class='centered language' data-langhtml='_CONFIGFULLSCREEN_'></p>");
//        
//        var $options = $('<p class="centered" />');
//        var $auto = $('<input id="configfullscreenmodeauto" type="radio" name="configfullscreenmode" value="auto" />');
//        $auto.bind('change', function () {
//            if ($(this).prop('checked')) {
//                window.app.configdb.store('fullscreenmode', 'auto');
//                window.app.updateConfig();
//            }
//        });
//        if (window.app.configdb.get('fullscreenmode', 'auto') === 'auto') {
//            $auto.prop('checked', true);
//        }
//        $options.append($auto);
//        $options.append($('<label for="configfullscreenmodeauto" class="language" data-langhtml="_AUTOFULL_" />'));
//        
//        var $always = $('<input id="configfullscreenmodeon" type="radio" name="configfullscreenmode" value="on" />');
//        $always.bind('change', function () {
//            if ($(this).prop('checked')) {
//                window.app.configdb.store('fullscreenmode', 'on');
//                window.app.ui.callRightWindow(('justhideit'));
//                window.app.updateConfig();
//            }
//        });
//        if (window.app.configdb.get('fullscreenmode', 'auto') === 'on') {
//            $always.prop('checked', true);
//        }
//        $options.append($always);
//        $options.append($('<label for="configfullscreenmodeon" class="language" data-langhtml="_ONFULL_" />'));
//        
//        
//        window.app.ui.configui.$configlist.append($options);
//        
//        window.app.ui.configui.$configlist.append($('<p class="explain language" data-langhtml="_CONFIGFULLSCREENEXPLAIN_" />'));
//        
        this.handleResize();
        
//        this.chat.updateConfig();
//        this.language.updateConfig();
//        this.gameui.updateConfig();
//        this.youtubeui.updateConfig();
//        this.sheetui.updateConfig();
        
//        this.language.applyLanguageOn(this.configui.$configlist);
    };
    
    /**
     * Init UI once document is loaded. Fully loaded is overkill
     */
//    $(document).ready(function () {
//        window.app.ui.init();
//    });
    
    /**
     * For some reason chrome randomly places the scroll of the singleton divs outside their boxes, resulting in shamefur dispray
     * And for some reason, that disappears once content reflows... So we force a reflow.
     */
    $(window).load(function () {
        $('body').css('height', (window.app.ui.$window.height() - 1) + 'px');
        window.setTimeout(function () {
            $('body').css('height', '');
        }, 5);
    });
    
    this.notifyMessages = function () {
        if (this.nonotifications) {
            return false;
        }
        document.title = '(' + this.language.getLingo(this.notificationLingo) + ') ' + this.title;
    };
    
    this.removeNotifications = function () {
        document.title = this.title;
    };
    
    this.openHitbox = function () {
        var lastsrc = $('#hitboxChatiFrame').attr('src');
        if (lastsrc !== undefined && lastsrc !== null && lastsrc !== '') {
            this.callRightWindow('hitboxChat');
            return;
        }
        var channel = prompt("Channel:");
        var src = 'http://www.hitbox.tv/embedchat/' + channel;
        if (channel !== '' && channel !== null && src !== $('#hitboxChatiFrame').attr('src')) {
            $('#hitboxChatiFrame').attr(
                'src', 
                src
            );
        }
        this.callRightWindow('hitboxChat');
    };
    
    this.closeHitbox = function () {
        $('#hitboxChatiFrame').attr('src', '');
        this.closeRightWindow();
    };
    
    this.addHistory = function () {
        history.pushState({left : this.lastLeft, right: this.lastRight}, '', window.location);
    };
    
    window.onpopstate = function (e) {
        if (typeof e === 'object' && e.state !== undefined) {
            if (e.state.left !== undefined) {
                if (e.state.left !== '') window.app.ui.callLeftWindow(e.state.left, false);
                else window.app.ui.closeLeftWindow(false);
                if (e.state.right !== '') window.app.ui.callRightWindow(e.state.right, false);
                else window.app.ui.closeRightWindow(false);
            } else if (e.state.sheetid !== undefined) {
                window.app.ui.sheetui.controller.openSheet(e.state.sheetid, undefined, undefined, undefined, undefined, false);
            }
        }
    };
} 
 
function Validator () {
    this.validate = function (val, valtype) {
        if (valtype === 'email') {
            if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)) {
                console.log('invalidMail');
                return false;
            }
        } else if (valtype === 'password') {
            if (!val.match('^[a-zA-Z0-9]{3,12}$')) {
                console.log('invalidPassword');
                return false;
            }
        } else if (valtype === 'name') {
            if (!val.match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,30}$') || val.charAt(0) === ' ') {
                console.log('invalidName');
                return false;
            }
        } else if (valtype === 'shortname') {
            if (!val.match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,12}$') || val.charAt(0) === ' ') {
                console.log('invalidShortName');
                return false;
            }
        } else if (valtype === 'nicksufix') {
            if (!val.match('^[0-9]{4,4}$')) {
                console.log('invalidNickSufix');
                return false;
            }
        } else if (valtype === 'nickname') {
            if (!val.match('^[a-zA-Z0-9çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,12}$')) {
                console.log('invalidNickname');
                return false;
            }
        } else if (valtype === 'language') {
            if (!val.match('^[a-zA-Z]{3,30}$')) {
                console.log('invalidLanguage');
                return false;
            }
        } else if (valtype === 'longname') {
            if (!val.match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,200}$') || val.charAt(0) === ' ') {
                console.log('invalidLongName');
                return false;
            }
        } else if (valtype === 'login') { 
            if (!val.match('^[a-z0-9]{3,12}$')) {
                console.log('invalidLogin');
                return false;
            }
        } else if (valtype === 'number') {
            if (!$.isNumeric(val)) {
                console.log('invalidNumber');
                return false;
            }
        } else if (valtype === 'notnull') {
            if (val === '') {
                console.log('invalidNotnull');
                return false;
            }
        }
        return true;
    };
} 
 
function AddonUI () {
    
    this.$box = $('#addonBox').hide();
    
    this.$handle = $('#addonBoxHandle').empty();
    this.$ul = $('#addonBoxUL');
    
    this.currentAddon = '';
    
    this.currentList = {};
    this.currentType = '';
    
    /**
     * 
     * @param {jQuery} $dom
     * @returns {$dom}
     */
    this.addonize = function ($dom, addon) {
        $dom.off('.addon').on('mouseenter.addon', function (e) {
            window.app.ui.addonui.showAddonBox($(this), e, 'addon');
        }).on('mouseleave.addon', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove.addon', function (e) {
            window.app.ui.addonui.moveAddonBox(e);
        }).attr('data-listid', addon);
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @returns {$dom}
     */
    this.turnVantagem = function ($dom, vantagem) {
        $dom.off('.addon').on('mouseenter.addon', function (e) {
            window.app.ui.addonui.showAddonBox($(this), e, 'vantagem');
        }).on('mouseleave.addon', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove.addon', function (e) {
            window.app.ui.addonui.moveAddonBox(e);
        }).attr('data-listid', vantagem);
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @returns {$dom}
     */
    this.turnDesvantagem = function ($dom, desvantagem) {
        $dom.off('.addon').on('mouseenter.addon', function (e) {
            window.app.ui.addonui.showAddonBox($(this), e, 'desvantagem');
        }).on('mouseleave.addon', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove.addon', function (e) {
            window.app.ui.addonui.moveAddonBox(e);
        }).attr('data-listid', desvantagem);
    };
    
    this.unAddonize = function ($dom) {
        $dom.off('.addon').attr('data-listid', '');
    };
    
    this.showAddonBox = function ($dom, e, type) {
        if (type === 'addon') {
            this.currentList = window.techAddonsHash;
            this.listType = 'addon';
        } else if (type === 'vantagem') {
            this.currentList = window.vantagensHash;
            this.listType = 'vantagem';
        } else if (type === 'desvantagem') {
            this.listType = 'desvantagem';
            this.currentList = window.desvantagensHash;
        }
        this.currentAddon = $dom.attr("data-listid").toUpperCase().replace(/ *\([^)]*\) */, '').trim();
        if (this.currentList === undefined) {
            var cbs = function () {
                window.app.ui.addonui.updateAddonBox(2);
            };
            
            var cbe = function () {
                window.app.ui.addonui.updateAddonBox(0);
            };
            
            if (this.listType === 'addon') {
                window.app.addonapp.loadTecnicas(cbs, cbe);
            } else if (this.listType === 'vantagem' || this.listType === 'desvantagem') {
                window.app.addonapp.loadVantagens(cbs, cbe);
            }
            this.updateAddonBox(1);
        } else {
            window.app.ui.addonui.updateAddonBox(3);
        }
        this.$box.stop(true, false).fadeIn(100);
        this.moveAddonBox(e);
    };
    
    this.updateAddonBox = function (how) {
        if (this.listType === 'addon') {
            this.currentList = window.techAddonsHash;
        } else if (this.listType === 'vantagem') {
            this.currentList = window.vantagensHash;
        } else if (this.listType === 'desvantagem') {
            this.currentList = window.desvantagensHash;
        }
        var oldHeight = this.$box.height();
        if (this.currentList === undefined) {
            this.$handle.empty().append("<img id='addonBoxIcon' src='http://rules.redpg.com.br/img/icon/Unknown.png' />");
            if (how === 1) {
                this.$handle.append(window.app.ui.language.getLingo("_ADDONBOXLOADING_"));
                this.$ul.empty().append(
                    $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXLOADINGEXPLAIN_"))
                );
            } else if (how === 0) {
                this.$handle.append(window.app.ui.language.getLingo("_ADDONBOXLOADINGERROR_"));
                this.$ul.empty().append(
                    $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXLOADINGERROREXPLAIN_"))
                );
            } else {
                this.$handle.append(window.app.ui.language.getLingo("_ADDONBOXLOADEDERROR_"));
                this.$ul.empty().append(
                    $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXLOADEDERROREXPLAIN_"))
                );
            }
        } else if (this.currentList[this.currentAddon] === undefined) {
            this.$handle.empty().append("<img id='addonBoxIcon' src='http://rules.redpg.com.br/img/icon/Unknown.png' />")
                        .append(window.app.ui.language.getLingo("_ADDONBOXNOTFOUND_"));
            this.$ul.empty().append(
                $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXNOTFOUNDEXPLAIN_"))
            );
        } else if (this.listType === 'addon') {
            var addon = this.currentList[this.currentAddon];
            this.$handle.empty();
            var $img = $('<img id="addonBoxIcon" />').attr('src', 'http://rules.redpg.com.br/img/icon/' + addon.nomeLimpo + '.png');
            this.$handle.text(addon.nome).prepend($img);
            this.$ul.empty();
            var $li;
            for (var i = 0; i < addon.efeitos.length; i++) {
                $li = $('<li />').text(addon.efeitos[i]);
                this.$ul.append($li);
            }
        } else if (this.listType === 'vantagem' || this.listType === 'desvantagem') {
            var addon = this.currentList[this.currentAddon];
            this.$handle.empty().text(addon.nome + ', ' + addon.pontos + (addon.pontos !== '1' ? " pontos" : ' ponto'));
            this.$ul.empty();
            var $li;
            for (var i = 0; i < addon.descricao.length; i++) {
                $li = $('<li />').text(addon.descricao[i]);
                this.$ul.append($li);
            }
            if (addon.requisitos !== undefined) {
                $li = $('<li />').text(addon.requisitos).prepend("<b>Requisitos: </b>");
                this.$ul.append($li);
            }
        }
        
        var newTop = oldHeight - this.$box.height();
        this.$box.css('top', newTop + this.$box.position().top);
    };
    
    /**
     * 
     * @param {Event} event
     * @returns {undefined}
     */
    this.moveAddonBox = function (event) {
        var top = event.pageY - this.$box.height() - 20;
        var left = event.pageX + 20;
        if (top < 10) {
            top = 10;
        }
        if (left + this.$box.width() + 10 > $(window).width()) {
            left = ($(window).width() - this.$box.width() - 10);
        }
        this.$box.css({
            left : left,
            top : top
        });
    };
} 
 
function ChangelogUI () {
    this.$updatetarget;
    
    this.newestVersion;
    
    this.init = function () {
        this.newestVersion = window.app.version;
        this.$updatetarget = $('#changelogAjaxTarget');
        
        var ajax = new ChangelogAjax();
        ajax.updateChangelog();
        
        $('#changelogLoadFully').on('click', function () {
            var ajax = new ChangelogAjax();
            ajax.getFullLog();
            window.app.ui.blockLeft();
        });
    };
    
    this.compareVersions = function (v1, v2) {
        if (v1[0] > v2[0]) {
            return true;
        } else if (v1[0] === v2[0]) {
            if (v1[1] > v2[1]) {
                return true;
            } else if (v1[1] === v2[1]) {
                if (v1[2] > v2[2]) {
                    return true;
                }
            }
        }
        return false;
    };
    
    this.considerNewest = function (version) {
        if (this.compareVersions(version, this.newestVersion)) {
            this.newestVersion = version;
        }
    };
    
    this.processUpdate = function (data) {
        $('#changelogAjaxError').hide();
        this.$updatetarget.html(data);
        
        this.$updatetarget.find('div').each(function () {
            var $this = $(this);
            var version = [parseInt($this.attr('data-major')),
                           parseInt($this.attr('data-minor')),
                           parseInt($this.attr('data-release'))
                          ];
            window.app.ui.changelogui.considerNewest(version);
            if (window.app.ui.changelogui.compareVersions(version, window.app.version)) {
                $this.addClass('newUpdate');
                $('#changelogUpdateNotice').show();
            }
        });
        
        $('#currentVersion').html(window.app.version[0] +
                                  '.' + window.app.version[1] +
                                  '.' + window.app.version[2]);
                          
                          
                          
        $('#updatedVersion').html(this.newestVersion[0] +
                                  '.' + this.newestVersion[1] +
                                  '.' + this.newestVersion[2]);
    };
    
    this.attach = function (data) {
        window.app.ui.unblockLeft();
        this.$updatetarget.append(data);
        $('#changelogLoadFully').hide();
    };
    
    this.attachError = function (data) {
        window.app.ui.unblockLeft();
        this.processError(data);
        $('#changelogLoadFully').hide();
    };
    
    this.processError = function (data) {
        this.$updatetarget.hide();
        $('#changelogAjaxError').show();
        $('#currentVersion').html(window.app.version[0] +
                                  '.' + window.app.version[1] +
                                  '.' + window.app.version[2]);
        $('#updatedVersion').parent().hide();
    };
} 
 
function AudioController () {
    this.bgm;
    this.se;
    
    this.$bar;
    
    this.$player;
    this.$playpause;
    this.$repeat;
    this.$volup;
    this.$voldown;
    this.$volumeslider;
    this.permittedFiles = $('#chatSounds')[0];
    
    this.init = function () {
        window.app.config.registerConfig('bgmVolume', this);
        window.app.config.registerConfig('seVolume', this);
        window.app.config.registerConfig('bgmLoop', this);
        window.app.config.registerConfig('autoBGM', this);
        window.app.config.registerConfig('autoSE', this);
        
        this.bgm = document.getElementById('musicPlayerAudioBGM');
        this.se = document.getElementById('musicPlayerAudioSE');
        this.$bar = $('#musicPlayerProgressCurrent');
        
        this.$player = $('#musicPlayerWrapper');
        this.$playpause = $('#musicPlayerActionButton');
        this.$repeat = $('#musicPlayerRepeatButton');
        
        this.$volup = $('#musicPlayerVolumeUp');
        this.$voldown = $('#musicPlayerVolumeDown');
        this.$volumeslider = $('#musicPlayerCurrentVolume');
        
        this.setBindings();
    };
    
    this.updateBar = function (current, max) {
        this.$bar.attr('value', current / max);
        if (current >= max) {
            this.ended();
        }
    };
    
    this.playpause = function () {
        if (this.$playpause.hasClass('toggled')) {
            this.bgm.pause();
            this.$playpause.removeClass('toggled');
        } else {
            this.$playpause.addClass('toggled');
            this.bgm.play();
        }
    };
    
    this.considerRepeat = function () {
        this.bgm.loop = window.app.config.get("bgmLoop");
        if (!this.bgm.loop) {
            this.$repeat.removeClass('toggled');
        } else {
            this.$repeat.addClass('toggled');
        }
    };
    
    this.ended = function () {
        if (!this.bgm.loop) {
            this.$playpause.removeClass('toggled');
            this.bgm.currentTime = 0;
            this.bgm.pause();
        } else {
            //this.bgm.currentTime = 0;
            //this.bgm.play();
            var filename = this.lastFilename;
            //this.play("aaaa");
            this.play(filename);
        }
    };
    
    this.moveSeeker = function (perc) {
        this.bgm.currentTime = (this.bgm.duration * perc);
    };
    
    this.changeVolume = function (diff) {
        this.bgm.volume += diff;
        if (this.bgm.volume >= 1) {
            this.bgm.volume = 1;
            this.$volup.addClass('deactivated');
            this.$voldown.removeClass('deactivated');
        } else if (this.bgm.volume <= 0) {
            this.bgm.volume = 0;
            this.$voldown.addClass('deactivated');
            this.$volup.removeClass('deactivated');
        } else {
            this.$volup.removeClass('deactivated');
            this.$voldown.removeClass('deactivated');
        }
    };
    
    this.changeVolumeTo = function (newVolume) {
        this.bgm.volume = newVolume;
        this.$volumeslider.height(this.bgm.volume * 100 + '%');
    };
    
    this.setBindings = function () {
        $('#musicPlayerAudioBGM').on('timeupdate', function() {
            window.app.ui.chat.audioc.updateBar(this.currentTime, this.duration);
        });
        
        this.$playpause.bind('click', function () {
            window.app.ui.chat.audioc.playpause();
        });
        
        this.$repeat.bind('click', function () {
            window.app.config.store("bgmLoop",
                !window.app.config.get("bgmLoop"));
        });
        
        this.$bar.bind('click', function (e) {
            var $this = $(this);
            var pointzero = $this.offset().left;
            var max = $this.width();
            var mouse = e.pageX;
            window.app.ui.chat.audioc.moveSeeker((e.pageX - pointzero) / max);
        });
        
        $('#musicPlayerVolumeWrapper').on('click', function (e) {
            var $this = $(this);
            var pointzero = $this.offset().top;
            var max = $this.height();
            var mouse = e.pageY;
            var volume = 1 - ((mouse - pointzero) / max);
            volume = + volume.toFixed(2);
            
            window.app.config.store("bgmVolume", volume);
        });
        
        this.$volup.bind('click', function () {
            window.app.ui.chat.audioc.changeVolume(0.05);
        });
        
        this.$voldown.bind('click', function () {
            window.app.ui.chat.audioc.changeVolume(-0.05);
        });
    };
    
    this.playse = function (filename) {
        var foundPerfect = false;
        if (filename.indexOf('://') === -1) {
            foundPerfect = this.setPermittedSource(false, filename);
            if (!foundPerfect) {
                filename = 'Sounds/' + filename;
            } else {
                return;
            }
        }
        this.se.setAttribute('src', filename);
        this.se.play();
    };
    
    this.stopse = function () {
        this.se.pause();
    };
    
    this.play = function (filename) {
        this.lastFilename = filename;
        this.$player.addClass('shown');
        var foundPerfect = false;
        if (filename.indexOf('://') === -1) {
            foundPerfect = this.setPermittedSource(true, filename);
            if (!foundPerfect) {
                filename = 'Sounds/' + filename;
            }
        }
        if (!foundPerfect) {
            this.bgm.setAttribute('src', filename);
            this.justPlayBGM();
        }
    };
    
    this.justPlayBGM = function () {  
        this.bgm.play();
        this.$playpause.addClass('toggled');
        this.changeVolumeTo(this.bgm.volume);
    };
    
    this.setPermittedSource = function (bgm, filename) {
        for (i = 0; i < this.permittedFiles.files.length; i++) {
            if (this.permittedFiles.files[i].name === filename) {
                var reader = new FileReader();
                if (bgm) {
                    reader.onload = function (e) {
                        window.app.ui.chat.audioc.bgm.setAttribute('src', e.target.result);
                        window.app.ui.chat.audioc.justPlayBGM();
                    };
                } else {
                    reader.onload = function (e) {
                        window.app.ui.chat.audioc.se.setAttribute('src', e.target.result);
                        window.app.ui.chat.audioc.se.play();
                    };
                }
                reader.readAsDataURL(this.permittedFiles.files[i]);
                return true;
            }
        }
    };
    
    this.configValidation = function (id, value) {
        if (id === 'bgmVolume' || id === 'seVolume') {
            if (typeof value === 'number' && value >= 0 && value <= 1) return true;
        }
        if (id === 'bgmLoop') {
            if (typeof value === 'boolean') return true;
        }
        if (id === 'autoBGM'|| id === 'autoSE') {
            if (typeof value !== 'number' || value < 0 || value > 2 || parseInt(value) !== value) return false;
            return true;
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'bgmVolume') return 1;
        if (id === 'seVolume') return 0.05;
        if (id === 'bgmLoop') return true;
        if (id === 'autoBGM') return 1;
        if (id === 'autoSE') return 1;
    };
    
    this.configChanged = function (id) {
        if (id === 'bgmVolume') {
            this.changeVolumeTo(window.app.config.get('bgmVolume'));
        } else if (id === 'seVolume') {
            this.se.volume = window.app.config.get('seVolume');
        } else if (id === 'bgmLoop') {
            this.considerRepeat();
        }
    };
} 
 
/**
 * Controlador da interface do CHAT apenas.
 * @class Chat
 * @requires MessageController
 * @requires PersonaController
 * @constructor
 */
function Chat () {
    this.$hidingCSS = $('<style type="text/css" />');
    $('head').append(this.$hidingCSS);
    
    this.tracker = new CombatTracker();
    this.langtab = new LanguageTracker();
    this.mc = new MessageController();
    this.pc = new PersonaController();
    this.ac = new AvatarController();
    this.dc = new DiceController();
    this.cc = new ChatController(this);
    this.audioc = new AudioController();
    this.logger = new Logger();
    
    // Elements
    this.$chatbox;
    this.$chatmensagemtipo;
    this.$chatscrolltobottom;
    this.$window;
    this.$dicereasonprompt;
    this.$dicefacesprompt;
    this.$dicequantityprompt;
    this.$chatmessageprompt;
    this.$dicemodprompt;
    this.$roomName;
    this.$roomDesc;
    this.$chatHeader;
    this.$chatMessages;
    
    
    // Inputs
    this.$chatinput;
    this.$dicequantity;
    this.$dicefaces;
    this.$dicereason;
    
    // Chat notification area
    this.$longloadicon;
    this.$connectionerroricon;
    
    
    /**
     * Tamanho atual da fonte mostrada no chat.
     * @type Number
     */
    this.alwaysBottom = true;
    this.powerBottom;
    
    this.configChanged = function (id) {
        if (id === 'chatfontsize') {
            this.$chatbox.css({'font-size' : window.app.config.get("chatfontsize") + 'em'});
        } else if (id === 'chatuseprompt') {
            this.considerPrompts();
        }
    };
    
    this.configValidation = function (id, value) {
        if (id === 'chatfontsize' && typeof value === 'number') {
            if (value >= 0.95 && value <= 1.90) return true;
            return false;
        }
        if ((id === 'chatuseprompt' || id === 'autoImage') && typeof value === 'number') {
            if (value >= 0 && value <=2 && parseInt(value) === value) {
                return true;
            }
            return false;
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'chatfontsize') return 0.95;
        if (id === 'chatuseprompt') return 2;
        if (id === 'autoImage') return 1;
    };
    
    
    /**
     * Adds diff to the current font size.
     * @param {Number} diff
     * @returns {void}
     */
    this.changeChatFont = function (diff) {
        var fontsize = window.app.config.get("chatfontsize") + diff;
        fontsize = +fontsize.toFixed(2);
        if (fontsize > 1.8) {
            fontsize = 1.8;
        }
        window.app.config.store('chatfontsize', fontsize);
    };
    
    /**
     * Initializes Chat UI.
     * @returns {void}
     */
    this.init = function () {
        window.app.config.registerConfig('chatfontsize', this);
        window.app.config.registerConfig('chatuseprompt', this);
        window.app.config.registerConfig('autoImage', this);
        
        
        // Now that the document is ready, initialize elements
        this.$longloadicon = $('#chatNotLoad');
        this.$connectionerroricon = $('#chatNotConnError');
        this.$chatbox = $('#areaChatBox');
        this.$chatinput = $('#chatMensagemInput');
        this.$chatmensagemtipo = $('#chatMensagemTipo');
        this.$chatscrolltobottom = $('#chatScrolltoBottom').hide();
        this.$window = $('#chatWindow');
        this.$dicequantity = $('#dadosFormQuantidade');
        this.$dicefaces = $('#dadosFormFaces');
        this.$dicereason = $('#dadosFormMotivo');
        this.$dicereasonprompt = $('#dadosFormMotivoPrompt');
        this.$dicefacesprompt = $('#dadosFormFacesPrompt');
        this.$dicequantityprompt = $('#dadosFormQuantidadePrompt');
        this.$chatmessageprompt = $('#chatMensagemPrompt');
        this.$dicemodprompt = $('#dadosFormModPrompt');
        this.$chatHeader = $('#chatIntro');
        this.$chatMessages = $('#chatMessages');
        this.$roomName = $('#roomName');
        this.$roomDesc = $('#roomDesc');
        
        // Clear "show everythings"
        //this.$chatbox.html('');
        this.$longloadicon.hide();
        this.$connectionerroricon.hide();
        
        // Bind stuff
        this.setBindings();
        this.considerPrompts();
        
        this.pc.init();
        this.mc.init();
        this.ac.init();
        this.audioc.init();
        this.cc.init();
        this.dc.init();
        this.logger.init();
        this.tracker.init();
        this.langtab.init();
    };
    
    /**
     * Reinitialises jScrollpane on chatbox.
     * @returns {undefined}
     */
    this.clearInformation = false;
    
    this.appendToHeader = function ($html) {
        this.$chatHeader.append($html);
        if (this.alwaysBottom) {
            this.scrollToBottom(true);
        }
    };
    
    this.appendToMessages = function ($html) {
        this.$chatMessages.append($html);
        if (this.alwaysBottom) {
            this.scrollToBottom(true);
        }
    };
    
    /**
     * Empties the whole of chatPane.
     * @returns {undefined}
     */
    this.clear = function () {
        this.$chatMessages.empty();
    };
    
    /**
     * Decides whether or not to use prompts instead of inputs.
     * @returns {undefined}
     */
    this.considerPrompts = function () {
        this.usePrompt = window.app.config.get("chatuseprompt");
        if (this.usePrompt === 2) {
            if (jQuery.browser.mobile) {
                this.showPrompts();
            } else {
                this.hidePrompts();
            }
        } else if (this.usePrompt === 1) {
            this.showPrompts();
        } else if (this.usePrompt === 0) {
            this.hidePrompts();
        }
    };
    
    this.showPrompts = function () {
        this.$dicefacesprompt.show();
        this.$dicequantityprompt.show();
        this.$dicereasonprompt.show();
        this.$chatmessageprompt.show();
        this.$dicemodprompt.show();
    };
    
    this.hidePrompts = function () {
        this.$dicefacesprompt.hide();
        this.$dicequantityprompt.hide();
        this.$dicereasonprompt.hide();
        this.$chatmessageprompt.hide();
        this.$dicemodprompt.hide();
    };
    
    /**
     * Sets all bindings on page elements.
     * Also calls other specialized binding functions which were too big to be here.
     * @returns {void}
     */
    this.setBindings = function () {
        this.setChatInputBindings();
        
        this.$chatbox.on('scroll', function (e) {
            var $this = $(this);
            var scrolled = this.scrollTop + $this.height();
            scrolled = this.scrollHeight - scrolled;
            if (scrolled > 2) {
                window.app.ui.chat.notAtBottom();
            } else {
                window.app.ui.chat.atBottom();
            }
        });
        
        this.$chatscrolltobottom.bind('click', function () {
            window.app.ui.chat.scrollToBottom(false);
        });
        
        $('#changeFontBig').bind('click', function () {
            window.app.ui.chat.changeChatFont(0.1);
        });
        
        $('#changeFontSmall').bind('click', function () {
            window.app.ui.chat.changeChatFont(-0.1);
        });
        
        this.$dicequantityprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICENUMBERPROMPT_');
            var input = window.prompt(lingo + ':');
            if (!isNaN(parseInt(input)) && isFinite(input)) {
                window.app.ui.chat.$dicequantity.val(input);
            } else {
                window.app.ui.chat.$dicequantity.val('');
            }
        });
        
        this.$dicemodprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICEMODPROMPT_');
            var input = window.prompt(lingo + ':');
            if (!isNaN(parseInt(input)) && isFinite(input)) {
                window.app.ui.chat.dc.$dicemod.val(input);
            } else {
                window.app.ui.chat.dc.$dicemod.val('');
            }
        });
        
        this.$dicefacesprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICEFACESPROMPT_');
            var input = window.prompt(lingo + ':');
            if (!isNaN(parseInt(input)) && isFinite(input)) {
                window.app.ui.chat.$dicefaces.val(input);
            } else {
                window.app.ui.chat.$dicefaces.val('');
            }
        });
        
        this.$dicereasonprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICEREASONPROMPT_');
            var input = window.prompt(lingo + ':');
            window.app.ui.chat.$dicereason.val(input);
        });
        
        $('#chatSettings').bind('click', function () {
            alert("Não implementado");
        });
        
        $('#modulesButton').bind('click', function () {
            alert("Não implementado");
        });
        
        this.$chatinput.bind('keydown keyup', function () {
            window.app.chatapp.updateTyping ($(this).val() !== '');
        });
    };
    
    /**
     * Bindings specific to the input.
     * Separated from the others for being the biggest.
     * @returns {void}
     */
    this.setChatInputBindings = function () {
        this.$chatinput.bind('keyup keydown', function(e) {
            window.app.ui.chat.$chatmensagemtipo.removeClass('chatNarrativa');
            window.app.ui.chat.$chatmensagemtipo.removeClass('chatAcao');
            window.app.ui.chat.$chatmensagemtipo.removeClass('chatOff');
            
            if (e.shiftKey) {
                window.app.ui.chat.$chatmensagemtipo.addClass('chatNarrativa');
            } else if (e.ctrlKey) {
                window.app.ui.chat.$chatmensagemtipo.addClass('chatAcao');
            } else if (e.altKey) {
                window.app.ui.chat.$chatmensagemtipo.addClass('chatOff');
            }
            
            if (e.keyCode === 18) {
                e.preventDefault();
            }
        });
        
        this.$chatinput.bind('keydown', function(e) {
            if (e.keyCode === 9 && $(this).val() === '') {
                if (!e.shiftKey) {
                    window.app.ui.chat.dc.$diceqt.focus();
                } else {
                    window.app.ui.chat.dc.$dicereason.focus();
                }
                e.preventDefault();
            }
        });
        
        $(document).bind('keypress',function(e) {
            window.app.ui.chat.considerRedirecting(e);
        });
        
        $(document).bind('keydown',function(e) {
            if (e.ctrlKey && e.keyCode === 86) {
                window.app.ui.chat.considerRedirecting(e);
            }
        });
        
        $('#sendMessageButton').bind('click', function () {
            window.app.ui.chat.mc.eatMessage();
        });
        
        this.$chatinput.bind('keydown', function(e) {
            // ENTER
            if (e.keyCode === 10 || e.keyCode === 13) {
                window.app.ui.chat.mc.eatMessage(e);
                e.preventDefault();
            }
            
            // UP
            if (e.keyCode === 38) {
                window.app.ui.chat.mc.messageRollUp();
                e.preventDefault();
            }
            
            // DOWN
            if (e.keyCode === 40) {
                window.app.ui.chat.mc.messageRollDown();
                e.preventDefault();
            }
            
            // ESC
            if (e.keyCode === 27) {
                window.app.ui.chat.$chatinput.val('');
                e.preventDefault();
            }
            
            // TAB
            if (e.keyCode === 9) {
                var msg = window.app.ui.chat.$chatinput.val().trim();
                if (msg.indexOf('/whisper') === 0 || msg.indexOf('/w') === 0) {
                    if (msg.indexOf(' ') !== -1) {
                        var slashCMD = msg.substr(0,msg.indexOf(' '));
                        var msgOnly = msg.substr(msg.indexOf(' ')+1);
                    } else {
                        var slashCMD = msg;
                        var msgOnly = '';
                    }
                    var mod = window.app.ui.chat.mc.getModule('Whisper');
                    if (mod.isValid(slashCMD, msgOnly)) {
                        window.app.ui.chat.$chatinput.val(mod.autoComplete(slashCMD, msgOnly));
                    } else {
                        var $autocomplete = mod.autoComplete(slashCMD, msgOnly);
                        window.app.ui.language.applyLanguageOn($autocomplete);
                        window.app.ui.chat.appendToMessages($autocomplete);
                    }
                }
                e.preventDefault();
            }
            
            // Space and tab
            if (e.keyCode === 9 || e.keyCode === 32) {
                var trimmed = window.app.ui.chat.$chatinput.val().trim();
                if (window.app.ui.chat.cc.room.lastWhisper !== null && (trimmed === '/r' || trimmed === '/reply')) {
                    var user = window.app.ui.chat.cc.room.lastWhisper;
                    window.app.ui.chat.$chatinput.val('/whisper ' + user.nickname + '#' + user.nicknamesufix + ', ');
                    window.app.ui.chat.$chatinput.focus();
                }
            }
        });
        
        this.$chatmessageprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_MESSAGEPROMPT_');
            var msg = window.prompt(lingo + ':');
            window.app.ui.chat.mc.processMessage(msg);
        });
    };
    
    /**
     * 
     * @param {Event} event
     * @returns {undefined}
     */
    this.considerRedirecting = function (event) {
        if ((!event.ctrlKey && !event.altKey) || (event.ctrlKey && event.keyCode === 86)) {
            if (this.$window.is(':visible')) {
                var $focus = $(':focus');
                if (typeof $focus === 'undefined' || !($focus.is("input") || $focus.is("textarea") || $focus.is("select"))) {
                    window.app.ui.chat.$chatinput.focus();
                }
            }
        }
    };
    
    /**
     * Updates window sizes to resizes.
     * @returns {void}
     */
    this.handleResize = function () {
        this.ac.handleResize();
    };
    
    
    this.scrollToBottom = function (instant) {
        var scrolltop = this.$chatbox[0].scrollHeight - this.$chatbox.height();
        if (instant) {
            this.$chatbox.stop(true, false).scrollTop(scrolltop);
            return;
        }
        this.$chatbox.stop(true, false).animate({
            scrollTop : scrolltop
        }, 300, function () {
            window.app.ui.chat.animating = false;
        });
        this.animating = true;
        this.atBottom();
    };
    
    this.notAtBottom = function () {
        if (this.animating) return;
        if (this.powerBottom) return this.atBottom();
        this.alwaysBottom = false;
        this.$chatscrolltobottom.stop(true, true).fadeIn(200);
    };
    
    this.atBottom = function () {
        if (this.animating) return;
        this.alwaysBottom = true;
        this.$chatscrolltobottom.stop(true, true).fadeOut(200);
    };
    
    this.considerBottoming = function () {
        if (this.alwaysBottom || this.powerBottom) {
            this.scrollToBottom(true);
        }
    };
    
    this.showEverything = function () {
        this.$hidingCSS.empty();
    };
    
    this.hideUnnecessary = function () {
        this.$hidingCSS.append("#avatarContainer, #chatBarra, #personaBox, #dadosForm, #dadosButtons > a { display: none; } #areaChat { top: 10px; bottom: 60px; }");
    };
} 
 
function ChatController (chat) {
    /**
     * @type Chat
     */
    this.chat = chat;
    
    this.mc = chat.mc;
    this.pc = new PlayerController();
    
    /**
     * @type Room
     */
    this.room = null;
    this.lastMessage = -1;
    this.firstPrint = true;
    
    this.printed = 0;
    this.clearInformed = false;
    this.lastDate = '';
    
    this.ignoreTooMany = false;
    
    this.onlineUsers = [];
    
    this.init = function () {
        
        
        this.setBindings();
    };
    
    this.openRoom = function (id) {
        this.ignoreTooMany = false;
        if (this.room === null || id !== this.room.id) {
            this.room = window.app.roomdb.getRoom(id);
            this.pc.room = this.room;
            this.callSelf(true);
        } else {
            this.callSelf(false);
        }
    };
    
    this.cleanSelf = function () {
        this.lastMessage = -1;
        this.lastDate = '';
        this.chat.$chatMessages.empty();
        this.pc.clear();
        this.chat.$roomName.text(this.room.name);
        this.chat.$roomDesc.text(this.room.description);
        this.chat.pc.$container.empty();
        this.chat.pc.restore();
        if (this.room.persona !== null) {
            window.app.ui.chat.pc.addPersona(this.room.persona, this.room.avatar, this.room.hidePersona);
        }
        this.room.emptyLocal();
        this.printed = 0;
        this.clearInformed = false;
    };
    
    this.printAllMessages = function () {
        this.firstPrint = true;
        this.printMessages();
        this.firstPrint = true;
    };
    
    this.callSelf = function (clean) {
        if (this.room === null) {
            window.app.ui.gameui.callSelf();
        } else {
            if (clean) {
                this.cleanSelf()
            }
            
            this.printAllMessages();
            
            this.onlineUsers = [];
            this.room.requiresUsers = true;
            
            var cbs = function () {
                window.app.ui.chat.cc.printMessages();
                window.app.ui.chat.cc.checkUsers();
                window.app.ui.chat.cc.pc.checkUsers();
            };
            
            var cbe = function (data) {
                window.app.ui.chat.cc.printError(data);
            };
            
            window.app.chatapp.start(this.room, cbs, cbe);
            window.app.ui.callLeftWindow('chatWindow');
        }
    };
    
    this.exit = function () {
        if (this.room !== null) {
            this.room.emptyLocal();
        }
        this.room = null;
        window.app.chatapp.stop();
    };
    
    this.setBindings = function () {
        $('#leaveChatBt').bind('click', function () {
            window.app.ui.chat.cc.exit();
            window.app.ui.gameui.callSelf();
        });
        
        $('#callChatWindowBt').bind('click', function () {
            if (window.app.chatapp.room !== null) {
                window.app.ui.callLeftWindow('chatWindow');
            } else {
                window.app.ui.gameui.callSelf();
            }
        });
    };
    
    
    this.printError = function (data) {
        var $html = $('<p class="chatSistema" />');
        $html.append($('<span class="language" data-langhtml="_CHATCONNERROR_" />'));
        
        $html.append(' ');
        
        var $aretry = $('<a class="language" data-langhtml="_CHATCONNERRORRETRY_" />');
        
        $html.append($aretry);
        
        $aretry.bind('click', function () {
            window.app.ui.chat.cc.callSelf(false);
            $(this).parent().remove();
            window.app.ui.chat.fixScrollpane();
        });
        
        
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    
    this.printMessages = function () {
        if (this.room === null) {
            return false;
        }
        var messages = this.room.getMessagesFrom(this.lastMessage);
        if (messages === null || typeof messages === 'undefined') {
            return false;
        }
        
        var printedOne = false;
        
        /** @type Message */ var message;
        var module;
        /** @type User */ var user;
        
        var $target = this.chat.$chatMessages;
        var $html;
        if (messages.length > 0) {
            this.lastMessage = messages[messages.length - 1].id;
            var start = 0;
            // Lets print only the last 100 messages.
            if (!this.ignoreTooMany && messages.length > 100) {
                start = messages.length - 100;
            }
            for (var i = start; i < messages.length; i++) {
                message = messages[i];
                if (window.app.ui.isStreaming() && message.destination !== 0 && message.destination !== null) {
                    continue;
                }
                
                if (message.localid !== null) {
                    continue;
                }
                if (this.lastDate !== message.date) {
                    $html = $('<p class="chatSistema language" data-langhtml="_CHATDATE_" />').attr('data-langp', message.date);
                    $target.append($html);
                    this.lastDate = message.date;
                    window.app.ui.language.applyLanguageOn($html);
                }
                module = window.app.ui.chat.mc.getModule(message.module);
                if (module === null) {
                    user = message.getUser();
                    $html = $('<p class="chatSistema language" data-langhtml="_INVALIDMODULE_" />');
                    $html.attr('data-langp', message.module);
                    if (user !== null) {
                        $html.attr('data-langd', user.nickname + '#' + user.nicknamesufix);
                    } else {
                        $html.attr('data-langd', "?????");
                    }
                } else {
                    $html = module.get$(message, null, null);
                }
                if ($html !== null) {
                    printedOne = true;
                    this.hoverizeSender($html, message);
                    window.app.ui.language.applyLanguageOn($html);
                    $target.append($html);
                    if (message.id !== null) {
                        $html.attr('data-msgid', message.id);
                    }
                }
                
            }
            
            if (!window.app.ui.hasFocus && printedOne) {
                window.app.ui.notifyMessages();
            }
            
            this.printed += messages.length;
            if (this.printed > 100 && !this.ignoreTooMany) {
                var $children = window.app.ui.chat.$chatMessages.children('p');
                this.printed = $children.length;
                if (this.printed > 100) {
                    $children.slice(0, this.printed - 50).remove();
                    var $html = $('<p class="chatSistema" />');
                    $html.append("<span class='language' data-langhtml='_CHATWSNOTALL_'></span>");
                    var $a = $('<a class="language" data-langhtml="_CHATWSGETOLDERMESSAGES_" />').on('click', function () {
                        window.app.chatapp.getAllMessages();
                    });
                    $html.append(' ').append($a);
                    window.app.ui.language.applyLanguageOn($html);
                    window.app.ui.chat.$chatMessages.prepend($html);
                }
            }
            
            window.app.ui.chat.considerBottoming();
        }
        this.firstPrint = false;
    };
    
    this.printMessage = function (message) {
        if (this.room === null) {
            return false;
        }
        var printedOne = false;
        
        /** @type Message */ var message;
        var module;
        /** @type User */ var user;
        
        var $target = this.chat.$chatMessages;
        var $html;
        if (this.lastDate !== message.date) {
            $html = $('<p class="chatSistema language" data-langhtml="_CHATDATE_" />').attr('data-langp', message.date);
            $target.append($html);
            this.lastDate = message.date;
            window.app.ui.language.applyLanguageOn($html);
        }
        
        
        module = window.app.ui.chat.mc.getModule(message.module);
        if (module === null) {
            user = message.getUser();
            $html = $('<p class="chatSistema language" data-langhtml="_INVALIDMODULE_" />');
            $html.attr('data-langp', message.module);
            if (user !== null) {
                $html.attr('data-langd', user.nickname + '#' + user.nicknamesufix);
            } else {
                $html.attr('data-langd', "?????");
            }
        } else {
            $html = module.get$(message, null, null);
        }
        if ($html !== null) {
            printedOne = true;
            this.hoverizeSender($html, message);
            $target.append($html);
            window.app.ui.language.applyLanguageOn($html);
        }

        if (!window.app.ui.hasFocus && printedOne) {
            window.app.ui.notifyMessages();
        }
        
        return $html;
    };
    
    this.clearUsers = function () {
        this.onlineUsers = [];
    };
    
    this.checkUsers = function () {
        if (window.app.ui.isStreaming()) {
            return null;
        }
        var users = this.room.users.users;
        var $html;
        var innerIndex;
        for (var index in users) {
            innerIndex = this.onlineUsers.indexOf(users[index].id);
            if (users[index].isOffline(window.app.chatapp.userTime, window.app.chatapp.afkTime)) {
                if (innerIndex !== -1) {
                    // Disconnected
                    $html = $('<p class="chatSistema language" data-langhtml="_HASDISCONNECTED_" />');
                    $html.attr('data-langp', users[index].nickname + '#' + users[index].nicknamesufix);
                    window.app.ui.language.applyLanguageTo($html);
                    window.app.ui.chat.appendToMessages($html);
                    this.onlineUsers.splice(innerIndex, 1);
                }
            } else {
                if (innerIndex === -1) {
                    // Connected
                    $html = $('<p class="chatSistema language" data-langhtml="_HASCONNECTED_" />');
                    $html.attr('data-langp', users[index].nickname + '#' + users[index].nicknamesufix);
                    window.app.ui.language.applyLanguageTo($html);
                    window.app.ui.chat.appendToMessages($html);
                    this.onlineUsers.push(users[index].id);
                }
            }
        }
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @param {Message} message
     * @returns {undefined}
     */
    this.hoverizeSender = function ($dom, message) {
        $dom.on('mouseenter', window.app.emulateBind(function () {
            window.app.ui.chat.cc.showFloater(this.$dom, this.message);
        }, {$dom : $dom, message : message}));
        
        $dom.on('mouseleave', function () {
            window.app.ui.simplefloater.hideFloater();
        }).on('mousemove', function () {
            window.app.ui.simplefloater.moveFloaterToElement();
        });
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @param {Message} message
     * @returns {undefined}
     */
    this.showFloater = function ($dom, message) {
        var sender = message.getUser();
        if (sender === null) sender = new User();
        
        var $p = $('<p />');
        var $b = $('<b />');
        if (sender.isStoryteller()) {
            $b.text(window.app.ui.language.getLingo("_STORYTELLERTOOLTIP_") + ': ');
        } else {
            $b.text(window.app.ui.language.getLingo("_PLAYERTOOLTIP_") + ': ');
        }
        $p.text(sender.nickname + '#' + sender.nicknamesufix).prepend($b);
        
        if (message.getOrigin() === 0) {
            $p.text(window.app.ui.language.getLingo("_CHATSYSTEMNICK_"));
        }
        
        window.app.ui.simplefloater.showFloaterAtElement($p, $dom);
    };
} 
 
function DiceController () {
    this.$diceqt;
    this.$dicefaces;
    this.$dicereason;
    this.$dicemod;
    this.$dicesecret;
    this.dicese;
    
    this.init = function () {
        this.$diceqt = $('#dadosFormQuantidade');
        this.$dicefaces = $('#dadosFormFaces');
        this.$dicereason = $('#dadosFormMotivo');
        this.$dicemod = $('#dadosFormMod');
        this.$dicesecret = $('#dadosFormSecret');
        this.dicese = document.getElementById('diceRollAudio');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        var submitFunc = function () {
            window.app.ui.chat.dc.submit();
        };
        $('#chatDadosForm').on('submit', submitFunc);
        
        this.$dicereason.bind('keydown', function (e) {
            if (e.keyCode === 9 && !e.shiftKey) {
                window.app.ui.chat.$chatinput.focus();
                e.preventDefault();
                e.stopPropagation();
            }
        });
        
        var dice = [4, 6, 8, 10, 12, 20, 100];
        for (var i = 0; i < dice.length; i++) {
            $('#d'+dice[i]+'Button').bind('click', window.app.emulateBind(
                function () {
                    window.app.ui.chat.dc.$dicefaces.val(this.dice);
                    if (window.app.ui.chat.dc.$diceqt.val() === '' || window.app.ui.chat.dc.$diceqt.val() === '1') {
                        window.app.ui.chat.dc.$diceqt.val('1');
                    }
                    this.submit();
                }, {dice : dice[i], submit : submitFunc}
            ));
        }
        
        this.$dicesecret.bind('click', function () {
            $(this).toggleClass('toggled');
        });
    };
    
    this.submit = function () {
        var message = new Message();
        message.setMessage(this.$dicereason.val());
        message.module = 'dice';
        
        if (this.$dicesecret.hasClass('toggled')) {
            var storytellers = window.app.ui.chat.cc.room.getStorytellers();
            message.destination = storytellers;
        }
        
        if (isNaN(this.$dicefaces.val())) {
            this.$dicefaces.val('6');
        }
        
        if (isNaN(this.$diceqt.val())) {
            this.$diceqt.val('1');
        }
        
        if (isNaN(this.$dicemod.val())) {
            this.$dicemod.val('0');
        }
        
        var rolls = parseInt(this.$diceqt.val());
        
        if (rolls < 1) {
            rolls = 0;
        } else if (rolls > 99) {
            rolls = 99;
        }
        
        var faces = parseInt(this.$dicefaces.val());
        if (faces < 1) {
            faces = 1;
        }
        var mod = parseInt(this.$dicemod.val());
        
        var specialDice = [];
        
        for (var i = 0; i < rolls; i++) {
            specialDice.push(faces);
        }
        
        message.setSpecial('dice', specialDice);
        message.setSpecial('mod', mod);
        message.setSpecial('persona', window.app.ui.chat.cc.room.persona);
        
        
        this.$dicereason.val('');
        
        var mod = window.app.ui.chat.mc.getModule('dice');
        var $html = mod.get$(message);
        
        window.app.chatapp.fixPrintAndSend(message, true);
        
        
        this.dicese.currentTime = 0;
        this.dicese.volume = 0.3;
        this.dicese.play();
    };
} 
 
function Logger () {
    
    this.$window = $("#loggerWindow");
    this.$messages = $("#loggerMessages");
    this.$slider= $('#loggerSlider');
    this.$types = $("#loggerTypes");
    
    this.$importBt = $("#logLoadButton").on('click', function () {
        window.app.ui.chat.logger.loadLog();
    });
    this.$importForm = $("#logLoadFile");
    
    this.$create = $("#loggerCreateJSON").on("click", function () {
        window.app.ui.chat.logger.createJSON();
    });
    
    this.allowedTypes = [];
    
    this.leftHandle = 0;
    this.rightHandle = 1000;
    
    this.makeSlider = function (min, max) {
        if (min > this.leftHandle) {
            this.leftHandle = min;
        }
        if (max < this.rightHandle) {
            this.rightHandle = max;
        }
        this.$slider.slider({
            range: true,
            min: min,
            max: max,
            values: [ this.leftHandle, this.rightHandle ],
            slide: function( event, ui ) {
                var logger = window.app.ui.chat.logger;
                logger.leftHandle = ui.values[0];
                logger.rightHandle = ui.values[1];
                logger.updateMessages();
            }
        });
    };
    
    this.updateMessages = function () {
        this.$messages.empty();
        var messages = window.app.chatapp.room.messages;
        var i = this.leftHandle;
        var v = 0;
        var maxExcerpt = 3;
        var message;
        while (i < messages.length && v < maxExcerpt) {
            if (this.letMessage(messages[i])) {
                message = messages[i];
                this.$messages.append($("<p />").text(this.messageToText(message)));
                v++;
            }
            i++;
        }
        
        this.$messages.append("<p>...</p><p>...</p>");
        
        var minI = i;
        
        i = this.rightHandle;
        var printMessages = [];
        while (i > minI && printMessages.length < maxExcerpt) {
            if (this.letMessage(messages[i])) {
                printMessages.unshift(messages[i]);
            }
            i--;
        }
        
        for (i = 0; i < printMessages.length; i++) {
            message = printMessages[i];
            this.$messages.append($("<p />").text(this.messageToText(message)));
        }
    };
    
    /**
     * 
     * @param {Message} message
     * @returns {undefined}
     */
    this.messageToText = function (message) {
        var text = message.module + " " + window.app.ui.language.getLingo("_LOGGERMSGBY_") + " " + message.getUser().getFullName()
             + ": ";
        
        var readableModules = ["story", "action", "countdown", "dice", "lingo", "offgame", "roleplay", "vote"];
        
        if (readableModules.indexOf(message.module) !== -1) {
            text += message.getMessage();
        } else {
            text += window.app.ui.language.getLingo("_LOGGERNOTTYPE_");
        }
        
        return text;
    };
    
    this.letMessage = function (message) {
        if (message === undefined || message === null) {
            return false;
        }
        if (message.destination !== null && message.destination !== undefined && message.destination !== 0) {
            return false;
        }
        if (this.allowedTypes.indexOf(message.module) === -1) {
            return false;
        }
        return true;
    };
    
    this.createFilters = function () {
        this.$types.empty();
        var messages = window.app.chatapp.room.messages;
        this.allowedTypes = [];
        var message;
        var $input;
        var $label;
        var inputs = 0;
        for (var i = 0; i < messages.length; i++) {
            message = messages[i];
            if (message === undefined || message === null) continue;
            if (this.allowedTypes.indexOf(message.module) === -1) {
                this.allowedTypes.push(message.module);
                // <input type="checkbox" id="loggerRoleplay" /><label for="loggerRoleplay">Roleplay</label>
                $label = "<label for='logger" + message.module + "'>" + message.module + "</label>";
                $input = $("<input checked id='logger" + message.module + "' type='checkbox' />").on('change', function () {
                    window.app.ui.chat.logger.updateFilters();
                }).attr("data-id", message.module);
                this.$types.append($input).append($label);
                inputs++;
                if (inputs === 4) {
                    inputs = 0;
                    this.$types.append("<br />");
                }
            }
        }
    };
    
    this.updateFilters = function () {
        this.allowedTypes = [];
        var $inputs = this.$types.find("input");
        for (var i = 0; i < $inputs.length; i++) {
            if ($inputs[i].checked) {
                this.allowedTypes.push($($inputs[i]).attr("data-id"));
            }
        }
        this.updateMessages();
    };
    
    this.init = function () {
        
    };
    
    this.callSelf = function () {
        this.$window.finish(true, true).fadeIn(500);
        
        var room = window.app.chatapp.room;
        this.rightHandle = window.app.chatapp.room.messages.length;
        this.makeSlider(0, room.messages.length);
        
        this.createFilters();
        this.updateMessages();
    };
    
    this.createJSON = function () {
        var object = window.app.chatapp.room.export();
        var messages = [];
        var message;
        for (var i = this.leftHandle; i < window.app.chatapp.room.messages.length && i < this.rightHandle; i++) {
            message = window.app.chatapp.room.messages[i];
            if (this.letMessage(message)) {
                messages.push(message.export());
            }
        }
        object.messages = messages;
        var blob = new Blob([JSON.stringify(object, null, 4)], {
            type: "text/plain;charset=utf-8;",
        });
        var d = new Date();
        var curr_date = d.getDate();
        if (curr_date < 10) {
            curr_date = "0" + curr_date;
        }
        var curr_month = d.getMonth() + 1; //Months are zero based
        if (curr_month < 10) {
            curr_month = "0" + curr_month;
        }
        var curr_year = d.getFullYear();
        saveAs(blob, curr_year + curr_month + curr_date + "-" + object.name.replace(/[ ]/g, "_") + ".txt");
    };
    
    this.updateRoom = function () {
        window.app.ui.blockLeft();
        
        var id = window.app.chatapp.room.id;
        
        var cbs = function (data) {
            window.app.ui.unblockLeft();
            window.app.chatapp.room.empty();
            window.app.chatapp.room.updateFromJSON({messages : data}, true);
            window.app.ui.chat.logger.callSelf();
        };
        
        var cbe = function () {
            window.app.ui.unblockLeft();
            alert("Error");
        };
        
        var ajax = new AjaxController();
        
        var data = {
            roomid : id,
            action : 'messages'
        };
        
        ajax.requestPage({
            url : 'Room',
            data : data,
            success: cbs,
            error: cbe
        });
    };
    
    this.closeSelf = function () {
        this.$window.finish().fadeOut(500);
    };
    
    this.loadLog = function () {
        var f = this.$importForm[0].files[0];
        
        if (!f) { return; }
        
        window.app.ui.blockLeft();
        
        var r = new FileReader();
        r.onload = function(e) {
            window.app.ui.unblockLeft();
            window.app.ui.chat.logger.openLog(e.target.result);
        };
        
        r.onerror = function () {
            window.app.ui.unblockLeft();
            alert("Error reading the file.");
        };
        
        r.readAsText(f);
    };
    
    this.openLog = function (json) {
        try {
            json = JSON.parse(json);
        } catch (e) {
            alert("Not a valid JSON file.");
        }
        window.app.ui.chat.cc.exit();
        window.app.chatapp.stop();
        window.app.chatapp.room = new Room();
        window.app.ui.chat.cc.room = window.app.chatapp.room;
        window.app.ui.chat.cc.pc.room = window.app.chatapp.room;
        window.app.chatapp.room.updateFromJSON(json);
        window.app.ui.chat.cc.cleanSelf();
        window.app.ui.chat.cc.ignoreTooMany = true;
        window.app.ui.chat.cc.printAllMessages();
        window.app.ui.callLeftWindow('chatWindow');
        window.app.ui.chat.hideUnnecessary();
    };
} 
 
function PlayerController() {
    
    /** @type Room */ this.room;
    
    this.$users = {};
    this.userState = {};
    
    this.init = function () {
        
    };
    
    this.setBindings = function () {
        
    };
    
    this.checkUsers = function () {
        var users = this.room.users.users;
        var isListed;
        var userState;
        for (var index in users) {
            if (users[index].nickname === null) {
                if (window.app.ui.chat.cc.room !== null) {
                    window.app.ui.chat.cc.room.requiresUsers = true;
                }
            }
            isListed = typeof this.$users[users[index].id] !== 'undefined';
            if (users[index].isOffline(window.app.chatapp.userTime, window.app.chatapp.afkTime)) {
                if (isListed) {
                    // Disconnected
                    this.$users[users[index].id].remove();
                    delete this.userState[users[index].id];
                    delete this.$users[users[index].id];
                }
            } else {
                if (!isListed) {
                    // Connected
                    this.$users[users[index].id] = window.app.ui.chat.ac.create$avatar(users[index]);
                    window.app.ui.chat.ac.append(this.$users[users[index].id]);
                    window.app.ui.chat.ac.considerScrollers();
                    userState = {
                        'focused' : users[index].focused,
                        'nick' : users[index].nickname + '#' + users[index].nicknamesufix,
                        'typing' : users[index].typing,
                        'avatar' : users[index].avatarS,
                        'persona' : users[index].personaS,
                        'idle' : users[index].idle
                    };
                    this.userState[users[index].id] = userState;
                } else {
                    window.app.ui.chat.ac.update$(this.$users[users[index].id], users[index], this.userState[users[index].id]);
                }
            }
        }
    };
    
    this.clear = function () {
        for (var i in this.$users) {
            this.$users[i].remove();
        }
        this.$users = {};
        window.app.ui.chat.ac.$container.empty();
    };
    
} 
 
function AvatarController () {
    this.$btup;
    this.$btdown;
    this.$container;
    
    this.$uw;
    this.$uwName;
    this.$uwNick;
    this.$uwAvatar;
    this.$uwPersonaP;
    this.$uwPersona;
    this.$uwWhisper;
    
    this.init = function () {
        this.$btup = $();
        this.$container = $('#avatarBox');
        this.$btup = $('#avatarUpButton');
        this.$btdown = $('#avatarDownButton');
        
        this.$uw = $('#avatarWindowWrapper');
        this.$uwName = $('#uWuserName');
        this.$uwNick = $('#uWuserNick');
        this.$uwAvatar = $('#uWuserAvatar');
        this.$uwPersonaP = $('#uWuserPersonaP');
        this.$uwPersona = $('#uWuserPersona');
        this.$uwWhisper = $('#uWuserWhisper');
        
        this.setBindings();
    };
    
    this.clear = function () {
        this.$container.empty();
    };
    
    this.setBindings = function () {
        this.$btdown.bind('click', function (){
            window.app.ui.chat.ac.animateDown();
        });
        
        this.$btup.bind('click', function (){
            window.app.ui.chat.ac.animateUp();
        });
        
        $('#uWuserClose').bind('click', function () {
            window.app.ui.chat.ac.$uw.fadeOut();
        });
        
        this.$uwWhisper.bind('click', function () {
            window.app.ui.chat.$chatinput.val('/whisper ' + $(this).attr('data-langp') + ', ');
            window.app.ui.chat.$chatinput.focus();
            window.app.ui.chat.ac.$uw.fadeOut();
        });
    };
    
    this.considerScrollers = function () {
        var scrollTop = this.$container.scrollTop();
        var height = this.$container.height();
        var scrollHeight = this.$container[0].scrollHeight;
        
        if (scrollTop + height < scrollHeight) {
            this.$btdown.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btdown.stop(true, true).addClass('deactivated', 200);
        }
        
        if (scrollTop > 0) {
            this.$btup.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btup.stop(true, true).addClass('deactivated', 200);
        }
    };
    
    this.animateDown = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.ac.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height();
                var scrollHeight = $this[0].scrollHeight;
                if (scrollTop + height <= scrollHeight) {
                    return scrollTop + height;
                } else {
                    return scrollTop;
                }
            } ()
        }, function () {
            window.app.ui.chat.ac.considerScrollers();
        });
    };
    
    this.animateUp = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.ac.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height();
                if (scrollTop - height >= 0) {
                    return scrollTop - height;
                } else {
                    return scrollTop;
                }
            } ()
        }, function () {
            window.app.ui.chat.ac.considerScrollers();
        });
    };
    
    this.handleResize = function () {
        this.considerScrollers();
    };
    
    
    /**
     * 
     * @param {jQuery} $user
     * @param {User} user
     * @returns {undefined}
     */
    this.update$ = function ($user, user, userState) {
        var callIgnore = [];
        
        if (user.avatarS === userState.avatar) {
            callIgnore.push('avatar');
        } else {    
            userState.avatar = user.avatarS;
        }
        
        var nick = user.nickname + '#' + user.nicknamesufix;
    
        if (user.personaS === userState.persona && nick === userState.nick) {
            callIgnore.push('persona');
        } else {
            userState.persona = user.personaS;
        }
        
        if (user.typing === userState.typing) {
            callIgnore.push('typing');
        } else {
            userState.typing = user.typing;
        }
        
        if (user.idle === userState.idle) {
            callIgnore.push('idle');
        } else {
            userState.idle = user.idle;
        }
        
        if (callIgnore.indexOf('persona') === -1) {
            if (user.personaS === null || user.personaS === '') {
                $user.children('span').text(user.nickname + '#' + user.nicknamesufix);
            } else {
                $user.children('span').text(user.personaS);
            }
        }
        
        if (callIgnore.indexOf('avatar') === -1) { 
            if (user.avatarS === null || user.avatarS === '') {
                $user.children('img').attr('src', "img/chat/iconAnon.jpg");
            } else {
                var url = user.avatar;
                if (url.indexOf('dropbox.com') !== -1) {
                    url = url.replace('dl=0', 'dl=1');
                    if (url.indexOf('dl=1') === -1) {
                        url = url + (url.indexOf('?') !== -1 ? '' : '?') + 'dl=1';
                    }
                }
                $user.children('img').attr('src', url).off('error.badUrl').on('error.badUrl', function () {
                    $(this).off('error.badUrl').attr('src', 'img/chat/iconAnonError.jpg');
                });
            }
        }
        
        if (callIgnore.indexOf('typing') === -1 ) {
            var $typing = $user.children('a.typing');
            if (user.typing) {
                $typing.show();
            } else {
                $typing.hide();
            }
        }
        
        if (callIgnore.indexOf('idle') === -1 ) {
            var $idle = $user.children('a.idle');
            if (user.idle) {
                $idle.show();
            } else {
                $idle.hide();
            }
        }
        
        if (callIgnore.indexOf('focused') === -1) {
            if (user.focused) {
                $user.css('opacity', '1');
            } else {
                $user.css('opacity', '0.5');
            }
        }
    };
    
    /**
     * 
     * @param {User} user
     * @returns {undefined}
     */
    this.create$avatar = function (user) {
        var $html = $('<div class="avatarWrapper" />');
        var nick = user.nickname + '#' + user.nicknamesufix;
        var avatar = user.avatarS;
        
        $html.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.chat.ac.showUserInfo(this.user);
            }, {user : user}
        ));
        
        
        if (user.personaS === null || user.personaS === '') {
            $html.append($('<span />').text(nick));
        } else {
            var $persona = $('<span />').text(user.personaS);
            $html.append($persona);
        }
        
        $html.attr('title', nick);
        
        var $typing = $('<a class="typing" />');
        if (user.typing) {
            $typing.show();
        } else {
            $typing.hide();
        }
        
        $html.append($typing);
        
        var $idle = $('<a class="idle" />');
        if (user.idle) {
            $idle.show();
        } else {
            $idle.hide();
        }
        
        $html.append($idle);
        
        if (avatar !== null && avatar !== '') {
            $html.append($('<img />').attr('src', avatar).off('error.badUrl').on('error.badUrl', function () {
                    $(this).off('error.badUrl').attr('src', 'img/chat/iconAnonError.jpg');
                }));
        } else {
            $html.append($('<img />').attr('src', "img/chat/iconAnon.jpg"));
        }
        
//        <div class="avatarWrapper">
//            <span>Reddo</span>
//            <img src="images/iconAnon.jpg"/>
//        </div>
        
        return $html;
    };
    
    this.append = function ($html) {
        this.$container.append($html);
        this.considerScrollers();
    };
    
    
    /**
     * 
     * @param {User} user
     * @returns {undefined}
     */
    this.showUserInfo = function (user) {
        if (user.avatarS !== null && user.avatarS !== '') {
            this.$uwAvatar.attr('src', user.avatarS);
        } else {
            this.$uwAvatar.attr('src', "img/chat/iconAnon.jpg");
        }
        var nick = user.nickname + '#' + user.nicknamesufix;
        var persona = user.personaS;
        this.$uwName.text(nick);
        this.$uwNick.text(nick);
        if (persona !== null && persona !== '') {
            this.$uwPersonaP.show();
            this.$uwPersona.text(persona);
        } else {
            this.$uwPersonaP.hide();
        }
        this.$uwWhisper.attr('data-langp', nick);
        window.app.ui.language.applyLanguageTo(this.$uwWhisper);
        this.$uw.fadeIn();
    };
} 
 
/**
 * 
 * @param {CombatTracker} mainTracker
 * @returns {BuffTracker}
 */
function BuffTracker (mainTracker) {
    this.mainTracker = mainTracker;
    
    this.init = function () {
        window.registerRoomMemory('buff', this);
    };
    
    this.printBuffs = function (id) {
        var buffs = [];
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = this.myStuff.buffs.length - 1; i >= 0; i--) {
            if (this.myStuff.buffs[i][1] === id) {
                buffs.push(this.myStuff.buffs[i]);
            }
        }
        
        if (buffs.length === 0) {
            return;
        }
        
        var idToName = {};
        for (var i = 0; i < this.mainTracker.myStuff.ordered.length; i++) {
            idToName[this.mainTracker.myStuff.ordered[i].id] = this.mainTracker.myStuff.ordered[i].name;
        }
        var $html = $('<p class="chatSistema" />');
        $html.append("<span class='language' data-langhtml='_CURRENTBUFFS_'></span> " + idToName[id] + ": ");
        var buffMessages = [];
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = 0; i < buffs.length; i++) {
             buffMessages.push(buffs[i][3] + " <span class='language' data-langhtml='_CURRENTBUFFBY_'></span> " + idToName[buffs[i][0]]);
        }
        $html.append(buffMessages.join(", "));
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.moveTurns = function (oldTurn, newTurn) {
        var oldGuy = this.mainTracker.myStuff.ordered[oldTurn].id;
        var newGuy = this.mainTracker.myStuff.ordered[newTurn].id;
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = this.myStuff.buffs.length - 1; i >= 0; i--) {
            // OldGuy and EndOfTurn!
            if (this.myStuff.buffs[i][0] === oldGuy && this.myStuff.buffs[i][4] === 1) {
                this.myStuff.buffs[i][2] -= 1;
                if (this.myStuff.buffs[i][2] <= 0) {
                    this.announceRemoval(this.myStuff.buffs.splice(i, 1));
                }
                continue;
            }
            
            // NewGuy and StartOfTurn
            if (this.myStuff.buffs[i][0] === newGuy && this.myStuff.buffs[i][4] === 0) {
                this.myStuff.buffs[i][2] -= 1;
                if (this.myStuff.buffs[i][2] <= 0) {
                    this.announceRemoval(this.myStuff.buffs.splice(i, 1));
                }
            }
        }
    };
    
    this.announceRemoval = function (buff) {
        var $html = $('<p class="chatSistema" />');
        var idToName = {};
        for (var i = 0; i < this.mainTracker.myStuff.ordered.length; i++) {
            idToName[this.mainTracker.myStuff.ordered[i].id] = this.mainTracker.myStuff.ordered[i].name;
        }
        $html.append("<span class='language' data-langhtml='_BUFFREMOVED_'></span>: " + buff[0][3])
                .append(" <span class='language' data-langhtml='_BUFFREMOVEDFROM_'></span> " + idToName[buff[0][1]]);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.deleteApplier = function (orderedId) {
        var guy = this.mainTracker.myStuff.ordered[orderedId].id;
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = this.myStuff.buffs.length - 1; i >= 0; i--) {
            if (this.myStuff.buffs[i][0] === guy || this.myStuff.buffs[i][1] === guy) {
                this.myStuff.buffs.splice(i, 1);
            }
        }
        this.saveMemory(false);
    };
    
    this.addBuff = function (buffer, targetId, duration, buffName, buffEndOfTurn) {
        var ordered = this.mainTracker.myStuff.ordered;
        var guy1;
        var guy2;
        
        for (var i = 0; i < ordered.length; i++) {
            if (ordered[i].id === buffer) {
                guy1 = ordered[i];
                if (guy2 !== undefined) break;
            }
            
            if (ordered[i].id === targetId) {
                guy2 = ordered[i];
                if (guy1 !== undefined) break;
            }
        }
        
        if (guy1 === undefined || guy2 === undefined) {
            this.announceImpossible();
            return;
        }
        
        duration = isNaN(duration, 10) ? 1 : parseInt(duration);
        buffEndOfTurn = buffEndOfTurn ? 1 : 0;
        
        this.myStuff.buffs.push([buffer, targetId, duration, buffName, buffEndOfTurn]);
        
        this.announcePlaced(buffName);
        
        this.saveMemory(true);
    };
    
    this.saveMemory = function (save) {
        this.memory.setMemory('buff', this.myStuff, !save);
    };
    
    this.announcePlaced = function (information) {
        var $html = $('<p class="chatSistema" />');
        $html.append("<span class='language' data-langhtml='_BUFFAPPLIED_'></span>: " + information);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.announceImpossible = function () {
        alert("Impossible buffs detected - sorry, this shouldn't happen");
    };
    
    this.updateMemory = function (memory) {
        this.memory = memory;
        this.myStuff = memory.getMemory('buff', {buffs : []});
    };
} 
 
function CombatTracker () {
    this.bufftracker = new BuffTracker(this);
    
    this.roomid = 0;
    
    this.$tracker = $('#combatTracker').draggable({
        containment : 'window',
        handle : '#combatTrackerHandle'
    }).hide();
    
    this.$sheets = $("#combatTrackerSheet").empty();
    this.$players = $('#combatTrackerPlayer');
    this.$trackerButton = $('#combatTrackerButton');
    
    this.$body = $('#combatTrackerBody').empty();
    this.$footer = $('#combatTrackerFooter').hide();
    
    this.target = -1;
    
    /** @type Room_Memory */ this.memory;
    this.myStuff = {};
    
    this.init = function () {
        window.registerRoomMemory('combat', this);
        this.bufftracker.init();
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#sheetViewer').on('loadedSheet.CombatTracker closedSheet.CombatTracker', function () {
            window.app.ui.chat.tracker.updateSheetList();
        });
        
        $('#combatTrackerHide').on('click', function () {
            window.app.ui.chat.tracker.toggleTracker();
        });
        
        this.$trackerButton.on('click', function () {
            window.app.ui.chat.tracker.toggleTracker();
        });
        
        $('#combatTrackerAddSheet').on('click', function () {
            var player = parseInt($('#combatTrackerPlayer').val());
            var sheet = parseInt($('#combatTrackerSheet').val());
            if (isNaN(sheet, 10) || isNaN(player, 10)) {
                return;
            }
            var name = window.app.sheetdb.getSheet(sheet).name;
            var init = 0;
            window.app.ui.chat.tracker.myStuff.ordered.push({
                id : sheet,
                player : player,
                name : name,
                init : init
            });
            window.app.ui.chat.tracker.saveMemory();
        });
        
        $('#combatTrackerTurn').on('click', function () {
            window.app.ui.chat.tracker.passTurn();
            window.app.ui.chat.tracker.saveMemory();
            window.app.ui.chat.tracker.warnTurn();
        });
        
        $('#combatTrackerNewRound').on('click', function () {
            window.app.ui.chat.tracker.passTurn();
            while (window.app.ui.chat.tracker.myStuff.turn !== 0) {
                window.app.ui.chat.tracker.passTurn();
            }
            window.app.ui.chat.tracker.saveMemory();
            window.app.ui.chat.tracker.warnTurn();
        });
    };
    
    this.passTurn = function () {
        var cTurn = this.myStuff.turn;
        this.myStuff.turn++;
        if (this.myStuff.turn > (this.myStuff.ordered.length - 1)) {
            this.myStuff.turn = 0;
        }
        this.bufftracker.moveTurns(cTurn, this.myStuff.turn);
    };
    
    this.saveMemory = function () {
        this.memory.setMemory('combat', this.myStuff, false);
    };
    
    this.toggleTracker = function () {
        var offset = this.$trackerButton.offset();
        if (this.$tracker.is(":visible")) {
            this.$tracker.stop(true,false).animate({
                top : offset.top + 20,
                left : offset.left + 20,
                height: '0px',
                width: '0px'
            }, function () {
                $(this).hide();
            });
        } else {
            this.$tracker.show().css('height', '').css('width', '').css('top', offset.top + 20).css('left', offset.left + 20);
            var height = this.$tracker.height();
            var width = this.$tracker.width();
            this.$tracker.css('height', '0px').css('width', '0px');
            this.$tracker.stop(true,false).animate({
                top : 10,
                left: 110,
                height: height + 'px',
                width: width + 'px'
            });
        }
    };
    
    this.getUser = function () {
        if (window.app.chatapp.room !== null && window.app.chatapp.room.getMe() !== null) {
            return window.app.chatapp.room.getMe();
        }
        return new User();
    };
    
    this.updateMemory = function (memory) {
        var user = this.getUser();
        this.memory = memory;
        this.myStuff = memory.getMemory('combat', {ordered : [], turn : 0});
        
        if (this.roomid !== window.app.chatapp.room.id) {
            this.roomid = window.app.chatapp.room.id;
            this.updateSheetList();
        }
        
        
        this.updateParticipants();
        // Show and hide parts of self
        if (user.isStoryteller()) {
            this.$footer.show();
            this.updateUserList();
            this.$body.find('input').prop('disabled', false);
            this.$body.find('a.deleteRow').show();
            this.$body.find('a.setTurn').show();
        } else {
            this.$footer.hide();
            this.$body.find('input').prop('disabled', true);
            this.$body.find('a.deleteRow').hide();
            this.$body.find('a.setTurn').hide();
        }
        this.$tracker.css('height', '');
    };
    
    this.updateParticipants = function () {
        var user = this.getUser();
        var changed = false;
        var messedup = false;
        var turn = this.myStuff.turn;
        var participant;
        var participants = [];
        for (var i = 0; i < this.myStuff.ordered.length; i++) {
            participant = this.myStuff.ordered[i];
            if (participant instanceof Object && typeof participant.id === 'number' && typeof participant.name === 'string' && typeof participant.init === 'number' && typeof participant.player === 'number') {
                messedup = false;
                //console.log(participant);
                for (var k in participant) {
                    if (['name', 'id', 'player', 'init'].indexOf(k) === -1) {
                        messedup = true;
                        break;
                    }
                }
                //console.log(messedup);
                if (!messedup) participants.push(participant);
            } else {
                //console.log("why");
                //console.log(participant);
                changed = true;
            }
        }
        
        //console.log(participants);
        //console.log(this.myStuff.ordered);
        
        participants.sort(function (a, b) {
            return b.init - a.init;
        });
        
        this.myStuff.ordered = participants;
        
        if (turn > participants.length - 1 && participants.length > 0) {
            turn = 0;
            changed = true;
        }
        
        
        var $participant;
        this.$body.empty();
        var $init;
        var $opensheet;
        var $target;
        var $delete;
        var $setturn;
        var $hp;
        var $mp;
        var hp;
        var mp;
        var sheet;
        for (var i = 0; i < participants.length; i++) {
            participant = participants[i];
            $participant = $('<p />');
            
            
            $init = $('<input type="text" class="language" data-langtitle="_COMBATTRACKERINITIATIVE_" />')
                    .val(participant.init)
                    .attr('data-id', participant.id);
            
            $init.on('change', window.app.emulateBind(function () {
                var val = this.$this.val();
                if (isNaN(val, 10)) {
                    this.$this.val(this.tracker.myStuff.ordered[this.ordered].init);
                } else {
                    val = parseInt(val);
                    this.tracker.myStuff.ordered[this.ordered].init = val;
                    this.tracker.memory.setMemory('combat', this.tracker.myStuff, false);
                }
            }, {tracker : this, ordered : i, $this : $init}));
            
            $opensheet = $('<a class="openSheet button language" data-langtitle="_COMBATTRACKEROPENSHEET_" />').on('click', window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.id);
            }, {id : participant.id}));
            
            $delete = $('<a class="deleteRow button language" data-langtitle="_COMBATTRACKERDELETEROW_" />');
            $delete.on('click', window.app.emulateBind(function () {
                this.tracker.bufftracker.deleteApplier(this.ordered);
                this.tracker.myStuff.ordered.splice(this.ordered, 1);
                if (this.tracker.myStuff.turn === this.ordered) {
                    this.tracker.warnTurn();
                }
                this.tracker.memory.setMemory('combat', this.tracker.myStuff, false);
            }, {tracker : this, ordered : i}));
            
            $target = $('<a class="setTarget button language" data-langtitle="_COMBATTRACKERSETTARGET_" />');
            $target.on('click', window.app.emulateBind(function () {
                if (this.$p.hasClass('target')) {
                    this.$p.removeClass('target');
                    this.tracker.target = -1;
                    return;
                }
                this.tracker.$body.children('p').removeClass('target');
                this.tracker.target = this.id;
                this.$p.addClass('target');
            }, {$p : $participant, tracker : this, id : i}));
            
            $setturn = $('<a class="setTurn button language" data-langtitle="_COMBATTRACKERSETTURN_" />');
            $setturn.on('click', window.app.emulateBind(function () {
                if (this.tracker.myStuff.turn !== this.order) {
                    this.tracker.bufftracker.moveTurns(this.tracker.myStuff.turn, this.order);
                    this.tracker.myStuff.turn = this.order;
                }
                this.tracker.warnTurn();
                this.tracker.saveMemory();
            }, {order : i, tracker : this}));
            
            hp = '';
            mp = '';
            if (window.app.sheetdb.isLoaded(participant.id)) {
                sheet = window.app.sheetdb.getSheet(participant.id);
                if (typeof sheet.values['HPAtual'] !== 'undefined' && typeof sheet.values['HPMaximo'] !== 'undefined') {
                    hp = sheet.values['HPAtual'] + '/' + sheet.values['HPMaximo'];
                }
                if (typeof sheet.values['MPAtual'] !== 'undefined' && typeof sheet.values['MPMaximo'] !== 'undefined') {
                    mp = sheet.values['MPAtual'] + '/' + sheet.values['MPMaximo'];
                }
            }
            if (hp !== '') $hp = $('<span class="hp" />').text(hp);
            if (mp !== '') $mp = $('<span class="mp" />').text(mp);
            
            $participant
                    .append($delete)
                    .append($('<span class="personagem" />').text(participant.name))
                    .append(
                        $('<span class="floatRight" />')
                            .append((hp !== '' ? $hp : ''))
                            .append((mp !== '' ? $mp : ''))
                            .append($init)
                            .append($setturn)
                            .append($target)
                            .append($opensheet)
                    );
            if (turn === i) {
                $participant.addClass('hisTurn');
            }
            if (i === this.target) {
                $participant.addClass('target');
            }
            $participant.attr('data-id', participant.id);
            this.$body.append($participant);
        }
        
        if (participants.length === 0) {
            this.$body.append($('<p class="language" data-langhtml="_COMBATTRACKERNOPARTICIPANTS_" />'));
        }
        
        window.app.ui.language.applyLanguageOn(this.$body);
        
        if (changed && user.isStoryteller()) {
            this.myStuff.ordered = participants;
            this.myStuff.turn = turn;
            this.memory.setMemory('combat', this.myStuff, false);
        }
    };
    
    this.updateUserList = function () {
        if (window.app.chatapp.room === null) {
            return;
        }
        var room = window.app.chatapp.room;
        var usersDB = room.users.users;
        var users = [];
        for (var i in usersDB) {
            users.push(usersDB[i]);
        }
        if (this.$players.children().length !== (users.length + 1)) {
            users.sort(function (a, b) {
                var na = a.nickname.toUpperCase() + '#' + a.nicknamesufix.toUpperCase();
                var nb = b.nickname.toUpperCase() + '#' + b.nicknamesufix.toUpperCase();
                if (na < nb) {
                    return -1;
                }
                if (na > nb) {
                    return 1;
                }
                return 0;
            });
            this.$players.empty().append('<option value="0">NPC</option>');
            var $player;
            for (var i = 0; i < users.length; i++) {
                $player = $('<option />').val(users[i].id).text(users[i].nickname + '#' + users[i].nicknamesufix);
                this.$players.append($player);
            }
        }
    };
    
    this.updateSheetList = function () {
        var user = this.getUser();
        if (!user.isStoryteller()) {
            return;
        }
        this.$sheets.empty();
        if (window.app.chatapp.room === null) {
            return;
        }
        var room = window.app.chatapp.room;
        var sheet;
        var $sheet = [];
        var sheets = window.app.sheetdb.sheets;
        for (var i in sheets) {
            sheet = sheets[i];
            if (sheet.gameid === room.gameid) {
                $sheet.push($('<option />').val(sheet.id).text(sheet.name));
            }
        }
        console.log(sheets);
        $sheet.sort(function ($a,$b) {
            var na = $a.text().toUpperCase();
            var nb = $b.text().toUpperCase();
            if (na < nb) {
                return -1;
            }
            if (na > nb) {
                return 1;
            }
            return 0;
        });
        
        for (var i = 0; i < $sheet.length; i++) {
            this.$sheets.append($sheet[i]);
        }
    };
    
    this.warnTurn = function () {
        var room = window.app.chatapp.room;
        if (room === null) {
            return;
        }
        if (typeof this.myStuff.ordered[this.myStuff.turn] === 'undefined') {
            return;
        }
        var message = new Message();
        message.module = "sheettr";
        message.setSpecial('sheetname', this.myStuff.ordered[this.myStuff.turn].name);
        message.setOrigin(window.app.loginapp.user.id);
        message.roomid = window.app.ui.chat.cc.room.id;
        message.setSpecial('player', this.myStuff.ordered[this.myStuff.turn].player);
        window.app.chatapp.printAndSend(message, true);
        
        this.bufftracker.printBuffs(this.myStuff.ordered[this.myStuff.turn].id);
    };
    
    this.getCurrentTurn = function () {
        if (typeof this.myStuff.ordered === 'undefined' || this.myStuff.turn === undefined || typeof this.myStuff.ordered[this.myStuff.turn] === 'undefined') {
            return -1;
        }
        return this.myStuff.ordered[this.myStuff.turn].id;
    };
    
    this.getTarget = function () {
       if (this.target === undefined || this.myStuff.ordered === undefined || typeof this.myStuff.ordered[this.target] === 'undefined') {
            return -1;
        }
        return this.myStuff.ordered[this.target].id;
    };
} 
 
function LanguageTracker() {
    this.$tracker = $('#languageTracker').draggable({
        containment : 'window',
        handle : '#languageTrackerHandle'
    }).hide();
    
    this.$tabButton = $('#languagesButton');
    this.$body = $('#languageTrackerBody').empty();
    
    /** @type Room_Memory */ this.memory;
    
    this.init = function () {
        window.registerRoomMemory('lingo', this);
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#languageTrackerHide').on('click', function () {
            window.app.ui.chat.langtab.toggleTab();
        });
        
        this.$tabButton.on('click', function () {
            window.app.ui.chat.langtab.toggleTab();
        });
    };
    
    this.toggleTab = function () {
        var offset = this.$tabButton.offset();
        if (this.$tracker.is(":visible")) {
            this.$tracker.stop(true,false).animate({
                top : offset.top + 20,
                left : offset.left + 20,
                height: '0px',
                width: '0px'
            }, function () {
                $(this).hide();
            });
        } else {
            this.$tracker.show().css('height', '').css('width', '').css('top', offset.top + 20).css('left', offset.left + 20);
            var height = this.$tracker.height();
            var width = this.$tracker.width();
            this.$tracker.css('height', '0px').css('width', '0px');
            this.$tracker.stop(true,false).animate({
                top : 10,
                left: 110,
                height: height + 'px',
                width: width + 'px'
            });
        }
    };
    
    this.updateMemory = function (memory) {
        this.memory = memory;
        this.myStuff = this.memory.getMemory('lingo', {lingo : {}});
        this.myStuff = this.myStuff.lingo;
        /**
         * id : [lingua1, lingua2]
         */
        var changed = false;
        var ling;
        // Remove invalid/unnecessary stores
        for (var i in this.myStuff) {
            if (isNaN(i, 10) || !(this.myStuff[i] instanceof Array)) {
                changed = true;
                delete this.myStuff[i];
            } else {
                if (this.myStuff[i].length === 0) {
                    changed = true;
                    delete this.myStuff[i];
                    continue;
                }
                for (ling = 0; ling < this.myStuff[i].length; ling++) {
                    if (typeof this.myStuff[i][ling] !== 'string') {
                        changed = true;
                        delete this.myStuff[i];
                        break;
                    }
                }
            }
        }
        
        this.updateList();
        
        var user = window.app.chatapp.room.getMe();
        if (user.isStoryteller()) {
            if (changed) {
                this.saveMemory();
            }
            this.$body.find('a.deleteLanguage, a.addLanguage, select').show();
        } else {
            this.$body.find('a.deleteLanguage, a.addLanguage, select').hide();
        }
    };
    
    this.updateList = function () {
        this.$body.empty();
        
        var memory = this.myStuff;
        
        var $select = $('<select />');
        
        var i;
        
        for (i = 0; i < window.AvailableLanguages.length; i++) {
            $select.append(
                $('<option />').val(window.AvailableLanguages[i]).text(window.AvailableLanguages[i])
            );
        }
        
        var intid;
        var $p;
        var $player;
        var $languages;
        var $language;
        var $remove;
        var $myselect;
        var $add;
        /** @type User */ var player;
        var noplayers = true;
        for (var id in window.app.chatapp.room.users.users) {
            player = window.app.chatapp.room.users.users[id];
            if (player.isStoryteller()) continue;
            noplayers = false;
            intid = player.id;
            $p = $('<p />');
            $player = $('<span class="player" />').text(player.nickname + '#' + player.nicknamesufix + ": ");
            $languages = $('<span class="languages" />');
            if (typeof memory[id] !== 'undefined') {
                for (i = 0; i < memory[id].length; i++) {
                    var $remove = $('<a class="deleteLanguage">(X)</a>');
                    var $language = $('<span class="language" />').text(memory[id][i]);
                    $language.prepend($remove);
                    $languages.append($language);
                    if (player.id === window.app.loginapp.user.id || window.app.chatapp.room.getMe().isStoryteller()) {
                        $language.addClass('mine');
                        $language.on('click', window.app.emulateBind(function () {
                            window.app.ui.chat.langtab.startTyping(this.lingo);
                        }, {lingo : memory[id][i]}));
                    }
                    $remove.on('click', window.app.emulateBind(function (e) {
                        window.app.ui.chat.langtab.removeLing(this.player, this.ling);
                        e.stopPropagation();
                    }, {player : intid, ling : i, $lang : $language}));
                }
            }
            $myselect = $select.clone();
            $add = $('<a class="addLanguage">(+)</a>');
            
            $add.on('click', window.app.emulateBind(function () {
                window.app.ui.chat.langtab.addLing(this.player, this.$select.val());
            }, {player : intid, $select : $myselect}));
            
            $p.append($player).append($languages.append('<br />').append($myselect).append($add));
            this.$body.append($p);
        }
        
        if (noplayers) {
            this.$body.append($('<p class="language" data-langhtml="_LANGUAGETRACKERNOPLAYERS_" />'));
            window.app.ui.language.applyLanguageOn(this.$body);
        }
        
        if (window.app.chatapp.room.getMe().isStoryteller()) {
            $p = $('<p />');
            player = window.app.chatapp.room.getMe();
            $player = $('<span class="player" />').text(player.nickname + '#' + player.nicknamesufix + ": ");
            $languages = $('<span class="languages" />');
            for (i = 0; i < window.AvailableLanguages.length; i++) {
                $language = $('<span class="language" />').text(window.AvailableLanguages[i]);
                $language.addClass('mine');
                $language.on('click', window.app.emulateBind(function () {
                    window.app.ui.chat.langtab.startTyping(this.lingo);
                }, {lingo : window.AvailableLanguages[i]}));
                $languages.append($language);
            }
            $languages.append("<a style='clear: both; display: block'></a>");
            $p.append($player).append($languages);
            this.$body.append($p);
        }
        
        this.$tracker.css('height', '');
    };
    
    this.removeLing = function (playerid, lingindex) {
        if (typeof this.myStuff[playerid] !== 'undefined') {
            this.myStuff[playerid].splice(lingindex, 1);
            this.saveMemory();
        }
    };
    
    this.addLing = function (playerid, ling) {
        if (typeof this.myStuff[playerid] === 'undefined') {
            this.myStuff[playerid] = [];
        }
        if (this.myStuff[playerid].indexOf(ling) !== -1) {
            return;
        }
        this.myStuff[playerid].push(ling);
        this.saveMemory();
    };
    
    this.saveMemory = function () {
        console.log(this.myStuff);
        this.memory.setMemory('lingo', {lingo : this.myStuff}, false);
    };
    
    this.whoSpeaks = function (ling) {
        var speakers = [];
        var player;
        for (var id in window.app.chatapp.room.users.users) {
            player = window.app.chatapp.room.users.users[id];
            if (player.isStoryteller()) {
                speakers.push(player.id);
            } else {
                if (typeof this.myStuff[player.id] !== 'undefined' && this.myStuff[player.id].indexOf(ling) !== -1) {
                    speakers.push(player.id);
                }
            }
        }
        return speakers;
    };
    
    this.startTyping = function (lingo) {
        window.app.ui.chat.$chatinput.val("/ling " + lingo + ", " + window.app.ui.chat.$chatinput.val()).focus();
    };
} 
 
/** 
 * JSON Message:
 * 
 * ID : {
 *      Origin : ID,
 *      Destination: ID|NULL,
 *      Message : String,
 *      Module : String,
 *      Special : {
 *          Persona : String,
 *          FakeLanguage : String,
 *          ...
 *      }
 * }
 * 
 * Default Modules (Action, OffGame, Speech, Story) will
 * be controlled server-side and will work in a very specific manner.
 * Their Special object will ALWAYS have certain values inside of it and they will follow rules.
 * 
 * Non-default modules are controller client-side. That means the server will only check
 */

/**
 * MessageController is the part of the UI that handles messages.
 * It grabs the messages and calls upon the message modules to process them.
 * @class MessageController
 * @constructor
 */
function MessageController () {
    this.messageHistory = [];
    this.lastMessage = -1;
    this.messageRoller = 0;
    
    this.$chatinput;
    
    this.slashToMod = {
        /* Tells which module gets which slash command. MC doesn't actually process anything.
         * '/me' : 0,
         * Generated automatically through reading window.chatModules.
         * No slash commands calls upon '' empty string.
         * Invalid slash command calls an error message.
         */
    };
    
    this.idToMod = {
        /* Just like slashToMod, but points an id to a module.
         * 'Action' : 0,
         * Generated automatically through reading window.chatModules.
         * If the module is not found, message is printed to the user.
         */
    };
    
    
    this.getModule = function (id) {
        id = id.toLowerCase();
        if (typeof this.idToMod[id] !== 'undefined') {
            return this.idToMod[id];
        }
        return null;
    };
    
    this.getModuleFromSlash = function (slash) {
        slash = slash.toLowerCase();
        if (typeof this.slashToMod[slash] !== 'undefined') {
            return this.slashToMod[slash];
        }
        return null;
    };
    
    /**
     * Reads every registered chat Module and stores it for later use.
     * If any modules are added at runtime, this needs to be called again
     * or the modules will not be usable.
     * @returns {undefined}
     */
    this.readModules = function () {
        var module;
        
        for (var i = 0; i < window.chatModules.length; i++) {
            /**
            * @type Module
            */
            module = window.chatModules[i];
            this.idToMod[module.ID.toLowerCase()] = module;
            
            for (var v = 0; v < module.Slash.length; v++) {
                this.slashToMod[module.Slash[v].toLowerCase()] = module;
            }
        };
    };
    
    this.init = function () {
        this.readModules();
        this.$chatinput = $('#chatMensagemInput');
    };
    
    /**
     * Empties the chatInput
     * @returns {undefined}
     */
    this.clearInput = function () {
        this.$chatinput.val('');
    };
    
    
    /**
     * Returns current chatInput value.
     * @returns {MessageController@pro;$chatinput@call;val}
     */
    this.getInput = function () {
        return this.$chatinput.val();
    };
    
    /**
     * Gets current chatInput and starts processing a message.
     * @param {Event} e
     * @returns {undefined}
     */
    this.eatMessage = function (e) {
        var msg = this.getInput().trim();
        // If this isn't a slash command, check for shortcuts
        if (msg.charAt(0) !== '/') {
            if (msg.indexOf('off:') === 0){
                msg = msg.replace('off:', '/off ');
            } else if (typeof e !== 'undefined') {
                if (e.shiftKey) {
                    msg = '/story ' + msg;
                } else if (window.app.ui.chat.cc.room.persona === null) {
                    msg = '/off ' + msg;
                } else if (e.ctrlKey) {
                    msg = '/me ' + msg;
                } else if (e.altKey) {
                    msg = '/off ' + msg;
                }
            }
        }
        this.processMessage(msg);
        this.clearInput();
    };
    
    /**
     * Replaces the value in chatInput by String msg and then selects it all.
     * @param {String} msg
     * @returns {undefined}
     */
    this.replaceInput = function (msg) {
        this.$chatinput.val(msg);
        this.$chatinput.select();
    };
    
    /**
     * Moves chatInput to an older message in the message history.
     * Empties chatInput if there aren't any older messages.
     * @returns {undefined}
     */
    this.messageRollUp = function () {
        var text = this.$chatinput.val().trim();
        if (text !== '' && this.messageHistory[this.messageRoller] !== text) {
            var roll = this.messageRoller;
            this.storeMessage(text);
            this.messageRoller = roll;
        }
        if (this.messageRoller > 0 && (typeof this.messageHistory[this.messageRoller - 1] !== 'undefined')) {
            this.messageRoller -= 1;
            this.replaceInput(this.messageHistory[this.messageRoller]);
        } else {
            this.messageRoller = -1;
            this.clearInput();
        }
    };
    
    /**
     * Moves chatInput to a newer message in the message history.
     * Empties chatInput if there aren't any newer messages.
     * @returns {undefined}
     */
    this.messageRollDown = function () {
        var text = this.$chatinput.val().trim();
        if (text !== '' && this.messageHistory[this.messageRoller] !== text) {
            var roll = this.messageRoller;
            this.storeMessage(text);
            this.messageRoller = roll;
        }
        if (this.messageRoller + 1 < this.messageHistory.length) {
            this.replaceInput(this.messageHistory[++this.messageRoller]);
        } else {
            this.messageRoller = this.messageHistory.length;
            this.clearInput();
        }
    };
    
    /**
     * Receives the message string and makes it go through the appropriate Module.
     * If no module can be found, appends an error to chat.
     * @param {String} msg
     * @returns {undefined}
     */
    this.processMessage = function (msg) {
        if (msg.charAt(0) === '/') {
            if (msg.indexOf(' ') !== -1) {
                var slashCMD = msg.substr(0,msg.indexOf(' '));
                var msgOnly = msg.substr(msg.indexOf(' ')+1);
            } else {
                var slashCMD = msg;
                var msgOnly = '';
            }
        } else {
            var slashCMD = '';
            var msgOnly = msg;
        }
        slashCMD = slashCMD.toLowerCase();
        msgOnly = msgOnly.trim();
        // Pass through module
        if (typeof this.slashToMod[slashCMD] !== 'undefined') {
            var mod = this.slashToMod[slashCMD];
            if (mod.isValid(slashCMD, msgOnly, window.app.ui.chat.cc.room.getUser(window.app.loginapp.user.id).isStoryteller())) {
                var msgObj = mod.getMsg(slashCMD, msgOnly);
                if (msgObj !== null) {
                    msgObj.roomid = window.app.ui.chat.cc.room.id;
                    msgObj.room = window.app.ui.chat.cc.room;
                    msgObj.origin = window.app.loginapp.user.id;
                    msgObj.module = mod.ID;
                    console.log(msgObj);
                }
                var $msg = mod.get$(msgObj, slashCMD, msgOnly);
                if ($msg !== null) {
                    window.app.ui.language.applyLanguageOn($msg);
                    if (msgObj !== null) {
                        window.app.ui.chat.cc.hoverizeSender($msg, msgObj);
                    }
                    window.app.ui.chat.appendToMessages($msg);
                }
                if (msgObj !== null) {
                    window.app.ui.chat.cc.room.addLocal(msgObj);
                    window.app.chatapp.sendMessage(msgObj);
                }
                
                if (msgObj !== null && $msg !== null) {
                    msgObj.set$($msg);
                }
            } else {
                var $error = mod.get$error(slashCMD, msgOnly, window.app.loginapp.user.isStoryteller());
                if ($error !== null) {
                    window.app.ui.language.applyLanguageTo($error);
                    window.app.ui.language.applyLanguageOn($error);
                    window.app.ui.chat.appendToMessages($error);
                } else {
                    var cleanSlash = $('<div />').text(slashCMD).html();
                    var cleanMsg = $('<div />').text(msgOnly).html();
                    var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDSLASHMESSAGE_" />');
                    $html.attr('data-langp', cleanSlash);
                    $html.attr('data-langd', msgOnly);
                    window.app.ui.language.applyLanguageTo($html);
                    window.app.ui.chat.appendToMessages($html);
                }
            }
        } else {
            var cleanSlash = $('<div />').text(slashCMD).html();
            var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDSLASHCOMMAND_" />');
            $html.attr('data-langp', cleanSlash);
            window.app.ui.language.applyLanguageTo($html);
            window.app.ui.chat.appendToMessages($html);
        }
        // Send Message object to database
        
        this.storeMessage(msg);
    };
    
    /**
     * Records a message in message history and resets the roller position.
     * @param {String} msg
     * @returns {undefined}
     */
    this.storeMessage = function (msg) {
        this.messageHistory.push(msg);
        this.messageRoller = this.messageHistory.length;
    };
}


/**
 * Holds every module we have.
 * Modules should implement every method of the TemplateModule Class, or they won't work.
 * @type Array
 */
if (window.chatModules === undefined) window.chatModules = []; 
 
if (window.chatModules === undefined) window.chatModules = [];
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 
 
if (window.chatModules === undefined) window.chatModules = [];
function ModuleMensagem () {
    /**
     * Hook é o slash command que irá, preferencialmente, ser enviado a esse módulo.
     * Slash command vazio ("") significa quando não há slash command.
     * @type String
     */
    this.hook = "/lang";
    
    /**
     * Guarda os valores padrões para as mensagens do módulo.
     * A função disso é não entregar mensagens de erro caso o servidor tenha guardado uma mensagem incompleta enviada por esse módulo.
     * @type object
     */
    this.default = {
        mensagem:"Mensagem inválida.",
        personagem: "Personagem Inválido",
        lingua: "Comum"
    };
    
    /**
     * Checa se a mensagem realmente é desse módulo.
     * Nesse módulo: é necessário ter uma persona ativa. A mensagem não pode estar vazia.
     * @param {String} mensagem
     * @returns {boolean}
     */
    this.checkMessage = function (mensagem) {
        return false;
    };
} 
 
function Module () {
    /**
     * Module ID. Should be unique and readable.
     * @type String
     */
    this.ID;
    
    /**
     * Holds every slash command that should point to this module.
     * @type Array of String
     */
    this.Slash = [];
    
    /**
     * Creates Message object from a String.
     * @param {String} message
     * @returns {Message}
     */
    this.createObject = function (message) {
        
    };
    
    /**
     * Creates HTML String out of a Message Object.
     * @param {Message} message
     * @returns {String}
     */
    this.createHTML = function (message) {
        
    };
} 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'action',
    
    Slash : ['/me', '/eu', '/act', '/acao', '/açao', '/ação'],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var user = msg.getUser();
        var $msg = $('<p class="chatAcao" />');
        
        var $persona = $('<b />').text('* ' + msg.getSpecial('persona', '????'));
        var msgText = $('<p />').text(msg.msg).html();
        $msg.append($persona).append(' ' + msgText);
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        if (room.persona === null) {
            msg.setSpecial('persona', '?????');
        } else {
            msg.setSpecial('persona', room.persona);
        }
        msg.msg = message;
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Avatar',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/avatar'],
    
    isValid : function (slashCMD, msg) {
        if (msg.length > 0) {
            return true;
        }
        return false;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.ui.chat.cc.room.avatar = message;
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'bgmplay',
    
    Slash : ['/bgm', '/splay', '/musica', '/sound', '/som'],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        var user = msg.getUser();
        var $msg = $('<p class="chatImagem" />');
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        var $who = $('<span class="language" data-langhtml="_SHAREDSOUND_" />');
        if (!snowflake) {
            $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
        } else {
            $who.attr('data-langp', (user.nickname));
        }
        $msg.append($who);
        
        var name = msg.getSpecial('name', null);
        
        if (name != null) {
            $msg.append(' ');
            $msg.append($("<span />").text('"' + name + '".'));
        }
        
        $msg.append (' ');
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_SOUNDLINK_" />');
        //$link.attr('href', cleanMsg);
        $link.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.chat.audioc.play(this.link);
            }, {link : cleanMsg}
        ));

        $msg.append($link);
        if (window.app.ui.chat.cc.firstPrint) {
            return $msg;
        }

        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null));
        var StorytellerPlayedItNow = user.isStoryteller() && (window.app.config.get("autoBGM") === 1);

        if (IPlayedItNow || StorytellerPlayedItNow || (window.app.config.get("autoBGM") === 2)) {
            window.app.ui.chat.audioc.play(cleanMsg);
        }

        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        msg.setSpecial('name', null);
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'buff',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : [],
    
    isValid : function (slashCMD, msg) {
        return false;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        var $html = $('<p class="chatSistema" />');
        var targetId = msg.getSpecial("target", -1);
        var targetName;
        var applierName;
        var applierId = msg.getSpecial("applier", -1);
        var ordered = window.app.ui.chat.tracker.myStuff.ordered;
        for (var i = 0; i < ordered.length; i++) {
            if (ordered[i].id === targetId) {
                targetName = ordered[i].name;
            }
            if (ordered[i].id === applierId) {
                applierName = ordered[i].name;
            }
        }
        if (targetName === undefined || applierName === undefined) {
            return null;
        }
        
        var user = msg.getUser();
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        if (!snowflake) $html.append(user.nickname + "#" + user.nicknamesufix);
        else $html.append(user.nickname);

        var $a = $("<a class='language textLink' data-langhtml='_BUFFAPPLYLINK_'></a>");
        $a.on("click", window.app.emulateBind(function () {
            window.app.ui.chat.tracker.bufftracker.addBuff(this.applier, this.target, 1, this.nome, this.iniciofim);
            this.$a.remove();
        }, {
            applier : applierId,
            target : targetId,
            nome : msg.getMessage(),
            iniciofim : msg.getSpecial("eot", 0) === 1,
            $a : $a
        }));
        
        $html.append(" <span class='language' data-langhtml='_BUFFAPPLYINGBUFF_'></span> \"" + msg.getMessage() + "\"")
                .append(" <span class='language' data-langhtml='_BUFFAPPLYINGTO_'></span> " + targetName + ", ")
                .append(" <span class='language' data-langhtml='_BUFFAPPLYINGFROM_'></span> " + applierName + ". ")
                .append($a);
        
        if (!window.app.chatapp.room.getMe().isStoryteller()) {
            $a.remove();
        }
        
        window.app.ui.language.applyLanguageOn($html);
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
//        var msg = new Message();
//        return msg;
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Clear',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/clear', '/limpa', '/limpar', '/cls', '/apagar', '/apaga', '/limpar', '/limpa'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (message === '1') {
            var $html = null;
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_CHATCLEARED_" />');
        }
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.ui.chat.$chatMessages.empty();
        
        if (message === '1') {
            window.app.chatapp.clear();
        }
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'countdown',
    
    timeouts : [],
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/countdown', '/count', '/timer', '/stoptimer'],
    
    isValid : function (slashCMD, msg) {
        return !isNaN(msg, 10) || slashCMD === '/stoptimer';
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (msg === null) {
            return null;
        }
        
        var $msg = $('<p class="chatNarrativa" />');
        
        $msg.text(msg.msg);
        
        return $msg;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        for (var i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        if (slashCMD === '/stoptimer') {
            return null;
        }
        var counter = parseInt(message);
        var timeout;
        var steps = 0;
        while (counter >= 0) {
            this.timeouts.push(
                setTimeout(window.app.emulateBind(
                    function () {
                        var message = new Message();
                        message.origin = window.app.loginapp.user.id;
                        message.module = 'countdown';
                        message.msg = this.count;
                        message.roomid = window.app.ui.chat.cc.room.id;
                        var $html = this.mod.get$(message);
                        window.app.ui.language.applyLanguageOn($html);
                        window.app.ui.chat.appendToMessages($html);
                        window.app.ui.chat.cc.room.addLocal(message);
                        window.app.chatapp.sendMessage(message);
                    }, {count : counter, mod : this}
                ), steps * 1000)
            );
            counter -= 1;
            steps += 1;
        }
        console.log(this.timeouts);
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'dice',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashcmd) {
        if (msg.destination !== null && msg.destination !== 0 && window.app.ui.isStreaming()) {
            return null;
        }
        var user = msg.getUser();
        var $msg = $('<p class="chatDice" />');
        
        if (msg.getSpecial('rolls', null) === null) {
            var mod = window.app.ui.chat.mc.getModule(msg.module);
            var cbs = window.app.emulateBind(
                function () {
                    var $html = this.mod.get$(this.msg);
                    $html.attr('data-msgid', this.msg.id);
                    this.$msg.replaceWith($html);
                    window.app.ui.language.applyLanguageOn($html);
                    window.app.ui.chat.cc.hoverizeSender($html, this.msg);
                }, {mod : mod, msg : msg, $msg : $msg}
            );
    
    
            var cbe = window.app.emulateBind(
                function () {
                    this.$msg.attr('data-langhtml', '_DICEERROR_');
                    window.app.ui.language.applyLanguageTo(this.$msg);
                }, {$msg : $msg}
            );
            
            msg.bindError(cbe);
            msg.bindSaved(cbs);
            
            $msg.addClass("language");
            $msg.attr("data-langhtml", "_DICEWAITING_");
            
            return $msg;
        }
        
        var $persona = $('<b />').text('* ' + msg.getSpecial('persona', '????'));
        
        $msg.append($persona);
        if (msg.destination === null || msg.destination === 0) {
            var $rollmsg = $('<span class="language" data-langhtml="_DICEHASROLLED_" />');
        } else {
            var $rollmsg = $('<span class="language" data-langhtml="_DICEHASSECRETLYROLLED_" />');
        }
        $msg.append(' ').append($rollmsg);
        
        
        var diceText = "";
        
        var dices = msg.getSpecial("dice", []);
        var rolls = msg.getSpecial("rolls", []);
        var mod = msg.getSpecial("mod", 0);
        
        var diceAmount = {};
        
        var diceArray = [];
        
        for (var i = 0; i < dices.length; i++) {
            if (typeof diceAmount[dices[i]] === 'undefined') {
                diceAmount[dices[i]] = 1;
            } else {
                diceAmount[dices[i]] += 1;
            }
        }
        
        for (var i in diceAmount) {
            diceArray.push(diceAmount[i] + 'd' + i);
        }
        
        var sum = 0;
        
        for (var i = 0; i < rolls.length; i++) {
            sum += rolls[i];
        }
        
        sum += mod;
        
        diceText = diceArray.join(' + ');
        
        if (mod !== 0) {
            diceText = diceText + ' + ' + mod;
        }
        
        
        if (diceArray.length === 0) {
            $msg.append($('<span class="box mod" />').text(sum));
            $rollmsg.attr("data-langhtml", "_HASTHROWN_");
        } else {
            var $initialRoll = $('<span class="box square" />');
            $initialRoll.text(diceText);
            $msg.append($initialRoll);

            $msg.append($('<a class="equals" />').text('='));

            var $results = $('<span class="results" />');

            rolls.sort();
            rolls.reverse();

            for (var i = 0; i < rolls.length; i++) {
                $results.append($('<a class="box" />').text(rolls[i]));
                if (i + 1 < rolls.length) {
                    $results.append($('<a class="plus" />').text('+'));
                }
            }

            if (mod !== 0) {
                $results.append($('<a class="plus" />').text('+'));
                $results.append($('<a class="box mod" />').text(mod));
            }

            $msg.append($results);

            $msg.append($('<a class="equals" />').text('='));
            $msg.append($('<span class="box square sum" />').text(sum));
        }
        
        if (msg.msg !== null && msg.msg !== '') {
            var $reason = $('<span class="reason" />');
            $reason.append($('<b class="language" data-langhtml="_DICEREASON_" />'));
            $reason.append($('<p />').text(msg.msg).html());

            $msg.append($reason);
        }
        
        
        // Strictly for Dragon Fantasy Saga, ignore
        var extra = msg.getSpecial("extra", null);
        if (extra !== null && typeof extra === 'object' && (extra.type === "Dano" || extra.type === "Cura")) {
            if (typeof window.app.ui.chat.tracker.myStuff !== 'undefined' &&
                    typeof window.app.ui.chat.tracker.myStuff.ordered !== 'undefined' &&
                    typeof window.app.ui.chat.tracker.myStuff.ordered[extra.target] !== 'undefined') {
                var mine = window.app.ui.chat.tracker.myStuff.ordered[extra.target];
                if (mine.id === extra.id && mine.name === extra.name && typeof window.app.ui.sheetui.controller.$listed[extra.id] !== "undefined" && window.app.sheetdb.getSheet(extra.id).editable) {
                    // we have everything to do it
                    msg.setSpecial("sum", sum);
                    var tiposDano = "";
                    if (extra.type === "Dano") {
                        var atributos = ['Artes Marciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Liderança'];
                        tiposDano = [];
                        for (var id = 0; id < atributos.length; id++) {
                            if (extra.damageType.indexOf(id) === -1) continue;
                            tiposDano.push(atributos[id]);
                        }
                        if (tiposDano.length === 0) {
                            tiposDano = "Sem Tipo";
                        } else {
                            tiposDano = tiposDano.join(", ");
                        }
                        tiposDano = " (" + tiposDano + ")";
                    }
                    var $a = $("<a class='automaticButton button' />").attr("title", "Essa rolagem é de " + extra.type + tiposDano + " e teve " + mine.name + " como alvo. Clique aqui para aplicar automaticamente.");
                    $a.on('click', window.app.emulateBind(function () {
                        window.dfsDice(this.msg);
                    }, {msg : msg}));
                    $reason.append($a);
                }
            }
        }
        
        // Back to default dice behavior
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'grinch',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/grinch'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        clearInterval(window.christmasInterval);
        delete window.christmasInterval;
        $('#snowCanvas').remove();
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'help',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/help', '/comandos', '/h', '/?', '/comando'],
    
    isValid : function (slashCMD, msg) {
        return false;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @param {String} slashCMD
     * @param {String} msgOnly
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        return null;
    },
    
    /**
     * Creates the HTML Element for an error message.
     * This is called after isValid returns false.
     * @param {String} slashCMD
     * @param {String} message
     * @returns {jQuery}
     */
    get$error : function (slashCMD, message) {
        message = message.trim();
        if (message === '') {
            return this.get$short();
        }
        
        var module = window.app.ui.chat.mc.getModule(message);
        if (module !== null) {
            return this.get$long(module);
        }
        
        if (message.indexOf('/') === -1) message = '/' + message;
        module = window.app.ui.chat.mc.getModuleFromSlash(message);
        if (module !== null) {
            return this.get$long(module);
        }
        
        return this.get$invalid();
    },
    
    get$short : function () {
        var module;
        var $html = $('<p class="chatSistema"/>');
        var $mod;
        var id;
        $html.append('<span class="language" data-langhtml="_MODULELIST_"></span>: <br />');
        for (var i = 0; i < window.chatModules.length; i++) {
            module = window.chatModules[i];
            if ((module.showHelp !== undefined && !module.showHelp) || module.Slash.length === 0) {
                continue;
            }
            id = module.ID;
            id = id.charAt(0).toUpperCase() + id.substr(1, id.length);
            $mod = $('<span class="module" />');
            $mod.append("<span class='name'>" + id + ": </span>").append(module.Slash.join(', '));
            id = '_' + module.ID.toUpperCase() + 'SHORTHELP_';
            if (window.app.ui.language.getLingo(id) !== id) {
                $mod.append(' <span class="language miniHelp" data-langhtml="' + id + '"></span>');
            }
            if (i > 0 && i < window.chatModules.length -1) {
                $mod.append("<br />");
            }
            $html.append($mod);
        }
        return $html;
    },
    
    get$long : function (module) {
        if (module.get$help !== undefined) {
            return module.get$help();
        }
        var id = '_' + module.ID.toUpperCase() + 'LONGHELP_';
        if (window.app.ui.language.getLingo(id) !== id) {
            return $('<p class="chatSistema language" data-langhtml="' + id + '" />');
        }
        var $html = $('<p class="chatSistema language" data-langhtml="_MODULENOHELP_" />');
        id = module.ID;
        id = id.charAt(0).toUpperCase() + id.substr(1, id.length);
        $html.attr("data-langp", id);
        return $html;
    },
    
    get$invalid : function () {
        var $html = $('<p class="chatSistema language" data-langhtml="_HELPINVALIDMODULE_" />');
        return $html;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'hidepersona',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/hidepersona', '/hidepers'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (window.app.ui.chat.cc.room.hidePersona) {
            var $html = $('<p class="chatSistema language" data-langhtml="_HIDEPERSON_" />');
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_HIDEPERSOFF_" />');
        }
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.ui.chat.cc.room.hidePersona = !window.app.ui.chat.cc.room.hidePersona;
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'image',
    
    Slash : ['/img', '/image', '/pic', '/picture', '/imagem', '/desenho'],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        var user = msg.getUser();
        var $msg = $('<p class="chatImagem" />');
        
        var nome = msg.getSpecial('name', null);
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        if (nome === null) {
            var $who = $('<span class="language" data-langhtml="_SHAREDIMAGE_" />');
            if (!snowflake) {
                $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
            } else {
                $who.attr('data-langp', (user.nickname));
            }
            $msg.append($who).append ('. ');
        } else {
            var $who = $('<span class="language" data-langhtml="_SHAREDTHEIMAGE_" />');
            if (!snowflake) {
                $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
            } else {
                $who.attr('data-langp', (user.nickname));
            }
            $msg.append($who);

            $msg.append (': ');
            
            $msg.append($('<span />').text(msg.getSpecial("name", null) + '. ').html());
        }
        
        if (nome !== null) {
            $msg.append('');
        }
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_IMAGELINK_" />');
        $link.bind('click', window.app.emulateBind(
            function (event) {
                window.app.ui.pictureui.open(this.link);
                event.preventDefault();
            }, {link : cleanMsg}
        ));
        $link.attr('href', cleanMsg);
        $link.attr('target', '_blank');
        
        $msg.append($link);
        if (window.app.ui.chat.cc.firstPrint) {
            return $msg;
        }
        
        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null));
        var StorytellerPlayedItNow = user.isStoryteller() && (window.app.config.get("autoImage") === 1);

        if (IPlayedItNow || StorytellerPlayedItNow || (window.app.config.get("autoImage") === 2)) {
            window.app.ui.pictureui.open(cleanMsg);
        }

        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
window.AvailableLanguages = ['Elvish', 'Binary', 'Magraki', 'Abyssal', 'Draconic', 'Aquon',
                             'Celestan', 'Technum', 'Arcana', 'Ancient', 'Natrum', 'Ellum',
                             'Animal', 'Auran', 'Davek', 'Arkadium'];
window.AvailableLanguages.sort(function (a, b) {
    var na = a.toUpperCase();
    var nb = b.toUpperCase();
    if (na < nb) {
        return -1;
    }
    if (na > nb) {
        return 1;
    }
    return 0;
});
window.chatModules.push({

    ID : 'lingo',
    
    Slash : ['/lang', '/language', '/lingo', '/lingua', '/ling', '/langsto',
             '/languagestory', '/lingosto', '/linguastory', '/lingsto', '/lingstory', '/lingostory'],
    
    linguas : window.AvailableLanguages,
    
    lingua : {
        Elvish : {
            words : {
                1 : ['a', 'i', 'e'],
                2 : ['ae', 'ea', 'lae', 'lea', 'mia', 'thal', 'maae', 'leah', 'tea', 'ma', 'da', 'le', 'li', 'ta', 'te', 'ia', 'io'],
                3 : ["a'la", 'eu', 'maari', 'eaat', 'tenlar', 'umil', 'malas', 'nilas', 'vaala', 'miu', 'thea', 'thao', 'bae', 'dia'],
                4 : ["e'lud", "mi'tael", 'lussia', 'tamila', 'lavia', 'mera', 'liaah', 'paalvas', 'mala', 'thala', 'tooa', 'theia'],
                5 : ["lu'thanis", "to'meera", "tha'valsar", 'tolelstraz', 'awynn', 'lissanas', 'olaamiss', 'tovalsar', 'malaasa', 'tholad'],
                6 : ["thaliassu", "leeramas", "su'diel", "mi'dhanas", "thashama", "liriana", "luinassa"],
                7 : ["lae'missa", "thol'vana", "sahmila", "mitrusala", "loriema", "tolisava"],
                Bigger : ['lamiaala', 'elatria', 'mialita', 'talvalbas', 'miraala', 'estraalas', 'teleerals',
                          'misalutia', 'lithusoh', "diel'thanas", "mil'dahni"],
                Numbers : ['o', 'u', 'uli', 'lia', 'sa', 'mi', 'ola', 'su', 'kaala', 'thus']
            },
            knownWords : {
                'uloloki' : ['CALOR','QUENTE','FOGO','CHAMA','FLAMEJANTE','CHAMAS','FOGOS'],
                'tenwar' : ['LETRA', 'LETRAS', 'LETTER', 'LETTERS'],
                'thalias' : ['CORAGEM', 'CONFIANÇA', 'CONFIANCA', 'BRAVERY'],
                'laer' : ['VERAO', 'VERÃO', 'SUMMER'],
                'tar' : ['ALTO', 'GRANDE'],
                'mellon' : ['AMIGO', 'COMPADRE', 'CAMARADA', "AMIGOS", "CAMARADAS", "COMPADRES", "ALIADO", "ALIADOS"],
                'zallon' : ['INIMIGO', "INIMIGOS", "ADVERSÁRIO", "ADVERSÁRIOS", "ADVERSARIO", "ADVERSARIOS"],
                'luin' : ['AZUL', 'AZULADO'],
                'hehe' : ['HA', "HAH", "HE", "HEH", "HEHE", "HAHA", "HEHEH", "HAHAH", "HEHEHE", "HAHAHA"],
                "el'um" : ['ELF', 'ELFO', 'ELFA'],
                "el'ar" : ['ELFOS', "ELFAS", "ELVES"],
                "el'zel" : ['FALSO', "FAKE", "FALSOS", "FAKES"],
                'elain' : ['ESPERANÇA', 'HOPE'],
                'luria' : ['ALEGRIA', 'FELICIDADE', 'JOY', 'HAPPINESS'],
                'lerast' : ['RÁPIDO', 'VELOZ', 'VELOCIDADE', 'FAST', 'SPEEDY', 'SPEED'],
                'vehal' : ['LAMA', 'BARRO', 'MUD', 'CLAY'],
                'simuh' : ['PÁSSARO', 'AVE', 'PASSARINHO', 'BIRD'],
                'fahin' : ['CURAR', 'SARAR', 'HEAL'],
                'amuhn' : ['BRUXA', 'FEITICEIRA', 'MAGA', 'WITCH', 'WIZARD', 'MAGE']
            },
            uppercase : true,
            allowpoints : true
        },
        Binary : {
            words : {
                Bigger : ['.','-','--','-.','.-','..','---','--.','-.-','-..','.--','.-.','..-','...','----','---.','--.-','--..','-.--','-.-.','-..-','-...','.---','.--.','.-.-','.-..','..--','..-.','...-','....','-----','----.','---.-','---..','--.--','--.-.','--..-','--...','-.---','-.--.','-.-.-','-.-..','-..--','-..-.','-...-','-....','.----','.---.','.--.-','.--..','.-.--','.-.-.','.-..-','.-...','..---','..--.','..-.-','..-..','...--','...-.','....-','.....','------','-----.','----.-','----..','---.--','---.-.','---..-','---...','--.---','--.--.','--.-.-','--.-..','--..--','--..-.','--...-','--....','-.----','-.---.','-.--.-','-.--..','-.-.--','-.-.-.','-.-..-','-.-...','-..---','-..--.','-..-.-','-..-..','-...--','-...-.','-....-','-.....','.-----','.----.','.---.-','.---..','.--.--','.--.-.','.--..-','.--...','.-.---','.-.--.','.-.-.-','.-.-..','.-..--','.-..-.','.-...-','.-....','..----','..---.','..--.-','..--..','..-.--','..-.-.','..-..-','..-...','...---','...--.','...-.-','...-..','....--','....-.','.....-','......','-------','------.','-----.-','-----..','----.--','----.-.','----..-','----...','---.---','---.--.','---.-.-','---.-..','---..--','---..-.','---...-','---....','--.----','--.---.','--.--.-','--.--..','--.-.--','--.-.-.','--.-..-','--.-...','--..---','--..--.','--..-.-','--..-..','--...--','--...-.','--....-','--.....','-.-----','-.----.','-.---.-','-.---..','-.--.--','-.--.-.','-.--..-','-.--...','-.-.---','-.-.--.','-.-.-.-','-.-.-..','-.-..--','-.-..-.','-.-...-','-.-....','-..----','-..---.','-..--.-','-..--..','-..-.--','-..-.-.','-..-..-','-..-...','-...---','-...--.','-...-.-','-...-..','-....--','-....-.','-.....-','-......','.------','.-----.','.----.-','.----..','.---.--','.---.-.','.---..-','.---...','.--.---','.--.--.','.--.-.-','.--.-..','.--..--','.--..-.','.--...-','.--....','.-.----','.-.---.','.-.--.-','.-.--..','.-.-.--','.-.-.-.','.-.-..-','.-.-...','.-..---','.-..--.','.-..-.-','.-..-..','.-...--','.-...-.','.-....-','.-.....','..-----','..----.','..---.-','..---..','..--.--','..--.-.','..--..-','..--...','..-.---','..-.--.','..-.-.-','..-.-..','..-..--','..-..-.','..-...-','..-....','...----','...---.','...--.-','...--..','...-.--','...-.-.','...-..-','...-...','....---','....--.','....-.-','....-..','.....--','.....-.','......-','.......','--------','-------.','------.-','------..','-----.--','-----.-.','-----..-','-----...','----.---','----.--.','----.-.-','----.-..','----..--','----..-.','----...-','----....','---.----','---.---.','---.--.-','---.--..','---.-.--','---.-.-.','---.-..-','---.-...','---..---','---..--.','---..-.-','---..-..','---...--','---...-.','---....-','---.....','--.-----','--.----.','--.---.-','--.---..','--.--.--','--.--.-.','--.--..-','--.--...','--.-.---','--.-.--.','--.-.-.-','--.-.-..','--.-..--','--.-..-.','--.-...-','--.-....','--..----','--..---.','--..--.-','--..--..','--..-.--','--..-.-.','--..-..-','--..-...','--...---','--...--.','--...-.-','--...-..','--....--','--....-.','--.....-','--......','-.------','-.-----.','-.----.-','-.----..','-.---.--','-.---.-.','-.---..-','-.---...','-.--.---','-.--.--.','-.--.-.-','-.--.-..','-.--..--','-.--..-.','-.--...-','-.--....','-.-.----','-.-.---.','-.-.--.-','-.-.--..','-.-.-.--','-.-.-.-.','-.-.-..-','-.-.-...','-.-..---','-.-..--.','-.-..-.-','-.-..-..','-.-...--','-.-...-.','-.-....-','-.-.....','-..-----','-..----.','-..---.-','-..---..','-..--.--','-..--.-.','-..--..-','-..--...','-..-.---','-..-.--.','-..-.-.-','-..-.-..','-..-..--','-..-..-.','-..-...-','-..-....','-...----','-...---.','-...--.-','-...--..','-...-.--','-...-.-.','-...-..-','-...-...','-....---','-....--.','-....-.-','-....-..','-.....--','-.....-.','-......-','-.......','.-------','.------.','.-----.-','.-----..','.----.--','.----.-.','.----..-','.----...','.---.---','.---.--.','.---.-.-','.---.-..','.---..--','.---..-.','.---...-','.---....','.--.----','.--.---.','.--.--.-','.--.--..','.--.-.--','.--.-.-.','.--.-..-','.--.-...','.--..---','.--..--.','.--..-.-','.--..-..','.--...--','.--...-.','.--....-','.--.....','.-.-----','.-.----.','.-.---.-','.-.---..','.-.--.--','.-.--.-.','.-.--..-','.-.--...','.-.-.---','.-.-.--.','.-.-.-.-','.-.-.-..','.-.-..--','.-.-..-.','.-.-...-','.-.-....','.-..----','.-..---.','.-..--.-','.-..--..','.-..-.--','.-..-.-.','.-..-..-','.-..-...','.-...---','.-...--.','.-...-.-','.-...-..','.-....--','.-....-.','.-.....-','.-......','..------','..-----.','..----.-','..----..','..---.--','..---.-.','..---..-','..---...','..--.---','..--.--.','..--.-.-','..--.-..','..--..--','..--..-.','..--...-','..--....','..-.----','..-.---.','..-.--.-','..-.--..','..-.-.--','..-.-.-.','..-.-..-','..-.-...','..-..---','..-..--.','..-..-.-','..-..-..','..-...--','..-...-.','..-....-','..-.....','...-----','...----.','...---.-','...---..','...--.--','...--.-.','...--..-','...--...','...-.---','...-.--.','...-.-.-','...-.-..','...-..--','...-..-.','...-...-','...-....','....----','....---.','....--.-','....--..','....-.--','....-.-.','....-..-','....-...','.....---','.....--.','.....-.-','.....-..','......--','......-.','.......-','........','----------','---------.','--------.-','--------..','-------.--','-------.-.','-------..-','-------...','------.---','------.--.','------.-.-','------.-..','------..--','------..-.','------...-','------....','-----.----','-----.---.','-----.--.-','-----.--..','-----.-.--','-----.-.-.','-----.-..-','-----.-...','-----..---','-----..--.','-----..-.-','-----..-..','-----...--','-----...-.','-----....-','-----.....','----.-----','----.----.','----.---.-','----.---..','----.--.--','----.--.-.','----.--..-','----.--...','----.-.---','----.-.--.','----.-.-.-','----.-.-..','----.-..--','----.-..-.','----.-...-','----.-....','----..----','----..---.','----..--.-','----..--..','----..-.--','----..-.-.','----..-..-','----..-...','----...---','----...--.','----...-.-','----...-..','----....--','----....-.','----.....-','----......','---.------','---.-----.','---.----.-','---.----..','---.---.--','---.---.-.','---.---..-','---.---...','---.--.---','---.--.--.','---.--.-.-','---.--.-..','---.--..--','---.--..-.','---.--...-','---.--....','---.-.----','---.-.---.','---.-.--.-','---.-.--..','---.-.-.--','---.-.-.-.','---.-.-..-','---.-.-...','---.-..---','---.-..--.','---.-..-.-','---.-..-..','---.-...--','---.-...-.','---.-....-','---.-.....','---..-----','---..----.','---..---.-','---..---..','---..--.--','---..--.-.','---..--..-','---..--...','---..-.---','---..-.--.','---..-.-.-','---..-.-..','---..-..--','---..-..-.','---..-...-','---..-....','---...----','---...---.','---...--.-','---...--..','---...-.--','---...-.-.','---...-..-','---...-...','---....---','---....--.','---....-.-','---....-..','---.....--','---.....-.','---......-','---.......','--.-------','--.------.','--.-----.-','--.-----..','--.----.--','--.----.-.','--.----..-','--.----...','--.---.---','--.---.--.','--.---.-.-','--.---.-..','--.---..--','--.---..-.','--.---...-','--.---....','--.--.----','--.--.---.','--.--.--.-','--.--.--..','--.--.-.--','--.--.-.-.','--.--.-..-','--.--.-...','--.--..---','--.--..--.','--.--..-.-','--.--..-..','--.--...--','--.--...-.','--.--....-','--.--.....','--.-.-----','--.-.----.','--.-.---.-','--.-.---..','--.-.--.--','--.-.--.-.','--.-.--..-','--.-.--...','--.-.-.---','--.-.-.--.','--.-.-.-.-','--.-.-.-..','--.-.-..--','--.-.-..-.','--.-.-...-','--.-.-....','--.-..----','--.-..---.','--.-..--.-','--.-..--..','--.-..-.--','--.-..-.-.','--.-..-..-','--.-..-...','--.-...---','--.-...--.','--.-...-.-','--.-...-..','--.-....--','--.-....-.','--.-.....-','--.-......','--..------','--..-----.','--..----.-','--..----..','--..---.--','--..---.-.','--..---..-','--..---...','--..--.---','--..--.--.','--..--.-.-','--..--.-..','--..--..--','--..--..-.','--..--...-','--..--....','--..-.----','--..-.---.','--..-.--.-','--..-.--..','--..-.-.--','--..-.-.-.','--..-.-..-','--..-.-...','--..-..---','--..-..--.','--..-..-.-','--..-..-..','--..-...--','--..-...-.','--..-....-','--..-.....','--...-----','--...----.','--...---.-','--...---..','--...--.--','--...--.-.','--...--..-','--...--...','--...-.---','--...-.--.','--...-.-.-','--...-.-..','--...-..--','--...-..-.','--...-...-','--...-....','--....----','--....---.','--....--.-','--....--..','--....-.--','--....-.-.','--....-..-','--....-...','--.....---','--.....--.','--.....-.-','--.....-..','--......--','--......-.','--.......-','--........','-.--------','-.-------.','-.------.-','-.------..','-.-----.--','-.-----.-.','-.-----..-','-.-----...','-.----.---','-.----.--.','-.----.-.-','-.----.-..','-.----..--','-.----..-.','-.----...-','-.----....','-.---.----','-.---.---.','-.---.--.-','-.---.--..','-.---.-.--','-.---.-.-.','-.---.-..-','-.---.-...','-.---..---','-.---..--.','-.---..-.-','-.---..-..','-.---...--','-.---...-.','-.---....-','-.---.....','-.--.-----','-.--.----.','-.--.---.-','-.--.---..','-.--.--.--','-.--.--.-.','-.--.--..-','-.--.--...','-.--.-.---','-.--.-.--.','-.--.-.-.-','-.--.-.-..','-.--.-..--','-.--.-..-.','-.--.-...-','-.--.-....','-.--..----','-.--..---.','-.--..--.-','-.--..--..','-.--..-.--','-.--..-.-.','-.--..-..-','-.--..-...','-.--...---','-.--...--.','-.--...-.-','-.--...-..','-.--....--','-.--....-.','-.--.....-','-.--......','-.-.------','-.-.-----.','-.-.----.-','-.-.----..','-.-.---.--','-.-.---.-.','-.-.---..-','-.-.---...','-.-.--.---','-.-.--.--.','-.-.--.-.-','-.-.--.-..','-.-.--..--','-.-.--..-.','-.-.--...-','-.-.--....','-.-.-.----','-.-.-.---.','-.-.-.--.-','-.-.-.--..','-.-.-.-.--','-.-.-.-.-.','-.-.-.-..-','-.-.-.-...','-.-.-..---','-.-.-..--.','-.-.-..-.-','-.-.-..-..','-.-.-...--','-.-.-...-.','-.-.-....-','-.-.-.....','-.-..-----','-.-..----.','-.-..---.-','-.-..---..','-.-..--.--','-.-..--.-.','-.-..--..-','-.-..--...','-.-..-.---','-.-..-.--.','-.-..-.-.-','-.-..-.-..','-.-..-..--','-.-..-..-.','-.-..-...-','-.-..-....','-.-...----','-.-...---.','-.-...--.-','-.-...--..','-.-...-.--','-.-...-.-.','-.-...-..-','-.-...-...','-.-....---','-.-....--.','-.-....-.-','-.-....-..','-.-.....--','-.-.....-.','-.-......-','-.-.......','-..-------','-..------.','-..-----.-','-..-----..','-..----.--','-..----.-.','-..----..-','-..----...','-..---.---','-..---.--.','-..---.-.-','-..---.-..','-..---..--','-..---..-.','-..---...-','-..---....','-..--.----','-..--.---.','-..--.--.-','-..--.--..','-..--.-.--','-..--.-.-.','-..--.-..-','-..--.-...','-..--..---','-..--..--.','-..--..-.-','-..--..-..','-..--...--','-..--...-.','-..--....-','-..--.....','-..-.-----','-..-.----.','-..-.---.-','-..-.---..','-..-.--.--','-..-.--.-.','-..-.--..-','-..-.--...','-..-.-.---','-..-.-.--.','-..-.-.-.-','-..-.-.-..','-..-.-..--','-..-.-..-.','-..-.-...-','-..-.-....','-..-..----','-..-..---.','-..-..--.-','-..-..--..','-..-..-.--','-..-..-.-.','-..-..-..-','-..-..-...','-..-...---','-..-...--.','-..-...-.-','-..-...-..','-..-....--','-..-....-.','-..-.....-','-..-......','-...------','-...-----.','-...----.-','-...----..','-...---.--','-...---.-.','-...---..-','-...---...','-...--.---','-...--.--.','-...--.-.-','-...--.-..','-...--..--','-...--..-.','-...--...-','-...--....','-...-.----','-...-.---.','-...-.--.-','-...-.--..','-...-.-.--','-...-.-.-.','-...-.-..-','-...-.-...','-...-..---','-...-..--.','-...-..-.-','-...-..-..','-...-...--','-...-...-.','-...-....-','-...-.....','-....-----','-....----.','-....---.-','-....---..','-....--.--','-....--.-.','-....--..-','-....--...','-....-.---','-....-.--.','-....-.-.-','-....-.-..','-....-..--','-....-..-.','-....-...-','-....-....','-.....----','-.....---.','-.....--.-','-.....--..','-.....-.--','-.....-.-.','-.....-..-','-.....-...','-......---','-......--.','-......-.-','-......-..','-.......--','-.......-.','-........-','-.........','.---------','.--------.','.-------.-','.-------..','.------.--','.------.-.','.------..-','.------...','.-----.---','.-----.--.','.-----.-.-','.-----.-..','.-----..--','.-----..-.','.-----...-','.-----....','.----.----','.----.---.','.----.--.-','.----.--..','.----.-.--','.----.-.-.','.----.-..-','.----.-...','.----..---','.----..--.','.----..-.-','.----..-..','.----...--','.----...-.','.----....-','.----.....','.---.-----','.---.----.','.---.---.-','.---.---..','.---.--.--','.---.--.-.','.---.--..-','.---.--...','.---.-.---','.---.-.--.','.---.-.-.-','.---.-.-..','.---.-..--','.---.-..-.','.---.-...-','.---.-....','.---..----','.---..---.','.---..--.-','.---..--..','.---..-.--','.---..-.-.','.---..-..-','.---..-...','.---...---','.---...--.','.---...-.-','.---...-..','.---....--','.---....-.','.---.....-','.---......','.--.------','.--.-----.','.--.----.-','.--.----..','.--.---.--','.--.---.-.','.--.---..-','.--.---...','.--.--.---','.--.--.--.','.--.--.-.-','.--.--.-..','.--.--..--','.--.--..-.','.--.--...-','.--.--....','.--.-.----','.--.-.---.','.--.-.--.-','.--.-.--..','.--.-.-.--','.--.-.-.-.','.--.-.-..-','.--.-.-...','.--.-..---','.--.-..--.','.--.-..-.-','.--.-..-..','.--.-...--','.--.-...-.','.--.-....-','.--.-.....','.--..-----','.--..----.','.--..---.-','.--..---..','.--..--.--','.--..--.-.','.--..--..-','.--..--...','.--..-.---','.--..-.--.','.--..-.-.-','.--..-.-..','.--..-..--','.--..-..-.','.--..-...-','.--..-....','.--...----','.--...---.','.--...--.-','.--...--..','.--...-.--','.--...-.-.','.--...-..-','.--...-...','.--....---','.--....--.','.--....-.-','.--....-..','.--.....--','.--.....-.','.--......-','.--.......','.-.-------','.-.------.','.-.-----.-','.-.-----..','.-.----.--','.-.----.-.','.-.----..-','.-.----...','.-.---.---','.-.---.--.','.-.---.-.-','.-.---.-..','.-.---..--','.-.---..-.','.-.---...-','.-.---....','.-.--.----','.-.--.---.','.-.--.--.-','.-.--.--..','.-.--.-.--','.-.--.-.-.','.-.--.-..-','.-.--.-...','.-.--..---','.-.--..--.','.-.--..-.-','.-.--..-..','.-.--...--','.-.--...-.','.-.--....-','.-.--.....','.-.-.-----','.-.-.----.','.-.-.---.-','.-.-.---..','.-.-.--.--','.-.-.--.-.','.-.-.--..-','.-.-.--...','.-.-.-.---','.-.-.-.--.','.-.-.-.-.-','.-.-.-.-..','.-.-.-..--','.-.-.-..-.','.-.-.-...-','.-.-.-....','.-.-..----','.-.-..---.','.-.-..--.-','.-.-..--..','.-.-..-.--','.-.-..-.-.','.-.-..-..-','.-.-..-...','.-.-...---','.-.-...--.','.-.-...-.-','.-.-...-..','.-.-....--','.-.-....-.','.-.-.....-','.-.-......','.-..------','.-..-----.','.-..----.-','.-..----..','.-..---.--','.-..---.-.','.-..---..-','.-..---...','.-..--.---','.-..--.--.','.-..--.-.-','.-..--.-..','.-..--..--','.-..--..-.','.-..--...-','.-..--....','.-..-.----','.-..-.---.','.-..-.--.-','.-..-.--..','.-..-.-.--','.-..-.-.-.','.-..-.-..-','.-..-.-...','.-..-..---','.-..-..--.','.-..-..-.-','.-..-..-..','.-..-...--','.-..-...-.','.-..-....-','.-..-.....','.-...-----','.-...----.','.-...---.-','.-...---..','.-...--.--','.-...--.-.','.-...--..-','.-...--...','.-...-.---','.-...-.--.','.-...-.-.-','.-...-.-..','.-...-..--','.-...-..-.','.-...-...-','.-...-....','.-....----','.-....---.','.-....--.-','.-....--..','.-....-.--','.-....-.-.','.-....-..-','.-....-...','.-.....---','.-.....--.','.-.....-.-','.-.....-..','.-......--','.-......-.','.-.......-','.-........','..--------','..-------.','..------.-','..------..','..-----.--','..-----.-.','..-----..-','..-----...','..----.---','..----.--.','..----.-.-','..----.-..','..----..--','..----..-.','..----...-','..----....','..---.----','..---.---.','..---.--.-','..---.--..','..---.-.--','..---.-.-.','..---.-..-','..---.-...','..---..---','..---..--.','..---..-.-','..---..-..','..---...--','..---...-.','..---....-','..---.....','..--.-----','..--.----.','..--.---.-','..--.---..','..--.--.--','..--.--.-.','..--.--..-','..--.--...','..--.-.---','..--.-.--.','..--.-.-.-','..--.-.-..','..--.-..--','..--.-..-.','..--.-...-','..--.-....','..--..----','..--..---.','..--..--.-','..--..--..','..--..-.--','..--..-.-.','..--..-..-','..--..-...','..--...---','..--...--.','..--...-.-','..--...-..','..--....--','..--....-.','..--.....-','..--......','..-.------','..-.-----.','..-.----.-','..-.----..','..-.---.--','..-.---.-.','..-.---..-','..-.---...','..-.--.---','..-.--.--.','..-.--.-.-','..-.--.-..','..-.--..--','..-.--..-.','..-.--...-','..-.--....','..-.-.----','..-.-.---.','..-.-.--.-','..-.-.--..','..-.-.-.--','..-.-.-.-.','..-.-.-..-','..-.-.-...','..-.-..---','..-.-..--.','..-.-..-.-','..-.-..-..','..-.-...--','..-.-...-.','..-.-....-','..-.-.....','..-..-----','..-..----.','..-..---.-','..-..---..','..-..--.--','..-..--.-.','..-..--..-','..-..--...','..-..-.---','..-..-.--.','..-..-.-.-','..-..-.-..','..-..-..--','..-..-..-.','..-..-...-','..-..-....','..-...----','..-...---.','..-...--.-','..-...--..','..-...-.--','..-...-.-.','..-...-..-','..-...-...','..-....---','..-....--.','..-....-.-','..-....-..','..-.....--','..-.....-.','..-......-','..-.......','...-------','...------.','...-----.-','...-----..','...----.--','...----.-.','...----..-','...----...','...---.---','...---.--.','...---.-.-','...---.-..','...---..--','...---..-.','...---...-','...---....','...--.----','...--.---.','...--.--.-','...--.--..','...--.-.--','...--.-.-.','...--.-..-','...--.-...','...--..---','...--..--.','...--..-.-','...--..-..','...--...--','...--...-.','...--....-','...--.....','...-.-----','...-.----.','...-.---.-','...-.---..','...-.--.--','...-.--.-.','...-.--..-','...-.--...','...-.-.---','...-.-.--.','...-.-.-.-','...-.-.-..','...-.-..--','...-.-..-.','...-.-...-','...-.-....','...-..----','...-..---.','...-..--.-','...-..--..','...-..-.--','...-..-.-.','...-..-..-','...-..-...','...-...---','...-...--.','...-...-.-','...-...-..','...-....--','...-....-.','...-.....-','...-......','....------','....-----.','....----.-','....----..','....---.--','....---.-.','....---..-','....---...','....--.---','....--.--.','....--.-.-','....--.-..','....--..--','....--..-.','....--...-','....--....','....-.----','....-.---.','....-.--.-','....-.--..','....-.-.--','....-.-.-.','....-.-..-','....-.-...','....-..---','....-..--.','....-..-.-','....-..-..','....-...--','....-...-.','....-....-','....-.....','.....-----','.....----.','.....---.-','.....---..','.....--.--','.....--.-.','.....--..-','.....--...','.....-.---','.....-.--.','.....-.-.-','.....-.-..','.....-..--','.....-..-.','.....-...-','.....-....','......----','......---.','......--.-','......--..','......-.--','......-.-.','......-..-','......-...','.......---','.......--.','.......-.-','.......-..','........--','........-.','.........-','..........']
            },
            knownWords : {
                
            },
            uppercase : false,
            allowpoints : false
        },
        Magraki : {
            words : {
                1 : ['a', 'u', 'k', 'c', 'e'],
                2 : ['ek', 'uk', 'tu', 'ob', 'zug', 'va'],
                3 : ['ruk', 'gra', 'mog', 'zuk', 'xar'],
                4 : ['zaga', 'garo', 'xhok', 'teba', 'nogu', 'uruk'],
                Bigger : ['arukzuk', 'nogugaro', 'tovosh', 'thromka', 'makogg']
            },
            knownWords : {
                'khazzog' : ['MATAR', 'MATE', 'MASSACRE', 'DEATH'],
                'mogtuban' : ['AMIGO', 'COMPADRE', 'CAMARADA'],
                'loktorok' : ['OI', 'OLÁ', 'OLA', 'HELLO'],
                'maguna' : ['ATACAR', 'ATAQUE', 'DESTRUIR', 'DESTRUA', 'ATTACK'],
                'grom' : ['HEROI', 'HERÓI', 'SALVADOR','HERO'],
                'kek' : ['HEHE', "HE", "HEH", "HA", "HAHA", "HAH", 'LOL', 'LMAO', 'ROFL', 'ROFLMAO'],
                'kekek' : ["HEHEHE", "HAHAHA", "HAHAH", 'HEHEH', "HAHAHAH", "HEHEHEH"],
                'bubu' : ['ORC', 'ORK'],
                'bubus' : ['ORCS', 'ORKS'],
                'bubugo' : ['ORCISH', 'ORKISH', 'ORQISH', 'ORQUES', "ORQUÊS", "ORKES", "ORKÊS"]
            },
            uppercase : true,
            allowpoints : true
        },
        Abyssal : {
            words : {
                1 : ['x', 'y', 'e', 'a', 'g', 'o'],
                2 : ['za', 'xy', 'go', 'ua', 'ka', 're', 'te', 'la', 'az'],
                3 : ['rruk', 'kar', 'mra', 'gak', 'zar', 'tra', 'maz'],
                4 : ['okra', 'zzar', 'kada', 'zaxy', 'drab', 'rikk'],
                5 : ['belam', 'rraka', 'ashaj', 'zannk', 'xalah'],
                Bigger : ['ratalaz', 'melalorah', 'trizzkarah', 'arkalada', 'karken'],
                Numbers : ['ia', 'ori', 'eri', 'dara', 'iru', 'taro', 'cace', 'zori', 'xash', 'rura']
            },
            knownWords : {
                "soran" : ['ANJO', 'YUQUN', 'ANGEL'],
                "gakzakada" : ['SACRIFICIO', 'SACRIFÍCIO', 'SACRIFICE'],
                "burah" : ['CALOR','QUENTE','FOGO','CHAMA','FLAMEJANTE','CHAMAS','FOGOS'],
                "aman" : ['HUMANO', 'HUMANA', 'HUMAN'],
                "zennshinagas" : ['INFERNO', 'INFERNAL', 'HELL']
            },
            uppercase : true,
            allowpoints : true
        },
        Draconic : {
            words : {
                1 : ['vi', 'si', 'fe', 'sh', 'ix', 'ur'],
                2 : ['wux ', 'vah', 'veh', 'vee', 'ios', 'irsa'],
                3 : ['rerk', 'xsio ', 'axun', 'yrev', 'ithil', 'creic'],
                4 : ["e'cer", 'direx', 'dout', 'yrev'],
                5 : ['ibleuailt ', 'virax', 'mrrandiina ', 'whedab ', 'bekisnhlekil '],
                Bigger : ['ilthyeora', 'kallyadranoch', 'yarchonis', 'yarchonis', 'jorethnobiounir '],
                Numbers : ['zero', 'ir', 'jiil', 'fogah', 'vrrar', 'jlatak', 'jiko', 'vakil', 'supri', 'wlekjr']
            },
            knownWords : {
                "darastrix " : ['DRAGÃO', 'DRAGON', 'DRAGAO', 'DRAGOES', 'DRAGÕES'],
                "thurirl" : ['COMPANHEIRO','AMIGO','PARCEIRO','FRIEND','PARTNER','ALIADO'],
                "ternocki" : ['ESCAMAS', 'SCALES', 'ESCAMA', 'SCALE'],
                "molik" : ['PELE', 'SKIN'],
                "seltur" : ['MOLE','MACIA','SOFT'],
                "l'gra" : ['MEDO','PAVOR','TEMOR','HORROR','FEAR'],
                "munthrek" : ['HUMANO','HUMANOS','HUMAN','HUMANS'],
                "arthonath" : ['HUMANIDADE','HUMANITY']
            },
            uppercase : true,
            allowpoints : true
        },
        Aquon : {
            words : {
                1 : ['le', 'li', 'la', 'a', 'e', 'i'],
                2 : ['laren', 'sare', 'elane', 'alena', 'leair'],
                3 : ['lessa', 'saril ', 'quissa', 'sarte', 'tassi', 'selasse'],
                4 : ['atoloran', 'tiran', 'quilara', 'assiassi'],
                Bigger : ['sildorine', "salen'aran", "arase'asionan", 'asurannale', 'illiarine'],
                Numbers : ['on', 'liss', 'diss', 'tiss', 'quass', 'ciss', 'siss', 'sess', 'oiss', 'niss']
            },
            knownWords : {
                "tassela" : ['TERRA', 'PISO', 'CHÃO', 'SUPERFICIE'],
                "tasselarane" : ['TERRESTRE', 'INIMIGO', 'ADVERSARIO', 'OPONENTE', 'INIMIGOS', 'ADVERSARIOS', 'OPONENTES'],
                "quill" : ['RIO', 'MAR', 'OCEANO'],
                "quillarine" : ['AQUATICO', 'AMIGO', 'COMPANHEIRO', 'ALIADO', 'AMIGOS', 'COMPANHEIROS', 'ALIADOS'],
                "quell" : ['AGUA', 'SAGRADO'],
                "sir" : ['AMANTE', 'ADORADOR'],
                "salara" : ['GLÓRIA', 'HONRA', 'AUTORIDADE', 'VIRTUDE'],
                "quellsalara" : ['REI', 'SOBERANO', 'MONARCA'],
                "selarane" : ["EL'ZEL"],
                "setarane" : ['ELFO'],
                "talarane" : ['HUMANO']
            },
            uppercase : true,
            allowpoints : true
        },
        Arcana : {
            words : {
                1 : ['a', 'o', 'z', 'c'],
                3 : ['xie', 'uru', 'ara', 'naa', 'ean', 'zha', 'zhi', 'xin', 'xan', 'chu', 'ran', 'nan', 'zan', 'ron'],
                4 : ['wanv', 'haov', 'chan', 'chun', 'chen', 'zhen', 'zhan', 'shie', 'yong', 'xing', 'kafe'],
                6 : ['zazado', 'kafel', 'xinzhao', 'mengtah', 'mengzha', 'lenshi', 'qibong', 'qubhan', 'quzhan', 'qizhao'],
                Bigger : ['jianzai', 'limcai', 'xenbhin', 'zhanmana', 'shizhan', 'qishin', 'mingzhan', 'xingqi', 'qienzhan', 'endaqin', 'shengri', 'chunra'],
                numbers : ['lin', 'i', 'e', 'sa', 'si', 'wu', 'liu', 'qi', 'ba', 'ju']
            },
            knownWords : {
                "yu mo" : ['COISA', 'BAD', 'COISAS', 'TRECO', 'TRECOS'],
                'gui gwai' : ['RUIM', 'THING', 'RUINS'],
                'fai' : ['VAI', 'GO', 'CAI', 'VA', 'VÁ'],
                'di zao' : ['EMBORA', 'AWAY', 'FORA'],
                'lai' : ['WATER', 'ÁGUA', 'AGUA', 'OCCUR'],
                'shui zai' : ['ACONTEÇA', 'COME', 'HAPPEN', 'FLOOD']
            },
            uppercase : true,
            allowpoints : true
        },
        Natrum : {
            words : {
                1 : ['en', 'er', 'i', 'ir', 'j', 'na', 'ma', 'ur', 'yl'],
                2 : ['aiga', 'draum', 'gaf', 'gorak', 'hennar', 'ormar', 'saman', 'warin'],
                3 : ['barmjor', 'eltzi', 'gunronir', 'thalandor', 'yirindir'],
                4 : ['iemnarar', 'normnundor', 'melgandark', 'sunnarsta', 'villnorer', 'znorud'],
                Bigger : ['gunnfjaunar', 'harlihheten', 'thassandanorm', 'tilkommender', 'volnushrindir'],
                Numbers : ['ein', 'tvein', 'trir', 'fjor', 'fimm', 'seks', 'syv', 'otte', 'niu', 'tiu']
            },
            knownWords : {
                'jotun' : ['ALTO', 'COLOSSAL', 'TITÃ', 'ROCHEDO'],
                'gutland' : ['TERRA', 'TERRITÓRIO', 'LUGAR', 'PAÍS', 'REGIÃO'],
                'jormungandr' : ['TERRA NATAL', 'MONTANHA', 'ORIGEM', 'FAMÍLIA', 'PÁTRIA', 'GELEIRA', 'POLAR'],
                'yggdrasil' : ['ÁRVORE', 'MUNDO', 'NATUREZA', 'ESSÊNCIA', 'ESPERANÇA'],
                'ragnarokkr' : ['FIM', 'DESTRUIÇÃO', 'ANIQUILAÇÃO', 'EXTERMÍNIO', 'RUÍNA', 'DECADÊNCIA'],
                'vollusp' : ['INICIO', 'PASSADO', 'ANTIGO', 'ANCIÃO'],
                'bifrost' : ['CÉU', 'CELESTE', 'SOL', 'NUVEM', 'AURORA', 'FIRMAMENTO', 'ESTELAR', 'ASTRAL'],
                'garm' : ['IRA', 'RAIVA', 'FOME', 'PERIGOSO', 'IRRACIONAL', 'AMEAÇA', 'INVEJA'],
                'hel' : ['MORTE', 'CEMITÉRIO', 'TÚMULO', 'TORMENTO', 'ESCURIDÃO', 'TREVAS', 'NEVOA'],
                'gagap' : ['VAZIO', 'ABISMO', 'FISSURA', 'FANTASMAGÓRICO', 'NADA', 'ESPAÇO', 'CAOS'],
                'surt' : ['CALOR','PODER', 'FORÇA', 'FÚRIA', 'FOGO', 'JUIZ', 'ACUSADOR'],
                'ymir' : ['FRIO', 'GELADO', 'PAREDE', 'MURALHA', 'GUARDIÃO', 'TEMPESTADE'],
                'hrimthur' : ['TRAIDOR', 'PÁLIDO', 'INIMIGO', 'COVARDE', 'FRACO'],
                'jormum' : ['PAI', 'PATERNO', 'PATERNAL'],
                'angrboda' : ['MÃE', 'MATERNAL', 'AMOR', 'AFETO', 'PAIXÃO'],
                'alvo' : ['COMPANHEIRO', 'IRMÃO', 'AMIGO'],
                'elain' : ['ANIMAL', 'FERA', 'SELVAGEM', 'BICHO', 'CRIATURA'],
                'alfir' : ['RESPEITOSO', 'DILIGENTE', 'ALIADO', 'PROTETOR'],
                'aesir' : ['LÍDER', 'GENERAL', 'GUERREIRO', 'HERÓI', 'CORAJOSO', 'DIVINO', 'IMORTAL'],
                'alfheim' : ['FLORESTA', 'SELVA', 'BOSQUE', 'FAUNA', 'FLORA', 'ARVOREDO'],
                'nidavel' : ['DESERTO', 'PLANÍCIE', 'ERMO', 'CAMPO'],
                'nidavemnir' : ['TRIBO', 'NOMADE', 'COLONIA', 'ACAMPAMENTO', 'ESTADIA'],
                'valtamer' : ['OCEANO', 'ÁGUA', 'LAGO', 'RIO', 'CORREGO', 'CHUVA'],
                'niohoggr' : ['MAU', 'MALIGNO', 'PESTE', 'DOENÇA', 'TIRANO'],
                'valhana' : ['SONHO', 'VISÃO', 'ESPIRITO', 'MÍSTICO', 'SOBRENATURAL', 'SÁBIO']
            },
            uppercase : true,
            allowpoints : true
        },
        Animal : {
            words : {
                1 : ['u', 'r', 'a', 'n', 'w'],
                Bigger : ['grr!', 'rarr!', 'rawr', 'mmf', 'pamf', 'pant', 'rrrr', 'rrrrrrr', 'eeep', 'uk', 'karr!', 'uff', 'off', 'aff', 'snif', 'puff', 'roar!', 'raar', 'mmmm', 'ghhh', 'kak', 'kok', 'grr', 'year', 'yor', 'caaaar', 'urr', 'uru!', 'muu', 'up', 'uup', 'oap', 'rrrraawr', 'mip', 'iap', 'ap']
            },
            uppercase: true,
            allowpoints : false
        },
        Technum : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['n', 'e', 'i', 'k', 'a'],
                2 : ['ok', 'un', 'ac', 'hal', 'sub', 'fyi', 'hym', 'cmp'],
                3 : ['vaal', 'hyss', 'lrok', 'gfun', 'jyin'],
                4 : ['netak', 'urmin', 'kvyan', 'trekt', 'pvnum'],
                Bigger: ['tkmkrok', 'ncallat', 'khstrat', 'meknym', 'snwyhok']
            },
            knownWords : {
                'lwyhak' : ['ESPADA', 'LÂMINA', 'AÇO', 'METAL'],
                'vclloc' : ['VENTO', 'BRISA', 'VENTANIA', 'SOPRO'],
                'vwynm' : ['AMIGO', 'AMIZADE', 'COMPANHEIRO'],
                'klumiun' : ['ÁGUA', 'GELO', 'LÍQUIDO'],
                'kramik' : ['CÉU', 'PARAÍSO', 'NUVEM', 'ANJO', 'DIVINO'],
                'mnyacc' : ['MORTE', 'TREVAS', 'DEMÔNIO', 'ESCURIDÃO']
            }
        },
        Arkadium : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['h', 'a', 'n', 'i', 'e'],
                2 : ['no', 'ko', 'ta', 'ain', 'nah', 'roi', 'shu', 'kon'],
                3 : ['ishi', 'temi', 'poto', 'taan', 'kain'],
                4 : ['treja', 'nizui', 'boron', 'hazoi', 'lamaf'],
                Bigger: ['tatoru', 'paketo', 'rikuku', 'sanami']
            },
            knownWords : {
                'saldine' : ['ILHA', 'ISTMO', 'DERIVA'],
                'kairu' : ['EDUCAÇÃO', 'ENSINO', 'ESCOLA', 'CONHECIMENTO'],
                'sazuina' : ['MAR', 'OCEANO', 'PRAIA'],
                'tenozesa' : ['ESTRANGEIRO', 'ESTRANHO', 'DESCONHECIDO'],
                'purechi' : ['AMIGO', 'COMPANHEIRO', 'IRMÃO', 'COLEGA'],
                'pukapuka' : ['CALMO', 'LENTO', 'TRANQUILO', 'AMIGÁVEL']
            }
        },
        Auran : {
            uppercase: true,
            allowpoints: true,
            words: {
                1 : ['o', 'k', 's', 'i', 'a', 'm'],
                2 : ['me', 'ra', 'lo', 'fu', 'je'],
                3 : ['kin', 'zoh', 'jao', 'nen', 'has'],
                4 : ['mewa', 'waon', 'kerl', 'nomu', 'qolt'],
                Bigger : ['hwajeh', 'moliken', 'zaohik', 'jehanos', 'gihazan']
            },
            knownWords : {
                'makonah' : ['PAZ', 'CALMARIA', 'CALMO', 'TRANQUILO'],
                'falnafu' : ['FOGO', 'CALOR', 'QUENTE', 'SOL'],
                'komuona' : ['MENINA', 'MULHER', 'FEMININO'],
                'zasujoh' : ['MÁQUINA', 'MAGIA', 'ELETRICIDADE'],
                'omuzah' : ['COMEÇO', 'INÍCIO', 'CRIAÇÃO'],
                'miwonih' : ['FIM', 'FINAL', 'DESTRUIÇÃO']
            }
        },
        Celestan : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['z', 'i', 'h', 'k', 'u'],
                2 : ['ul', 'ha', 'ko', 'ia', 'ez', 'oh'],
                3 : ['moh', 'lea', 'sha', 'lok', 'tae'],
                4 : ['zaha', 'ohta', 'baos', 'naia', 'ezoh'],
                Bigger: ['lakanoh', 'baenas', 'heraloh', 'tarinae', 'mohzase']
            },
            knownWords : {
                'ladon' : ['ANJO', 'CELESTIAL', 'YUQUN'],
                'deis' : ['COBRA', 'SERPENTE', 'SNAKE'],
                'klistera' : ['GELO', 'SÓLIDO', 'CONGELADO', 'GELEIRA'],
                'toraeh': ['ASAS', 'PENAS', 'ALADO', 'WINGED'],
                'goetiah' : ['CAÍDO', 'DEMÔNIO', 'INFERNAL', 'TREVAS']
            }
        },
        Ellum : {
            words : {
                1 : ['a', 'i', 'e'],
                2 : ['ae', 'ea', 'tae', 'cea', 'mia', 'lhat', 'maae', 'teah', 'lea', 'ma', 'da', 'te', 'ti', 'la', 'le', 'ia', 'io'],
                3 : ["a'ta", 'eu', 'maari', 'eaal', 'lentar', 'umit', 'matas', 'nitas', 'vaata', 'miu', 'lhea', 'lhao', 'bae', 'dia'],
                4 : ["e'tud", "mi'laet", 'tussia', 'lamita', 'tavia', 'mera', 'tiaah', 'paatvas', 'mata', 'lhata', 'looa', 'lheia'],
                5 : ["tu'lhanis", "lo'meera", "lha'vatsar", 'lotetslraz', 'awynn', 'tissanas', 'otaamiss', 'lovatsar', 'mataasa', 'lhotad'],
                6 : ["lhatiassu", "teeramas", "su'diet", "mi'dhanas", "lhashama", "tiriana", "tuinassa"],
                7 : ["tae'missa", "lhot'vana", "sahmita", "milrusata", "toriema", "lotisava"],
                Bigger : ['tamiaata', 'etalria', 'miatila', 'latvatbas', 'miraata', 'eslraatas', 'leteerats',
                          'misatulia', 'tilhusoh', "diet'lhanas", "mit'dahni"],
                Numbers : ['o', 'u', 'uti', 'tia', 'sa', 'mi', 'ota', 'su', 'kaata', 'lhus']
            },
            knownWords : {
                'utotoki' : ['CALOR','QUENTE','FOGO','CHAMA','FLAMEJANTE','CHAMAS','FOGOS'],
                'lenwar' : ['LETRA', 'LETRAS', 'LETTER', 'LETTERS'],
                'lhatias' : ['CORAGEM', 'CONFIANÇA', 'CONFIANCA', 'BRAVERY'],
                'taer' : ['VERAO', 'VERÃO', 'SUMMER'],
                'lar' : ['ALTO', 'GRANDE'],
                'metton' : ['AMIGO', 'COMPADRE', 'CAMARADA', "AMIGOS", "CAMARADAS", "COMPADRES", "ALIADO", "ALIADOS"],
                'zatton' : ['INIMIGO', "INIMIGOS", "ADVERSÁRIO", "ADVERSÁRIOS", "ADVERSARIO", "ADVERSARIOS"],
                'tuin' : ['AZUL', 'AZULADO'],
                'hehe' : ['HA', "HAH", "HE", "HEH", "HEHE", "HAHA", "HEHEH", "HAHAH", "HEHEHE", "HAHAHA"],
                "et'um" : ['ELF', 'ELFO', 'ELFA'],
                "et'ar" : ['ELFOS', "ELFAS", "ELVES"],
                "et'zet" : ['FALSO', "FAKE", "FALSOS", "FAKES"],
                'etain' : ['ESPERANÇA', 'HOPE'],
                'turia' : ['ALEGRIA', 'FELICIDADE', 'JOY', 'HAPPINESS'],
                'terasl' : ['RÁPIDO', 'VELOZ', 'VELOCIDADE', 'FAST', 'SPEEDY', 'SPEED'],
                'vehat' : ['LAMA', 'BARRO', 'MUD', 'CLAY'],
                'simuh' : ['PÁSSARO', 'AVE', 'PASSARINHO', 'BIRD'],
                'fahin' : ['CURAR', 'SARAR', 'HEAL'],
                'amuhn' : ['BRUXA', 'FEITICEIRA', 'MAGA', 'WITCH', 'WIZARD', 'MAGE']
            },
            uppercase : true,
            allowpoints : true
        },
        Davek : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['d', 'k', 'e', 'a', 'u'],
                2 : ['bu', 'ka', 'ce', 'ke', 'ko', 'za', 'ik', 'ep', 'pa', 'na', 'ma', 'pe'],
                3 : ['kok', 'kek', 'iek', 'cea', 'sok', 'ask', 'pok', 'pak', 'rak', 'rok', 'ruh', 'ruk', 'ram', 'ran', 'rae', 'era', 'ero', 'erp'],
                4 : ['doko', 'pika', 'paek', 'caeo', 'peao', 'pako', 'poka', 'mako', 'zako', 'zado', 'edo', 'akad', 'miko', 'adek', 'edao'],
                5 : ['emaop', 'edaki', 'pedak', 'pokad', 'emako', 'pokad', 'rakza', 'edoru', 'akara', 'iekpa', 'dokok', 'ceape', 'mikora', 'erada', 'erpad'],
                6 : ['jukoa', 'kodoko', 'pikace', 'peaika', 'pakpoka', 'rokzado', 'maedoru', 'akarape', 'epask', 'dokoran'],
                Bigger: ['kekokamido', 'maridokiza', 'paridoka', 'taritara', 'monikaze', 'porikaka', 'ukarema', 'poricares', 'mirakuru', 'puaridozua']
            },
            knownWords : {
                'topkek' : ['ENGRAÇADO', "ENGRACADO", "GRAÇA", "GRACA", "PIADA", "PIADAS", "ENGRAÇADOS", "ENGRACADOS"],
                'kekdoru' : ['COMEDIANTE', 'COMEDIANTES', 'PALHAÇO', "PALHACO", "PALHAÇOS", "PALHAÇOS"],
                'maraka' : ['AMIGO', "AMIGOS", "COMPADRE", "COMPADRES", "PARCEIRO", "PARCEIROS"],
                'karama' : ['INIMIGO', 'INIMIGOS', "OPONENTE", "OPONENTES"],
                'kara' : ['PESSOA', 'CARA', "KRA"],
                'ma' : ['RUIM', "MALIGNO", "MALIGNA", "MALDADE", "MA", "MÁ", "MAU"],
                'ukokimadokuzapa' : ['PARALELEPIPEDO', "PARALELEPÍPEDO"]
            }
        }
    },
    
    isValid : function (slashCMD, message) {
        var lingua = message.substring(0, message.indexOf(','));
        return this.linguas.indexOf(lingua) !== -1 && this.doISpeak(lingua);
    },
    
    
    /**
     * Scours a Game Controller Sheet for who can speak a certain language
     * @param {String} language
     * @returns {Array}
     */
    whoSpeaks : function (language) {
        return window.app.ui.chat.langtab.whoSpeaks(language);
    },
    
    doISpeak : function (language) {
        return !window.app.ui.chat.mc.getModule("stream").isStream && this.whoSpeaks(language).indexOf(window.app.loginapp.user.id) !== -1;
    },

    /**
     * Translates a word into a set language.
     * @param {String} word
     * @param {String} language
     * @returns {String}
     */
    translate : function (word, language) {
        if (this.lingua[language] === undefined || word.length === 0) {
            return word;
        }
        
        var exclamation = word.indexOf('!') !== -1;
        var interrobang = word.indexOf('?') !== -1;
        var finish = word.indexOf('.') !== -1;
        var trespontos = word.indexOf('...') !== -1;
        var doispontos = word.indexOf(':') !== -1;
        var virgula = word.indexOf(',') !== -1;
        word = word.replace(/\!/g, '');
        word = word.replace(/\?/g, '');
        word = word.replace(/\./g, '');
        word = word.replace(/\:/g, '');
        word = word.replace(/\,/g, '');
        var words = this.lingua[language].words;
        var knownWords = this.lingua[language].knownWords;
        var uppercase = this.lingua[language].uppercase;
        var allowpoints = this.lingua[language].allowpoints;
        
        for (var index in knownWords) {
            if (typeof knownWords[index] === 'string') {
                words[knownWords[index]] = [index];
            } else {
                for (var k = 0; k < knownWords[index].length; k++) {
                    words[knownWords[index][k]] = [index];
                }
            }
        }
        
        if (typeof words['Numbers'] !== 'undefined' && !isNaN(word, 10)) {
            var result = '';
            for (var i = 0; i < word.length; i++) {
                result += words['Numbers'][parseInt(word.charAt(i))];
            }
            if (allowpoints) {
                result +=
                    (virgula ? ',' : '') +
                    (doispontos ? ':' : '') +
                    (exclamation ? '!' : '') +
                    (interrobang ? '?' : '') +
                    (finish ? '.' : '') +
                    (trespontos ? '..' : '');
            }
            return result;
        }
        
        var resultFrom = "Bigger";
        if (typeof words[word.toUpperCase()] !== 'undefined') {
            resultFrom = word.toUpperCase();
        } else if (typeof words[word.length] !== 'undefined') {
            resultFrom = word.length;
        }
        
        var myrng = new Math.seedrandom(word.toUpperCase());
        var result = Math.floor(myrng() * words[resultFrom].length);
        var selected = words[resultFrom][result];
        
        if (!uppercase) {
            var newWord = selected;
        } else {
            var newWord = '';
            var char;
            for (var i = 0; i < selected.length; i++) {
                if (i > (word.length - 1)) {
                    char = word.charAt(word.length - 1);
                } else {
                    char = word.charAt(i);
                }
                if (char === char.toUpperCase()) {
                    newWord += selected.charAt(i).toUpperCase();
                } else {
                    newWord += selected.charAt(i);
                }
            }
        }
        
        if (allowpoints) {
            newWord = newWord +
                    (virgula ? ',' : '') +
                    (doispontos ? ':' : '') +
                    (exclamation ? '!' : '') +
                    (interrobang ? '?' : '') +
                    (finish ? '.' : '') +
                    (trespontos ? '..' : '');
        }
        
        return newWord;
    },
    
    translatePhrase : function (phrase, language) {
        phrase = phrase.split(' ');
        for (var i = 0; i < phrase.length; i++) {
            if (phrase[i].length > 0) {
                phrase[i] = this.translate(phrase[i], language);
            }
        }
        phrase = phrase.join(' ');
        return phrase;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        return null;
    },
    
    getMsg : function (slashCMD, message) {
        var room = window.app.chatapp.room;
        var msg = new Message();
        msg.roomid = room.id;
        msg.origin = window.app.loginapp.user.id;
        
        if (slashCMD.toUpperCase().indexOf("STO") === -1 || !room.getMe().isStoryteller) {
            msg.module = 'roleplay';
            if (room.persona === null) {
                msg.setSpecial('persona', '?????');
            } else {
                msg.setSpecial('persona', room.persona);
            }
        } else {
            msg.module = 'story';
        }
        var lingua = message.substring(0, message.indexOf(','));
        msg.setSpecial('lingua', lingua);
        
        var cleanMsg = message.substring(message.indexOf(',') + 1, message.length).trim();
        
        var pseudo = '';
        var sentence = '';
        var skipfor = null;
        var char;
        for (var i = 0; i < cleanMsg.length; i++) {
            char = cleanMsg.charAt(i);
            if (skipfor === null) {
                if (['*', '[', '(', '{'].indexOf(char) === -1) {
                    sentence += char;
                } else {
                    if (char === '*') {
                        skipfor = '*';
                    } else if (char === '[') {
                        skipfor = ']';
                    } else if (char === '(') {
                        skipfor = ')';
                    } else if (char === '{') {
                        skipfor = '}';
                    }
                    if (sentence.length > 0) {
                        pseudo += this.translatePhrase(sentence, lingua);
                    }
                    sentence = char;
                }
            } else {
                sentence += char;
                if (char === skipfor) {
                    pseudo += sentence;
                    sentence = '';
                    skipfor = null;
                }
            }
            
        };
        
        if (sentence.length > 0) {
            pseudo += this.translatePhrase(sentence, lingua);
        }
        
        msg.setMessage(pseudo);
        msg.setSpecial('translation', cleanMsg);
        
        var speakers = this.whoSpeaks(lingua);
        
        msg.setDestination(speakers);
        window.app.chatapp.fixPrintAndSend(msg, true);
        
        msg.unsetSpecial('translation');
        msg.setDestination(null);
        msg.clone = false;
        msg.setSpecial("ignoreFor", speakers);
        window.app.chatapp.sendMessage(msg);

        
        return null;
    },
    
    get$error : function (slash, msg, storyteller) {
        var lingua = msg.substring(0, msg.indexOf(','));
        var $error = $('<p class="chatSistema" class="language" />');
        
        if (this.linguas.indexOf(lingua) === -1) {
            $error.attr('data-langhtml', '_CHATLANGINVALID_');
        } else if (!this.doISpeak(lingua)) {
            $error.attr('data-langhtml', '_CHATLANGUNKNOWN_');
        } else {
            $error.attr('data-langhtml', '_INVALIDSLASHMESSAGE_');
        }
        
        $error.html("?");
        
        return $error;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Logger',
    
    showHelp : false,
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/log'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.ui.chat.logger.updateRoom();
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'nose',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/nose', '/nosoundeffect', '/nse'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (window.app.configdb.get('autoSE', true)) {
            var $html = $('<p class="chatSistema language" data-langhtml="_AUTOSEON_" />');
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_AUTOSEOFF_" />');
        }
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.configdb.store('autoSE', !window.app.configdb.get('autoSE', true));
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'notification',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/nonot'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (window.app.ui.nonotifications) {
            var $html = $('<p class="chatSistema language" data-langhtml="_NONOTON_" />');
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_NONOTOFF_" />');
        }
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.ui.nonotifications = !window.app.ui.nonotifications;
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'nowhisper',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/nowhisper', '/nowhispers', '/nw'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (window.app.configdb.get('showWhispers', true)) {
            var $html = $('<p class="chatSistema language" data-langhtml="_NOWHISPERSOFF_" />');
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_NOWHISPERSON_" />');
        }
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.configdb.store('showWhispers', !window.app.configdb.get('showWhispers', true));
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'offgame',
    
    Slash : ['/off', '/ooc', '/offgame', '/outofgame'],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var user = msg.getUser();
        var $msg = $('<p class="chatOff" />');
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        var $jogador = $('<b />');
        if (!snowflake) {
            $jogador.text(user.nickname + '#' + user.nicknamesufix + ':');
        } else {
            $jogador.text(user.nickname + ':');
        }
        $msg.append($jogador).append(' ' + $('<p />').text(msg.msg).html());
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Persona',
    
    showHelp : false,
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/persona', '/nick', '/nome', '/personagem', '/nickhidden', '/personaescondida', '/personahidden', '/nomehidden', '/nomeescondido'],
    
    isValid : function (slashCMD, msg) {
        if (msg.length > 0) {
            return true;
        }
        return false;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        var hidden = ['/nickhidden', '/personaescondida', '/personahidden', '/nomehidden', '/nomeescondido'];
        window.app.ui.chat.pc.addPersona(message, "", hidden.indexOf(slashCMD) !== -1);
        
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'pica',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/quadro', '/board', '/canvas', '/pica'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @param {String} slashCMD
     * @param {String} msgOnly
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        if (slashCMD !== undefined && slashCMD !== null) {
            return null;
        }
        
        var lock = msg.getSpecial('lock', null);
        if (lock !== null && msg.getUser().isStoryteller()) {
            window.app.ui.pictureui.lock(window.app.chatapp.room.id, lock === true);
        }
        
        if (window.app.ui.pictureui.isLocked()) {
            var user = msg.getUser();
            if (!user.isStoryteller()) {
                return null;
            }
        }
        
        var src = msg.msg;
        
        var clear = msg.getSpecial('clear', false);
        if (clear === true) {
            var user = msg.getUser();
            if (!user.isStoryteller()) {
                return null;
            }
            window.app.ui.pictureui.clearDrawings(src);
        }
        
        var myArt = msg.getSpecial('art', []);
        
        
        if (!myArt instanceof Array) return null;
        
        var art = [];
        
        for (var i = 0; i < myArt.length; i++) {
            if (myArt[i].length < 2) continue;
            if (isNaN(myArt[i][0], 10) || isNaN(myArt[i][1], 10)) continue;
            art.push(myArt[i]);
        }
        
        window.app.ui.pictureui.addDrawings (src, art);
        
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        // Open empty picture
        var msg = new Message();
        msg.module = 'image';
        var id;
        if (message !== null && message !== '') {
            msg.setSpecial('name', message);
            id = window.app.chatapp.room.id + '-' + message;
        } else {
            id = (Math.random() * 100000000000000000);
        }
        msg.msg = 'img/WhiteBoard.png?id=' + id;
        
        window.app.chatapp.fixPrintAndSend(msg, true);
        
        return null;
    },
    
    /**
     * Creates the HTML Element for an error message.
     * This is called after isValid returns false.
     * @param {String} slashCMD
     * @param {String} message
     * @returns {jQuery}
     */
    get$error : function (slashCMD, message) {
        
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'powerbottom',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/powerbottom'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        window.app.ui.chat.powerBottom = !window.app.ui.chat.powerBottom;
        if (window.app.ui.chat.powerBottom) {
            var $html = $('<p class="chatSistema language" data-langhtml="_POWERBOTTON_" />');
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_POWERBOTTOFF_" />');
        }
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'roleplay',
    
    Slash : [''],
    
    showHelp : false,
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var ignoreFor = msg.getSpecial("ignoreFor", []);
        if (ignoreFor.indexOf(window.app.loginapp.user.id) !== -1) {
            return null;
        }
        var user = msg.getUser();
        var lingua = msg.getSpecial('lingua', 'Padrao');
        var valid = new Validator();
        if (!valid.validate(lingua, 'language')) {
            lingua = 'Padrao';
        }
        
        
        var $msg = $('<p class="chatMensagem" />');
        
        var $persona = $('<b />').text(msg.getSpecial('persona', '????'));
        var msgText = $('<p />').text(msg.msg).html();
        
        
        var $spans = [];
        var pmsg = '';
        var open = null;
        
        var char;
        var $span;
        for (var i = 0; i < msgText.length; i++) {
            char = msgText.charAt(i);
            if (char === '*') {
                if (open === '*') {
                    $span = $('<span class="action" />').html('*' + pmsg + '*');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (open === null) {
                    open = '*';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['[', ']'].indexOf(char) !== -1) {
                if (char === ']' && open === '[') {
                    $span = $('<span class="important" />').html('[' + pmsg + ']');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '[' && open === null) {
                    open = '[';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['{', '}'].indexOf(char) !== -1) {
                if (char === '}' && open === '{') {
                    $span = $('<span class="highlight" />').html(pmsg);
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '{' && open === null) {
                    open = '{';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['(', ')'].indexOf(char) !== -1) {
                if (char === ')' && open === '(') {
                    $span = $('<span class="thought" />').html('(' + pmsg + ')');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '(' && open === null) {
                    open = '(';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else {
                pmsg = pmsg + char;
            }
        }
        if (open !== null) {
            pmsg = open + pmsg;
        }
        
        if (pmsg.length > 0) {
            $span = $('<span />').html(pmsg);
            $span.addClass('lingua' + lingua);
            $spans.push($span);
        }
        
        $msg.append($persona).append(': ');
        for (i = 0; i < $spans.length; i++) {
            $msg.append($spans[i]);
        }
        
        var translation = msg.getSpecial('translation', null);
        if (translation !== null) {
            $msg.append(
                    $('<span class="langTranslation" />')
                            .append($('<b class="language" data-langhtml="_CHATTRANSLATEDAS_" />'))
                        .append(": ")
                        .append(translation)
            );
        }
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        if (room.persona === null) {
            msg.setSpecial('persona', '?????');
        } else {
            msg.setSpecial('persona', room.persona);
        }
        msg.msg = message;
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'seplay',
    
    Slash : ['/se', '/seplay', '/soundeffect', '/wav', '/wave'],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        var user = msg.getUser();
        var $msg = $('<p class="chatImagem" />');
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        var $who = $('<span class="language" data-langhtml="_SHAREDSOUNDEFFECT_" />');
        if (!snowflake) {
            $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
        } else {
            $who.attr('data-langp', (user.nickname));
        }
        $msg.append($who);
        
        var name = msg.getSpecial('name', null);
        
        if (name !== null) {
            $msg.append(' ');
            $msg.append($("<span />").text('"' + name + '".'));
        }
        
        $msg.append (' ');
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_SOUNDLINK_" />');
        //$link.attr('href', cleanMsg);
        $link.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.chat.audioc.playse(this.link);
            }, {link : cleanMsg}
        ));

        var $link2 = $('<a class="language" data-langhtml="_SOUNDSTOP_" />');
        $link2.bind('click', function () {
            window.app.ui.chat.audioc.stopse();
        });

        $msg.append(' ');
        $msg.append($link);
        $msg.append(' ');
        $msg.append($link2);
        if (window.app.ui.chat.cc.firstPrint) {
            return $msg;
        }

        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null));
        var StorytellerPlayedItNow = user.isStoryteller() && (window.app.config.get("autoSE") === 1);

        if (IPlayedItNow || StorytellerPlayedItNow || (window.app.config.get("autoSE") === 2)) {
            window.app.ui.chat.audioc.playse(cleanMsg);
        }

        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        msg.setSpecial('name', null);
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'sheetdm',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var user = msg.getUser();
        var $msg = $('<p class="chatDano" />');
        
        var tipo = msg.getSpecial('type', "HP");
        
//        if (tipo !== "HP" && tipo !== "Exp" && tipo !== "MP") {
//            tipo = "HP";
//        }
        
        $msg.addClass("tipo" + tipo);
        
        var $persona = $('<b />').text(msg.getSpecial('sheetname', '????'));
        $msg.
            append($('<span class="changeIcon" />')).
            append($persona).
            append(": ").
            append($('<span class="changeAmount" />').text(msg.getSpecial('amount', '0?') + ' ' + tipo));
        
//        if (msg.id !== null) {
//            $msg.attr('data-msgid', msg.id);
//        } else {
//            msg.bindSaved(window.app.emulateBind(
//                function () {
//                    this.$msg.attr('data-msgid', this.msg.id);
//                }, {$msg : $msg, msg : msg}
//            ));
//        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'sheettr',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var user = msg.getUser();
        var $msg = $('<p class="chatTurno" />');
        
        var $persona = $('<b />').text(msg.getSpecial('sheetname', '????'));
        $msg.
            append($('<span class="turnIcon" />')).
            append($persona).
            append(":");
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        var player = msg.getSpecial('player', 0);
        if (window.app.loginapp.user.id === player && !window.app.ui.chat.cc.firstPrint) {
            var audio = document.getElementById('yourTurnAudio');
            audio.currentTime = 0;
            audio.volume = 1;
            audio.play();
        }
        
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'sheetup',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var sheetid = msg.getSpecial('sheetid', 0);
        if (typeof window.app.ui.sheetui.controller.$listed[sheetid] === 'undefined') {
            return null;
        }
        
        var sheet = window.app.sheetdb.getSheet(sheetid);
        
        var user = msg.getUser();
        var $msg = $('<p class="chatSistema" />');
        
        $msg.text(sheet.name);
        $msg.append(' ');
        
        if (window.app.ui.sheetui.controller.autoUpdate && !sheet.changed) {
            window.app.ui.sheetui.controller.updateSpecificSheet(sheetid);
            return null;
        } else {
            $msg.append('<span class="language" data-langhtml="_SHEETWASUPDATED_" />');
            $msg.append(' ');

            var $clickupdate = $('<a class="language" data-langhtml="_SHEETCLICKTOUPDATE_" />');

            $clickupdate.on('click', function () {
                window.app.ui.sheetui.controller.updateSpecificSheet(sheetid);
            });

            $msg.append($clickupdate);
        }
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'splay',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        var user = msg.getUser();
        var $msg = $('<p class="chatImagem" />');
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
        }
        
        var $who = $('<span class="language" data-langhtml="_SHAREDSOUND_" />');
        $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
        $msg.append($who);
        
        $msg.append (' ');
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_SOUNDLINK_" />');
        $link.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.chat.audioc.play(this.link);
            }, {link : cleanMsg}
        ));

        $msg.append($link);
        if (window.app.ui.chat.cc.firstPrint) {
            return $msg;
        }

        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null));
        var StorytellerPlayedItNow = user.isStoryteller() && (window.app.config.get("autoBGM") === 1);

        if (IPlayedItNow || StorytellerPlayedItNow || (window.app.config.get("autoBGM") === 2)) {
            window.app.ui.chat.audioc.play(cleanMsg);
        }

        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'story',
    
    Slash : ['/story', '/tale', '/historia', '/história'],
    
    
    isValid : function (slashCMD, message, mestre) {
        return mestre;
    },
    
    
    get$error : function (slashCMD, message, mestre) {
        var $html = $('<p class="chatSistema language" data-langhtml="_STORYNOSTORYTELLER_" />');
        return $html;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var user = msg.getUser();
        var lingua = msg.getSpecial('lingua', 'Padrao');
        var valid = new Validator();
        if (!valid.validate(lingua, 'language')) {
            lingua = 'Padrao';
        }
        
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
        }
        
        if (!user.isStoryteller()) {
            var $msg = $('<p class="chatSistema language" data-langhtml="_STORYTELLERHACK_" />');
            $msg.attr('data-langp', user.nickname + '#' + user.nicknamesufix);
            return $msg;
        }
        
        var $msg = $('<p class="chatNarrativa" />');
        
        var msgText = $('<p />').text(msg.msg).html();
        
        var msgFinal = '';
        var go = true;
        var open = null;
        
        var $spans = [];
        var $span = null;
        for (var i = 0; i < msgText.length; i++) {
            if (msgText.charAt(i) === '[' && open === null) {
                open = '[';
                $span = $('<span class="lingua' + lingua + '" />').html(msgFinal);
                $spans.push($span);
                msgFinal = '';
            } else if (msgText.charAt(i) === ']' && open === '[') {
                $span = $('<span class="important" />').html(msgFinal);
                $spans.push($span);
                msgFinal = '';
                open = null;
            } else if (msgText.charAt(i) === '{' && open === null) {
                open = '{';
                $span = $('<span class="lingua' + lingua + '" />').html(msgFinal);
                $spans.push($span);
                msgFinal = '';
            } else if (msgText.charAt(i) === '}' && open === '{') {
                $span = $('<span class="highlight" />').html(msgFinal);
                $spans.push($span);
                msgFinal = '';
                open = null;
            } else {
                msgFinal += msgText.charAt(i);
            }
        }
        
        if (msgFinal.length > 0) {
            $span = $('<span class="lingua' + lingua + '" />').html(msgFinal);
            $spans.push($span);
        }
        
        $msg.append('- ');
        
        for (var i = 0; i < $spans.length; i++) {
            $msg.append($spans[i]);
        }
        
        var translation = msg.getSpecial('translation', null);
        if (translation !== null) {
            $msg.append(
                    $('<span class="langTranslation" />')
                            .append($('<b class="language" data-langhtml="_CHATTRANSLATEDAS_" />'))
                        .append(": ")
                        .append(translation)
            );
        }
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var msg = new Message();
        msg.msg = message;
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'stream',
    
    isStream : false,
    $css : null,
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/stream'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (msg === null || msg.msg === null) {
            return null;
        }
        
        if (!this.isStream || (msg.getUser() === null || (!msg.getUser().isStoryteller()) && msg.origin !== window.app.loginapp.user.id)) {
            return null;
        }
        
        var clean = msg.msg.toUpperCase();
        
        if (clean === 'CLOSEPICTURE' || clean === 'PICTURE') {
            window.app.ui.pictureui.close();
        } else if (clean === 'CLOSEYOUTUBE' || clean === 'YOUTUBE') {
            window.app.ui.hideRightWindows(function () {
                window.app.ui.youtubeui.$player.empty();
            });
        } else if (clean === 'CLEAR') {
            window.app.ui.chat.$chatHeader.hide();
            window.app.ui.chat.$chatMessages.empty();
        } else if (msg.msg.indexOf('://') !== -1) {
            var url = msg.msg;
            try {
                url = decodeURIComponent(url);
            } catch (e) {

            }
            if (url.indexOf('dropbox.com') !== -1) {
                url = url.replace('dl=0', 'dl=1');
                if (url.indexOf('dl=1') === -1) {
                    url = url + (url.indexOf('?') !== -1 ? '' : '?') + 'dl=1';
                }
            }
            $('#stream').empty().append($('<img />').attr('src', url));
        }
        
        
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        var msg = null;
        if (message === '' || message === null) {
            if (this.isStream) {
                this.isStream = false;
                window.app.ui.chat.$chatHeader.show();
                window.app.ui.nonotifications = false;
                window.app.ui.chat.cc.room.hidePersona = false;
                window.app.ui.title = "RedPG";
                window.app.ui.chat.alwaysBottom = false;
                window.app.ui.removeNotifications();
                this.$css.remove();
                var $notification = $('<p class="chatSistema language" data-langhtml="_STREAMOFF_" />');
                window.app.ui.language.applyLanguageTo($notification);
                window.app.ui.chat.appendToMessages($notification);
                $('#favicon').attr('href', 'favicon.ico');
                window.app.ui.pictureui.streaming(false);
                window.app.ui.checkWidth();
            } else {
                this.isStream = true;
                window.app.ui.chat.alwaysBottom = true;
                window.app.ui.nonotifications = true;
                window.app.ui.chat.cc.room.hidePersona = true;
                window.app.ui.title = "RedPGCamera";
                window.app.ui.removeNotifications();
                window.app.ui.pictureui.streaming(true);
                $('#favicon').attr('href', 'img/favicon.ico');
                var $notification = $('<p class="chatSistema language" data-langhtml="_STREAMON_" />');
                window.app.ui.language.applyLanguageTo($notification);
                window.app.ui.chat.appendToMessages($notification);
                window.app.ui.hideRightWindows();
                this.$css = $('<link rel="stylesheet" href="css/stream.css" type="text/css" />').on('load', function () {
                    window.app.ui.checkWidth();
                    window.app.ui.chat.scrollToBottom(true);
                    window.app.ui.chat.alwaysBottom = true;
                });
                $('head').append(this.$css);
            }
        } else {
            msg = new Message();
            msg.setMessage(message);
        }
        return msg;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'system',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : [],
    
    isValid : function (slashCMD, msg) {
        return false;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        var $html = $('<p class="chatSistema" />').append('<span class="language" data-langhtml="_CHATSYSTEMMESSAGE_"></span>: ' + msg.getMessage());
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Template',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/template'],
    
    isValid : function (slashCMD, msg) {
        
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @param {String} slashCMD
     * @param {String} msgOnly
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        // message is the whole string after the slash command.
        // slashCMD is the slash command used.
        // If the user typed "/template 123", message would be "123" now and slashCMD would be "/template".
    },
    
    /**
     * Creates the HTML Element for an error message.
     * This is called after isValid returns false.
     * @param {String} slashCMD
     * @param {String} message
     * @returns {jQuery}
     */
    get$error : function (slashCMD, message) {
        
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'title',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/title'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.ui.title = message;
        window.app.ui.removeNotifications();
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'vote',
    
    Slash : ['/vote', '/voto', '/vota', '/votar'],
    
    poller : {},
    vote : {},
    $votes : {},
    
    addVotes : function (votefor, user) {
        if (typeof this.vote[votefor] === 'undefined' || this.poller[votefor] === user) {
            return null;
        }
        var index = this.vote[votefor].indexOf(user);
        if (index === -1) {
            this.vote[votefor].push(user);
        } else {
            this.vote[votefor].splice(index, 1);
        }
        this.$votes[votefor].text(this.vote[votefor].length);
    },
    
    isValid : function (slashCMD, message) {
        return (message !== null && message.length > 0);
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        
        var votefor = msg.getSpecial('castvote', null);
        var user = msg.getUser();
        var $msg = $('<p class="chatVote" />');
        
        var $voteCount = $('<span class="voteCount" />').text('0');
        $msg.append($voteCount);
        
        if (user === null) {
            user = new User();
            user.id = msg.origin;
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        if (votefor !== null) {
            this.addVotes(votefor, user.id);
            return null;
        }
        
        var $jogador = $('<b />');
        if (!snowflake) {
            $jogador.text(user.nickname + '#' + user.nicknamesufix + ' ');
        } else {
            $jogador.text(user.nickname + ' ');
        }
        $msg.append($jogador);
        
        $msg.append($('<span class="language" data-langhtml="_VOTECREATED_" />'));
                
        $msg.append(': ' + $('<p />').text(msg.msg).html());
        
        $msg.append("<br />");
        
        if (msg.id !== null && msg.origin !== window.app.loginapp.user.id) {
            this.poller[msg.id] = msg.origin;
            this.vote[msg.id] = [];
            this.$votes[msg.id] = $voteCount;
            
            $voteCount.bind('click', window.app.emulateBind(
                function () {
                    var $this = this.$voteCount;
                    var msg = new Message();
                    msg.setSpecial('castvote', this.id);
                    msg.setMessage('');
                    msg.module = 'vote';
                    msg.origin = window.app.loginapp.user.id;
                    msg.roomid = this.room;
                    var room = window.app.roomdb.getRoom(this.room);
                    room.addLocal(msg);
                    
                    var $load = $('<span class="load" />').text('LOAD');
                    
                    //$load.insertAfter(this.$voteCount);
                    
                    this.$voteCount.addClass('load');
                    
                    msg.bindSaved(window.app.emulateBind(
                        function () {
                            this.$load.removeClass('load');
                            this.mod.addVotes(this.id, this.me);
                        }, {$load : this.$voteCount, mod : this.mod, me : msg.origin, id : this.id}
                    ));
            
                    msg.bindError(window.app.emulateBind(
                        function () {
                            window.app.chatapp.sendMessage(this.msg);
                        }, {$load : this.$voteCount, msg : msg}
                    ));
                    
                    window.app.chatapp.sendMessage(msg);
                }, {id : msg.id, $voteCount : $voteCount, room : msg.roomid, mod : this}
            ));
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.mod.poller[this.msg.id] = this.msg.origin;
                    this.mod.vote[this.msg.id] = [];
                    this.mod.$votes[this.msg.id] = this.$voteCount;
                }, {msg : msg, mod : this, $voteCount : $voteCount}
            ));
    
            $voteCount.addClass("owner");
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        msg.setSpecial('castvote', null);
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'webm',
    
    Slash : ['/webm', '/mp4'],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        var user = msg.getUser();
        var $msg = $('<p class="chatImagem" />');
        
        var nome = msg.getSpecial('name', null);
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        if (nome === null) {
            var $who = $('<span class="language" data-langhtml="_SHAREDVIDEO_" />');
            if (!snowflake) {
                $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
            } else {
                $who.attr('data-langp', (user.nickname));
            }
            $msg.append($who).append ('. ');
        } else {
            var $who = $('<span class="language" data-langhtml="_SHAREDTHEVIDEO_" />');
            if (!snowflake) {
                $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
            } else {
                $who.attr('data-langp', (user.nickname));
            }
            $msg.append($who);

            $msg.append (': ');
            
            $msg.append($('<span />').text(msg.getSpecial("name", null) + '. ').html());
        }
        
        if (nome !== null) {
            $msg.append('');
        }
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_VIDEOLINK_" />');
        $link.bind('click', window.app.emulateBind(
            function (event) {
                window.app.ui.pictureui.open(this.link, true);
                event.preventDefault();
            }, {link : cleanMsg}
        ));
        $link.attr('href', cleanMsg);
        $link.attr('target', '_blank');

        $msg.append($link);
        if (window.app.ui.chat.cc.firstPrint) {
            return $msg;
        }
        
        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null));
        var StorytellerPlayedItNow = user.isStoryteller() && (window.app.config.get("autoImage") === 1);

        if (IPlayedItNow || StorytellerPlayedItNow || (window.app.config.get("autoImage") === 2)) {
            window.app.ui.pictureui.open(cleanMsg, true);
        }

        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Whisper',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/whisper', '/w', '/pm', '/private', '/mp', '/privada'],
    
    targets : [],
    
    storyteller : false,
    
    isValid : function (slashCMD, msg) {
        this.targets = [];
        var room = window.app.ui.chat.cc.room;
        var users = room.users.users;
        var split = msg.split(/,(.+)/);
        var target = split[0];
        
        if (target.toUpperCase() === 'MESTRE' || target.toUpperCase() === 'MESTRES') {
            this.storyteller = true;
            return true;
        }
        
        var testTarget = target.toUpperCase();
        /** @type User */ var user;
        for (var idx in users) {
            user = users[idx];
            if (user.id === window.app.loginapp.user.id) continue;
            if (testTarget === (user.nickname + '#' + user.nicknamesufix).toUpperCase()) {
                this.targets.push(user.id);
                return true;
            }
            if (user.nickname !== null && user.nickname.toUpperCase().indexOf(testTarget) !== -1) {
                this.targets.push(user.id);
            } else if (user.persona !== null) {
                if (user.persona.toUpperCase().indexOf(testTarget) !== -1) {
                    this.targets.push(user.id);
                }
            }
        }
        
        return (this.targets.length === 1);
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @param {String} slashCMD
     * @param {String} msgOnly
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        if (!window.app.ui.isStreaming()) {
            var $html = $('<p class="chatWhisper" />');
            var user = msg.getUser();
        
            if (user === null) {
                user = new User();
                user.nickname = '?';
                user.nicknamesufix = '?';
            }
            
            var me = window.app.loginapp.user;
            
            if (user.id !== me.id) {
                window.app.ui.chat.cc.room.lastWhisper = user;
                var $origin = $('<span class="origin" />');
                $origin.append('( ');
                $origin.append($('<span class="language" data-langhtml="_WHISPERORIGIN_" />'));
                $origin.append(" ");
                $origin.append(user.nickname + '#' + user.nicknamesufix);
                $origin.append(' ) : ');
            
                $html.append($origin);
                
                if (user.nickname !== '?') {
                    $origin.bind('click', window.app.emulateBind(
                        function () {
                            window.app.ui.chat.$chatinput.val('/whisper ' + this.nick + ', ');
                            window.app.ui.chat.$chatinput.focus();
                        }, {nick : user.nickname + '#' + user.nicknamesufix}
                    ));
                }
            } else {
                if (typeof msg.destination === 'number' || msg.destination.length === 1) {
                    var destination = msg.getDestinationUser();
                    if (destination === null) {
                        destination = new User();
                        destination.nickname = '?';
                        destination.nicknamesufix = '?';
                    }
                    window.app.ui.chat.cc.room.lastWhisper = destination;

                    var $destination = $('<span class="origin" />');
                    $destination.append('( ');
                    $destination.append($('<span class="language" data-langhtml="_WHISPERDESTINATION_" />'));
                    $destination.append(" ");
                    $destination.append(destination.nickname + '#' + destination.nicknamesufix);
                    $destination.append(' ) : ');

                    $html.append($destination);

                    if (destination.nickname !== '?') {
                        $destination.bind('click', window.app.emulateBind(
                            function () {
                                window.app.ui.chat.$chatinput.val('/whisper ' + this.nick + ', ');
                                window.app.ui.chat.$chatinput.focus();
                            }, {nick : destination.nickname + '#' + destination.nicknamesufix}
                        ));
                    }
                } else {
                    var $destination = $('<span class="origin" />');
                    $destination.append('( ');
                    $destination.append($('<span class="language" data-langhtml="_WHISPERDESTINATION_" />'));
                    $destination.append(" <span class='language' data-langhtml'_WHISPERMANYDESTINATIONS_'></span>");
                    $destination.append(' ) : ');

                    $html.append($destination);
                }
            }
            
            
            
            var $msg = $('<span class="message" />');
            $msg.text(msg.getMessage());
            
            $html.append($msg);
            
            return $html;
        }
            
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        // message is the whole string after the slash command.
        // slashCMD is the slash command used.
        // If the user typed "/template 123", message would be "123" now and slashCMD would be "/template".
        var msg = new Message();
        
        var split = message.split(/,(.+)/);
        if (split.length > 1) {
            msg.setMessage(split[1]);
        }
        
        msg.setDestination(this.targets);
        
        return msg;
    },
    
    
    autoComplete : function (slashCMD, message) {
        if (this.targets.length === 1) {
            var split = message.split(/,(.+)/);
            if (split.length > 1) { 
                var cleanMessage = split[1];
            } else {
                var cleanMessage = '';
            }
            
            var username;
            var user = window.app.ui.chat.cc.room.getUser(this.targets[0]);
            if (user == null || user.nickname == null) {
                username = split[0];
            } else {
                username = user.nickname + '#' + user.nicknamesufix;
            }
            
            return "/whisper " + username + ', ' + cleanMessage;
        } else {
            return this.get$error(slashCMD, message);
        }
    },
    
    /**
     * Creates the HTML Element for an error message.
     * This is called after isValid returns false.
     * @param {String} slashCMD
     * @param {String} message
     * @returns {jQuery}
     */
    get$error : function (slashCMD, message) {
        var cleanSlash = $('<div />').text(slashCMD).html();
        var split = message.split(/,(.+)/);
        if (split.length > 1) { 
            var cleanMessage = split[1];
        } else {
            var cleanMessage = '';
        }
        
        var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDWHISPER_" />');
        var $many = $('<p class="chatSistema" />');
        $many.append('<span class="language" data-langhtml="_TOOMANYWHISPER_"></span>');
        
        var $user;
        var hasAny = false;
        var nick;
        var user;
        var id;
        
        for (var i = 0; i < this.targets.length; i ++) {
            id = this.targets[i];
            user = window.app.ui.chat.cc.room.getUser(id);
            if (user !== null) {
                nick = user.nickname + '#' + user.nicknamesufix;
                if (user.persona !== null && user.persona !== '') {
                    nick = nick + ' - (' + user.persona + ')';
                }
                $user = $('<span class="target" />').text(nick);
                $user.bind('click', window.app.emulateBind(
                    function () {
                        window.app.ui.chat.$chatinput.val('/whisper ' + this.target + ', ' + this.message);
                        window.app.ui.chat.$chatinput.focus();
                    }, {target : user.nickname + '#' + user.nicknamesufix, message : cleanMessage}
                ))
                $many.append($user);
            }
            hasAny = true;
        }
        
        if (hasAny) {
            $many.append("<span class='language' data-langhtml='_WHISPERPICKONE_'></span>");
            return $many;
        }
        
        
        var split = message.split(/,(.+)/);
        var target = split[0];
        var cleanMsg = $('<div />').text(target).html();
        var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDWHISPER_" />');
        $html.attr('data-langp', cleanMsg);
        
        return $html;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'youtube',
    
    Slash : ['/youtube', '/ytube', '/video'],
    
    
    isValid : function (slashCMD, message) {
        var url = window.app.ui.youtubeui.parseUrl(message);
        return url !== null;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        var user = msg.getUser();
        var $msg = $('<p class="chatImagem" />');
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        var $who = $('<span class="language" data-langhtml="_SHAREDVIDEO_" />');
        if (!snowflake) {
            $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
        } else {
            $who.attr('data-langp', (user.nickname));
        }
        $msg.append($who);
        
        $msg.append (' ');
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_VIDEOLINK_" />');
        $link.bind('click', window.app.emulateBind(
            function (/** Event */ event) {
                var id = window.app.ui.youtubeui.parseUrl(this.link);
                if (id === null) {
                    var $error = $('<p class="chatSistema" class="language" data-langhtml="_VIDEOINVALID_" />');
                    $error.attr('data-langp', this.user);
                    window.app.ui.language.applyLanguageTo($error);
                    window.app.ui.chat.appendToMessages($error);
                } else {
                    window.app.ui.youtubeui.play(id, this.autoplay);
                }
                event.preventDefault();
            }, {link : cleanMsg, user : user.nickname + '#' + user.nicknamesufix, autoplay : user.isStoryteller()}
        ));
        $link.attr('href', cleanMsg);
        $link.attr('target', '_blank');

        var storytellerDid = (user.isStoryteller() && !(window.app.ui.chat.cc.firstPrint) && window.app.config.get("autoVIDEO") === 1);
        

        if (window.app.ui.chat.cc.firstPrint) {
            // do nothing
        } else if ((typeof slashCMD !== 'undefined' && slashCMD !== null)) {
            var id = window.app.ui.youtubeui.parseUrl(cleanMsg);
            if (id !== null) {
                window.app.ui.youtubeui.play(id, false);
            }
        } else if (storytellerDid || window.app.config.get("autoVIDEO") === 2) {
            var id = window.app.ui.youtubeui.parseUrl(cleanMsg);
            if (id !== null) {
                window.app.ui.youtubeui.play(id, true);
            }
        }

        $msg.append($link);
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var msg = new Message();
        msg.msg = message;
        
        
        return msg;
    }
}); 
 
if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Zebra',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/zebra'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (window.app.ui.chat.$chatbox.hasClass('zebra')) {
            var $html = $('<p class="chatSistema language" data-langhtml="_ZEBRAON_" />');
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_ZEBRAOFF_" />');
        }
        
        return $html;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        window.app.ui.chat.$chatbox.toggleClass('zebra');
        return null;
    },
    
    get$error : function () {
        return null;
    }
}); 
 
/**
 * Controls every UI element related to Personas.
 * @class PersonaController
 * @constructor
 */
function PersonaController () {
    this.$btup;
    this.$btdown;
    this.$btadd;
    this.$btremove;
    this.$container;
    
    /* Form */
    this.$creationWindow;
    this.$nameinput;
    this.$hideinput;
    
    this.init = function () {
        this.$btup = $('#personaUpButton');
        this.$btdown = $('#personaDownButton');
        this.$btadd = $('#personaAddButton');
        this.$btremove = $('#personaRemoveButton');
        this.$container = $('#personaCenterBox');
        
        this.$creationWindow = $('#personaCreateDiv');
        this.$nameinput = $('#PCFName');
        this.$avatarinput = $('#PCFAvatar');
        this.$hideinput = $('#PCFHide');
        
        this.setBindings();
        this.considerScrollers();
        this.closeWindow();
    };
    
    this.setBindings = function () {
        this.$btdown.bind('click', function (){
            window.app.ui.chat.pc.animateDown();
        });
        
        this.$btup.bind('click', function (){
            window.app.ui.chat.pc.animateUp();
        });
        
        $('#personaAddButton').bind('click', function () {
            window.app.ui.chat.pc.openCreation();
        });
        
        $('#personaRemoveButton').bind('click', function () {
            window.app.ui.chat.pc.removePersona();
        });
        
        $('#PCForm').on('submit', function () {
            window.app.ui.chat.pc.submit();
        });
    };
    
    this.handleResize = function () {
        this.considerScrollers();
    };
    
    this.considerScrollers = function () {
        var scrollTop = this.$container.scrollTop();
        var height = this.$container.height() / 2;
        var scrollHeight = this.$container[0].scrollHeight;
        
        if (scrollTop + (height * 2) < scrollHeight) {
            this.$btdown.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btdown.stop(true, true).addClass('deactivated', 200);
        }
        
        if (scrollTop > 0) {
            this.$btup.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btup.stop(true, true).addClass('deactivated', 200);
        }
    };
    
    this.animateDown = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.pc.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height() / 2;
                var scrollHeight = $this[0].scrollHeight;
                if (scrollTop + height <= scrollHeight) {
                    if (scrollTop + (height * 2) <= scrollHeight) {
                        return scrollTop + (height * 2);
                    }
                    return scrollTop + height;
                } else {
                    return scrollTop;
                }
            } ()
        }, 200, function () {
            window.app.ui.chat.pc.considerScrollers();
        });
    };
    
    this.animateUp = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.pc.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height() / 2;
                if (scrollTop - height >= 0) {
                    if (scrollTop - (height * 2) >= 0) {
                        return scrollTop - (height * 2);
                    }
                    return scrollTop - height;
                } else {
                    return scrollTop;
                }
            } ()
        }, 200, function () {
            window.app.ui.chat.pc.considerScrollers();
        });
    };
    
    this.removePersona = function () {
        var $found = this.$container.find('a.toggled');
        if ($found.length > 0) {
            this.setPersona($($found[0]));
            var nome = $($found[0]).attr('data-persona');
            $($found[0]).remove();
            window.app.ui.chat.cc.room.persona = null;
            this.removeMemory(nome);
        }
    };
    
    this.addPersona = function (persona, avatar, hidepers, restoring) {
        if (typeof restoring === 'undefined') restoring = false;
        var $found = this.$container.find('a');
        var $this;
        for (var i = 0; i < $found.length; i++) {
            $this = $($found[i]);
            if ($this.attr('data-persona') === persona) {
                $this.remove();
            }
        }
        
        var $pers = $('<a class="button" />');
        $pers.text(persona);
        $pers.attr('data-persona', persona);
        $pers.attr('data-avatar', avatar);
        $pers.attr('data-hidepers', hidepers);
        
        $pers.bind('click', function () {
            window.app.ui.chat.pc.setPersona($(this));
        });
        
        this.$container.find('a.toggled').removeClass('toggled');
        this.$container.append($pers);
        
        this.considerScrollers();
        if (!restoring) {
            this.setPersona($pers);
            this.addMemory(persona, avatar, hidepers);
        }
    };
    
    this.setPersona = function ($persona, force) {
        if (typeof force === 'undefined') force = false;
        if ($persona.hasClass('toggled') && !force) {
            $persona.removeClass('toggled');
            window.app.ui.chat.cc.room.persona = null;
            window.app.ui.chat.cc.room.avatar = null;
            var $html = $('<p class="chatSistema language" data-langhtml="_NICKREMOVED_" />');
        } else {
            window.app.ui.chat.cc.room.persona = $persona.attr('data-persona');
            window.app.ui.chat.cc.room.avatar = $persona.attr('data-avatar');
            window.app.ui.chat.cc.room.hidePersona = $persona.attr('data-hidepers') === 'true';
            this.$container.find('a.toggled').removeClass('toggled');
            $persona.addClass('toggled');
            var persona = $persona.html();
            var $html = $('<p class="chatSistema language" data-langhtml="_NICKCHANGE_" />');
            $html.attr("data-langp", persona);
        }
        
        if (!window.app.ui.chat.cc.room.hidePersona) {
            window.app.chatapp.sendAction("persona", JSON.stringify({
                "persona" : window.app.ui.chat.cc.room.persona,
                "avatar" : window.app.ui.chat.cc.room.avatar
            }));
        }
        
        window.app.ui.language.applyLanguageTo($html);
        
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.submit = function () {
        var avatar = this.$avatarinput.val();
        if (avatar === '') avatar = null;
        this.addPersona(
            this.$nameinput.val(),
            avatar,
            this.$hideinput.is(':checked')
        );
        this.closeWindow();
    };
    
    this.closeWindow = function () {
        this.$creationWindow.finish().fadeOut(200);
    };
    
    this.openWindow = function () {
        this.$avatarinput.val('');
        this.$nameinput.val('');
        this.$hideinput.removeAttr('checked');
        this.$creationWindow.finish().fadeIn(200, function () {
            window.app.ui.chat.pc.$nameinput.focus();
        });
    };
    
    this.openCreation = function () {
        if (this.$creationWindow.is(':visible')) {
            this.closeWindow();
        } else {
            this.openWindow();
        }
    };
    
    this.restore = function () {
        var personas = window.app.memory.getMemory("Personas", {});
        if (typeof personas[window.app.ui.chat.cc.room.id] === 'undefined') {
            personas[window.app.ui.chat.cc.room.id] = {};
        }
        
        var persona;
        for (var i in personas[window.app.ui.chat.cc.room.id]) {
            persona = personas[window.app.ui.chat.cc.room.id][i];
            this.addPersona(persona.persona, persona.avatar, persona.hidepers, true);
        }
    };
    
    this.addMemory = function (persona, avatar, hidepers) {
        var personas = window.app.memory.getMemory("Personas", {});
        if (typeof personas[window.app.ui.chat.cc.room.id] === 'undefined') {
            personas[window.app.ui.chat.cc.room.id] = {};
        }
        personas[window.app.ui.chat.cc.room.id][persona] = {
            persona : persona,
            avatar : avatar,
            hidepers : hidepers
        };
        
        window.app.memory.saveMemory();
    };
    
    this.removeMemory = function (persona) {
        var personas = window.app.memory.getMemory("Personas", {});
        if (typeof personas[window.app.ui.chat.cc.room.id] === 'undefined') {
            personas[window.app.ui.chat.cc.room.id] = {};
        }
        delete personas[window.app.ui.chat.cc.room.id][persona];
        window.app.memory.saveMemory();
    };
} 
 
function ConfigUI () {
    
    this.$langImg = $("#configLanguageImg");
    this.$langSelect = $("#configLanguageSelect").empty().on('change', function () {
        window.app.ui.language.changeLanguage($(this).val());
    });
    
    this.$ele = {};
    
    this.$ele['chatuseprompt'] = $("#configPromptSelect").on('change', function () {
        window.app.config.store('chatuseprompt', parseInt($(this).val()));
    });
    this.$ele['fsmode'] = $("#configFullscreen").on('change', function () {
        window.app.config.store('fsmode', parseInt($(this).val()));
    });
    this.$ele['autoBGM'] = $("#configAutoBGM").on('change', function () {
        window.app.config.store('autoBGM', parseInt($(this).val()));
    });
    this.$ele['autoSE'] = $("#configAutoSE").on('change', function () {
        window.app.config.store('autoSE', parseInt($(this).val()));
    });
    this.$ele['autoVIDEO'] = $("#configAutoVIDEO").on('change', function () {
        window.app.config.store('autoVIDEO', parseInt($(this).val()));
    });
    
    this.$ele['autoImage'] = $("#configAutoImage").on('change', function () {
        window.app.config.store('autoImage', parseInt($(this).val()));
    });
    
    this.$ele['wsPort'] = $("#configWsHost").on('change', function () {
        window.app.config.store('wsPort', parseInt($(this).val()));
    });
    
    this.$error = $("#configSaveError").hide();
    this.$success = $("#configSaveSuccess").hide();
    
    $("#configSaveButton").on('click', function () {
        window.app.ui.configui.$error.finish().hide();
        window.app.ui.configui.$success.finish().hide();
        var cbs = function () {
            window.app.ui.configui.$error.hide();
            window.app.ui.configui.$success.show().fadeOut(4000);
            window.app.ui.unblockLeft();
        };
        var cbe = function () {
            window.app.ui.configui.$error.show();
            window.app.ui.unblockLeft();
        };
        window.app.ui.blockLeft();
        window.app.config.sendToServer(cbs, cbe);
    });
    
    this.configChanged = function (id) {
        if (id === 'language') {
            var lang = window.app.config.get("language");
            this.$langSelect.val(lang);
            this.$langImg.removeClass().addClass(lang + "_Flag").attr("title", window.lingo[lang]._LANGUAGENAME_);
        } else if (['chatuseprompt', 'fsmode', 'autoBGM', 'autoSE', 'autoVIDEO','autoImage', 'wsPort'].indexOf(id) !== -1) {
            this.$ele[id].val(window.app.config.get(id).toString());
        }
    };
    
    this.init = function () {
        window.app.config.addListener("language", this);
        window.app.config.addListener("autoBGM", this);
        window.app.config.addListener("autoSE", this);
        window.app.config.addListener("autoVIDEO", this);
        window.app.config.addListener("autoImage", this);
        window.app.config.addListener("chatuseprompt", this);
        window.app.config.addListener("fsmode", this);
        window.app.config.addListener("wsPort", this);
        
        var lingos = window.lingo;
        var $option;
        for (var key in lingos) {
            $option = $("<option />").val(key).text(lingos[key]._LANGUAGENAME_);
            this.$langSelect.append($option);
        }
        
        for (var i = 0; i < window.app.wsHostPorts.length; i++) {
            $option = $("<option />").val(window.app.wsHostPorts[i]).text(window.app.wsHostPorts[i]);
            this.$ele['wsPort'].append($option);
        }
        
        
        $('#configVersion').html(window.app.version[0] +
                                 '.' + window.app.version[1] +
                                 '.' + window.app.version[2]);
                         
        $('#callSettingsWindowBt').bind('click', function () {
            window.app.ui.callLeftWindow("configWindow");
        });
  };
    
} 
 
function ForumUI () {
    this.$forum = $("#forumRecent");
    
    var ajax = new AjaxController();
    ajax.requestPage({
        url: "http://forum.redpg.com.br/index.php?p=/discussions",
        dataType: 'html',
        success : function (data) {
            window.app.ui.forumui.addLatest(data);
        },
        error : function (data) {
            window.app.ui.forumui.addError(data);
        }
    });
    
    this.addError = function (data) {
        this.$forum.html("<p class='language' data-langhtml='_HOMEFORUMERROR_'>" + 
                window.app.ui.language.getLingo("_HOMEFORUMERROR_") + "</p>");
    };
    
    this.addLatest = function (data) {
        this.$forum.empty();
        var $latest = $(data).find("table.DiscussionsTable.DataTable > tbody");
        var $tr = $latest.find("tr");
        
        var $threadName;
        var $threadCategory;
        var $threadPoster;
        
        var $as;
        var $trr;
        
        var $ul = $("<ul />");
        var $li;
        
        for (var i = 0; i < $tr.length; i++) {
            $trr = $($tr[i]);
            $as = $trr.find("td.DiscussionName a");
            
            $threadName = $($as[0]).removeClass().addClass("textLink").attr("target", "_blank");
            $threadName.attr("href", this.fixHref($threadName.attr("href")));
            
            $threadCategory = $($as[1]).removeClass().addClass("textLink").attr("target", "_blank");
            $threadCategory.attr("href", this.fixHref($threadCategory.attr("href")));
            
            $as = $trr.find("td.LastUser a");
            
            $threadPoster = $($as[1]).removeClass().addClass("textLink").attr("target", "_blank");
            $threadPoster.attr("href", this.fixHref($threadPoster.attr("href")));
            
            $li = $("<li />")
                    .append("<span class='language' data-langhtml='_FORUMLATESTPOST_'>"
                            + window.app.ui.language.getLingo("_FORUMLATESTPOST_")
                            + "</span>: ")
                    .append($threadName)
                    .append(" <span class='language' data-langhtml='_FORUMLATESTIN_'>" 
                            + window.app.ui.language.getLingo("_FORUMLATESTIN_") 
                            + "</span> ")
                    .append($threadCategory)
                    .append(", <span class='language' data-langhtml='_FORUMBY_'>" +
                            + window.app.ui.language.getLingo("_FORUMBY_")
                            + "</span> ")
                    .append($threadPoster)
                    .append(".");
            
            $ul.append($li);
        }
        
        this.$forum.append($ul);
        return;
        
        
        
        $latest.find("span.LastCommentBy").each(function () {
            var $this = $(this);
            var $a = $this.find("a");
            $this.empty()
                    .append("<span class='language' data-langhtml='_FORUMBY_'>" +
                            + window.app.ui.language.getLingo("_FORUMBY_")
                            + "</span> ")
                    .append($a);
        });
        
        
        $latest.find("span.options").remove();
        $latest.find("span.ViewCount").remove();
        $latest.find("span.CommentCount").remove();
        $latest.find("div.Title").prepend(
            "<span class='language' data-langhtml='_FORUMLATESTPOST_'>"
            + window.app.ui.language.getLingo("_FORUMLATESTPOST_")
            + "</span>: "
        );

        $(
            "<span> <span class='language' data-langhtml='_FORUMLATESTIN_'>" 
                + window.app.ui.language.getLingo("_FORUMLATESTIN_") 
          + "</span> </span>"
        ).insertBefore($latest.find("span.Category"));
        $latest.find("span.LastCommentDate").remove();
        
        var $as = $latest.find("a").addClass("textLink");
        var $a;
        var href;
        for (var i = 0; i < $as.length; i++) {
            $a = $($as[i]);
            href = $a.attr("href");
            if (href.indexOf("://") === -1) {
                $a.attr("href", "http://forum.redpg.com.br" + (href.indexOf("/") === 0 ? "" : "/") + href);
            }
            $a.attr("target", "_blank");
        }
        
        
        $latest.find("span.DiscussionScore").remove();
        this.$forum.empty().append($latest);
    };
    
    this.fixHref = function (href) {
        if (href.indexOf("://") === -1) {
            if (href.indexOf("//") === 0) {
                href = "http:" + href;
            } else {
                href = "http://forum.redpg.com.br" + (href.indexOf("/") === 0 ? "" : "/") + href;
            }
        }
        return href;
    };
} 
 
function Game$ () {
    /**
     * 
     * @param {Game} game
     * @returns {jQuery}
     */
    this.createGame = function (game) {
        var $game = $('<div />');
        
        var $nameline = $('<p class="language gameTitle" data-langtitle="_GAMESOPENCLOSE_">').text(game.name);
        $nameline.bind("click", window.app.emulateBind(function () {
            this.$div.toggleClass('toggled');
        }, {$div : $game}));
        
        $game.append($nameline);
        
        if (game.isOwner()) {
            var $deletebutton = $('<a class="button delete language" data-langtitle="_GAMESDELETE_"></a>');
            $deletebutton.bind('click', window.app.emulateBind(
                function (e) {
                    if (confirm(window.app.ui.language.getLingoOn('_GAMESCONFIRMDELETE_', this.gamename))) {
                        window.app.ui.gameui.deleteGame(this.gameid);
                    }
                    e.stopPropagation();
                }, {gamename : game.name, gameid : game.id}
            ));
            
            var $options = $('<a class="button options language" data-langtitle="_GAMESOPTIONS_"></a>');
            $options.bind('click', window.app.emulateBind(function (e) {
                window.app.ui.gameui.callEdit(this.id);
                e.stopPropagation();
            }, {id : game.id}));
            
            $nameline.append($deletebutton).append($options);
        } else {
            var $leavebutton = $('<a class="right button leave language" data-langtitle="_GAMESLEAVE_"></a>');
            $leavebutton.bind('click', window.app.emulateBind(function (e) {
                if (confirm(window.app.ui.language.getLingoOn('_GAMESCONFIRMLEAVE_', this.gamename))) {
                    window.app.ui.gameui.leaveGame(this.gameid);
                }
                e.stopPropagation();
            }, {gamename : game.name, gameid : game.id}));
            $nameline.append($leavebutton);
        }
        
        if (game.promote) {
            var $permissions = $('<a class="right button permissions language" data-langtitle="_GAMESPERMISSIONS_"></a>');
            $permissions.bind("click", window.app.emulateBind(function (e) {
                window.app.ui.gameui.privui.callSelf(this.gameid);
                e.stopPropagation();
            }, {gameid : game.id}));
            
            $nameline.append($permissions);
        }
        
        var $rooms = $('<div />');
        
        var $creatorline = $('<p class="creator" />');
        $creatorline.append($("<span class='language' data-langhtml='_GAMESCREATORTOOLTIP_' />"));
        $creatorline.append(": " + game.creatornick + '#' + game.creatorsufix);
        $rooms.append($creatorline);
        
        if (game.rooms.length === 0) {
            $rooms.append('<p class="language noRooms" data-langhtml="_GAMESNOROOMS_"></p>');
        } else {
            /**
             * @type Room
             */
            var room;
            
            var $room;
            var $rooma;
            var $roomdelete;
            var $roomoptions;
            var $roomleave;
            
            for (var i = 0; i < game.rooms.length; i++) {
                room = window.app.roomdb.getRoom(game.rooms[i]);
                $room = $('<p class="selectable roomLink" />');
                
                $rooma = $('<a class="language roomLink" data-langtitle="_GAMESJOINROOM_" />');
                $rooma.append(room.name);
                $rooma.bind('click', window.app.emulateBind(
                    function () {
                        window.app.ui.chat.cc.openRoom(this.roomid);
                    }, {roomid : room.id}
                ));
                
                if (room.isOwner()) {
                    $roomdelete = $('<a class="language right delete button" data-langtitle="_GAMESDESTROYROOM_" />');
                    $roomdelete.bind('click', window.app.emulateBind(
                        function () {
                            window.app.ui.gameui.deleteRoom(this.id);
                        }, {id : room.id}
                    ));
                    
                    $roomoptions = $('<a class="language right options button" data-langtitle="_GAMESROOMOPTIONS_" />');
                    $roomoptions.bind('click', function () {
                        alert("Room options - not implemented");
                    });
                    
                    $room.append($roomdelete);
                }
                
                
                
                
                $room.append ($rooma);
                
                $rooms.append($room);
            }
        }
        
        if (game.storyteller || game.invite) {
            $rooms.append('<hr />');
        }
        
        if (game.storyteller) {
            
            var $newroomp = $('<p class="bottomLinks" />');
            
            var $newrooma = $('<a class="language textLink" data-langhtml="_GAMESNEWROOM_" />');
            $newrooma.bind("click", window.app.emulateBind(
                function () {
                    window.app.ui.gameui.roomui.openCreation(this.gameid);
                }, {gameid : game.id}
            ));
            
            
            $newroomp.append($newrooma);
            $rooms.append($newroomp);
        }
        
        if (game.invite) {
            var $newplayerp = $('<p class="bottomLinks" />');
            
            var $newplayera = $('<a class="language textLink" data-langhtml="_GAMESINVITE_" />');
            $newplayera.bind("click", window.app.emulateBind(
                function () {
                    window.app.ui.gameui.inviteui.openForm(this.gameid);
                }, {gameid : game.id}
            ));
            
            $newplayerp.append($newplayera);
            $rooms.append($newplayerp);
        }
        
        $game.append($rooms);
        
        return $game;
    };
    
    this.createList = function ($list) {
        $list.empty();
        
        var gamelist = window.app.gamedb.gamelist;
        
        for (var i = 0; i < gamelist.length; i++) {
            $list.append(
                this.createGame(
                    window.app.gamedb.getGame(gamelist[i])
                )
            );
        }
        
        window.app.ui.language.applyLanguageOn($list);
    };
}



//<div id="gameID" class="gameDiv">
//    <a class="right button delete language" data-langtitle="_GAMESDELETE_"></a>
//    <a class="right button options language" data-langtitle="_GAMESOPTIONS_"></a>
//    <span class="button paraButton language" data-langtitle="_GAMESOPENCLOSE_" onclick="$(this).toggleClass('toggled');">
//        <a class="left button openclose"></a>
//        <span>Um nome muito comprido mesmoeim</span>
//    </span>
//    <div>
//        <p class="creatorP"><span class='language' data-langhtml='_GAMESCREATORTOOLTIP_'></span>: Criador#IIID</p>
//
//        <p class="language noRooms" data-langhtml="_GAMESNOROOMS_"></p>
//
//        <p class="selectable hoverMark">
//            <a class="language" data-langtitle="_GAMESJOINROOM_">
//                012345678901234567890123456789
//            </a>
//            <a class="language right delete button" data-langtitle="_GAMESDESTROYROOM_"></a>
//            <a class="language right options button" data-langtitle="_GAMESROOMOPTIONS_"></a>
//        </p>
//
//        <hr />
//        <p><a class="language" data-langhtml="_GAMESNEWROOM_"></a></p>
//        <h1>Logs</h1>
//
//        <p class="language noLogs" data-langhtml="_GAMESNOLOGS_"></p>
//
//        <p class="selectable hoverMark">
//            <a class="language" data-langtitle="_GAMESJOINROOM_">
//                012345678901234567890123456789
//            </a>
//            <a class="language right delete button" data-langtitle="_GAMESDESTROYLOG_"></a>
//            <a class="language right options button" data-langtitle="_GAMESLOGPERMISSIONS_"></a>
//        </p>
//
//    </div>
//</div> 
 
function GameInvite$ () {
    /**
     * 
     * @param {Invite} invite
     * @returns {jQuery}
     */
    this.$createInvite = function (invite) {
        var $invite = $('<div />');
        
        var $nameline = $('<p class="nameLine" />');
        $nameline.append("<strong class='language' data-langhtml='_INVITESGAME_'></strong>")
                 .append(": ")
                 .append(
            $('<span />').text(invite.gamename)
        );

        var $aaccept = $('<a class="language textLink" data-langhtml="_GAMESMYINVITESACCEPT_" />');
        $aaccept.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.gameui.inviteui.acceptInvite(this.gameid, this.$div);
            }, {gameid : invite.gameid, $div : $invite}
        ));

        var $areject = $('<a class="language textLink" data-langhtml="_GAMESMYINVITESREJECT_" />');
        $areject.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.gameui.inviteui.rejectInvite(this.gameid, this.$div);
            }, {gameid : invite.gameid, $div : $invite}
        ));

        $nameline.append(" - ").append($aaccept).append(" | ").append($areject);
        
        $invite.append($nameline);
        
        
        var $creatorline = $('<p />');
        //<p><span class="language" data-langhtml="_GAMESMYINVITESCREATOR_"></span>: Nome#Sufix</p>
        $creatorline.append($('<strong class="language" data-langhtml="_GAMESMYINVITESCREATOR_" />'));
        $creatorline.append(': ' + invite.creatornick + '#' + invite.creatornicksufix);
        
        $invite.append($creatorline);
        
        if (invite.message === "") {
            $invite.append($('<p class="inviteMessage language" data-langhtml="_GAMESMYINVITESNOMESSAGE_" />'));
        } else {
            $invite.append($('<p class="inviteMessage" />').text(invite.message));
        }
        
        return $invite;
    };
    
    /**
     * 
     * @param {Array} inviteList
     * @param {jQuery} $list
     * @returns {undefined}
     */
    this.appendInvites = function (inviteList, $list) {
        $list.empty();
        for (var i = 0; i < inviteList.length; i++) {
            $list.append(this.$createInvite(inviteList[i]));
        }
        if (inviteList.length === 0) {
            $list.append("<p class='language' data-langhtml='_INVITESNOINVITES_'></p>");
        }
        window.app.ui.language.applyLanguageOn($list);
    };
}

//<div>
//    <p class="nameLine">
//        <span>Nome do Jogo</span>
//        <a class="language" data-langhtml="_GAMESMYINVITESACCEPT_"></a>
//        <a class="language" data-langhtml="_GAMESMYINVITESREJECT_"></a>
//    </p>
//    <p><span class="language" data-langhtml="_GAMESMYINVITESCREATOR_"></span>: Nome#Sufix</p>
//    <p class="inviteMessage">
//            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
//
//    </p>
//</div> 
 
/**
 * @returns {GameInviteUI}
 */
function GameInviteUI () {
    this.gameid = null;
    
    this.$ = new GameInvite$();
    
    // Elements
    this.$inviteinput;
    this.$messageinput;
    this.$keepgoing;
    this.$error401;
    this.$error404;
    this.$error500;
    this.$error;
    this.$success;
    this.$currentgame;
    
    this.$invitelist;
    this.$identifier;
    
    this.openForm = function (gameid) {
        this.gameid = gameid;
        var game = window.app.gamedb.getGame(gameid);
        if (game === null) {
            this.$currentgame.attr('data-langp', '?????');
        } else {
            this.$currentgame.attr('data-langp', game.name);
        }
        window.app.ui.language.applyLanguageTo(this.$currentgame);
        window.app.ui.callLeftWindow('gamesInviteWindow');
    };
    
    this.submitCreation = function () {
        this.$error.hide();
        this.$error404.hide();
        this.$error401.hide();
        this.$error500.hide();
        this.$success.hide();
        
        window.app.ui.blockLeft();
        var cbs = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$success.show();
                this.$input.val('');
                this.$message.val('');
                if (!this.$keepgoing.is(':checked')) {
                    window.app.ui.gameui.callSelf();
                }
            }, {$success : this.$success, $input : this.$inviteinput,
                $message : this.$messageinput, $keepgoing : this.$keepgoing}
        );

        var cbe = window.app.emulateBind(
            function (data) {
                window.app.ui.unblockLeft();
                if (data.status === 404) {
                    this.$error404.show();
                } else if (data.status === 401) {
                    this.$error401.show();
                } else if (data.status === 500) {
                    this.$error500.show();
                } else {
                    this.$error.show();
                }
            }, {$error : this.$error, $error404 : this.$error404, $error500 : this.$error500,
                $error401 : this.$error401}
        );

        var val = this.$inviteinput.val();
        var message = this.$messageinput.val();
        var nick = val.split('#');
        if (nick.length !== 2) {
            cbe({status:404});
            return false;
        }
        
        window.app.gameapp.sendInvite(this.gameid, nick[0], nick[1], message, cbs, cbe);
    };
    
    this.callMyInvites = function () {
        window.app.ui.callLeftWindow('gamesMyInvitesWindow');
        this.$invitelist.empty().hide();
        window.app.ui.blockLeft();
        
        var user = window.app.loginapp.user;
        if (user === null) {
            this.$identifier.attr("data-langp", "?");
        } else {
            this.$identifier.attr("data-langp", user.nickname + '#' + user.nicknamesufix);
        }
        window.app.ui.language.applyLanguageTo(this.$identifier);
        
        var cbs = window.app.emulateBind(
            function (json) {
                var inviteList = [];
                var invite;
                for (var i = 0; i < json.length; i++) {
                    invite = new Invite();
                    invite.updateFromJSON(json[i]);
                    inviteList.push(invite);
                }
                window.app.ui.unblockLeft();
                this.$.appendInvites(inviteList, this.$list);
                this.$list.fadeIn();
            }, {$ : this.$, $list : this.$invitelist}
        );

        var cbe = window.app.emulateBind(
            function (data) {
                window.app.ui.unblockLeft();
            }, {}
        );

        window.app.gameapp.getInvites(cbs, cbe);
    };
    
    this.init = function () {
        this.$error = $('#inviteErrorDef').hide();
        this.$error401 = $('#inviteError401').hide();
        this.$error404 = $('#inviteError404').hide();
        this.$error500 = $('#inviteError500').hide();
        this.$success = $('#inviteSuccess200').hide();
        this.$currentgame = $('#gamesInviteCurrentGame');
        this.$inviteinput = $('#gamesInviteInput');
        this.$messageinput = $('#gamesInviteMessage');
        this.$keepgoing = $('#gamesInviteKeepGoing');
        this.$invitelist = $('#gamesMyInvitesList');
        this.$identifier = $('#gamesMyInvitesIdentifier');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#gamesInviteForm').on('submit', function () {
            window.app.ui.gameui.inviteui.submitCreation();
        });
        
        $('#gamesInviteListButton').bind('click', function () {
            window.app.ui.gameui.inviteui.callMyInvites();
        });
    };
    
    
    this.acceptInvite = function (gameid, $div) {
        window.app.ui.blockLeft();
        
        var cbs = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$div.remove();
            }, {$div : $div}
        );

        var cbe = function () {
            window.app.ui.unblockLeft();
        };
        
        window.app.gameapp.acceptInvite(gameid, cbs, cbe);
    };
    
    this.rejectInvite = function (gameid, $div) {
        window.app.ui.blockLeft();
        
        var cbs = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$div.remove();
            }, {$div : $div}
        );

        var cbe = function () {
            window.app.ui.unblockLeft();
        };
        
        window.app.gameapp.rejectInvite(gameid, cbs, cbe);
    };
} 
 
function GamePrivilegeUI () {
    this.$gameId = $("#gamePermissionGameID");
    this.$priv = $("#gamePermissionPrivileges");
    this.$error = $("#gamePermissionsError").hide();
    this.$submit = $("#gamePermissionSubmit");
    
    this.gameId = 0;
    this.ids = [];
    
    this.callSelf = function (id) {
        window.app.ui.callLeftWindow("gamePermissionWindow");
        this.gameId = id;
        
        var game = window.app.gamedb.getGame(id);
        this.$gameId.text(game.name);
        this.$error.hide();
        
        window.app.ui.blockLeft();
        
        var cbs = function (data) {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.privui.fill(data);
        };
        
        var cbe = function (data) {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.privui.$error.show();
        };
        
        window.app.gameapp.getPrivileges(id, cbs, cbe);
    };
    
    this.fill = function (json) {
        this.ids = [];
        this.$priv.empty();
        
        json.sort(function (a,b) {
            var na = (a.nickname + "#" + a.nicknamesufix).toUpperCase();
            var nb = (b.nickname + "#" + b.nicknamesufix).toUpperCase();
            
            if (na < nb) return -1;
            if (nb < na) return 1;
        });
        
        for (var i = 0; i < json.length; i++) {
            this.ids.push(json[i].userid);
            this.addUser(json[i]);
        }
    };
    
    this.addUser = function (user) {
        // userid
        // nickname
        // nicknamesufix
        // createSheet
        // editSheet
        // viewSheet
        // invite
        
        var $name = $("<span />").text(user.nickname + "#" + user.nicknamesufix).addClass("name");
        var $p = $("<p />").append($name);
        
        //CRIAR FICHA
        var $createSheet = $("<span />");
        var $label = $("<label />").attr("for", "create" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONCREATE_")
                            .addClass("gamePermIconCreate");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "create" + user.userid);
        $input[0].checked = user.createSheet;
                    
        $createSheet.append($label, $input);
        $p.append($createSheet);
        
        //VIEW FICHA
        var $viewSheet = $("<span />");
        var $label = $("<label />").attr("for", "view" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONVIEW_")
                            .addClass("gamePermIconView");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "view" + user.userid);
        $input[0].checked = user.editSheet;
                    
        $viewSheet.append($label, $input);
        $p.append($viewSheet);
        
        //EDITAR FICHA
        var $editSheet = $("<span />");
        var $label = $("<label />").attr("for", "edit" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONEDIT_")
                            .addClass("gamePermIconEdit");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "edit" + user.userid);
        $input[0].checked = user.editSheet;
                    
        $editSheet.append($label, $input);
        $p.append($editSheet);
        
        //INVITE
        var $invite = $("<span />");
        var $label = $("<label />").attr("for", "invite" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONINVITE_")
                            .addClass("gamePermIconInvite");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "invite" + user.userid);
        $input[0].checked = user.invite;
                    
        $invite.append($label, $input);
        $p.append($invite);
        
        
        var $kick = $("<a />").addClass("textButton").addClass("language").attr("data-langhtml", "_GAMEPERMISSIONKICK_");
        $p.append($kick);
        
        
        
        window.app.ui.language.applyLanguageOn($p);
        this.$priv.append($p);
    };
} 
 
function GameUI () {
    this.$ = new Game$();
    this.inviteui = new GameInviteUI();
    this.roomui = new RoomUI();
    this.privui = new GamePrivilegeUI();
    
    this.edit = null;
    
    this.$nickobj;
    this.$list;
    this.$createbutton;
    
    this.$error;
    this.$deleteError;
    this.$loadError;
    this.$form;
    this.$formname;
    this.$formdesc;
    this.$formfreejoin;
    this.$formsubmit;
    this.$header;
    
    this.init = function () {
        window.app.loginapp.addLoginListener(this);
        
        this.$nickobj = $('#gamesNickInformant');
        this.$list = $('#gamesList');
        this.$createbutton = $('#gamesNewGameButton');
        this.$header = $('#newgameHeader');
        
        this.$error = $('#newGameError');
        this.$deleteError = $('#gamesDeleteError');
        this.$loadError = $('#gamesLoadError');
        this.$form = $('#createGameForm');
        this.$formname = $('#CGName');
        this.$formdesc = $('#CGDesc');
        this.$formfreejoin = $('#CGFreejoin');
        this.$formsubmit = $('#createGameSubmit');
        
        this.inviteui.init();
        this.roomui.init();
        
        this.$deleteError.hide();
        this.$loadError.hide();
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#callGamesWindowBt').bind('click', function () {
            window.app.ui.gameui.callSelf();
        });
        
        this.$createbutton.bind('click', function () {
            window.app.ui.gameui.callCreation();
        });
        
        this.bindForm();
    };
    
    this.bindForm = function () {
        this.$form.bind('submit', window.app.emulateBind(function () {            
            this.$formname.removeClass('error');
            var Validation = new FormValidator(this.$form);
            if (!Validation.validated) {
                this.$formname.addClass('error');
                return false;
            }
            
            window.app.ui.blockLeft();
            
            var obj = {};
            obj.name = this.$formname.val();
            obj.desc = this.$formdesc.val();
            obj.freejoin = this.$formfreejoin.is(':checked');
            
            var cbs = function () {
                window.app.ui.gameui.callSelf();
                window.app.ui.unblockLeft();
            };
            
            console.log(this.$error);
            
            var cbe = window.app.emulateBind(
                function () {
                    window.app.ui.unblockLeft();
                    this.$error.show();
                }, {
                    $error : this.$error
                }
            );
            
            
            if (this.base.edit !== null) {
                obj.id = this.base.edit;
                window.app.gameapp.editGame(obj, cbs, cbe);
            } else {
                window.app.gameapp.createGame(obj, cbs, cbe);
            }
        }, {$formname : this.$formname, $form : this.$form, $formdesc : this.$formdesc,
            $formfreejoin : this.$formfreejoin, $error : this.$error, base : this,
            $loadError : this.$loadError})
        );
    };
    
    this.callCreation = function () {
        // empty the form
        this.edit = null;
        this.$header.attr("data-langhtml", "_NEWGAMEHEADER_");
        this.$formsubmit.attr("data-langvalue", "_SENDNEWGAME_");
        window.app.ui.language.applyLanguageTo(this.$header);
        window.app.ui.language.applyLanguageTo(this.$formsubmit);
        this.$error.hide();
        this.$formdesc.val('');
        this.$formname.val('');
        this.$formfreejoin.attr('checked', false);
        // call window
        window.app.ui.callLeftWindow('createGameWindow');
    };
    
    this.callEdit = function (id) {
        var game = window.app.gamedb.getGame(id);
        
        if (game === null) {
            alert(window.app.ui.language.getLingo("_INVALIDGAME_"));
            return;
        }
        
        this.$error.hide();
        
        this.edit = id;
        
        this.$header.attr("data-langhtml", "_EDITGAMEHEADER_");
        this.$formsubmit.attr("data-langvalue", "_SENDEDITGAME_");
        window.app.ui.language.applyLanguageTo(this.$header);
        window.app.ui.language.applyLanguageTo(this.$formsubmit);
        this.$formdesc.val(game.description);
        this.$formname.val(game.name);
        this.$formfreejoin.attr('checked', game.freejoin);
        // call window
        window.app.ui.callLeftWindow('createGameWindow');
    };
    
    this.callSelf = function () {
        this.$loadError.hide();
        this.$list.finish().fadeOut(100);
        this.$createbutton.finish().fadeOut(100);
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.refreshWindow();
        };
        var cbe = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.$loadError.show();
        };
        window.app.gameapp.updateLists(cbs, cbe);
        window.app.ui.blockLeft();
        window.app.ui.callLeftWindow("gamesWindow");
    };
    
    this.refreshWindow = function () {
        this.$list.finish();
        this.$createbutton.finish();
        this.$.createList(this.$list);
        this.$list.finish().fadeIn(200);
        this.$createbutton.finish().fadeIn(200);
    };
    
    this.deleteGame = function (id) {
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.callSelf();
        };
        
        var cbe = function () {
            this.$error.show();
            window.app.ui.unblockLeft();
        };
        
        window.app.ui.blockLeft();
        window.app.gameapp.deleteGame(id, cbs, cbe);
    };
    
    this.deleteRoom = function (id) {
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.callSelf();
        };
        
        var cbe = function () {
            window.app.ui.gameui.$error.show();
            window.app.ui.unblockLeft();
        };
        
        window.app.ui.blockLeft();
        window.app.roomapp.deleteRoom(id, cbs, cbe);
    };
    
    this.loginChanged = function () {
        var nickname = window.app.loginapp.user.nickname + '#' + window.app.loginapp.user.nicknamesufix;
        this.$nickobj.attr('data-langp', nickname);
        window.app.ui.language.applyLanguageTo(this.$nickobj);
    };
    
    this.invitePlayers = function (gameId) {
        alert("Invite for gameId");
    };
    
    this.leaveGame = function (gameId) {
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.callSelf();
        };
        
        var cbe = function () {
            window.app.ui.gameui.$error.show();
            window.app.ui.unblockLeft();
        };
        
        window.app.ui.blockLeft();
        window.app.gameapp.leaveGame(gameId, cbs, cbe);
    };
} 
 
function RoomUI () {
    this.gameid = null;
    this.$window;
    this.$error;
    this.$form;
    this.$currentgame;
    this.$nameinput;
    this.$descinput;
    this.$privateinput;
    this.$streaminput;
    this.$pbpinput;
    
    this.init = function () {
        this.$window = $('#createRoomWindow');
        this.$form = $('#createRoomForm');
        this.$error = $('#newRoomError').hide();
        
        this.$nameinput = $('#NRName');
        this.$descinput = $('#NRDesc');
        this.$privateinput = $('#NRPrivate');
        this.$streaminput = $('#NRStreamable');
        this.$currentgame = $('#CRCurrentGame');
        this.$pbpinput = $('#NRPBP');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        this.$form.on('submit', window.app.emulateBind(
            function () {
                this.roomui.submitCreation();
            }, {roomui : this}
        ));
    };
    
    this.submitCreation = function () {
        this.$form.find('.error').removeClass('error');
        this.$error.hide();
        var valid = new FormValidator(this.$form);
        if (!valid.validated) {
            for (var i = 0; i < valid.$errors.length; i++) {
                valid.$errors[i].addClass('error');
            }
            return false;
        }
        
        window.app.ui.blockLeft();
        
        var obj = {
            name : this.$nameinput.val(),
            description : this.$descinput.val(),
            private: this.$privateinput.is(':checked'),
            streamable : this.$streaminput.is(':checked'),
            playbypost : this.$pbpinput.is(':checked'),
            gameid : this.gameid
        };
        
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.callSelf();
        };
        
        var cbe = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$error.show();
            }, {$error : this.$error}
        );
        
        window.app.roomapp.createRoom(obj, cbs, cbe);
    };
    
    this.openCreation = function (gameid) {
        this.gameid = gameid;
        var game = window.app.gamedb.getGame(this.gameid);
        if (game === null) {
            this.$currentgame.attr('data-langp', '????');
        } else {
            this.$currentgame.attr('data-langp', game.name);
        }
        window.app.ui.language.applyLanguageTo(this.$currentgame);
        this.cleanUpCreation();
        window.app.ui.callLeftWindow('createRoomWindow');
    };
    
    this.cleanUpCreation = function () {
        this.$form.find('.error').removeClass('error');
        this.$error.hide();
        this.$streaminput.removeAttr('checked');
        this.$privateinput.removeAttr('checked');
        this.$nameinput.val('');
        this.$descinput.val('');
    };
} 
 
function ImageUI () {
    
    $('#openImagesBt').bind('click', function () {
        window.app.ui.imageui.callSelf();
    });
    
    $('#imageUpload').on('submit', function (e) {
        e.preventDefault();
        window.app.ui.imageui.submitUpload();
    });
    
    this.$imageLinkSave = $('#imageLinkSave').on('click', function () {
        window.app.ui.imageui.saveStorage();
    });
    
    this.$imageFileList = $("#imageFileList");
    
    this.$corsError = $('#imageCorsError').hide();
    
    this.$imageList = $('#imageList');
    this.$linkList = $('#imageLinkList');
    
    this.$imageUpload = $('#imageRadioUpload').on('change', function () {
        window.app.ui.imageui.updateForm();
    });
    
    this.$imageLink = $('#imageRadioLink').on('change', function () {
        window.app.ui.imageui.updateForm();
    });
    
    this.$linkForm = $('#imagesLink').unhide();
    this.$uploadForm = $('#imagesUpload').hide();
    
    this.$linkName = $('#imagesLinkName');
    this.$linkLink = $('#imagesLinkLink');
    this.$linkFolder = $('#imagesLinkFolder');
    this.$linkisList = $('#imagesLinkList');
    
    this.lastFolder = null;
    
    this.$storageUsed = $("#imagesStorageUsed");
    this.$storageText = {
        left : $("#imagesStorageLeft"),
        right : $("#imagesStorageRight")
    };
    
    this.updateForm = function () {
        if (this.$imageLink[0].checked) {
            this.$linkForm.unhide();
            this.$uploadForm.hide();
        } else {
            this.$linkForm.hide();
            this.$uploadForm.unhide();
        }
    };
    
    this.submitUpload = function () {
        this.$corsError.hide();
        if (this.$imageLink[0].checked) {
            if (this.$linkisList[0].checked) {
                var ajax = new ImageAjax();
                var cbs = function () {
                    window.app.ui.unblockRight();
                    window.app.ui.imageui.$linkLink.val('');
                    window.app.ui.imageui.$corsError.hide();
                    window.app.ui.imageui.fillLists(true);
                    window.app.ui.imageui.$linkName.val('').focus();
                };
                var cbe = function () {
                    window.app.ui.unblockRight();
                    window.app.ui.imageui.$corsError.unhide();
                };
                
                window.app.ui.blockRight();
                ajax.grabLinks(this.$linkLink.val().trim(), this.$linkFolder.val().trim(), cbs, cbe);
                return;
            }
            var imagem = window.app.imagedb.createLink();
            imagem.name = this.$linkName.val().trim();
            imagem.url = this.$linkLink.val().trim();
            imagem.url = window.app.imageapp.prepareUrl(imagem.url);
            imagem.folder = this.$linkFolder.val().trim();
            
            if (imagem.name === '' || imagem.url === '') return false;
            
            window.app.imagedb.addImage(imagem);
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
            this.$linkName.val('').focus();
            this.$linkLink.val('');
        } else {
            var cbs = function () {
                window.app.ui.unblockRight();
                window.app.ui.imageui.callSelf();
            };
            var cbe = function (data) {
                alert(JSON.stringify(data));
                window.app.ui.unblockRight();
            };
            var data = new FormData();
            for (var i = 0; i < this.$imageFileList[0].files.length; i++) {
                data.append('file' + i, this.$imageFileList[0].files[i]);
            }
            
            window.app.ui.blockRight();
            window.app.imageapp.uploadImage(data, cbs, cbe);
        }
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('imageWindow');
        window.app.imagedb.empty();
        
        this.loaded = 0;
        
        var cbs = function (data) {
            window.app.ui.imageui.fillLists();
            window.app.ui.unblockRight();
            window.app.ui.imageui.setupSpaceBar(data['space']);
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            alert("Error");
        };
        
        window.app.ui.blockRight();
        
        window.app.imageapp.updateDB(cbs, cbe);
        //window.app.imagedb.updateStorage(cbs, cbe);
    };
    
    /**
     * 
     * @param {Image|Image_Link} image
     * @returns {undefined}https://www.dropbox.com/sh/po2ei0qatw6y0ds/AACGl-Cmdh4UCSGWnZu5p5PSa?dl=0
     */
    this.$createImage = function (image) {
        var $image = $("<p class='image' />").text(image.name);
        
        // Visualizar
        var $view = $('<a class="uiconView floatLeft button language" data-langtitle="_IMAGESOPEN_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.pictureui.open(this.url);
        }, {url : image.getUrl()}));
        $image.append($view);
        
        // Compartilhar
        var $share = $('<a class="uiconShare floatLeft button language" data-langtitle="_IMAGESSHARE_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.shareImage(this.image);
        }, {image : image}));
        $image.append($share);
        
        // Persona
        var $persona = $('<a class="uiconPerson floatLeft button language" data-langtitle="_IMAGESPERSONA_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.personaImage(this.image);
        }, {image : image}));
        $image.append($persona);
        
        // Deletar
        var $delete = $('<a class="uiconDelete floatRight button language" data-langtitle="_IMAGESDELETE_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.deleteImage(this.id);
        }, {id : image.getId()}));
        $image.append($delete);

        // Folder
        var $folder = $('<a class="uiconFolder floatRight button language" data-langtitle="_IMAGESFOLDER_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.editFolder(this.id, window.prompt(window.app.ui.language.getLingo("_IMAGESFOLDERPROMPT_") + ":"));
        }, {id : image.getId()}));
        $image.append($folder);

        if (!image.isLink()) {
            // Cloud
            $image.append($('<a class="uiconCloud floatRight button language" data-langtitle="_IMAGESCLOUD_" />'));
        }
        
        return $image;
    };
    
    this.editFolder = function (id, folder) {
        this.lastFolder = window.app.imagedb.getImage(id).folder;
        if (id < 0) {
            window.app.imagedb.getImage(id).folder = folder;
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
        } else {
            var data = {
                uuid : id,
                folder : folder,
                name : window.app.imagedb.getImage(id).name
            };
            window.app.ui.blockRight();
            var cbs = function () {
                window.app.ui.unblockRight();
                window.app.ui.imageui.callSelf();
            };
            var cbe = function () {
                alert("ERROR");
                window.app.ui.unblockRight();
            };
            window.app.imageapp.updateImage (data, cbs, cbe);
        }
    };
    
    this.deleteImage = function (id) {
        var image = window.app.imagedb.getImage(id);
        this.lastFolder = image.folder;
        if (id < 0) {
            window.app.imagedb.deleteImage(id);
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
        } else {
            window.app.ui.blockRight();
            var cbs = function () {
                window.app.ui.unblockRight();
                window.app.ui.imageui.callSelf();
            };
            var cbe = function () {
                alert("Error");
                window.app.ui.unblockRight();
            };
            window.app.imageapp.deleteImage(id, cbs, cbe);
        }
    };
    
    this.saveStorage = function () {
        var cbs = function () {
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            alert("Error");
        };
        
        window.app.ui.blockRight();
        
        window.app.imagedb.saveStorage(cbs, cbe);
    };
    
    this.lastImages = "";
    this.fillLists = function () {
        var $foldersLink = {};
        var $foldersUpload = {};
        
        var images = window.app.imagedb.imagesOrdered;
        var imagesJson = JSON.stringify(images);
        if (imagesJson === this.lastImages) return false;
        
        this.lastImages = imagesJson;
        this.$linkList.empty();
        this.$imageList.empty();
        var $folderLink;
        var $image;
        var folder;
        for (var i = 0; i < images.length; i++) {
            $image = this.$createImage(images[i]);
            folder = images[i].folder;
            if (folder === '') folder = window.app.ui.language.getLingo('_IMAGESNOFOLDER_');
            if (this.lastFolder === '') this.lastFolder = window.app.ui.language.getLingo('_IMAGESNOFOLDER_');
            if ($foldersLink[images[i].folder] === undefined) {
                $folderLink = $("<p class='folder' />").text(folder).on('click', function () {
                    $(this).toggleClass('toggled');
                }).append($("<a />").addClass('uiconFolderButton'));
                if (folder === this.lastFolder) {
                    $folderLink.addClass('toggled');
                }
                $foldersLink[images[i].folder] = $('<div />');
                this.$linkList.append($folderLink).append($foldersLink[images[i].folder]);
            }
            $foldersLink[images[i].folder].append($image);
        }
        
        window.app.ui.language.applyLanguageOn(this.$linkList);
        window.app.ui.language.applyLanguageOn(this.$imageList);
    };
    
    this.shareImage = function (image) {
        var message = new Message();
        message.module = 'image';
        message.msg = image.getUrl();
        message.setSpecial('name', image.name.replace(/ *\([^)]*\) */, '').trim());
        window.app.chatapp.fixPrintAndSend(message, true);
    };
    
    this.personaImage = function (image) {
        window.app.ui.chat.pc.addPersona(image.getName().replace(/ *\([^)]*\) */, '').trim(), image.getUrl(), false);
    };
    
    this.setupSpaceBar = function (json) {
        //{"TotalSpace":10240,"UsedSpace":1024,"FreeSpace":5242880}
        var used = json.UsedSpace / (1024 * 1024);
        used = +(used.toFixed(2));
        var total = ((json.TotalSpace + json.FreeSpace) / (1024 * 1024));
        total = +(total.toFixed(2));
        this.$storageText.left.text(used + " MB");
        this.$storageText.right.text(total + " MB");
        if (total > 0) {
            this.$storageUsed.css("width", (used * 100 / total) + "%");
        } else {
            this.$storageUsed.css("width", "100%");
        }
    };
} 
 
function IntroUI () {
    this.$intro = $("#intro").on('click', function () {
        window.app.ui.intro.$intro.fadeOut(250);
        window.app.memory.setMemory("seenIntro", 1);
    }).hide();;
    
    this.init = function () {
        window.app.ui.loginui.onLogin(function () {
            window.app.ui.intro.update();
        });
    };
    
    this.update = function () {
        if (window.app.memory.getMemory("seenIntro", 0) === 0 && !window.app.ui.$leftWindow.hasClass("fullScreen")) {
            this.$intro.show();
        } else {
            this.$intro.hide();
        }
    };
} 
 
/**
 * @class Language
 * @constructor
 * @returns {Language}
 */
function Language () {
    /**
     * Generates clickable flags to change language.
     * @returns {String} html
     */
    this.createFlags = function () {
        var html = '';
        for (var language in window.lingo) {
            html += "<a class='" + language + 
                    "_Flag' title=\"" + 
                    window.lingo[language]['_LANGUAGENAME_'] + 
                    "\" onclick=\"" +
                    "window.app.ui.language.changeLanguage('" +
                    language +
                    "');\"></a>";
        }
        return html;
    };
    
    /**
     * Implements abstract.
     * Applies language on init.
     * @returns {void}
     */
    this.init = function () {
        window.app.config.registerConfig("language", this);
        this.configChanged();
    };
    
    this.configValidation = function (id, value) {
        if (id === 'language' && typeof value === 'string') {
            if (typeof window.lingo[value] !== 'undefined') {
                return true;
            }
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'language') {
            var language = this.getNavigator();
            if (typeof window.lingo[language] !== 'undefined') {
                return language;
            }
            return "pt_br";
        }
    };
    
    this.getNavigator = function () {
        var language = navigator.language.toLowerCase();
        language = language.replace('-', '_');
        if (typeof window.lingo[language] === 'undefined' && language.indexOf('_') !== -1) {
            language = language.split('_')[0];
        }
        return language;
    };
    
    /**
     * Finds text value for String id in current language and returns it.
     * If not found, will return id itself.
     * @param {String} id
     * @returns {String}
     */
    this.getLingo = function (id) {
        if (typeof window.lingo[this.currentlang] !== 'undefined') {
            if (typeof window.lingo[this.currentlang][id] !== 'undefined') {
                return window.lingo[this.currentlang][id];
            }
        }
        return id;
    };
    
    this.getLingoOn = function (id, p) {
        if (typeof window.lingo[this.currentlang] !== 'undefined') {
            if (typeof window.lingo[this.currentlang][id] !== 'undefined') {
                return window.lingo[this.currentlang][id].replace(new RegExp("%p", "g"), p);
            }
        }
        return id;
    };
    
    /**
     * Changes current language and applies it to page immediately.
     * @param {String} lang
     * @returns {void}
     */
    this.changeLanguage = function (lang) {
        window.app.config.store("language", lang);
    };
    
    /**
     * Searches document for language elements and calls applyLanguageTo on each of them.
     * Elements need to be wrapped with a tag, any tag.
     * @returns {void}
     */
    this.applyLanguage = function () {
        $('.language').each(function() {
            var $this = $(this);
            window.app.ui.language.applyLanguageTo($this);
        });
        
        $('#formPaypalButton').attr('src', 'img/home/paypal_' + this.currentlang + '.gif').off('error.Language').on('error.Language', function () {
            $(this).attr('src', 'https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif').off('error.Language');
        });
    };
    
    this.replaceOnString = function (string) {
        var $string = $('<div />').html(string);
        this.applyLanguageOn($string);
        return $string.html();
    };
    
    this.workString = function (string) {
        var $elem = $('<div />');
        $elem.html(string);
        this.applyLanguageOn($elem);
        return $elem.html();
    };
    
    /**
     * Applies language to language elements _inside_ jQuery element $this.
     * 
     * @example
     *    var $teste = $('<div />');
     *    $teste.append ($('<p class="language" data-langhtml="_SUPERTEST_"></p>'));
     *    $teste.append($('<p class="language" data-langhtml="_SUPERTESTE2_"></p>'));
     *    window.app.ui.language.applyLanguageOn($teste);
     *    $('#areaChatBox').html('').append($teste.html());
     *    
     * @param {jQuery} $this
     * @returns {void}
     */
    this.applyLanguageOn = function ($this) {
        $this.find('.language').each(function() {
            window.app.ui.language.applyLanguageTo($(this));
        });
        
        if ($this.hasClass('language')) {
            window.app.ui.language.applyLanguageTo($this);
        }
    };
    
    /**
     * Applies current language to jQuery element $this.
     * Should be called on creation of a language element that is about to be added to the page.
     * Element should still have language markers - if language is changed it needs to be updated.
     * @param {jQuery} $this
     * @returns {void}
     */    
    this.applyLanguageTo = function ($this) {
        // HTML
        if ($this.is("[data-langhtml]")) {
            var langhtml = $this.attr('data-langhtml');
            langhtml = window.app.ui.language.getLingo(langhtml);
            var replacers = ['p', 'd'];
            for (var index = 0; index < replacers.length; ++index) {
                if ($this.is("[data-lang"+replacers[index]+"]")) {
                    langhtml = langhtml.replace(new RegExp("%"+replacers[index], "g"), $this.attr("data-lang"+replacers[index]));
                }
            }
            $this.html(langhtml);
        }
        
        // TITLE
        if ($this.is("[data-langtitle]")) {
            var langtitle = $this.attr('data-langtitle');
            $this.attr('title', window.app.ui.language.getLingo(langtitle));
        }
        
        // LABEL
        if ($this.is("[data-langlabel]")) {
            var langlabel = $this.attr('data-langlabel');
            $this.attr('label', window.app.ui.language.getLingo(langlabel));
        }
        
        // PLACEHOLDER
        if ($this.is("[data-langplaceholder]")) {
            var langplaceholder = $this.attr('data-langplaceholder');
            $this.attr('placeholder', window.app.ui.language.getLingo(langplaceholder));
        }
        
        // PLACEHOLDER
        if ($this.is("[data-langvalue]")) {
            var langvalue = $this.attr('data-langvalue');
            $this.attr('value', window.app.ui.language.getLingo(langvalue));
        }
    };
    
    
    this.configChanged = function () {
        var language = window.app.config.get("language");
        this.currentlang = language;
        this.applyLanguage();
    };
}

if (window.lingo === undefined) window.lingo = {}; 
 
if (window.lingo === undefined) window.lingo = {};
window.lingo['en'] = {
    _LANGUAGENAME_ : 'English',
    
    _NEWMESSAGES_ : 'Messages',
    
    _LEAVING_ : 'Are you sure you want to quit?',
    _CONFIRMLOGOUT_ : 'Are you sure you want to logout?',
    _GOFULL_ : 'View application in full screen?',
    
    /* Intro */
    _INTROEXPLANATION1_ : "Move your mouse over the corners to bring up the menus.",
    _INTROEXPLANATION2_ : "Click anywhere to close this message.",
    
    /* Home */
    _HOMETITLE_ : 'RedPG',
    _HOMEEXPLAIN1_ : 'RedPG is meant to assist those wishing to play tabletop role-playing games over the internet. It is able to share Pictures, Sounds, Sheets, has rooms for everyone to talk, with dices and many more, with new functions always being added.',
    _HOMEEXPLAIN2_ : 'Everything is attached to a Table, the way the system sees a Group. Therefore, to create Sheets or anything or to use the system in any way, you will have to either create a Table or get Invited to one. You can do this through the "Tables" menu at your left.',
    _HOMELINKS_ : "Useful Links",
    _HOMEFRONTGITHUB_ : 'RedPG Front on GitHub',
    _HOMEFRONTGITHUBBALL_ : 'RedPG Front on GitHub - Direct download',
    _HOMESERVERGITHUB_ : 'RedPG Server on GitHub',
    _HOMEDB_ : 'RedPG.sql',
    _HOMEFRONTGITHUBEXPLAIN_ : 'Offline version of RedPG Front. Users who wish to run the client from their hard drive need to download this. The offline version also allows a group to share and play sounds inside the "Sounds" folder, not requiring an external server for them.',
    _HOMEFRONTGITHUBBALLEXPLAIN_ : 'Same as the one above, just a direct download link.',
    _HOMESERVERGITHUBEXPLAIN_ : 'RedPG Server Source Code. Those interested in seeing how it works can grab it here.',
    _HOMEDBEXPLAIN_ : 'Empty database dump. Unavailable at the moment.',
    _HOMERULESNAVIGATION_ : 'DFS Rules',
    _HOMERULESNAVIGATIONEXPLAIN_ : 'Rules Website for the Dragon Fantasy Saga system. (Portuguese)',
    _HOMERULESGITHUB_ : 'DFS Rules (Offline)',
    _HOMERULESGITHUBEXPLAIN_ : 'Offline version of the link above',
    
    /* Images */
    
    _IMAGESHEADER_ : 'Images',
    _IMAGESFOLDERPROMPT_ : 'New folder (leave empty for none)',
    _IMAGESCLOUD_ : 'This image has been uploaded and consumes storage space.',
    _IMAGESEXPLAIN1_ : 'Images are attached to your account. The space each account has for images is finite, so caution needs to be exerted when uploading new files.',
    _IMAGESEXPLAIN2_ : 'You can increase your total space through donations which help cover RedPG\'s server costs. If you end up having more images uploaded than your total space allows, they will not be deleted, but you will be unable to upload new images until you bring your usage down.',
    _IMAGESEXPLAIN3_ : 'When printing an image name, as a Persona or in the Chat, anything between parentheses will not be printed.',
    _IMAGESUPLOADED_ : 'Server Images (Not implemented)',
    _IMAGESUPLOADEDEXPLAIN_ : 'Server Images will not be lost between sessions. If you end up having more images uploaded than your total space allows, they will not be deleted, but you will be unable to upload new images until you bring your usage down.',
    _IMAGESLINKED_ : 'Linked Images',
    _IMAGESLINKEDEXPLAIN_ : 'These images are stored as simple storage in the server. They will not be lost, but you have to click "Save to server" to save them.',
    _IMAGESLINKEDSAVE_ : 'Save to server',
    _IMAGESFOLDER_ : 'Folder',
    _IMAGESNOFOLDER_ : 'No folder',
    _IMAGESUPLOAD_ : 'New Upload',
    _IMAGESLINK_ : 'New Link',
    _IMAGESLINKISLIST_ : 'Is a list of images',
    _IMAGESNAME_ : 'Image Name',
    _IMAGESLINKADDRESS_ : 'Image Address',
    _IMAGESUPLOADSUBMIT_ : 'Send',
    _IMAGESDELETE_ : 'Delete',
    _IMAGESSHARE_ : "Share in the current chat",
    _IMAGESPERSONA_ : "Use as Persona",
    _IMAGESOPEN_ : 'Open Image',
    _IMAGESLINKLISTEXPLAIN_ : 'Without checking this, the system will add the address as a single picture. If you check this box, the system will access the address and add every image address it finds there.',
    _IMAGESFILEUPLOADEXPLAIN1_ : 'Uploading images will utilize your storage space.',
    _IMAGESFILEUPLOADEXPLAIN2_ : 'You may upload more than one image at once. Text before a hyphen (-) on file names will be treated as folder names.',
    
    
    /* Sounds */
    _OPENSOUNDS_ : 'Sounds',
    _SOUNDSHEADER_ : 'Sounds',
    _SOUNDSEXPLAIN_ : 'The application will look for sound files in the "Sounds/" folder. You must be using the offline version of the application for it to be able to access them.',
    _SOUNDSEXPLAIN2_ : 'When adding links from another server, the application will be able to play them both from the Offline version and the Online version.',
    _SOUNDSPICKONE_ : 'Choose a folder',
    _SOUNDSFOLDERS_ : 'Folders',
    _SOUNDSNEWFOLDER_ : 'New Folder',
    _SOUNDSNEWSOUNDS_ : 'Add Sounds',
    _SOUNDSSAVESOUNDS_ : 'Save',
    _NEWFOLDERNAME_ : 'New Folder',
    _SOUNDSSUBMITLIST_ : 'Add Files',
    _SOUNDSLINK_ : 'External link',
    _SOUNDSSUBMITLINK_ : 'Send link',
    _SOUNDSOR_ : 'Alternatively, add an external link to the sound file. It must be the file directly or a page which indexes the files.',
    _SHAREMUSIC_ : 'Share',
    _PLAYMUSIC_ : 'Play',
    _TRYCORS_ : 'We weren\'t able to access the link provided. The server might not have been configured properly. You can click here and install an extension that will bypass this error. Remember to activate it before trying again and remember to deactivate it when done.',
    _DELETEMUSIC_ : 'Delete',
    _SOUNDSUSEFILES_ : 'Pick files in "Sounds/"',
    _SOUNDSUSELINK_ : 'Add all sound links in a link',
    _SOUNDSISBGM_ : 'BGM? It\'s a Sound Effect otherwise',
    _SOUNDFOLDERERROR_ : 'To add sounds, you need to specify a folder.',
    
    /* Sheets */
    
    _MSGLOSTHP_ : 'lost HP',
    
    _STYLEBEFOREERROR_ : 'Error in the Before Process section of "%p"',
    _STYLEAFTERERROR_ : 'Error in the After Process section of "%p"',
    _STYLETRIGGERERROR_ : 'Error triggering "%p"',
    
    _SHEETSHEADER_ : 'Sheets',
    _SHEETSEXPLAIN_ : 'Sheets are stored in the system so that everyone can look at the same version of the resource at the same time.',
    _SHEETSEXPLAIN2_ : 'They are normally used to store character information, but can really store any kind of information.',
    _SHEETSEXPLAIN3_ : 'Every Sheet utilizes a "Style", which tells it how it looks and which values it has. Some "Styles" have not been created by an admin and may be unsafe, so be wary of them. Only styles created automatically or by an admin are considered safe.',
    _SHEETSERROR_ : 'There was an error. Try again.',
    _SHEETSNOFOLDER_ : 'No folder',
    _SHEETSSETFOLDER_ : 'Folder',
    _SHEETCHANGEFOLDER_ : 'New folder for "%p":',
    _SHEETHOVERCREATOR_ : 'Creator',
    _SHEETHOVERSTYLECREATOR_ : 'Style designer',
    _SHEETHOVERSTYLE_ : 'Style',
    

    _SHEETSDELETE_ : 'Delete',
    _SHEETSPRIVILEGES_ : 'Privileges',
    _SHEETSAFE_ : 'This sheet utilizes a safe style.',
    _SHEETUNSAFE_ : 'This sheet utilizes an UNSAFE style. Do not open this sheet unless you trust the designer.',
    _SHEETSNAMETITLE_ : 'Click here to open this sheet',
    _SHEETSNOSHEETS_ : 'No sheets to list.',
    _SHEETSNOGAMES_ : 'You aren\'t in any tables. Create a table on the left menu link or accept an invitation to someone\'s table before you can use Sheets.',
    _SHEETSADD_ : 'Create sheet',
    _SHEETSGAMETITLE_ : 'Click here to list all sheets in this table.',
    
    _SHEETCREATIONHEADER_ : 'Create Sheet',
    _SHEETCREATIONNAME_ : "Sheet Name",
    _SHEETCREATIONSUBMIT_ : 'Send',
    _SHEETCREATIONPUBLIC_ : 'Public',
    _SHEETCREATIONPUBLICEXPLAIN_ : 'Public sheets can be seen by all players.',
    
    _SHEETPERMISSIONNHEADER_ : 'Sheet Privileges',
    _SHEETPERMISSIONVIEW_ : 'See',
    _SHEETPERMISSIONEDIT_ : 'Edit',
    _SHEETPERMISSIONDELETE_ : 'Delete',
    _SHEETPERMISSIONPROM_ : 'Promote',
    _SHEETPERMISSIONPROMEXP_ : 'Allows the user to alter sheet privileges',
    _SHEETPERMISSIONSUBMIT_ : 'Send',
    
    _SHEETSAVE_ : 'Save',
    _SHEETEDIT_ : 'Edit',
    _SHEETRELOAD_ : 'Reload values',
    _SHEETFULLRELOAD_ : 'Reload values and style (avoid)',
    _SHEETIMPORT_ : 'Import JSON as values',
    _SHEETEXPORT_ : 'Export values as JSON',
    _SHEETAUTO_ : 'Update Automatically (requires open chat)',
    _SHEETCLOSE_ : 'Close sheet (unsaved changes will be lost)',
    _SHEETHIDEWINDOW_ : 'Hide Window',
    _SHEETIMPORTEXPLAIN_ : 'Paste the JSON code here.',
    _SHEETIMPORTSEND_ : 'Take on new form',
    _SHEETEXPORTEXPLAIN_ : 'JSON code representing the sheet values',
    _SHEETIMPORTERROR_ : 'Invalid JSON code.',
    _SHEETSAVESUCCESSHEADER_ : 'Success',
    _SHEETSAVESUCCESSMESSAGE_ : 'Successfully saved the sheet',
    _SHEETSAVEERRORHEADER_ : 'Error',
    _SHEETSAVEERRORMESSAGE_ : 'Saving the sheet was not possible. Try again.',
    
    _SHEETWASUPDATED_ : 'was updated.',
    _SHEETCLICKTOUPDATE_ : 'Click here to reload.',
    _SHEETCLICKAUTOUPDATEOFF_ : 'Click here to disable automatic reloading.',
    _SHEETCLICKAUTOUPDATEON_ : 'Click here to enable automatic reloading.',
    
    
    /* Login */
    _LOGIN_ : 'E-mail',
    _PASSWORD_ : 'Password',
    _CONFIRMLOGIN_ : 'Login',
    _FORGOTPASSWORD_ : 'Forgot your password?',
    _NEWACCOUNT_ : 'New Account',
    _LOGININVALID_ : "Invalid login.",
    _LOGINCONNECTIONERROR_ : "Connection error. Login failed.",
    _LOGININACTIVE_ : "Your account has not been activated. Please follow the instructions sent to your e-mail.",
    _LOGINTIMEOUT_ : "Your session expired.",
    _CONFIRMSUCCESS_ : 'Your account has been activated.',
    _CONFIRMFAILURE_ : 'There was an error. Click here to try again.',
    
    _CREATEACCOUNTHEADER_ : 'Account Creation',
    _CACONNERROR_ : 'There was an error. Try again later.',
    _CAEMAILERROR_ : 'Your e-mail has already been used. Click here if you haven\'t activated your account yet.',
    _CANICKERROR_ : 'There are already ten thousand accounts with that nickname... You will have to pick another one.',
    _CANAME_ : 'Name',
    _CAEMAIL_ : 'E-mail',
    _CANICK_ : 'Nickname',
    _CAPASSWORD_ : 'Password',
    _CAPASSWORD2_ : 'Password (Again)',
    _CASUBMIT_ : 'Create Account',
    _CANAMEEXPLAIN_ : '3-200 characters. Only Portuguese characters are allowed.',
    _CANAMEHELP_ : 'The name of the account owner. This information will be private.',
    _CAEMAILHELP_ : 'Your e-mail will be your login.',
    _CAEMAILEXPLAIN_ : "The e-mail needs to be valid.",
    _CANICKEXPLAIN_ : "3-12 characters. Only letters and numbers.",
    _CANICKHELP_ : 'Your nickname will be how other users see you.',
    _CAPASSEXPLAIN_ : "3-12 characters. Only letters a-zA-Z and numbers.",
    _CAPASSHELP_ : 'Don\'t forger your password!',
    _CAPASS2EXPLAIN_ : "Must be equal to the one above.",
    _CAAGE_ : 'I am old enough to have the above information stored in this system.',
    _CAAGEEXPLAIN_ : 'We cannot legally store the above information without this.',
    _CAAGEHELP_ : 'In some countries, it is illegal to store minor\'s information. By checking this box, you are saying you are old enough to have the above information stored.',
    
    _CASUC1_ : 'Thank you for creating your account.',
    _CASUC2_ : 'Your account was activated automatically.',
    _CASUC3_ : 'Click here to login.',
    
    /* Menu */
    _HIDELEFTWINDOWS_ : 'Hide windows',
    _CALLCHATWINDOW_ : 'Open Chat',
    _GAMES_ : 'Tables',
    _SETTINGS_ : 'Config',
    _MODULES_ : 'Addons',

    _HIDERIGHTWINDOWS_ : 'Hide windows',
    _SHEETS_ : 'Sheet List',
    _SHEET_ : 'Open Sheets',
    _STYLES_ : 'Styles',
    _MYACCOUNT_ : 'My Account',
    _LOGOUT_ : 'Logout',
    _OPENTHITBOX_ : 'Hitbox Chat!',
    _OPENYOUTUBE_ : 'Video Player',
    _OPENIMAGES_ : 'Images',
    
    /* Picture Show */
    _CLOSEIMAGE_ : 'Click here to close the picture.',

    /* Config */
    _CONFIGHEADER_ : "Settings",
    _CONFIGLANGUAGE_ : 'Language',
    _CHATUSEPROMPT_ : 'Chat input as a button',
    _CHATPROMPT0_ : 'Never',
    _CHATPROMPT1_ : 'Always',
    _CHATPROMPT2_ : 'Only on mobile',
    _CHATPROMPTEXP_ : 'Instead of having the chat message input be an actual input, it becomes a button that calls a prompt. This is useful while on mobile devices without a keyboard attached.',
    _CHATFULLSCREEN_ : 'Single screen mode',
    _CHATFULLSCREEN0_ : 'Only when necessary',
    _CHATFULLSCREEN1_ : 'Always',
    _CHATFULLSCREENEXP_ : 'When the resolution is too low, RedPG will only show one screen at a time. Otherwise, RedPG will show two screens: one to the left side and another to the right side. This option controls this behavior.',
    _AUTOPLAYBGM_ : 'Play BGM Automatically',
    _AUTOPLAYBGM0_ : 'Never',
    _AUTOPLAYBGM1_ : 'Only when sent by a storyteller',
    _AUTOPLAYSE_ : 'Play SE Automatically',
    _AUTOPLAYSE0_ : 'Never',
    _AUTOPLAYSE1_ : 'Only when sent by a storyteller',
    _AUTOPLAYVIDEO_ : 'Play Videos Automatically',
    _AUTOPLAYVIDEO0_ : 'Never',
    _AUTOPLAYVIDEO1_ : 'Only when sent by a storyteller',
    _CONFIGSAVE_ : 'Save',
    _CONFIGERROR_ : 'Error while saving the settings. Please try again.',
    _CONFIGSUCCESS_ : 'Settings saved successfully!',
    _AUTOPLAYBGM2_ : 'Always',
    _AUTOPLAYSE2_ : 'Always',
    _AUTOPLAYVIDEO2_ : 'Always',
    _AUTOPLAYIMAGE_ : 'Show images automatically',
    _AUTOPLAYIMAGE0_ : 'Never',
    _AUTOPLAYIMAGE1_ : 'Only when sent by a storyteller',
    _AUTOPLAYIMAGE2_ : 'Always',
    _CONFIGWSPORT_ : 'Port used in WebSockets',
    _CONFIGWSEXP_ : "You may select which port is used for the WebSocket connections on the Chat. Don't change this value unless it's already not working.",


    /* Room */
    _CHATSYSTEMMESSAGE_ : "System Message",
    _CHATSYSTEMNICK_ : "System",
    _CHATWSCONNECTED_ : 'Connected. Old messages were not printed.',
    _CHATWSNOTALL_ : 'Old messages were hidden.',
    _CHATWSCONNECTING_ : 'Connecting...',
    _CHATWSGETOLDERMESSAGES_ : 'Click here to load older messages.',
    _CHATWSDISCONNECTED_ : 'Disconnected.',
    _CHATWSRECONNECT_ : 'Reconnect.',
    _CHATWSTAKINGLONG_ : 'Server is taking too long to respond.',
    _CHATWSTIMEOUT_ : 'Not receiving server messages. If this problem keeps happening, check if your anti-virus software is not interfering with Websocket communications.',
    _CHATTRANSLATEDAS_ : 'Translation',
    _BASICCOMMANDS_ : 'Basic Commands',
    _ACTIONSAMPLE_ : '"/me [message]": Sends the message as an action of the current Persona.',
    _OFFSAMPLE_ : '"/off [message]": Sends the message as an out of character comment.',
    _ACTUALSAMPLE_ : 'Example: "/me jumps from a bridge."',
    _SHORTCUTS_ : 'Alternatively, you can hold Alt, Shift or Control while sending the message with Enter.',
    _MORECOMMANDS_ : 'To see the full listing of commands, type "/help".',
    _CLEARTIP_ : 'It is possible to use "/clear 1" to delete messages from the server.',
    _SELECTSOUNDS_ : "If you'd like to play Offline music files while still using the Online RedPG, click the form input below and select all the music files you'd like available. This will give RedPG temporary access to the selected files.",
    _INVALIDSLASHCOMMAND_ : '"%p" is not a recognized slash command.',
    _INVALIDSLASHMESSAGE_ : '"%d" is not a valid command for "%p".',
    _CHATLANGINVALID_ : 'The system does not know this language.',
    _CHATLANGUNKNOWN_ : 'You are not allowed to speak this language.',
    _INVALIDMODULE_ : 'A message with module "%p" was received, sent by %d, but you do not have this module. The message was not shown.',
    _INVALIDWHISPER_ : 'No players found for "%p".',
    _TOOMANYWHISPER_ : 'Found too many targets! Found:',
    _WHISPERPICKONE_ : 'Please, add more information to the search...',
    _WHISPERORIGIN_ : 'message from',
    _WHISPERDESTINATION_ : 'message sent to',
    _NICKCHANGE_ : 'Your persona is now "%p".',
    _NICKREMOVED_ : 'You are no longer using personas.',
    _CHATDATE_ : 'Messages from %p',
    _ZEBRAON_ : 'Stripes added to messages in chat.',
    _ZEBRAOFF_ : 'Stripes removed from messages in chat.',
    _STORYNOSTORYTELLER_ : 'Only the storyteller can talk story',
    _STORYTELLERHACK_ : '%p sent a story message, but is not the storyteller. The message was ignored.',
    _CHATCLEARED_ : 'The screen was cleared, but the messages are still there. To clear them permanently, type "/clear 1".',
    _CLEARFAIL_ : 'There was an error while trying to clear the messages from the server. Try again.',
    _DICEWAITING_ : 'Waiting for rolls...',
    _DICEERROR_ : 'There was an error with the roll. Try again.',
    _NODICEREASON_ : 'No reason informed.',
    _NONOTON_ : 'Message notification enabled.',
    _NONOTOFF_ : 'Message notification disabled..',
    _STREAMON_ : 'Streaming mode enabled. Automatic playing of sounds disabled. It is recommended to have automatic picture displaying and automatic video playing set to ON.',
    _STREAMOFF_ : 'Streaming mode disabled. Automatic playing of sounds was enabled. If this is not the right setting for you, please change it in the config..',
    _NOWHISPERSON_ : 'Private messages will no longer be printed.',
    _NOWHISPERSOFF_ : 'Private messages will be printed again.',
    _AUTOSEON_ : 'Sound effects send by the storyteller will be played automatically.',
    _AUTOSEOFF_ : 'Sound effects send by the storyteller will not be played automatically.',
    _PCFNAME_ : 'Persona (Name)',
    _PCFAVATAR_ : 'Avatar (Link)',
    _PCFHIDE_ : 'Do not reveal this persona',
    _PCFSEND_ : 'Create Persona',
    _BUFFAPPLYINGBUFF_ : 'wishes to apply the condition',
    _BUFFAPPLYINGTO_ : "to",
    _BUFFAPPLYINGFROM_ : "applied from",
    _BUFFAPPLYLINK_ : 'Click here to accept.',
    _BUFFAPPLIED_ : "Effect applied",
    _BUFFREMOVED_ : "Effect removed",
    _CURRENTBUFFS_ : "Current conditions on",
    _CURRENTBUFFBY_ : 'by',
    _BUFFREMOVEDFROM_ : 'from',
    
    _POWERBOTTON_ : 'Chat will always scroll to bottom.',
    _POWERBOTTOFF_ : "Chat scrolling returned to default.",

    _HASCONNECTED_ : '%p has connected.',
    _HASDISCONNECTED_ : '%p has disconnected.',
    _CHATRESEND_ : 'This message was not sent. Click here to try again.',
    _ROLLED_ : 'rolled %p. (Reason: %d)',
    _DICEHASROLLED_ : 'rolled',
    _DICEHASSECRETLYROLLED_ : 'secretly rolled',
    _VOTECREATED_ : 'started a vote',
    _HASTHROWN_ : 'shows',
    _SHAREDIMAGE_ : '%p send a picture',
    _SHAREDTHEIMAGE_ : '%p sent a picture',
    _SHAREDSOUND_ : '%p sent a song:',
    _SHAREDSOUNDEFFECT_ : '%p sent a sound:',
    _SOUNDSTOP_ : 'Pause.',
    _SOUNDLINK_ : 'Play.',
    _IMAGELINK_ : 'See.',
    _SHAREDVIDEO_ : '%p shared a video.',
    _VIDEOLINK_ : 'Watch.',
    _VIDEOINVALID_ : 'The video sent by %p was invalid and can\'t be seen.',
    _PLAYERTOOLTIP_ : 'Player',
    _PERSONATOOLTIP_ : 'Character',
    _LASTMESSAGE_ : 'Last message',
    _LASTUPDATE_ : 'Last update',
    _WHISPER_ : 'Send messages to %p',
    _CLOSE_ : 'Close',
    _STORYTELLERTOOLTIP_ : 'Storyteller',
    _TOBOTTOM_ : 'Scroll to bottom',

    _CHATSETTINGS_ : 'Chat configuration',
    _INCREASEFONT_ : 'Increase Font size',
    _DECREASEFONT_ : 'Decrease Font Size',
    _LEAVECHAT_ : 'Leave room',

    _MESSAGE_ : 'Message...',
    _SENDMESSAGE_ : 'Send message',
    _MESSAGEPROMPT_ : 'Message',

    _ADDPERSONA_ : 'Add Persona',
    _REMOVEPERSONA_ : 'Remove Persona',
    _UPPERSONA_ : 'Scroll up',
    _DOWNPERSONA_ : 'Scroll down',

    _DICENUMBEREXPLAIN_ : 'Amount of dice to roll',
    _DICENUMBER_ : '#',
    _DICEREASONEXPLAIN_ : "Reason for the roll.",
    _DICEREASON_ : 'Reason',
    _DICEFACESEXPLAIN_ : 'Dice sides. Only the number, as in 6 for d6.',
    _DICEFACES_ : 'd#',
    _DICEMODEXPLAIN_ : 'Dice mod. Number only.',
    _DICEMOD_ : '+#',
    _DICETOWER_ : 'Secret Roll (only the storyteller is able to see it)',
    _DICENUMBERPROMPT_ : 'Amount of dice to roll, a number',
    _DICEFACESPROMPT_ : 'Amount of sides the dice has, as a number',
    _DICEREASONPROMPT_ : 'Reason for the roll',
    _DICEMODPROMPT_ : 'Modifier being added to the dice roll',
    _ROLLDICE_ : 'Roll Dice',
    _ROLLD4_ : 'Roll d4',
    _ROLLD6_ : 'Roll d6',
    _ROLLD8_ : 'Roll d8',
    _ROLLD10_ : 'Roll d10',
    _ROLLD12_ : 'Roll d12',
    _ROLLD20_ : 'Roll d20',
    _ROLLD100_ : 'Roll d100',

    _LONGLOAD_ : 'Server is taking too long to respond...',
    _CONNECTIONERROR_ : 'Server connection error.',
    
    /* Chat Module Help */
    
    _HELPINVALIDMODULE_ : 'Unknown module. Type "/help" to see the complete listing.',
    _MODULENOHELP_ : 'Module "%p" has no additional explanations.',
    _MODULELIST_ : 'Modules',
    _HELPSHORTHELP_ : 'Type "/help [command]" to receive more information on it. Example: /help help',
    _HELPLONGHELP_ : 'Type "/help" for a complete listing of commands. Type "/help [command]" to receive extra information on it.',
    _COUNTDOWNSHORTHELP_ : 'Starts a countdown in seconds. Example: /timer 10',
    _VOTESHORTHELP_ : 'Creates a vote. Example: /vote go left',
    _BGMPLAYSHORTHELP_ : 'Shares a song. Usage: /bgmplay http://musiclink.mp3',
    _SEPLAYSHORTHELP_ : 'Shares a sound. Usage: /seplay http://soundlink.mp3',
    _ACTIONSHORTHELP_ : 'Prints the message as an action of the current persona. Example: /me jumps on the spot',
    _CLEARSHORTHELP_ : 'Clears the screen. Example: /clear. May add "1" to it to clear them from the server, too: /clear 1',
    _NOTIFICATIONSHORTHELP_ : 'Enables/Disables notification of new messages in window title.',
    _NOWHISPERSHORTHELP_ : 'Enables/Disables printing of whispers.',
    _NOSESHORTHELP_ : 'Enables/Disables automatic playing of sound effects.',
    _STREAMSHORTHELP_ : 'Enables/Disables Streaming mode. "/h stream" for more info.',
    _STREAMLONGHELP_ : '"/stream" Enables/Disables streaming mode. While streaming, "/stream LINK" will change the stream background. "/stream PICTURE" will close any open pictures. "/stream YOUTUBE" will close videos.',
    _TITLESHORTHELP_ : 'Changes the window title. Example: /title Camera',
    _STORYSHORTHELP_ : 'Prints the message as story. Only the storytellers can use this module. Example: /story The group reaches the beach...',
    _ZEBRASHORTHELP_ : 'Enables/Disables stripes in chat messages.',
    _OFFGAMESHORTHELP_ : 'Prints the message as an out of character comment. Example: /off gonna get pizza, brb',
    _WHISPERSHORTHELP_ : 'Sends the message as a whisper to someone. Usage: /whisper [player], [message]. Example: /whisper Reddo#0001, Hello',
    _WHISPERLONGHELP_ : 'Sends the message as a whisper to someone. Press TAB to auto-complete the player name. Example: /w Red[TAB]. /w [tab] will show a list of all possible players.',
    _LINGOSHORTHELP_ : 'Sends the message with a language. Example: "/lang Elvish, Hello" will code it as Elvish. Adding "sto" to the slash command will code it as story. Example: "/langsto Elvish, Something written in a book"',
    _YOUTUBESHORTHELP_ : 'Sends an youtube link as video. Example: /youtube https://www.youtube.com/watch?v=moSFlvxnbgk',
    _PICASHORTHELP_ : 'Opens a white board for everyone to draw into. If text is typed after the slash command, it will be used as the board name. Using the same name twice brings the same board out. Otherwise, new boards are made with every try.',
    
    /* Config */
    _SYSTEMCONFIGHEADER_ : 'Configuration',
    _VERSIONNAME_ : 'Version',
    _VERSIONINFO_ : 'Click here for more information',
    
    /* Game Permissions */
    _GAMEPERMISSIONSHEADER_ : 'Table Permissions',
    _GAMEPERMISSIONKICK_ : 'Kick',
    _GAMEPERMISSIONCREATE_ : 'Create Sheets',
    _GAMEPERMISSIONVIEW_ : 'View Sheets',
    _GAMEPERMISSIONEDIT_ : 'Edit Sheets',
    _GAMEPERMISSIONSUBMIT_ : 'Save',
    _GAMEPERMISSIONEXP1_ : 'These are the global permissions players have within your table.',
    _GAMEPERMISSIONEXP2_ : 'Therefore, "View Sheets" means that a player can see all sheets. "Edit Sheets" means a player can edit all sheets they can view. "Create Sheets" means a player can create new sheets for the table.',
    _GAMEPERMISSIONINVITE_ : 'Invite Players',
    
    /* Games */
    _GAMESCONFIRMLEAVE_ : 'Are you sure you wish to leave "%p"? There is no turning back.',
    _GAMESHEADER_ : 'Tables',
    _GAMESNICK_ : 'If you need your identifier for someone, it is "%p", with no quotes.',
    _GAMESEXPLAIN1_ : 'You may manage your tables here. To invite someone to your table, you will need their identifier.',
    _GAMESEXPLAIN2_ : 'A table is where the system will attach pretty much everything. Rooms, where sessions happen, are attached to a table. Character sheets are attached to a table.',
    _GAMESEXPLAIN3_ : 'Is is not possible find open tables yet (not implemented).',
    _GAMESOPENCLOSE_ : 'Click here to show or hide this table\'s contents.',
    _GAMESDELETE_ : 'Delete the table',
    _GAMESLEAVE_ : 'Leave table',
    _GAMESPERMISSIONS_ : 'Table permissions',
    _GAMESOPTIONS_ : 'Table options',
    _GAMESNEWROOM_ : 'Create new room',
    _GAMESNOROOMS_ : 'No visible rooms.',
    _GAMESLOGS_ : 'Logs',
    _GAMESNOLOGS_ : 'No visible logs.',
    _GAMESINVITE_ : 'Invite players',
    _GAMESROOMOPTIONS_ : 'Alter permissions',
    _GAMESDESTROYROOM_ : 'Delete',
    _GAMESJOINROOM_ : 'Click here to join this room',
    _GAMESROOMTOOLTIP_  : 'Room',
    _GAMESSEELOG_ : 'Click here to see this log',
    _GAMESDESTROYLOG_ : 'Delete log',
    _GAMESLOGPERMISSIONS_ : 'Change log permissions',
    _GAMESNEWGAME_ : 'Create new Table',
    _GAMESMYINVITESBUTTON_ : 'See received invites',
    _GAMESCREATEEXPLAIN_ : 'Every system function requires a table.',
    _GAMESCREATORTOOLTIP_ : 'Creator',
    _GAMESLOADERROR_ : 'It was not possible to load the table list. Try again.',
    _NEWGAMEHEADER_ : 'Create Table',
    _NEWGAMENAME_ : 'Table Name',
    _NEWGAMENAMEERROR_ : '30 characters maximum. It may only have letters, numbers and spaces. It may not begin with a space.',
    _NEWGAMEDESCRIPTION_ : 'Table description. Will be seen in the table list and when someone finds your table.',
    _NEWGAMEFREEJOIN_ : 'Free join (Not implemented)',
    _NEWGAMEFREEJOINEXP_ : 'Allows players searching for tables to submit themselves as a player for this table. Players who join your table this way will only have permission to see and alter things that are already public and you will be warned of their joining. Not implemented, so it doesn\'t work yet, but you can set it on from now, if you want to..',
    _SENDNEWGAME_ : 'Create',
    _EDITGAMEHEADER_ : 'Alter Table',
    _SENDEDITGAME_ : 'Save Changes',
    _INVALIDGAME_ : 'Invalid or unknown Table',
    _NEWGAMEERROR_ : 'There was an error, try again.',
    _GAMESDELETEERROR_ : 'There was an error. The request was not fulfilled.',
    
    _GAMESINVITEHEADER_ : 'Add Players',
    _GAMESINVITEEXPLAIN_ : 'You may add players to this table. A player will only start seeing anything about this table when he accepts the invitation. After sending an invitation, you may not repeat it until the player either accepts or rejects it. To invite a player, you need to type it\'s identifier in the input below. All identifiers are similar to yours, like "Name#1234".',
    _GAMESINVITECURRENTGAME_ : 'You are adding players to the table "%p".',
    _GAMESINVITE401_ : 'Server says you can\'t invite to this table. Did your session expire? Try again.',
    _GAMESINVITE404_ : 'Player not found. Check the identifier and try again.',
    _GAMESINVITE500_ : 'There was an error processing the request. Try again..',
    _GAMESINVITE200_ : 'Invitation sent!',
    _GAMESINVITEDEF_ : 'There was an error. Try again.',
    _GAMESINVITEINPUT_ : 'Identifier#',
    _INVITESNOINVITES_ : 'No invitations received.',
    _INVITESGAME_ : 'Table',
    _GAMESINVITEMESSAGE_ : 'Invite Message. Say who you are and tell why you are inviting them to your table.',
    _GAMESINVITESUBMIT_ : 'Send invite',
    _GAMESINVITEKEEPGOING_ : 'Invite more players after this',
    _NEWROOMPBP_ : 'Play-by-Post',
    _NEWROOMPBPEXPLAIN_ : 'A play-by-post room is not ideal for real-time sessions. Players will be notified by e-mail when new messages were added to the room. (not implemented).',
    
    _GAMESMYINVITESHEADER_ : 'My Invites',
    _GAMESMYINVITESEXPLAIN_ : 'As long as you do not accept an invitation, you will not be part of that table.',
    _GAMESMYINVITESACCEPT_ : 'Accept',
    _GAMESMYINVITESREJECT_ : 'Refuse',
    _GAMESMYINVITESCREATOR_ : 'Table Creator',
    _GAMESMYINVITESNOMESSAGE_ : 'No message was added to this invitation.',
    _GAMESMYINVITESMYIDENTIFIER_ : 'If you need to inform your identifier to someone, it is "%p".',
    
    _NEWROOMHEADER_ : 'New Room',
    _NEWROOMEXPLAIN_ : 'The room is where the game\'s story is made. Every message is sent to a room.',
    _NEWROOMERROR_ : 'There was an error. Try again.',
    _NEWROOMNAME_ : 'Room name',
    _NEWROOMNAMEERROR_ : 'The room name is how it is listed. 3-30 caracteres. Only letters and numbers. May not begin with a space.',
    _NEWROOMDESCRIPTION_ : 'Description. This field will be printed everytime you enter the room. Describe what the room is meant for (Main story, side story, shopping, etc). Other info, like playing times and who plays here, could also be meaningful.',
    _NEWROOMPRIVATE_ : 'Private',
    _NEWROOMPRIVATEEXPLAIN_ : 'A private room defaults to invisible and can only be seen by those with permissions. (Not implemented) The system is still not able to set these permissions, so a private room would be invisible to all except the storyteller.',
    _NEWROOMSTREAMABLE_ : 'Public',
    _NEWROOMSTREAMABLEEXPLAIN_ : 'A public room may be acessed even by those that are not part of this table. (Not implemented)',
    _SENDROOM_ : 'Create room',
    _NEWROOMCURRENTGAME_ : 'You are creating rooms for the table "%p".',
    
    /* \n = New Line */
    _GAMESCONFIRMDELETE_ : 'Are you sure you wish to delete "%p"?\There is no turning back!',
    
    /* Changelog! */
    _REDUPDATES_ : 'To receive the updates marked in red, you need to update your RedPG Front.',
    _BACKWARDSCOMPATIBILITY_ : 'Compatibility with older versions is not intended. There are no guarantees that older versions will work correctly and it is recommended to always update.',
    _YOURVERSION_ : 'Your version is',
    _LASTVERSION_ : 'Newest version is',
    _CHANGELOGNOTLOADED_ : 'It was not possible to load the changelog.',
    _CHANGELOGLOADALL_ : 'Load full changelog',
    
    
    /* CHAT LOGGER */
    _LOGGERMESSAGEEXPLAIN_ : "The following excerpt shows which will be the first messages and the last messages to be copied to the log. Any messages that were not sent to a public channel will not be copied to the log. After clicking a slider, it is possible to move it with the arrow keys.",
    _LOGGERGENERATEJSON_ : "Generate JSON",
    _LOGGERTYPESEXPLAIN_ : "You may select which types of messages will be copied to the log. Messages which are not sent to a public channel will not be copied regardless of their type being selected.",
    _LOGGERMSGBY_ : 'by',
    _LOGGERNOTTYPE_ : "This message can't be shown in this space, but it will be copied successfully.",
    _LOGGERLOADJSON_ : "Load Log",
    
    
    
    /* Combat Tracker */
    _COMBATTRACKER_ : "Combat Tracker",
    _COMBATTRACKERMINIMIZE_ : "Hide",
    _COMBATTRACKERDELETEROW_ : "Remove from Combat",
    _COMBATTRACKERINITIATIVE_ : "Initiative",
    _COMBATTRACKERSETTARGET_ : "Select as Target",
    _COMBATTRACKEROPENSHEET_ : "Open Sheet",
    _COMBATTRACKERADDSHEET_ : "Add to Combat",
    _COMBATTRACKERSHEETSELECT_ : "Select a sheet to join combat. Only sheets from this table are listed and you need to have loaded the list once.",
    _COMBATTRACKERREFRESH_ : "Update list",
    _COMBATTRACKERSORT_ : "Order by initiative",
    _COMBATTRACKERTURN_ : "Next turn",
    _COMBATTRACKERSETTURN_ : 'Make the turn his',
    _COMBATTRACKERNEWROUND_ : "New round",
    _COMBATTRACKERPLAYERSELECT_ : 'Select a player (or none). If a player is selected, he will be warned when his turn comes.',
    _COMBATTRACKERNOPARTICIPANTS_ : 'No fighters.',
    
    /* Language Tracker */
    _LANGUAGETRACKER_ : 'Language Tracker',
    _LANGUAGETRACKERMINIMIZE_ : 'Hide',
    _LANGUAGETRACKERNOPLAYERS_ : 'No players to show.',
    
    /* Addon Box */
    _ADDONBOXLOADING_ : 'Loading...',
    _ADDONBOXLOADINGEXPLAIN_ : "List is being loaded.",
    _ADDONBOXLOADINGERROR_ : "Error loading list",
    _ADDONBOXLOADINGERROREXPLAIN_ : "It was not possible to load the list.",
    _ADDONBOXLOADEDERROR_ : 'Error',
    _ADDONBOXLOADEDERROREXPLAIN_ : 'List was loaded, but is invalid.',
    _ADDONBOXNOTFOUND_ : 'Unknown',
    _ADDONBOXNOTFOUNDEXPLAIN_ : 'Item not found.',
    
    /* Styles */
    _STYLEWINDOW_ : "Manage sheet styles",
    _STYLESHEADER_ : "Styles",
    _STYLEPUBLIC_ : "Public style",
    _STYLEFORGAME_ : "Style for the table",
    _STYLENAME_ : "Name",
    _STYLEAFTER_ : "Post-Processing Javascript",
    _STYLEBEFORE_ : "Pre-Processing Javascript",
    _STYLECSS_ : "CSS",
    _STYLEHTML_ : "HTML",
    _STYLESUBMIT_ : "Send",
    _STYLESTAYHERE_ : "Remain in this page after sending",
    _STYLECREATE_ : "Create Style",
    _STYLECOPY_ : 'Copy style',
    _STYLENOSTYLES_ : "No styles loaded. Open a sheet.",
    
    /* Picture UI */
    _DRAWINGSIZE_ : 'Pen size',
    _DRAWINGCOLOR_ : 'Pen color',
    _DRAWINGCLEAR_ : 'Erase everything',
    _DRAWINGERASER_ : 'Eraser, size 10',
    _DRAWINGLOCK_ : 'Lock drawings',
    
    /* Sheet Commons */
    _SHEETSLOADIMAGES_ : 'Image list was not yet loaded',
    _SHEETSLOADSHEETS_ : 'Sheet list was not yet loaded',
    _SHEETCOMMONSPLAYER_ : 'Player',
    _SHEETCOMMONSOPEN_ : 'Open/Close',
    _SHEETCOMMONSNEWCATEGORY_ : 'New Category',
    _SHEETCOMMONSNEWIMAGE_ : 'New Picture',
    _IMAGEARCHIVE_ : 'Image Bank',
    _SHEETCOMMONSTYPE_ : 'Type',
    _SHEETCOMMONSPICKIMAGE_ : 'Choose a picture',
    _SHEETCOMMONSPICKIMAGENOFOLDER_ : "No folder",
    _SHEETCOMMONSPICKIMAGENONE_ : 'No picture',
    _SHEETCOMMONSPICKSHEET_ : 'Choose a sheet',
    _SHEETCOMMONSNEWDUAL_ : 'New double list',
    _SHEETCOMMONSNEWLINE_ : 'New field',
    _SHEETCOMMONSNEWSINGLE_ : 'New single list',
    _GENERICSHEET_ : 'Generic Sheet',
    _SHEETCOMMONSMAPINFO_ : 'Map Settings',
    _SHEETMAP_ : 'Map',
    _SHEETCOMMONSADDTOKEN_ : 'Add new token',
    _SHEETCOMMONSCHANGETOKEN_ : 'Edit token',
    
    
    /* FOrum */
    _HOMEFORUM_ : 'Active Topics on the Forums',
    _HOMEFORUMERROR_ : "It was not possible to load the forum news.",
    _FORUMBY_ : 'by',
    _FORUMLATESTIN_ : 'in',
    _FORUMLATESTPOST_ : 'Post',
    
    /* Donations */
    _HOMEDONATIONS_ : 'Donations',
    _HOMEDONATIONSEXPLAIN1_ : 'RedPG is freeware and will remain so for as long as possible. However, it still has costs and someone has to pay for them.',
    _HOMEDONATIONSEXPLAIN2_ : 'Through donations, you fund development and help cover monthly fees the servers incur. If everyone helps, RedPG may remain freeware forever!',
    _HOMEDONATIONSEXPLAIN3_ : 'Every time you donate, please try to do so from an account made from the same Name your RedPG account was made from. That way, in the future we may have the donations count for your account on RedPG!',
    
    
    
    /* Video Player */
    _VIDEOPLAYER_ : 'Video Player',
    
    /* CHrome */
    
    _CHROME1_ : 'This application is made for and tested in Google Chrome, being also compatible with Chromium.',
    _CHROME2_ : 'Compatibility with other browsers is desired, but incidental. Using Chrome or Chromium is recommended.',
    _CHROME3_ : 'Click here to hide this message.'
};
 
 
window.lingo['FR'] = {
    _LANGUAGENAME_ : 'Français',
    
    /* Login */
    _LOGIN_ : 'Login',
    _PASSWORD_ : 'Senha',
    _CONFIRMLOGIN_ : 'Entrar',
    _FORGOTPASSWORD_ : 'Esqueceu sua senha?',
    _NEWACCOUNT_ : 'Criar nova conta',
    _LOGININVALID_ : "Credenciais inválidas",
    _LOGINCONNECTIONERROR_ : "Erro na conexão com o servidor",
    _LOGINTIMEOUT_ : "Sua sessão expirou",
    
    _CREATEACCOUNTHEADER_ : 'Criação de conta',
    _CANAME_ : 'Nome',
    _CAEMAIL_ : 'E-mail',
    _CANICK_ : 'Apelido',
    _CAPASSWORD_ : 'Senha',
    _CAPASSWORD2_ : 'Senha (Repetir)',
    _CASUBMIT_ : 'Criar conta',
    _CANAMEEXPLAIN_ : 'Seu nome. Obrigatório.',
    _CAEMAILEXPLAIN_ : "Seu e-mail. Obrigatório. Deve ser válido.",
    _CANICKEXPLAIN_ : "Obrigatório. Letras e números. Não começa com espaço.",
    _CAPASSEXPLAIN_ : "Obrigatório. Apenas letras e números.",
    _CAPASS2EXPLAIN_ : "Deve ser igual à senha acima..",
    
    /* Menu */
    _HIDELEFTWINDOWS_ : 'Esconder Janelas',
    _CALLCHATWINDOW_ : 'Abrir Chat',
    _GAMES_ : 'Jogos',
    _SETTINGS_ : 'Config',

    _HIDERIGHTWINDOWS_ : 'Esconder Janelas',
    _SHEETS_ : 'Fichas',
    _STYLES_ : 'Estilos',
    _MYACCOUNT_ : 'Minha Conta',
    _LOGOUT_ : 'Logout',
    _OPENOLDSYSTEM_ : "Sistema Antigo",
    
    /* Picture Show */
    _CLOSEIMAGE_ : 'Clique aqui para fechar a imagem.',

    /* Room */
    _BASICCOMMANDS_ : 'Comandos Básicos',
    _ACTIONSAMPLE_ : '"/me [mensagem]": Envia a mensagem como uma ação da persona escolhida.',
    _OFFSAMPLE_ : '"/off [mensagem]": Envia a mensagem como uma mensagem fora de jogo, falando como o jogador.',
    _ACTUALSAMPLE_ : 'Exemplo: "/me se joga do penhasco."',
    _MORECOMMANDS_ : 'Caso precise de uma listagem completa dos comandos, digite "/comandos".',
    _INVALIDSLASHCOMMAND_ : '"%p" não é um comando reconhecido.',

    _HASCONNECTED_ : '%p se conectou.',
    _HASDISCONNECTED_ : '%p se desconectou.',
    _ROLLED_ : 'rolou %p. (Motivo: %d)',
    _SHAREDIMAGE_ : '%p compartilhou uma imagem.',
    _IMAGELINK_ : 'Clique aqui para ver.',
    _PLAYERTOOLTIP_ : 'Jogador',
    _PERSONATOOLTIP_ : 'Personagem',
    _LASTMESSAGE_ : 'Ultima mensagem',
    _LASTUPDATE_ : 'Ultima atualização',
    _WHISPER_ : 'Enviar mensagem a %p',
    _STORYTELLERTOOLTIP_ : 'Mestre',
    _TOBOTTOM_ : 'Descer até  o fim',

    _CHATSETTINGS_ : 'Configurações do Chat',
    _INCREASEFONT_ : 'Aumentar Fonte',
    _DECREASEFONT_ : 'Diminuir Fonte',
    _LEAVECHAT_ : 'Sair da sala',

    _MESSAGE_ : 'Mensagem...',
    _SENDMESSAGE_ : 'Enviar mensagem',
    _MESSAGEPROMPT_ : 'Mensagem',

    _ADDPERSONA_ : 'Adicionar Persona',
    _REMOVEPERSONA_ : 'Remover Persona',
    _UPPERSONA_ : 'Subir a lista',
    _DOWNPERSONA_ : 'Descer a lista',

    _DICENUMBEREXPLAIN_ : 'Quantidade de dados para rolar',
    _DICENUMBER_ : '#',
    _DICEREASONEXPLAIN_ : "Motivo pelo qual o dado será rolado.",
    _DICEREASON_ : 'Motivo da Rolagem',
    _DICEFACESEXPLAIN_ : 'Faces do dado. Apenas o número. 6 para d6.',
    _DICEFACES_ : 'd#',
    _DICENUMBERPROMPT_ : 'Quantidade de dados a rolar, um número',
    _DICEFACESPROMPT_ : 'Número de faces que o dado possui, apenas números',
    _DICEREASONPROMPT_ : 'Motivo pelo qual o dado será rolado',
    _ROLLDICE_ : 'Rolar dados',
    _ROLLD4_ : 'Rolar d4',
    _ROLLD6_ : 'Rolar d6',
    _ROLLD8_ : 'Rolar d8',
    _ROLLD10_ : 'Rolar d10',
    _ROLLD12_ : 'Rolar d12',
    _ROLLD20_ : 'Rolar d20',
    _ROLLD100_ : 'Rolar d100',

    _LONGLOAD_ : 'O servidor está demorando a responder...',
    _CONNECTIONERROR_ : 'Houve um erro na conexão com o servidor.'
}; 
 
if (window.lingo === undefined) window.lingo = {};
window.lingo['pt_br'] = {
    _LANGUAGENAME_ : 'Português - Brasil',
    
    _NEWMESSAGES_ : 'Mensagens',
    
    _LEAVING_ : 'Tem certeza que deseja sair?',
    _CONFIRMLOGOUT_ : 'Tem certeza que deseja fazer logout?',
    _GOFULL_ : 'Utilizar o aplicativo em tela cheia?',
    
    
    /* Intro */
    _INTROEXPLANATION1_ : "Passe o mouse sobre os cantos da tela para acessar os menus.",
    _INTROEXPLANATION2_ : "Clique em qualquer parte dessa tela para fechar essa mensagem.",
    
    
    /* Home */
    _HOMETITLE_ : 'RedPG',
    _HOMEEXPLAIN1_ : 'RedPG é um sistema para facilitar RPGs de Mesa através da internet. Funções do sistema incluem o compartilhamento de Imagens, Sons, Fichas de Personagens, uma sala para troca de mensagens com suporte a dados e muito mais, com novas funções sempre sendo adicionadas.',
    _HOMEEXPLAIN2_ : 'Todos os aspectos do sistema existem e estão presos às Mesas, que ele enxerga como um grupo de RPG. Então para criar qualquer coisa ou utilizar o sistema de qualquer maneira, você precisa criar ou ser convidado a uma Mesa. Isso é feito na seção "Mesas", no menu à esquerda.',
    _HOMELINKS_ : "Links úteis",
    _HOMEFRONTGITHUB_ : 'RedPG Front on GitHub',
    _HOMEFRONTGITHUBBALL_ : 'RedPG Front on GitHub - Download direto',
    _HOMESERVERGITHUB_ : 'RedPG Server on GitHub',
    _HOMEDB_ : 'RedPG.sql',
    _HOMEFRONTGITHUBEXPLAIN_ : 'Versão offline do cliente RedPG. Usuários que queiram abrir o RedPG a partir da própria máquina devem baixar versões atualizadas aqui. A versão offline permite que jogadores e mestres compartilhem sons que estejam dentro da pasta Sons, sem a necessidade de um servidor para compartilhar sons.',
    _HOMEFRONTGITHUBBALLEXPLAIN_ : 'O mesmo do de cima, mas como um link direto ao download.',
    _HOMESERVERGITHUBEXPLAIN_ : 'Código-fonte do servidor RedPG. Pessoas interessadas em ver como o código funciona podem acessá-lo por ali.',
    _HOMEDBEXPLAIN_ : 'Dump do banco de dados do servidor RedPG, necessário para executar o servidor RedPG. Indisponível no momento.',
    _HOMERULESNAVIGATION_ : 'Regras DFS',
    _HOMERULESNAVIGATIONEXPLAIN_ : 'Navegar no site de regras para o Dragon Fantasy Saga.',
    _HOMERULESGITHUB_ : 'Regras DFS (Offline)',
    _HOMERULESGITHUBEXPLAIN_ : 'Versão Offline do site de regras para o Dragon Fantasy Saga.',
    
    /* Images */
    
    _IMAGESHEADER_ : 'Imagens',
    _IMAGESCLOUD_ : 'Essa imagem está salva no RedPG e ocupa espaço.',
    _IMAGESFOLDERPROMPT_ : 'Nova pasta (deixe vazio para nenhuma)',
    _IMAGESEXPLAIN1_ : 'Imagens ficam anexadas à sua conta ao invés de a algum jogo em específico. O espaço que cada conta possui para imagens é finito e deve-se tomar cuidado com o tamanho das imagens que se guarda aqui.',
    _IMAGESEXPLAIN2_ : 'Você pode aumentar seu espaço para imagens através de doações que ajudam a pagar o servidor do RedPG. Se seu espaço para imagens diminuir além do seu espaço gasto com imagens, suas imagens não serão apagadas, mas você não poderá enviar novas imagens até reduzir o uso de espaço.',
    _IMAGESEXPLAIN3_ : 'Nos nomes das imagens, qualquer coisa entre parênteses será ignorada na hora de imprimir seu nome, tanto quando usada como Persona quanto quando enviada para o chat.',
    _IMAGESUPLOADED_ : 'Imagens Salvas (Não implementadas)',
    _IMAGESUPLOADEDEXPLAIN_ : 'Imagens salvas no servidor não serão perdidas entre sessões. Caso você tenha mais imagens do que seu espaço total, elas não serão deletadas, mas você não poderá enviar mais imagens até remover o suficiente.',
    _IMAGESLINKED_ : 'Imagens Linkadas',
    _IMAGESLINKEDEXPLAIN_ : 'Essas imagens são salvas como Storage simples no servidor. Elas não serão perdidas, mas você precisa clicar em "Salvar" manualmente, logo abaixo da lista.',
    _IMAGESLINKEDSAVE_ : 'Salvar Imagens Linkadas no servidor',
    _IMAGESUPLOAD_ : 'Novo Upload',
    _IMAGESFOLDER_ : 'Pasta',
    _IMAGESNOFOLDER_ : 'Sem pasta',
    _IMAGESLINK_ : 'Novo Link',
    _IMAGESLINKISLIST_ : 'Possui imagens dentro',
    _IMAGESNAME_ : 'Nome da Imagem',
    _IMAGESLINKADDRESS_ : 'Endereço da Imagem',
    _IMAGESUPLOADSUBMIT_ : 'Enviar',
    _IMAGESDELETE_ : 'Deletar',
    _IMAGESSHARE_ : "Compartilhar no chat atual",
    _IMAGESPERSONA_ : "Usar como persona",
    _IMAGESOPEN_ : 'Visualizar imagem',
    _IMAGESLINKLISTEXPLAIN_ : 'Sem marcar essa caixa, o sistema vai adicionar o link digitado como um link de imagem. Marcando essa caixa, o sistema irá abrir o link digitado e varrer ele atrás de links de imagens, adicionando cada uma delas.',
    _IMAGESFILEUPLOADEXPLAIN1_ : 'Upload de imagens consome seu espaço.',
    _IMAGESFILEUPLOADEXPLAIN2_ : "Você pode enviar várias imagens de uma só vez. Texto antes do primeiro hífen (-) no nome do arquivo será considerado o nome da pasta.",
    
    
    /* Sounds */
    _OPENSOUNDS_ : 'Sons',
    _SOUNDSHEADER_ : 'Sons',
    _SOUNDSEXPLAIN_ : 'O sistema sempre irá buscar arquivos de sons na pasta "/Sounds". Você precisa estar usando o website de forma offline para colocar sons nessa pasta.',
    _SOUNDSEXPLAIN2_ : 'Caso você esteja adicionando um link completo para o som em algum servidor, o sistema irá poder tocar esse som de qualquer lugar, tanto online quanto offline.',
    _SOUNDSPICKONE_ : 'Escolha uma pasta',
    _SOUNDSFOLDERS_ : 'Folders',
    _SOUNDSNEWFOLDER_ : 'Nova Pasta',
    _SOUNDSNEWSOUNDS_ : 'Adicionar Sons',
    _SOUNDSSAVESOUNDS_ : 'Salvar',
    _NEWFOLDERNAME_ : 'Nova pasta',
    _SOUNDSSUBMITLIST_ : 'Adicionar Arquivos',
    _SOUNDSLINK_ : 'Link externo',
    _SOUNDSSUBMITLINK_ : 'Enviar link',
    _SOUNDSOR_ : 'Alternativamente, envie um link de servidor externo para adicionar as músicas dele (deve ser o arquivo de música ou deve ser um index da pasta).',
    _SOUNDDROPBOX_ : 'Abra o link compartilhado da pasta no Dropbox, aperte Control + U, copie TODO o código fonte e o cole aqui.',
    _SOUNDSUBMITDROPBOX_ : 'Adicionar Dropbox',
    _SOUNDSORDROPBOX_ : 'Uma pasta compartilhada do Dropbox pode ser adicionada aqui. Lembre-se de que o Dropbox possui limites de download para clientes não pagantes.',
    _SHAREMUSIC_ : 'Compartilhar',
    _PLAYMUSIC_ : 'Tocar',
    _TRYCORS_ : 'Não foi possível acessar o servidor. Seu servidor provavelmente não está configurado corretamente para receber pedidos. Clique aqui para baixar uma extensão para Google Chrome que fará o acesso funcionar assim mesmo. Lembre-se de, depois de instalar, ativar a extensão por clicar no ícone vermelho CORS ao lado direito da barra de endereços. Lembre-se de desativar o CORS após importar o link!',
    _DELETEMUSIC_ : 'Deletar',
    _SOUNDSUSEFILES_ : 'Escolher arquivos em "Sounds/"',
    _SOUNDSUSELINK_ : 'Adicionar links de músicas em um link.',
    _SOUNDSISBGM_ : 'BGM? É Sound Effect se não for.',
    _SOUNDFOLDERERROR_ : 'Para adicionar sons, é necessário escolher uma pasta para colocá-las.',
    
    /* Sheets */
    
    _MSGLOSTHP_ : 'perdeu HP',
    
    _STYLEBEFOREERROR_ : 'Erro no código Before Process de "%p"',
    _STYLEAFTERERROR_ : 'Erro no código After Process de "%p"',
    _STYLETRIGGERERROR_ : 'Erro ao ativar Trigger do estilo "%p"',
    
    _SHEETSHEADER_ : 'Fichas',
    _SHEETSEXPLAIN_ : 'Fichas são algo que mestres e seus jogadores podem guardar no sistema, garantindo que todos estejam vendo a mesma versão desse recurso.',
    _SHEETSEXPLAIN2_ : 'Normalmente são usadas para guardar as informações de personagens, mas têm o potencial para guardar qualquer tipo de informação.',
    _SHEETSEXPLAIN3_ : 'Cada ficha utiliza um "Estilo", que define a aparência dela e os valores que ela precisa guardar. Como alguns estilos não são criados por um administrador, tome cuidado ao abrir fichas que utilizem estilos criados por alguém em quem você não confia. Apenas os estilos criados por um administrador são considerados seguros.',
    _SHEETSERROR_ : 'Houve um erro no processamento. Tente novamente.',
    _SHEETSNOFOLDER_ : 'Sem pasta',
    _SHEETSSETFOLDER_ : 'Pasta',
    _SHEETCHANGEFOLDER_ : 'Nova pasta para "%p":',
    _SHEETHOVERCREATOR_ : 'Criador',
    _SHEETHOVERSTYLECREATOR_ : 'Criador do Estilo usado',
    _SHEETHOVERSTYLE_ : 'Estilo',
    

    _SHEETSDELETE_ : 'Deletar',
    _SHEETSPRIVILEGES_ : 'Permissões',
    _SHEETSAFE_ : 'Essa ficha utiliza um estilo Seguro.',
    _SHEETUNSAFE_ : 'Essa ficha utiliza um estilo que não é Seguro. Não abra essa ficha se não confiar no seu criador.',
    _SHEETSNAMETITLE_ : 'Clique aqui para abrir essa ficha',
    _SHEETSNOSHEETS_ : 'Nenhuma ficha para listar.',
    _SHEETSNOGAMES_ : 'Você não faz parte de nenhuma mesa. Crie uma mesa pelo menu da esquerda ou aceite um convite para uma mesa de outra pessoa para ter acesso às fichas.',
    _SHEETSADD_ : 'Criar ficha',
    _SHEETSGAMETITLE_ : 'Clique aqui para listar as fichas desse mesa.',
    
    _SHEETCREATIONHEADER_ : 'Criar Ficha',
    _SHEETCREATIONNAME_ : "Nome da Ficha",
    _SHEETCREATIONSUBMIT_ : 'Enviar',
    _SHEETCREATIONPUBLIC_ : 'Pública',
    _SHEETCREATIONPUBLICEXPLAIN_ : 'Fichas públicas podem ser vistas por todos os jogadores.',
    
    _SHEETPERMISSIONNHEADER_ : 'Permissões de Ficha',
    _SHEETPERMISSIONVIEW_ : 'Ver',
    _SHEETPERMISSIONEDIT_ : 'Editar',
    _SHEETPERMISSIONDELETE_ : 'Apagar',
    _SHEETPERMISSIONPROM_ : 'Promover',
    _SHEETPERMISSIONPROMEXP_ : 'Permite alterar permissões da ficha, permitindo que dê elas aos outros',
    _SHEETPERMISSIONSUBMIT_ : 'Enviar',
    
    _SHEETSAVE_ : 'Salvar',
    _SHEETEDIT_ : 'Editar',
    _SHEETRELOAD_ : 'Recarregar Valores da Ficha',
    _SHEETFULLRELOAD_ : 'Recarregar Valores e Aparência da Ficha',
    _SHEETIMPORT_ : 'Importar JSON com Valores',
    _SHEETEXPORT_ : 'Exportar JSON com Valores',
    _SHEETAUTO_ : 'Atualizar Automaticamente (Não implementado)',
    _SHEETCLOSE_ : 'Fechar a ficha (Mudanças não salvas serão perdidas)',
    _SHEETHIDEWINDOW_ : 'Esconder a Janela',
    _SHEETIMPORTEXPLAIN_ : 'Cole aqui o código JSON da ficha que deseja importar.',
    _SHEETIMPORTSEND_ : 'Assumir nova forma',
    _SHEETEXPORTEXPLAIN_ : 'Código JSON dos valores da ficha',
    _SHEETIMPORTERROR_ : 'Código JSON inválido.',
    _SHEETSAVESUCCESSHEADER_ : 'Sucesso',
    _SHEETSAVESUCCESSMESSAGE_ : 'A ficha foi salva com sucesso.',
    _SHEETSAVEERRORHEADER_ : 'Erro',
    _SHEETSAVEERRORMESSAGE_ : 'Não foi possível salvar a ficha, tente novamente.',
    
    _SHEETWASUPDATED_ : 'foi atualizada.',
    _SHEETCLICKTOUPDATE_ : 'Clique aqui para recarregar a ficha.',
    _SHEETCLICKAUTOUPDATEOFF_ : 'Clique aqui para desativar recarregamento automático.',
    _SHEETCLICKAUTOUPDATEON_ : 'Clique aqui para ativar carregamento automático de fichas.',
    
    
    /* Login */
    _LOGIN_ : 'E-mail',
    _PASSWORD_ : 'Senha',
    _CONFIRMLOGIN_ : 'Entrar',
    _FORGOTPASSWORD_ : 'Esqueceu sua senha?',
    _NEWACCOUNT_ : 'Criar nova conta',
    _LOGININVALID_ : "Credenciais inválidas.",
    _LOGINCONNECTIONERROR_ : "Erro na conexão com o servidor. Login não foi realizado.",
    _LOGININACTIVE_ : "Sua conta não foi ativada. Siga o processo de ativação enviado ao seu e-mail.",
    _LOGINTIMEOUT_ : "Sua sessão expirou",
    _CONFIRMSUCCESS_ : 'Sua conta foi ativada com sucesso.',
    _CONFIRMFAILURE_ : 'Houve um erro na ativação da sua conta. Clique aqui para tentar novamente.',
    
    _CREATEACCOUNTHEADER_ : 'Criação de conta',
    _CACONNERROR_ : 'Houve um erro na criação da conta. Tente novamente mais tarde.',
    _CAEMAILERROR_ : 'Seu e-mail já foi registrado antes. Caso você ainda não tenha ativado sua conta, clique aqui.',
    _CANICKERROR_ : 'Existem dez mil contas com esse apelido... Você precisará escolher um apelido novo.',
    _CANAME_ : 'Nome',
    _CAEMAIL_ : 'E-mail',
    _CANICK_ : 'Apelido',
    _CAPASSWORD_ : 'Senha',
    _CAPASSWORD2_ : 'Senha (Repetir)',
    _CASUBMIT_ : 'Criar conta',
    _CANAMEEXPLAIN_ : '3-200 caracteres. Apenas caracteres Portugueses.',
    _CANAMEHELP_ : 'O nome que será anexado à conta. Essa informação será privada.',
    _CAEMAILHELP_ : 'Seu e-mail será seu login no sistema.',
    _CAEMAILEXPLAIN_ : "O e-mail deve ser válido.",
    _CANICKEXPLAIN_ : "3-12 caracteres. Apenas letras e números.",
    _CANICKHELP_ : 'Seu apelido será o nome que aparecerá para outros usuários do sistema.',
    _CAPASSEXPLAIN_ : "3-12 caracteres. Apenas letras a-zA-Z e números.",
    _CAPASSHELP_ : 'Não esqueça sua senha!',
    _CAPASS2EXPLAIN_ : "Deve ser igual à senha acima.",
    _CAAGE_ : 'Sou velho o suficiente para ter a informação acima guardada no sistema.',
    _CAAGEEXPLAIN_ : 'A conta não pode ser criada legalmente sem isso.',
    _CAAGEHELP_ : 'Em alguns países é ilegal guardar quaisquer informações sobre menores de idade. Marcando essa caixa, você afirma ser velho o suficiente para ter as informações providas acima guardadas no nosso sistema.',
    
    _CASUC1_ : 'Obrigado por criar uma conta.',
    _CASUC2_ : 'Sua conta foi ativada automaticamente.',
    _CASUC3_ : 'Clique aqui para fazer o login.',
    
    /* Menu */
    _HIDELEFTWINDOWS_ : 'Esconder Janelas',
    _CALLCHATWINDOW_ : 'Abrir Chat',
    _GAMES_ : 'Mesas',
    _SETTINGS_ : 'Config',
    _MODULES_ : 'Addons',

    _HIDERIGHTWINDOWS_ : 'Esconder Janelas',
    _SHEETS_ : 'Lista de Fichas',
    _SHEET_ : 'Fichas Abertas',
    _STYLES_ : 'Estilos',
    _MYACCOUNT_ : 'Minha Conta',
    _RULES_ : 'Regras DFS',
    _NAVIGATOR_ : 'Comunidade',
    _LOGOUT_ : 'Logout',
    _OPENOLDSYSTEM_ : "Sistema Antigo",
    _OPENTWITCH_ : 'Twitch Chat...',
    _OPENTHITBOX_ : 'Hitbox Chat!',
    _OPENYOUTUBE_ : 'Video Player',
    _OPENIMAGES_ : 'Imagens',
    
    /* Picture Show */
    _CLOSEIMAGE_ : 'Clique aqui para fechar a imagem.',

    /* Config */
    _CONFIGHEADER_ : 'Configurações',
    _CONFIGLANGUAGE_ : 'Língua',
    _CHATUSEPROMPT_ : 'Caixa de chat como um botão',
    _CHATPROMPT0_ : 'Nunca',
    _CHATPROMPT1_ : 'Sempre',
    _CHATPROMPT2_ : 'Apenas em aparelhos móveis',
    _CHATPROMPTEXP_ : "O campo de texto do chat passa a funcionar com um botão que chama um Prompt para que digite sua mensagem. Isso é útil em dispositivos móveis que não tenham um teclado externo conectado.",
    _CHATFULLSCREEN_ : 'Modo tela única',
    _CHATFULLSCREEN0_ : 'Apenas quando necessário',
    _CHATFULLSCREEN1_ : 'Sempre',
    _CHATFULLSCREENEXP_ : "Quando acessando por um dispositivo com resolução baixa, o site mostra apenas uma tela por vez, caso contrário, o site mostra duas telas: uma na esquerda e outra na direita. Essa opção permite que o modo de tela única seja forçado independente da resolução do dispositivo.",
    _AUTOPLAYBGM_ : 'Tocar músicas automaticamente',
    _AUTOPLAYBGM0_ : 'Nunca',
    _AUTOPLAYBGM1_ : 'Apenas se enviadas por um mestre',
    _AUTOPLAYSE_ : 'Tocar sons automaticamente',
    _AUTOPLAYSE0_ : 'Nunca',
    _AUTOPLAYSE1_ : 'Apenas se enviados por um mestre',
    _AUTOPLAYVIDEO_ : 'Tocar videos automaticamente',
    _AUTOPLAYVIDEO0_ : 'Nunca',
    _AUTOPLAYVIDEO1_ : 'Apenas se enviados por um mestre',
    _CONFIGSAVE_ : 'Salvar',
    _CONFIGERROR_ : 'Erro ao salvar as configurações, tente novamente.',
    _CONFIGSUCCESS_ : 'Configurações salvas com sucesso!',
    _AUTOPLAYBGM2_ : 'Sempre',
    _AUTOPLAYSE2_ : 'Sempre',
    _AUTOPLAYVIDEO2_ : 'Sempre',
    _AUTOPLAYIMAGE_ : 'Mostrar imagens automaticamente',
    _AUTOPLAYIMAGE0_ : 'Nunca',
    _AUTOPLAYIMAGE1_ : 'Apenas se enviadas por um mestre',
    _AUTOPLAYIMAGE2_ : 'Sempre',
    _CONFIGWSPORT_ : 'Porta usada em WebSockets',
    _CONFIGWSEXP_ : "Você pode controlar qual porta é utilizada para as conexões WebSocket do Chat. Só mexa aqui se o chat não estiver funcionando.",
    
    
    /* Room */
    _CHATSYSTEMMESSAGE_ : "Mensagem do Sistema",
    _CHATSYSTEMNICK_ : "Sistema",
    _CHATWSCONNECTED_ : 'Conectado. Mensagens antigas não foram impressas.',
    _CHATWSNOTALL_ : 'Mensagens antigas foram escondidas.',
    _CHATWSCONNECTING_ : 'Conectando...',
    _CHATWSGETOLDERMESSAGES_ : 'Clique aqui para carregar todas as mensagens dessa sala.',
    _CHATWSDISCONNECTED_ : 'Desconectado do servidor.',
    _CHATWSRECONNECT_ : 'Clique aqui para reconectar.',
    _CHATWSTAKINGLONG_ : 'Resposta do servidor não está sendo ouvida.',
    _CHATWSTIMEOUT_ : 'Não recebendo mensagens do servidor. Se esse problema persistir, alguns anti-virus podem acabar bloqueando mensagens do chat, verifique o seu.',
    _CHATTRANSLATEDAS_ : 'Tradução',
    _BASICCOMMANDS_ : 'Comandos Básicos',
    _ACTIONSAMPLE_ : '"/me [mensagem]": Envia a mensagem como uma ação da persona escolhida.',
    _OFFSAMPLE_ : '"/off [mensagem]": Envia a mensagem como uma mensagem fora de jogo, falando como o jogador.',
    _ACTUALSAMPLE_ : 'Exemplo: "/me se joga do penhasco."',
    _SHORTCUTS_ : 'Alternativamente, segure Alt, Control ou Shift quando for enviar a mensagem.',
    _MORECOMMANDS_ : 'Caso precise de uma listagem completa dos comandos, digite "/comandos".',
    _CLEARTIP_ : 'É recomendável executar "/clear 1" para limpar as mensagens no servidor de vez em quando, ou a sala ficará cada vez mais lenta.',
    _SELECTSOUNDS_ : "Caso deseje usar as músicas em modo offline, mas o RedPG em modo online, clique no formulário abaixo e escolha suas músicas: você estará dando permissão temporária para o RedPG acessá-las.",
    _INVALIDSLASHCOMMAND_ : '"%p" não é um comando reconhecido.',
    _INVALIDSLASHMESSAGE_ : '"%d" não é um comando válido para "%p".',
    _CHATLANGINVALID_ : 'O sistema não conhece essa língua.',
    _CHATLANGUNKNOWN_ : 'Você não tem permissão para falar essa língua.',
    _INVALIDMODULE_ : 'Uma mensagem do módulo "%p" foi recebida, enviada por %d, mas você não possui esse módulo. A mensagem não foi exibida.',
    _INVALIDWHISPER_ : 'Um jogador para "%p" não foi encontrado.',
    _TOOMANYWHISPER_ : 'Encontrei muitos possíveis alvos! Encontrei:',
    _WHISPERPICKONE_ : 'Por favor, adicione mais informação à busca...',
    _WHISPERORIGIN_ : 'mensagem de',
    _WHISPERDESTINATION_ : 'mensagem enviada para',
    _NICKCHANGE_ : 'Sua persona foi trocada para "%p".',
    _NICKREMOVED_ : 'Você não está mais usando nenhuma persona.',
    _CHATDATE_ : 'Mensagens de %p',
    _ZEBRAON_ : 'Listras adicionadas em mensagens do chat.',
    _ZEBRAOFF_ : 'Listras removidas das mensagens do chat.',
    _STORYNOSTORYTELLER_ : 'Apenas o mestre pode falar como história',
    _STORYTELLERHACK_ : '%p enviou uma mensagem de história, mas ele não é o mestre da sala. A mensagem foi ignorada.',
    _CHATCLEARED_ : 'A tela foi limpa, mas as mensagens ainda existem. Para apagar as mensagens da sala, digite "/clear 1".',
    _CLEARFAIL_ : 'Houve um erro ao tentar apagar as mensagens no servidor. Tente novamente.',
    _CLEARREMINDER_ : 'Uau! Essa sala tem um monte de mensagens! Caso a aplicação comece a ficar lenta, digite "/clear" para limpar a tela. Isso deve resolver. Se você for o mestre da sala, você também pode limpar as mensagens permanentemente através do comando "/clear 1".',
    _DICEWAITING_ : 'Esperando rolagens do servidor...',
    _DICEERROR_ : 'Houve um erro ao rolar os dados. Tente novamente.',
    _NODICEREASON_ : 'Uma razão para os dados não foi informada.',
    _NONOTON_ : 'Notificações de novas mensagens desativadas',
    _NONOTOFF_ : 'Notificações de novas mensagens ativadas.',
    _STREAMON_ : 'Modo para streams ativo. Play automático de sons e efeitos desativado. É recomendável ter Play automático de vídeos e Mostrar imagens automaticamente ativos.',
    _STREAMOFF_ : 'Modo para streams desativado. Play automático de sons e efeitos sonoros foi reativado. Caso essa não seja a configuração desejada para a conta, é recomendável alterar essas opções.',
    _NOWHISPERSON_ : 'Visualização de mensagens privadas desativada. Mensagens privadas não serão imprimidas.',
    _NOWHISPERSOFF_ : 'Visualização de mensagens privadas ativa. Mensagens privadas serão imprimidas.',
    _AUTOSEON_ : 'Efeitos sonoros enviados pelo mestre serão tocados automaticamente.',
    _AUTOSEOFF_ : 'Efeitos sonoros enviados pelo mestre não tocarão automaticamente.',
    _PCFNAME_ : 'Persona (Nome)',
    _PCFAVATAR_ : 'Avatar (Link)',
    _PCFHIDE_ : 'Não revelar persona',
    _PCFSEND_ : 'Criar a persona',
    _BUFFAPPLYINGBUFF_ : 'deseja aplicar a condição',
    _BUFFAPPLYINGTO_ : "em",
    _BUFFAPPLYINGFROM_ : "aplicado por",
    _BUFFAPPLYLINK_ : 'Clique aqui para aceitar.',
    _BUFFAPPLIED_ : "Condição aplicada",
    _BUFFREMOVED_ : "Condição removida",
    _CURRENTBUFFS_ : "Condições atuais em",
    _CURRENTBUFFBY_ : "por",
    _BUFFREMOVEDFROM_ : 'de',
    
    _POWERBOTTON_ : 'O chat ficará em baixo não importa o que aconteça.',
    _POWERBOTTOFF_ : "Comportamento do scorll automático retornado ao padrão.",

    _HASCONNECTED_ : '%p se conectou.',
    _HASDISCONNECTED_ : '%p se desconectou.',
    _CHATCONNERROR_ : 'Houve três erros no processamento de pedidos. Atualizações desse chat foram desligadas por enquanto. Envio de mensagens também foi desligado por enquanto.',
    _CHATCONNERRORRETRY_ : 'Clique aqui para voltar a atualizar essa sala.',
    _CHATRESEND_ : 'Essa mensagem não foi enviada. Clique aqui para tentar novamente.',
    _ROLLED_ : 'rolou %p. (Motivo: %d)',
    _DICEHASROLLED_ : 'rolou',
    _DICEHASSECRETLYROLLED_ : 'rolou secretamente',
    _VOTECREATED_ : 'criou uma votação',
    _HASTHROWN_ : 'mostra',
    _SHAREDIMAGE_ : '%p enviou uma imagem',
    _SHAREDTHEIMAGE_ : '%p enviou uma imagem',
    _SHAREDSOUND_ : '%p enviou uma música:',
    _SHAREDSOUNDEFFECT_ : '%p enviou um som:',
    _SOUNDSTOP_ : 'Pausar.',
    _SOUNDLINK_ : 'Tocar.',
    _IMAGELINK_ : 'Ver.',
    _SHAREDVIDEO_ : '%p compartilhou um vídeo.',
    _VIDEOLINK_ : 'Assistir.',
    _VIDEOINVALID_ : 'O vídeo compartilhado por %p continha um link inválido e não pode ser visto.',
    _PLAYERTOOLTIP_ : 'Jogador',
    _PERSONATOOLTIP_ : 'Personagem',
    _LASTMESSAGE_ : 'Ultima mensagem',
    _LASTUPDATE_ : 'Ultima atualização',
    _WHISPER_ : 'Enviar mensagem a %p',
    _CLOSE_ : 'Fechar',
    _STORYTELLERTOOLTIP_ : 'Mestre',
    _TOBOTTOM_ : 'Descer até  o fim',

    _CHATSETTINGS_ : 'Configurações do Chat',
    _INCREASEFONT_ : 'Aumentar Fonte',
    _DECREASEFONT_ : 'Diminuir Fonte',
    _LEAVECHAT_ : 'Sair da sala',

    _MESSAGE_ : 'Mensagem...',
    _SENDMESSAGE_ : 'Enviar mensagem',
    _MESSAGEPROMPT_ : 'Mensagem',

    _ADDPERSONA_ : 'Adicionar Persona',
    _REMOVEPERSONA_ : 'Remover Persona',
    _UPPERSONA_ : 'Subir a lista',
    _DOWNPERSONA_ : 'Descer a lista',

    _DICENUMBEREXPLAIN_ : 'Quantidade de dados para rolar',
    _DICENUMBER_ : '#',
    _DICEREASONEXPLAIN_ : "Motivo pelo qual o dado será rolado.",
    _DICEREASON_ : 'Motivo',
    _DICEFACESEXPLAIN_ : 'Faces do dado. Apenas o número. 6 para d6.',
    _DICEFACES_ : 'd#',
    _DICEMODEXPLAIN_ : 'Modificador do dado. Apenas número.',
    _DICEMOD_ : '+#',
    _DICETOWER_ : 'Rolagem secreta (visível apenas ao mestre)',
    _DICENUMBERPROMPT_ : 'Quantidade de dados a rolar, um número',
    _DICEFACESPROMPT_ : 'Número de faces que o dado possui, apenas números',
    _DICEREASONPROMPT_ : 'Motivo pelo qual o dado será rolado',
    _DICEMODPROMPT_ : 'Número de modificador a ser adicionado no dado',
    _ROLLDICE_ : 'Rolar dados',
    _ROLLD4_ : 'Rolar d4',
    _ROLLD6_ : 'Rolar d6',
    _ROLLD8_ : 'Rolar d8',
    _ROLLD10_ : 'Rolar d10',
    _ROLLD12_ : 'Rolar d12',
    _ROLLD20_ : 'Rolar d20',
    _ROLLD100_ : 'Rolar d100',

    _LONGLOAD_ : 'O servidor está demorando a responder...',
    _CONNECTIONERROR_ : 'Houve um erro na conexão com o servidor.',
    
    /* Chat Module Help */
    
    _HELPINVALIDMODULE_ : 'Módulo desconhecido. Digite "/comandos" para ver uma lista completa de módulos.',
    _MODULENOHELP_ : 'Módulo "%p" não possui explicações adicionais.',
    _MODULELIST_ : 'Módulos',
    _HELPSHORTHELP_ : 'Digite "/help [comando]" para receber informações extras sobre algum comando. Exemplo: /h /h',
    _HELPLONGHELP_ : 'Digite "/help" para uma listagem completa de comandos. Digite "/help [comando]" para receber informações especiais sobre um comando em específico.',
    _COUNTDOWNSHORTHELP_ : 'Faz uma contagem em segundos. Exemplo: /timer 10',
    _VOTESHORTHELP_ : 'Cria uma votação. Exemplo: /vote Ir pela esquerda',
    _BGMPLAYSHORTHELP_ : 'Toca um link de música. Uso: /bgmplay http://linkdamusica.mp3',
    _SEPLAYSHORTHELP_ : 'Toca um link de efeito sonoro. Uso: /seplay http://linkdamusica.mp3',
    _ACTIONSHORTHELP_ : 'Imprime a mensagem como uma ação com a persona atual. Exemplo: /me pula no lugar',
    _CLEARSHORTHELP_ : 'Limpa a tela da sala. Exemplo: /clear. Pode-se adicionar "1" ao comando para também apagar as mensagens antigas do servidor, exemplo: /clear 1',
    _NOTIFICATIONSHORTHELP_ : 'Ativa/Desativa o aviso de mensagens novas no nome da janela.',
    _NOWHISPERSHORTHELP_ : 'Ativa/Desativa a impressão de whispers enviados.',
    _NOSESHORTHELP_ : 'Ativa/Desativa efeitos sonoros.',
    _STREAMSHORTHELP_ : 'Ativa/Desativa modo stream. "/h stream" para conseguir mais informações.',
    _STREAMLONGHELP_ : '"/stream" Ativa/Desativa modo Stream. Durante o modo stream, "/stream LINK" em uma outra janela irá trocar o background da stream. "/stream PICTURE" irá fechar qualquer imagem aberta. "/stream YOUTUBE" irá fechar vídeos na stream.',
    _TITLESHORTHELP_ : 'Troca o título da janela. Exemplo: /title Camera',
    _STORYSHORTHELP_ : 'Imprime a mensagem como narrativa. Apenas narradores podem utilizar esse módulo. Exemplo: /story Enquanto isso, no castelo...',
    _ZEBRASHORTHELP_ : 'Ativa/Desativa listras nas mensagens impressas.',
    _OFFGAMESHORTHELP_ : 'Imprime a mensagem como algo fora-de-jogo. Exemplo: /off vou comer pizza, já volto',
    _WHISPERSHORTHELP_ : 'Envia a mensagem como uma mensagem privada para um jogador. Uso: /whisper [jogador], [mensagem]. Exemplo: /whisper Reddo#0001, Olá',
    _WHISPERLONGHELP_ : 'Envia a mensagem como mensagem privada para um jogador. Pressione TAB para completar o nome do jogador automaticamente. Exemplo: /w Red[TAB]. /w [tab] irá mostrar uma lista de todos os jogadores para que escolha.',
    _LINGOSHORTHELP_ : 'Envia a mensagem como uma mensagem de língua. Exemplo: "/lang Elvish, Olá" irá codificar Olá na língua Elvish. Adicionar "sto" no comando irá codificar com a língua na história. Exemplo: /langsto Elvish, Algo escrito em um livro',
    _YOUTUBESHORTHELP_ : 'Envia um link de youtube como vídeo. Exemplo: /youtube https://www.youtube.com/watch?v=moSFlvxnbgk',
    _PICASHORTHELP_ : 'Abre uma tela em branca para todos desenharem. Texto digitado se torna o nome da imagem. Usar o mesmo texto mais de uma vez na mesma sala faz a mesma imagem abrir. Caso contrário, imagens diferentes serão abertas para cada comando executado.',
    
    /* Config */
    _SYSTEMCONFIGHEADER_ : 'Configurações',
    _VERSIONNAME_ : 'Versão',
    _VERSIONINFO_ : 'Clique aqui para mais informações',
    
    /* Game Permissions */
    _GAMEPERMISSIONSHEADER_ : 'Permissões de Mesa',
    _GAMEPERMISSIONKICK_ : 'Expulsar',
    _GAMEPERMISSIONCREATE_ : 'Criar Fichas',
    _GAMEPERMISSIONVIEW_ : 'Ver Fichas',
    _GAMEPERMISSIONEDIT_ : 'Editar Fichas',
    _GAMEPERMISSIONSUBMIT_ : 'Salvar',
    _GAMEPERMISSIONEXP1_ : 'Essas são as permissões globais que os jogadores da sua mesa tem.',
    _GAMEPERMISSIONEXP2_ : 'Dessa forma, "Ver Fichas" significa que o jogador pode acessar todas as fichas da mesa. "Editar Fichas" significa que o jogador pode editar qualquer ficha que vê. "Criar Fichas" significa que um jogador pode criar fichas dentro daquela mesa.',
    _GAMEPERMISSIONINVITE_ : 'Convidar Jogadores',
    
    /* Games */
    _GAMESCONFIRMLEAVE_ : 'Tem certeza que deseja sair do jogo "%p"? Isso é irreversível.',
    _GAMESHEADER_ : 'Mesas',
    _GAMESNICK_ : 'Caso precise informar seu identificador para alguém, ele é "%p", sem as aspas.',
    _GAMESEXPLAIN1_ : 'Aqui você pode administrar as mesas das quais você participa. Para convidar jogadores à sua mesa, você irá precisar do identificador deles.',
    _GAMESEXPLAIN2_ : 'Uma mesa nesse sistema é o lugar no qual todas as outras partes do sistema se conectam. As salas, o ambiente no qual as partidas são jogadas, ficam anexadas à uma mesa. As fichas de personagens ficam anexadas à uma mesa.',
    _GAMESEXPLAIN3_ : 'No momento não é possível pedir uma lista de mesas de livre entrada (não implementados).',
    _GAMESOPENCLOSE_ : 'Clique aqui para mostrar ou esconder o conteúdo dessa mesa.',
    _GAMESDELETE_ : 'Deletar a mesa',
    _GAMESLEAVE_ : 'Sair da mesa',
    _GAMESPERMISSIONS_ : 'Permissões da mesa',
    _GAMESOPTIONS_ : 'Opções da Mesa',
    _GAMESNEWROOM_ : 'Criar nova sala',
    _GAMESNOROOMS_ : 'Nenhuma sala é visível.',
    _GAMESLOGS_ : 'Logs',
    _GAMESNOLOGS_ : 'Nenhum log é visível.',
    _GAMESINVITE_ : 'Convidar jogadores',
    _GAMESROOMOPTIONS_ : 'Alterar Permissões',
    _GAMESDESTROYROOM_ : 'Excluir',
    _GAMESJOINROOM_ : 'Clique para entrar nessa sala',
    _GAMESROOMTOOLTIP_  : 'Sala',
    _GAMESSEELOG_ : 'Clique para ver esse log',
    _GAMESDESTROYLOG_ : 'Excluir o Log',
    _GAMESLOGPERMISSIONS_ : 'Alterar permissões do log',
    _GAMESNEWGAME_ : 'Criar nova mesa',
    _GAMESMYINVITESBUTTON_ : 'Ver convites recebidos',
    _GAMESCREATEEXPLAIN_ : 'Todas as funções do sistema se baseiam em mesas.',
    _GAMESCREATORTOOLTIP_ : 'Criador',
    _GAMESLOADERROR_ : 'Não foi possível carregar a lista de mesas. Tente novamente.',
    _NEWGAMEHEADER_ : 'Criar Mesa',
    _NEWGAMENAME_ : 'Nome da Mesa',
    _NEWGAMENAMEERROR_ : 'Máximo de 30 caracteres. O nome da mesa deve possuir apenas letras, números e espaços. Ele não deve começar por espaço.',
    _NEWGAMEDESCRIPTION_ : 'Descrição da Mesa. Será visível na listagem de salas e quando a mesa for visualizado por alguém que deseja se inscrever.',
    _NEWGAMEFREEJOIN_ : 'Inscrição Livre (Não implementado)',
    _NEWGAMEFREEJOINEXP_ : 'Permite que jogadores procurando mesas visualizem essa mesa e se inscrevam nela. Usuários que entrarem na sua mesa dessa maneira não receberão permissão para utilizar nada que não seja livre dentro da mesa e você será informado da inscrição. Não está implementado e, portanto, não funciona, mas você pode marcar essa opção desde já, caso deseje.',
    _SENDNEWGAME_ : 'Confirmar criação',
    _EDITGAMEHEADER_ : 'Alterar Mesa',
    _SENDEDITGAME_ : 'Confirmar mudanças',
    _INVALIDGAME_ : 'Mesa inválida ou inexistente',
    _NEWGAMEERROR_ : 'Houve um erro no envio da informação, tente novamente.',
    _GAMESDELETEERROR_ : 'Houve um erro. O pedido não foi executado.',
    
    _GAMESINVITEHEADER_ : 'Adicionar Jogadores',
    _GAMESINVITEEXPLAIN_ : 'Aqui você adiciona jogadores a mesa. Um jogador só pode visualizar qualquer coisa de uma mesa quando ele foi convidado e aceitou o convite. Depois de enviar o convite, você não poderá repetir o envio até o jogador aceitar ou recusar o convite. Para convidar um jogador, você precisa digitar o identificador dele no formulário abaixo. Identificadores de todos são parecidos com o seu, como "Nome#1234".',
    _GAMESINVITECURRENTGAME_ : 'Você está adicionando jogadores para a mesa "%p".',
    _GAMESINVITE401_ : 'O servidor disse que você não tem permissões para convidar nessa mesa. Seu login expirou? Tente novamente.',
    _GAMESINVITE404_ : 'O jogador digitado não foi encontrado, verifique se digitou o identificador corretamente.',
    _GAMESINVITE500_ : 'O servidor encontrou um erro no processamento do pedido. Tente novamente.',
    _GAMESINVITE200_ : 'Convite enviado! Agora é só aguardar até o jogador aceitar.',
    _GAMESINVITEDEF_ : 'Houve um erro no processamento do pedido. Tente novamente.',
    _GAMESINVITEINPUT_ : 'Identificador#',
    _INVITESNOINVITES_ : 'Nenhum convite recebido.',
    _INVITESGAME_ : 'Jogo',
    _GAMESINVITEMESSAGE_ : 'Mensagem de convite. Apresente-se e explique o motivo de estar convidando o jogador à sua mesa.',
    _GAMESINVITESUBMIT_ : 'Enviar convite',
    _GAMESINVITEKEEPGOING_ : 'Convidar mais jogadores ao enviar',
    _NEWROOMPBP_ : 'Play-by-Post',
    _NEWROOMPBPEXPLAIN_ : 'Uma sala no modo Play-by-Post não é ideal para sessões de jogo em tempo real. Jogadores serão informados até uma vez por dia de novos posts em uma sala Play-By-Post que possam acessar (não implementado).',
    
    _GAMESMYINVITESHEADER_ : 'Meus Convites',
    _GAMESMYINVITESEXPLAIN_ : 'Enquanto você não aceitar um dos convites, você não faz parte da mesa.',
    _GAMESMYINVITESACCEPT_ : 'Aceitar',
    _GAMESMYINVITESREJECT_ : 'Recusar',
    _GAMESMYINVITESCREATOR_ : 'Criador da Mesa',
    _GAMESMYINVITESNOMESSAGE_ : 'Nenhuma mensagem foi anexada a esse convite.',
    _GAMESMYINVITESMYIDENTIFIER_ : 'Caso precise informar seu identificador a alguém, ele é "%p".',
    
    _NEWROOMHEADER_ : 'Nova Sala',
    _NEWROOMEXPLAIN_ : 'A sala é onde uma história do jogo é criada. Todas as mensagens que forem enviadas serão enviadas a uma sala.',
    _NEWROOMERROR_ : 'Houve um erro no processamento do pedido. Tente novamente.',
    _NEWROOMNAME_ : 'Nome da sala',
    _NEWROOMNAMEERROR_ : 'O nome da sala é como ela será listada. 3-30 caracteres. Apenas letras e números. Não pode começar com espaço.',
    _NEWROOMDESCRIPTION_ : 'Descrição da sala. Esse campo será imprimido toda vez que entrarem na sala. Coloque aqui a razão da sala existir (História Principal, História Secundária, Level Up, etc). Outras informações, como horário de jogo e participantes, também podem ser úteis.',
    _NEWROOMPRIVATE_ : 'Privada',
    _NEWROOMPRIVATEEXPLAIN_ : 'Uma sala que não é privada pode ser acessada por qualquer um que faça parte da mesa. Salas privadas exigem permissões individuais para serem acessadas. (Não implementado) O sistema no momento não possui as partes de controle de permissões. Uma sala privada não poderá ser acessada, no momento.',
    _NEWROOMSTREAMABLE_ : 'Pública',
    _NEWROOMSTREAMABLEEXPLAIN_ : 'Uma sala pública pode ser acessada até por pessoas que não fazem parte do mesa. Também irão ser listadas no gerador de Streams. (Não implementado)',
    _SENDROOM_ : 'Criar a sala',
    _NEWROOMCURRENTGAME_ : 'Você está criando salas para a mesa "%p".',
    
    /* \n = New Line */
    _GAMESCONFIRMDELETE_ : 'Tem certeza que deseja deletar "%p"?\nIsso é irreversível!',
    
    /* Changelog! */
    _REDUPDATES_ : 'Para receber os updates marcados em vermelho você precisa atualizar sua aplicação para a última versão.',
    _BACKWARDSCOMPATIBILITY_ : 'Compatibilidade com versões anteriores não é intencional. Não existem garantias de que versões desatualizadas funcionem e é recomendável sempre utilizar a versão mais recente do aplicativo.',
    _YOURVERSION_ : 'A sua versão é',
    _LASTVERSION_ : 'A versão mais recente é',
    _CHANGELOGNOTLOADED_ : 'Não foi possível carregar a lista de atualizações.',
    _CHANGELOGLOADALL_ : 'Carregar Changelog completo',
    
    /* CHAT LOGGER */
    _LOGGERMESSAGEEXPLAIN_ : "O excerto a seguir representa as primeiras e as últimas mensagens que irão fazer parte deste log. Você pode alterar o slider abaixo para definir onde começar o log e onde terminar o log. Apenas mensagens públicas (não enviadas a uma pessoa específica) serão guardadas no JSON. Você pode mover com as setas do teclado após clicar nos sliders.",
    _LOGGERGENERATEJSON_ : "Criar JSON",
    _LOGGERTYPESEXPLAIN_ : "Aqui você pode definir quais tipos de mensagens não serão salvas. Lembrando que apenas mensagens públicas (visível a todos) serão salvas no log.",
    _LOGGERMSGBY_ : 'por',
    _LOGGERNOTTYPE_ : "Não é possível mostrar os conteúdos dessa mensagem, mas ela pode ser salva.",
    _LOGGERLOADJSON_ : 'Carregar Log',
    
    /* Combat Tracker */
    _COMBATTRACKER_ : "Gerenciador de Combate",
    _COMBATTRACKERMINIMIZE_ : "Minimizar",
    _COMBATTRACKERDELETEROW_ : "Remover do Combate",
    _COMBATTRACKERINITIATIVE_ : "Iniciativa",
    _COMBATTRACKERSETTARGET_ : "Selecionar como Alvo",
    _COMBATTRACKEROPENSHEET_ : "Abrir Ficha",
    _COMBATTRACKERADDSHEET_ : "Adicionar ao Combate",
    _COMBATTRACKERSHEETSELECT_ : "Selecione a ficha para entrar no combate. Apenas fichas da mesma mesa que essa sala serão listadas e você precisa ter acessado a lista de fichas alguma vez.",
    _COMBATTRACKERREFRESH_ : "Atualizar lista",
    _COMBATTRACKERSORT_ : "Ordenar por iniciativa",
    _COMBATTRACKERTURN_ : "Passar um turno",
    _COMBATTRACKERSETTURN_ : 'Fazer ser o turno desse personagem',
    _COMBATTRACKERNEWROUND_ : "Passar uma rodada",
    _COMBATTRACKERPLAYERSELECT_ : 'Selecione um jogador (ou nenhum). Se um jogador for selecionado, ele é avisado quando seu turno chega.',
    _COMBATTRACKERNOPARTICIPANTS_ : 'Sem participantes em combate.',
    
    /* Language Tracker */
    _LANGUAGETRACKER_ : 'Gerenciador de Línguas',
    _LANGUAGETRACKERMINIMIZE_ : 'Minimizar',
    _LANGUAGETRACKERNOPLAYERS_ : 'Sem jogadores para mostrar.',
    
    /* Addon Box */
    _ADDONBOXLOADING_ : 'Carregando...',
    _ADDONBOXLOADINGEXPLAIN_ : "Lista está sendo carregada.",
    _ADDONBOXLOADINGERROR_ : "Erro ao carregar lista",
    _ADDONBOXLOADINGERROREXPLAIN_ : "Não foi possível carregar a lista.",
    _ADDONBOXLOADEDERROR_ : 'Erro',
    _ADDONBOXLOADEDERROREXPLAIN_ : 'Lista foi carregada, mas é inválida.',
    _ADDONBOXNOTFOUND_ : 'Desconhecido',
    _ADDONBOXNOTFOUNDEXPLAIN_ : 'Item não encontrado.',
    
    /* Styles */
    _STYLEWINDOW_ : "Gerenciar estilos de ficha",
    _STYLESHEADER_ : "Estilos",
    _STYLEPUBLIC_ : "Estilo público",
    _STYLEFORGAME_ : "Estilo apenas para a mesa",
    _STYLENAME_ : "Nome",
    _STYLEAFTER_ : "JS pós-processo",
    _STYLEBEFORE_ : "JS pré-processo",
    _STYLECSS_ : "CSS",
    _STYLEHTML_ : "HTML",
    _STYLESUBMIT_ : "Enviar",
    _STYLESTAYHERE_ : "Continuar nessa página após envio",
    _STYLECREATE_ : "Criar estilo",
    _STYLECOPY_ : 'Copiar estilo',
    _STYLENOSTYLES_ : "Sem estilos carregados. Abra uma ficha.",
    
    /* Picture UI */
    _DRAWINGSIZE_ : 'Tamanho do pincel (Não implementado)',
    _DRAWINGCOLOR_ : 'Cor do pincel',
    _DRAWINGCLEAR_ : 'Apagar desenhos',
    _DRAWINGERASER_ : 'Borracha, tamanho 10',
    _DRAWINGLOCK_ : 'Trancar desenho para o mestre',
    
    /* Sheet Commons */
    _SHEETSLOADIMAGES_ : 'Lista de imagens ainda não foi aberta',
    _SHEETSLOADSHEETS_ : 'Lista de fichas ainda não foi aberta',
    _SHEETCOMMONSPLAYER_ : 'Jogador',
    _SHEETCOMMONSOPEN_ : 'Abrir/Fechar',
    _SHEETCOMMONSNEWCATEGORY_ : 'Nova Categoria',
    _SHEETCOMMONSNEWIMAGE_ : 'Adicionar Imagem',
    _IMAGEARCHIVE_ : 'Banco de Imagens',
    _SHEETCOMMONSTYPE_ : 'Tipo',
    _SHEETCOMMONSPICKIMAGE_ : 'Escolha uma imagem',
    _SHEETCOMMONSPICKIMAGENOFOLDER_ : "Sem pasta",
    _SHEETCOMMONSPICKIMAGENONE_ : 'Sem Imagem',
    _SHEETCOMMONSPICKSHEET_ : 'Escolha uma ficha',
    _SHEETCOMMONSNEWDUAL_ : 'Nova lista dupla',
    _SHEETCOMMONSNEWLINE_ : 'Novo campo',
    _SHEETCOMMONSNEWSINGLE_ : 'Nova lista',
    _GENERICSHEET_ : 'Ficha Genérica',
    _SHEETCOMMONSMAPINFO_ : 'Configuração do Mapa',
    _SHEETMAP_ : 'Mapa',
    _SHEETCOMMONSADDTOKEN_ : 'Adicionar token',
    _SHEETCOMMONSCHANGETOKEN_ : 'Edit token',
    
    
    /* Map */
    _MAPCURRENTTURN_ : 'Turno Atual',
    _MAPTARGET_ : 'Seu alvo',
    
    
    /* FOrum */
    _HOMEFORUM_ : 'Tópicos ativos no fórum',
    _HOMEFORUMERROR_ : "Não foi possível carregar o fórum.",
    _FORUMBY_ : 'por',
    _FORUMLATESTIN_ : 'em',
    _FORUMLATESTPOST_ : 'Post',
    
    /* Donations */
    _HOMEDONATIONS_ : 'Doações',
    _HOMEDONATIONSEXPLAIN1_ : 'RedPG é um sistema gratuito e permanecerá gratuito enquanto isso for possível. Mas o servidor possui um custo e alguém precisa pagar.',
    _HOMEDONATIONSEXPLAIN2_ : 'Através de doações, você funda o desenvolvimento do sistema e ajuda a pagar as mensalidades do servidor. Com a ajuda de todos, RedPG poderá ser grátis para sempre!',
    _HOMEDONATIONSEXPLAIN3_ : 'Sempre que fizer uma doação, tente realizar ela a partir de uma conta registrada no mesmo nome registrado no RedPG. Assim, no futuro suas doações poderão ser contabilizadas pelo sistema do RedPG!',
    
    
    
    
    /* Video Player */
    _VIDEOPLAYER_ : 'Video Player',
    
    /* CHrome */
    
    _CHROME1_ : 'Esse aplicativo é testado para o navegador Google Chrome e, por consequência, Chromium.',
    _CHROME2_ : 'Compatbilidade com outros browsers é desejável, mas incidental. Utilizar Chrome ou Chromium junto desse aplicativo é recomendado.',
    _CHROME3_ : 'Clique aqui para esconder essa mensagem.'
}; 
 
window.lingo['SP'] = {
    _LANGUAGENAME_ : 'Spañol',
    
    /* Login */
    _LOGIN_ : 'Login',
    _PASSWORD_ : 'Senha',
    _CONFIRMLOGIN_ : 'Entrar',
    _FORGOTPASSWORD_ : 'Esqueceu sua senha?',
    _NEWACCOUNT_ : 'Criar nova conta',
    _LOGININVALID_ : "Credenciais inválidas",
    _LOGINCONNECTIONERROR_ : "Erro na conexão com o servidor",
    _LOGINTIMEOUT_ : "Sua sessão expirou",
    
    _CREATEACCOUNTHEADER_ : 'Criação de conta',
    _CANAME_ : 'Nome',
    _CAEMAIL_ : 'E-mail',
    _CANICK_ : 'Apelido',
    _CAPASSWORD_ : 'Senha',
    _CAPASSWORD2_ : 'Senha (Repetir)',
    _CASUBMIT_ : 'Criar conta',
    _CANAMEEXPLAIN_ : 'Seu nome. Obrigatório.',
    _CAEMAILEXPLAIN_ : "Seu e-mail. Obrigatório. Deve ser válido.",
    _CANICKEXPLAIN_ : "Obrigatório. Letras e números. Não começa com espaço.",
    _CAPASSEXPLAIN_ : "Obrigatório. Apenas letras e números.",
    _CAPASS2EXPLAIN_ : "Deve ser igual à senha acima..",
    
    /* Menu */
    _HIDELEFTWINDOWS_ : 'Esconder Janelas',
    _CALLCHATWINDOW_ : 'Abrir Chat',
    _GAMES_ : 'Jogos',
    _SETTINGS_ : 'Config',

    _HIDERIGHTWINDOWS_ : 'Esconder Janelas',
    _SHEETS_ : 'Fichas',
    _STYLES_ : 'Estilos',
    _MYACCOUNT_ : 'Minha Conta',
    _LOGOUT_ : 'Logout',
    _OPENOLDSYSTEM_ : "Sistema Antigo",
    
    /* Picture Show */
    _CLOSEIMAGE_ : 'Clique aqui para fechar a imagem.',

    /* Room */
    _BASICCOMMANDS_ : 'Comandos Básicos',
    _ACTIONSAMPLE_ : '"/me [mensagem]": Envia a mensagem como uma ação da persona escolhida.',
    _OFFSAMPLE_ : '"/off [mensagem]": Envia a mensagem como uma mensagem fora de jogo, falando como o jogador.',
    _ACTUALSAMPLE_ : 'Exemplo: "/me se joga do penhasco."',
    _MORECOMMANDS_ : 'Caso precise de uma listagem completa dos comandos, digite "/comandos".',
    _INVALIDSLASHCOMMAND_ : '"%p" não é um comando reconhecido.',

    _HASCONNECTED_ : '%p se conectou.',
    _HASDISCONNECTED_ : '%p se desconectou.',
    _ROLLED_ : 'rolou %p. (Motivo: %d)',
    _SHAREDIMAGE_ : '%p compartilhou uma imagem.',
    _IMAGELINK_ : 'Clique aqui para ver.',
    _PLAYERTOOLTIP_ : 'Jogador',
    _PERSONATOOLTIP_ : 'Personagem',
    _LASTMESSAGE_ : 'Ultima mensagem',
    _LASTUPDATE_ : 'Ultima atualização',
    _WHISPER_ : 'Enviar mensagem a %p',
    _STORYTELLERTOOLTIP_ : 'Mestre',
    _TOBOTTOM_ : 'Descer até  o fim',

    _CHATSETTINGS_ : 'Configurações do Chat',
    _INCREASEFONT_ : 'Aumentar Fonte',
    _DECREASEFONT_ : 'Diminuir Fonte',
    _LEAVECHAT_ : 'Sair da sala',

    _MESSAGE_ : 'Mensagem...',
    _SENDMESSAGE_ : 'Enviar mensagem',
    _MESSAGEPROMPT_ : 'Mensagem',

    _ADDPERSONA_ : 'Adicionar Persona',
    _REMOVEPERSONA_ : 'Remover Persona',
    _UPPERSONA_ : 'Subir a lista',
    _DOWNPERSONA_ : 'Descer a lista',

    _DICENUMBEREXPLAIN_ : 'Quantidade de dados para rolar',
    _DICENUMBER_ : '#',
    _DICEREASONEXPLAIN_ : "Motivo pelo qual o dado será rolado.",
    _DICEREASON_ : 'Motivo da Rolagem',
    _DICEFACESEXPLAIN_ : 'Faces do dado. Apenas o número. 6 para d6.',
    _DICEFACES_ : 'd#',
    _DICENUMBERPROMPT_ : 'Quantidade de dados a rolar, um número',
    _DICEFACESPROMPT_ : 'Número de faces que o dado possui, apenas números',
    _DICEREASONPROMPT_ : 'Motivo pelo qual o dado será rolado',
    _ROLLDICE_ : 'Rolar dados',
    _ROLLD4_ : 'Rolar d4',
    _ROLLD6_ : 'Rolar d6',
    _ROLLD8_ : 'Rolar d8',
    _ROLLD10_ : 'Rolar d10',
    _ROLLD12_ : 'Rolar d12',
    _ROLLD20_ : 'Rolar d20',
    _ROLLD100_ : 'Rolar d100',

    _LONGLOAD_ : 'O servidor está demorando a responder...',
    _CONNECTIONERROR_ : 'Houve um erro na conexão com o servidor.'
}; 
 
function LoginUI () {
    this.$logininput;
    this.$loginpasswordinput;
    this.$loginwindow;
    this.$loginformwindow;
    this.$loginformform;
    this.$loginerrorinvalid;
    this.$loginerrorconnection;
    this.$logininactiveerror;
    this.$timeouterror;
    this.$confirmsuccess;
    this.$confirmerror;
    this.$createwindow;
    this.$cainputname;
    this.$cainputnick;
    this.$cainputemail;
    this.$cainputpass;
    this.$cainputpass2;
    this.$cainputage;
    this.$caconnerror;
    this.$canickerror;
    this.$caemailerror;
    
    this.open = false;
    
    this.init = function () {
        this.$logininput = $('#loginInput');
        this.$loginpasswordinput = $('#passwordInput');
        this.$loginwindow = $('#loginWindow');
        this.$loginformwindow = $('#loginFormWindow');
        this.$createwindow = $('#loginCreateAccountWindow');
        this.$loginformform = $('#loginFormForm');
        //this.$createwindow.find('span').hide();
        
        this.$cainputname = $('#caInputName');
        this.$cainputnick = $('#caInputNick');
        this.$cainputemail = $('#caInputEmail');
        this.$cainputpass = $('#caInputPassword');
        this.$cainputpass2 = $('#caInputPassword2');
        this.$cainputage = $('#caInputAge');
        this.$caconnerror = $('#caConnError');
        this.$canickerror = $('#caNicknameError');
        this.$caemailerror = $('#caEmailError');
        
        $('#loginFlags').html(window.app.ui.language.createFlags());
        
        this.$loginerrorinvalid = $('#loginInvalidError');
        this.$loginerrorconnection = $('#loginConnectionError');
        this.$logininactiveerror = $('#loginInactiveError');
        this.$confirmsuccess = $('#loginConfirmationSuccess');
        this.$confirmerror = $('#loginConfirmationFailure');
        this.$timeouterror = $('#loginTimeoutError');
        
        
        this.$loginformwindow.find('p.error').hide();
        this.$loginwindow.find('.window').hide();
        this.callWindow('loginFormWindow');
        
        this.setBindings();
        this.considerConfirm();
        
        // If we have cookies, try to restore session first.
        if (window.app.loginapp.hasJsessid()) {
            this.restoreSession();
        }
        
        // On logged out
        
        window.app.loginapp.onLoggedout = window.app.emulateBind(
            function () {
                this.$loginwindow.show();
                this.ui.callWindow('loginFormWindow');
                window.app.ui.hideUI();
            }, {$loginwindow : this.$loginwindow, ui : this}
        );
    };
    
    this.considerConfirm = function () {
        this.$confirmerror.hide();
        this.$confirmsuccess.hide();
        if (window.location.search === '?confirm') {
            window.app.ui.showLoading();
            var uuid = window.location.hash.substr(1);
            var cbs = window.app.emulateBind(function () {
                this.$msg.show();
                window.app.ui.hideLoading();
            }, {$msg : this.$confirmsuccess});
            
            var cbe = window.app.emulateBind(function () {
                this.$msg.show();
                window.app.ui.hideLoading();
            }, {$msg : this.$confirmerror});
            
            window.app.loginapp.confirm(uuid, cbs, cbe);
        }
    };
    
    this.callWindow = function (id, cb) {
        /*
        var callback = function () {
            $('#' + this.id).fadeIn(200, this.cb);
        };
        if (typeof cb === 'undefined') {
            var cb = function () {};
        }
        callback = callback.bind({'id':id, 'cb':cb});
        this.$loginwindow.find('.window:not(#'+id+')').fadeOut(200, callback);
        */
        window.app.ui.hideUI();
        this.$loginwindow.find('.window:not(#'+id+')').hide();
        $('#' + id).show();
        if (typeof cb !== 'undefined')
            cb();
        
        this.open = true;
    };
    
    this.setBindings = function () {
        $(document).on('submit','#loginFormForm', function() {
            window.app.ui.loginui.processLogin();
        });
        
        $('#newAccountButton').bind('click', function() {
            window.app.ui.loginui.openCreation();
        });
        
        $('#createAccountButton').bind('click', function () {
            window.app.ui.loginui.createAccount();
        });
        
        $('#loginConfirmationFailureButton').bind('click', function () {
            window.app.ui.loginui.considerConfirm();
        });
        
        this.$caemailerror.bind('click', function () {
            alert("Não implementado");
        });
        
        $('#emailConfirmationReturnLink').bind('click', function () {
            window.app.ui.loginui.callWindow('loginFormWindow');
        });
        
        $('#logoutBt').bind('click', function () {
            if (confirm(window.app.ui.language.getLingo("_CONFIRMLOGOUT_"))) {
                window.app.ui.loginui.logout();
            }
        });
    };
    
    this.createAccount = function () {
        this.$caconnerror.hide();
        this.$caemailerror.hide();
        this.$canickerror.hide();
        this.$createwindow.find('input').each(function() {
            $(this).removeClass('error');
        });
        
        var validation = new FormValidator($('#loginCreateAccountForm'));
        var valid = validation.validated;
        
        for (var i in validation.$errors) {
            validation.$errors[i].addClass('error');
        }
        
        if (!this.$cainputage.is(':checked')) {
            this.$cainputage.addClass('error');
            valid = false;
        }
        if (this.$cainputpass.val() !== this.$cainputpass2.val()) {
            this.$cainputpass2.addClass('error');
            valid = false;
        }
        if (valid) {
            window.app.ui.showLoading();
            
            var form = {
                name : this.$cainputname.val(),
                nickname : this.$cainputnick.val(),
                email : this.$cainputemail.val(),
                password : this.$cainputpass.val()
            };
            
            var cbs = function (data) {
                window.app.ui.loginui.callWindow('emailConfirmation', function () {
                    window.app.ui.hideLoading();
                });
                console.log(data);
            };
            
            var cbe = function (data) {
                console.log(data);
                if (data.status === 409) {
                    window.app.ui.loginui.$caemailerror.show();
                } else if (data.status === 420) {
                    window.app.ui.loginui.$canickerror.show();
                } else {
                    window.app.ui.loginui.$caconnerror.show();
                }
                window.app.ui.hideLoading();
                console.log(data);
            };
            
            window.app.loginapp.createAccount(form, cbs, cbe);
        }
    };
    
    this.openCreation = function () {
        this.$caconnerror.hide();
        this.$caemailerror.hide();
        this.$canickerror.hide();
        this.callWindow('loginCreateAccountWindow', function () {
            window.app.ui.loginui.$cainputname.focus();
        });
    };
    
    this.restoreSession = function () {
        window.app.ui.showLoading();
        
        
        var cbs = window.app.emulateBind(function () {
            window.app.ui.showUI();
            this.$loginwindow.fadeOut(200);
            window.app.ui.hideLoading();
            window.app.ui.loginui.onLogin(null);
        }, {$loginwindow : this.$loginwindow});
        
        var cbe = function () {
            window.app.ui.hideLoading();
        };
        
        window.app.loginapp.login(null, null, cbs, cbe);
    };
    
    this.processLogin = function () {
        this.$confirmsuccess.hide();
        this.$loginerrorconnection.hide();
        this.$loginerrorinvalid.hide();
        this.$logininactiveerror.hide();
        
        var validate = new FormValidator(this.$loginformform);
        
        var cbs = window.app.emulateBind(function () {
            window.app.ui.showUI();
            localStorage.lastLogin = this.$input.val();
            this.$input.val('');
            this.$password.val('');
            this.$loginwindow.fadeOut(200);
            window.app.ui.hideLoading();
            window.app.ui.loginui.onLogin(null);
        }, {$loginwindow : this.$loginwindow,
            $input : this.$logininput,
            $password : this.$loginpasswordinput});
        
        if (!validate.validated) {
            this.$loginerrorinvalid.show();
            if (window.app.debug && this.$logininput.val() === '') {
                cbs();
            }
            return false;
        }
        
        window.app.ui.showLoading();
        var cbe = window.app.emulateBind(function (data) {
            var code = data.status;
            if (code === 404) {
                this.$logininvalid.show();
            } else if (code === 401) {
                this.$logininactiveerror.show();
            } else {
                this.$loginerror.show();
            }
            window.app.ui.hideLoading();
        }, {$loginerror : this.$loginerrorconnection,
            $logininvalid : this.$loginerrorinvalid,
            $logininactiveerror : this.$logininactiveerror});
        
        var login = this.$logininput.val();
        var password = this.$loginpasswordinput.val();
        
        window.app.loginapp.login(login, password, cbs, cbe);
    };
    
    this.logout = function () {
        window.app.ui.showLoading();
        
        var cbs = window.app.emulateBind(
            function () {
                this.$loginwindow.show();
                this.ui.callWindow('loginFormWindow');
                window.app.ui.chat.cc.exit();
                window.app.ui.callLeftWindow('changelogWindow');
                window.app.ui.callRightWindow('homeWindow');
                window.app.ui.hideLoading();
            }, {$loginwindow : this.$loginwindow, ui : this}
        );

        var cbe = function () {
            alert("Erro - Logout não realizado");
            window.app.ui.hideLoading();
        };
        
        window.app.loginapp.logout(cbs, cbe);
    };
    
    this.loginFunc = [];
    
    this.onLogin = function (func) {
        if (func === null) {
            for (var i = 0; i < this.loginFunc.length; i++) {
                this.loginFunc[i]();
            }
        } else if (typeof func === 'function') {
            this.loginFunc.push(func);
        }
    };
} 
 
function Navigator () {
    this.$window;
    this.$iframe;
    
    this.init = function () {
        this.$window = $('#navigationWindow');
        this.$iframe = $('#navigationiFrame');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
    };
    
    this.navigate = function (url) {
        if (this.$iframe.attr('src') !== url) {
            this.$iframe.attr('src', url);
        }
        
        window.app.ui.callLeftWindow('navigationWindow');
    };
} 
 
function PictureUI () {
    this.$window = $('#pictureWindow').hide();
    this.$element = $('#pictureElement').hide();
    this.$loading = $('#pictureLoading');
    this.$currentSize = $('<a class="paintIconSmall language button" data-langtitle="_DRAWINGSIZE_" />').on('click', function () {
        window.app.ui.pictureui.changeSize();
    });
    this.$currentColor = $('<a class="language button" data-langtitle="_DRAWINGCOLOR_" style="background-color: #CC0000" />').append('<a></a>');
    this.$eraser = $('<a class="language button paintIconEraser" data-langtitle="_DRAWINGERASER_" />').on('click', function () {
        window.app.ui.pictureui.color = "none";
        window.app.ui.pictureui.size = 10;
        window.app.ui.pictureui.$currentColor.css('background-color', 'transparent');
    });
    
    
    this.$clear = $('<a class="paintIconClear language button" data-langtitle="_DRAWINGCLEAR_" style="background-color: #ffffff" />').on('click', function () {
        window.app.ui.pictureui.sendClear();
    });
    
    this.$lock = $('<a class="paintIconLock language button" data-langtitle="_DRAWINGLOCK_" />').on('click', function () {
        var message = new Message();
        message.module = 'pica';
        message.setSpecial('lock', !window.app.ui.pictureui.isLocked());
        message.msg = "lock";
        window.app.chatapp.fixPrintAndSend(message, true);
    });
    
    this.$paintingTools = $('#picturePaint').append(this.$currentSize).append(this.$currentColor)
            .append(this.$clear).append(this.$eraser).append(this.$lock);
    
    this.locked = {};
    
    this.color = '#CC0000';
    this.size = 1;
    
    this.drawings = {};
    this.myArt = {};
    
    this.$canvas = null;
    
    this.touchTimeout = null;
    
    this.$currentColor.colpick({
        flat: true,
	layout:'hex',
	submit:1,
        color : 'CC0000',
        onSubmit : function (hsb, hex, rgb, el, bySetColor) {
            $(el).css('background-color', '#' + hex).children('div').stop(true,false).fadeOut(200);
            window.app.ui.pictureui.color = '#' + hex;
        }
    }).children('div').hide();
            
    this.$currentColor.children('a').on('click', function () {
        $(this).parent().children('div').stop(true, false).fadeIn(200);
    });
    
    this.link404 = 'img/404.png';
    
    this.$close = $('#pictureWindowClose').on('click', function () {
        window.app.ui.pictureui.close();
    });
    
    this.elementOnLoadPicture = function () {
        this.$element.on('load', function () {
            window.app.ui.pictureui.updatePicture();
        });
    };
    this.elementOnLoadPicture();
    
    this.lastType = 'img'; // 'webm'
    
    this.stream = false;
    
    this.handleResize = function () {
        if (window.app.ui.chat.mc.getModule('stream') === null || !window.app.ui.chat.mc.getModule('stream').isStream) {
            this.$window.css({"width" : window.app.ui.$rightWindow.width()});
        } else {
            this.$window.css('width', '');
        }
        this.updatePicture();
    };
    
    this.fullscreen = function (full) {
        var right = full ? 100 : 10;
        if (window.app.ui.chat.mc.getModule('stream') === null || !window.app.ui.chat.mc.getModule('stream').isStream) {
            this.$window.css('right', right + 'px');
        } else {
            this.$window.css('right', '');
        }
        this.updatePicture();
    };
    
    this.open = function (url, webm) {
        webm = (webm === undefined) ? false : (webm === true);
        try {
            url = decodeURIComponent(url);
        } catch (e) {
            
        }
        if (url.indexOf('dropbox.com') !== -1) {
            url = url.replace('dl=0', 'dl=1');
            if (url.indexOf('dl=1') === -1) {
                url = url + (url.indexOf('?') !== -1 ? '' : '?') + 'dl=1';
            }
        }
        
        var type = webm ? 'webm' : 'img';
        if (this.lastType !== type) {
            if (webm) {
                var $ele = $("<video id='pictureElement' autoplay loop controls style='border: none'/>");
                $ele[0].src = url;
                $ele[0].volume = window.app.config.get('bgmVolume');
                this.$element.replaceWith($ele);
                this.$element.remove();
                this.$element = $ele;
                this.$element.on('canplay', function() {
                   window.app.ui.pictureui.updatePicture();
                });
                $ele[0].load();
            } else {
                var $ele = $("<img id='pictureElement' />");
                this.$element.replaceWith($ele);
                this.$element.remove();
                this.$element = $ele;
                this.elementOnLoadPicture();
            }
            this.lastType = type;
        }
        
        var oldUrl = this.$element.attr("src");
        
        this.$element.off('error').on('error', function () {
            window.app.ui.pictureui.invalidPicture();
        }).attr('src', url).css({
            width: 0, height: 0
        });
        this.$window.stop(true,false).fadeIn(200);
        this.$loading.stop(true,true).show();
        this.$paintingTools.stop(true, false).hide();
        if (window.app.ui.pictureui.$canvas !== null) {
            window.app.ui.pictureui.$canvas.remove();
            window.app.ui.pictureui.$canvas = null;
        }
        
        if (oldUrl === url) {
            this.$element.trigger('load');
        }
    };
    
    this.updatePicture = function () {
        if (this.$element.attr('src') === undefined) return;
        this.$element.css('width', '').css('height', '');
        this.$loading.stop(true,false).fadeOut(200);
        if (this.$element.prop('tagName') !== 'VIDEO') {
            var oHeight = this.$element[0].naturalHeight;
            var oWidth = this.$element[0].naturalWidth;
        } else {
            var oHeight = this.$element[0].videoHeight;
            var oWidth = this.$element[0].videoWidth;
        }
        // Anti loop
        if (oHeight === 0 || oWidth === 0) return;
        var margin = this.stream ? 0 : 40;
        var maxHeight = this.$window.height() - margin;
        var maxWidth = this.$window.width() - margin;
        var factorW = maxWidth / oWidth;
        var factorH = maxHeight / oHeight;
        if (this.stream) {
            var factor = factorW < factorH ? factorH : factorW;
        } else {
            var factor = factorW < factorH ? factorW : factorH;
        }
        var top = (this.$window.height() - (oHeight * factor))/2;
        if (!this.stream && top < 30 && this.$element.attr('src') !== this.link404) {
            top = 30;
        }
        var left = (this.$window.width() - (oWidth * factor))/2;
        this.$element.css({
            width: oWidth * factor,
            height: oHeight * factor,
            top: top,
            left: left
        });
        this.$element.show();
        
        this.src = this.$element.attr('src');
        
        if (this.$element.attr('src') !== this.link404) {
            this.showPainting();
            this.updateCanvas(true);
        }
    };
    
    this.addDrawings = function (src, array) {
        var correctedLink = window.app.chatapp.room !== null ? window.app.chatapp.room.id : '0';
        correctedLink = correctedLink + src;
        if (this.drawings[correctedLink] === undefined) {
            var oldDrawings = window.app.memory.getMemory('draw' + correctedLink, null);
            if (oldDrawings !== null) {
                try {
                    this.drawings[correctedLink] = JSON.parse(oldDrawings);
                } catch (e) {
                    this.drawings[correctedLink] = [];
                }
            } else {
                this.drawings[correctedLink] = [];
            }
        }
        this.drawings[correctedLink] = this.drawings[correctedLink].concat(array);
        
        window.app.memory.setMemory('draw' + correctedLink, JSON.stringify(this.drawings[correctedLink]));
        
        if (src === this.src) {
            this.updateCanvas();
        }
    };
    
    this.clearDrawings = function (src) {
        var correctedLink = window.app.chatapp.room !== null ? window.app.chatapp.room.id : '0';
        correctedLink = correctedLink + src;
        this.drawings[correctedLink] = [];
        window.app.memory.setMemory('draw' + correctedLink, JSON.stringify(this.drawings[correctedLink]));
        if (src === this.src) {
            this.updateCanvas();
        }
    };
    
    this.sendClear = function () {
        var message = new Message();
        message.module = 'pica';
        message.setSpecial('clear', true);
        message.msg = this.src;
        window.app.chatapp.fixPrintAndSend(message, false);
    };
    
    this.showPainting = function () {
        this.$paintingTools.stop(true,false).unhide();
    };
    
    this.updateCanvas = function (updateValues) {
        if (window.app.chatapp.room === null) {
            this.$paintingTools.hide();
        } else if (!window.app.chatapp.room.getMe().isStoryteller()) {
            this.$lock.detach();
            this.$clear.detach();
            this.$paintingTools.unhide();
        } else {
            this.$paintingTools.append(this.$clear).append(this.$lock);
            if (this.isLocked()) {
                this.$lock.addClass('toggled');
            } else {
                this.$lock.removeClass('toggled');
            }
            this.$paintingTools.unhide();
        }
        if (this.$canvas === null) {
            updateValues = true;
            if (this.$element.prop('tagName') !== 'VIDEO') {
                var oHeight = this.$element[0].naturalHeight;
                var oWidth = this.$element[0].naturalWidth;
            } else {
                var oHeight = this.$element[0].videoHeight;
                var oWidth = this.$element[0].videoWidth;
            }
            this.$canvas = $('<canvas id="pictureCanvas" width="' + oWidth + '" height="' + oHeight + '" />');
            this.$window.append(this.$canvas);
            this.canvasContext = this.$canvas[0].getContext('2d');
            this.$canvas.on('mousedown', function (e) {
                window.app.ui.pictureui.mousedown(e);
                $(window).on('mouseup.canvasDrawing', function (e) {
                    $(this).off('mouseup.canvasDrawing');
                    window.app.ui.pictureui.mouseup(e);
                });
            }).on('mousemove', function (e) {
                window.app.ui.pictureui.mousemove(e);
            }).on('mouseup', function (e) {
                window.app.ui.pictureui.mouseup(e);
                $(window).off('mouseup.canvasDrawing');
            }).on('touchstart', function (e) {
                window.app.ui.pictureui.touchstart(e);
            }).on('touchmove', function (e) {
                window.app.ui.pictureui.touchmove(e);
            }).on('touchend touchcancel', function (e) {
                window.app.ui.pictureui.touchcancel(e);
            });
            this.oWidth = oWidth;
            this.oHeight = oHeight;
        }
        if (updateValues) {
            this.$canvas.css({
                top : this.$element.css('top'),
                left : this.$element.css('left'),
                height : this.$element.css('height'),
                width : this.$element.css('width')
            });
            this.width = this.$canvas.width();
            this.height = this.$canvas.height();
            this.offset = this.$canvas.offset();
        }
        
        var correctedLink = window.app.chatapp.room !== null ? window.app.chatapp.room.id : '0';
        correctedLink = correctedLink + this.src;
        if (this.drawings[correctedLink] === undefined) {
            this.addDrawings(this.src, []);
        }
        
        this.canvasContext.clearRect(0,0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        
        if (this.src.toUpperCase().indexOf('.GIF') === -1 && (this.$element.prop('tagName') !== 'VIDEO')) {
            //this.canvasContext.drawImage(this.$element[0],0,0);
        }
        this.canvasContext.beginPath();
        
        
        this.drawArray(this.drawings[correctedLink]);
        
        if (this.myArt[correctedLink] !== undefined) {
            this.drawArray(this.myArt[correctedLink]);
        }
        
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    };
    
    this.drawArray = function (drawings) {
        for (var i = 0; i < drawings.length; i++) {
            var drawing = drawings[i];
            if (drawing.length >= 4) {
                if (drawing.length === 4 || drawing[4] === 1) {
                    this.canvasContext.stroke();
                    this.canvasContext.closePath();
                    this.canvasContext.beginPath();
                    this.canvasContext.lineWidth = 2;
                    this.canvasContext.lineCap = "round";
                    this.canvasContext.moveTo(drawing[0], drawing[1]);
                }
                
                if (!isNaN(drawing[2], 10)) {
                    this.canvasContext.lineWidth = parseInt(drawing[2]);
                }
                
                if (drawing[3].indexOf('#') !== -1) {
                    this.canvasContext.globalCompositeOperation="source-over";
                    this.canvasContext.strokeStyle = drawing[3];
                } else {
                    this.canvasContext.globalCompositeOperation="destination-out";
                }
                if (drawing.length === 3 || drawing[3] === 1) {
                    continue;
                }
            }
            this.canvasContext.lineTo(drawing[0], drawing[1]);
            this.canvasContext.moveTo(drawing[0], drawing[1]);
        }
    };
    
    this.touchtomouse = function (e) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        return touch;
    };
    
    this.touchstart = function (e) {
        e.preventDefault();
        this.mousedown(this.touchtomouse(e));
    };
    
    this.touchmove = function (e) {
        e.preventDefault();
        if (this.touchTimeout !== null) {
            window.clearTimeout(this.touchTimeout);
        }
        this.touchTimeout = window.setTimeout(200, function () {
            window.app.ui.pictureui.touchTimeout = null;
            window.app.ui.pictureui.mouseup();
        });
        this.mousemove(this.touchtomouse(e));
    };
    
    this.touchcancel = function (e) {
        e.preventDefault();
        this.mouseup();
    };
    
    /**
     * 
     * @param {MouseEvent} e
     * @returns {undefined}
     */
    this.mousedown = function (e) {
        this.painting = true;
        var correctedLink = window.app.chatapp.room !== null ? window.app.chatapp.room.id : '0';
        correctedLink = correctedLink + this.src;
        this.myArt[correctedLink] = [];
        if (this.isLocked()) {
            if (!window.app.chatapp.room.getMe().isStoryteller()) {
                this.painting = false;
            }
        }
        this.mousemove(e, 1);
    };
    
    /**
     * 
     * @param {MouseEvent} e
     * @returns {undefined}
     */
    this.mouseup = function () {
        this.painting = false;
        if (this.touchTimeout !== null) {
            window.clearTimeout(this.touchTimeout);
            this.touchTimeout = null;
        }
        
        var correctedLink = window.app.chatapp.room !== null ? window.app.chatapp.room.id : '0';
        correctedLink = correctedLink + this.src;
        
        // send art through chat
        if (this.myArt[correctedLink].length === 0) return;
        this.drawings[correctedLink] = this.drawings[correctedLink].concat(this.myArt[correctedLink]);
        var message = new Message();
        message.module = 'pica';
        message.setSpecial('art', this.myArt[correctedLink]);
        message.msg = this.src;
        window.app.chatapp.fixPrintAndSend(message, true);
        this.myArt[correctedLink] = [];
    };
    
    /**
     * 
     * @param {MouseEvent} e
     * @returns {undefined}
     */
    this.mousemove = function (e, newOne) {
        if (newOne === undefined) newOne = 0;
        if (this.painting && window.app.chatapp.room !== null) {
            var relX = e.pageX - this.offset.left;
            var relY = e.pageY - this.offset.top;
            var finalX = parseInt((relX/this.width) * this.oWidth);
            var finalY = parseInt((relY/this.height) * this.oHeight);
            var array = [];
            
            array.push(finalX);
            array.push(finalY);
            if (newOne) {
                array.push(this.size);
                array.push(this.color);
            }
            
            var correctedLink = window.app.chatapp.room !== null ? window.app.chatapp.room.id : '0';
            correctedLink = correctedLink + this.src;
            
            this.myArt[correctedLink].push(array);
            this.updateCanvas();
        }
    };
    
    this.close = function () {
        this.$window.stop(true,false).fadeOut(200, function () {
            if (!window.app.ui.pictureui.$window.is(':visible')) {
                window.app.ui.pictureui.$element.removeAttr('src');
            }
            if (window.app.ui.pictureui.$canvas !== null) {
                window.app.ui.pictureui.$canvas.remove();
                window.app.ui.pictureui.$canvas = null;
            }
            if (window.app.ui.pictureui.$element.prop('tagName') === 'VIDEO') {
                window.app.ui.pictureui.$element[0].src = null;
            }
        });
    };
    
    this.invalidPicture = function () {
        this.$element.css('width', '').css('height', '');
        this.$element.attr('src', this.link404);
        this.$element.off('error');
    };
    
    this.streaming = function (streaming) {
        this.stream = streaming;
        if (streaming) {
            this.$window.css('width', '');
            this.$window.css('right', '');
        }
        this.handleResize();
        this.updatePicture();
    };
    
    this.changeSize = function () {
        this.$currentSize.removeClass("paintIconSmall paintIconMedium paintIconLarge");
        if (this.size === 1) {
            this.size = 3;
            this.$currentSize.addClass("paintIconMedium");
        } else if (this.size === 3) {
            this.size = 6;
            this.$currentSize.addClass("paintIconLarge");
        } else {
            this.size = 1;
            this.$currentSize.addClass("paintIconSmall");
        }
    };
    
    this.isLocked = function () {
        var id = window.app.chatapp.room !== null ? window.app.chatapp.room.id : 0;
        return this.locked[id] === true;
    };
    
    this.lock = function (id, which) {
        this.locked[id] = which;
        if (which) {
            this.$lock.addClass('toggled');
        } else {
            this.$lock.removeClass('toggled');
        }
    };
    
    this.configChanged = function (id) {
        if (id === 'bgmVolume' && (this.$element.prop('tagName') === 'VIDEO')) {
            this.$element[0].volume = window.app.config.get('bgmVolume');
        }
    };
    
    this.init = function () {
        window.app.config.addListener("bgmVolume", this);
    };
} 
 
function SheetController () {
    this.$listed = {};
    this.currentInstance = 0;
    this.currentStyle = 0;
    this.styles = {};
    this.$list;
    this.$import;
    this.$export;
    this.autoUpdate = false;
    this.opening = false;
    
    
    this.$cleanhtml = $('<div />');
    this.$cleancss = $('<style />');
    this.$html = this.$cleanhtml;
    this.$css = this.$cleancss;
    
    this.init = function () {
        this.$list = $('#sheetList').empty();
        this.$import = $('#sheetImportJSON');
        this.$export = $('#sheetExportJSON');
        this.$importForm = $('#sheetImportForm');
        this.$exportForm = $('#sheetExportForm');
        
        this.$viewer = $('#sheetViewer');
        
        $('#sheetSaveSuccess').hide();
        $('#sheetSaveError').hide();
        
        $('#sheetImportForm').hide();
        $('#sheetExportForm').hide();
        
        
        this.$closeButton = $('#closeButton');
        this.$importButton = $('#importButton');
        this.$saveButton = $('#saveButton');
        this.$editButton = $('#editButton');
        this.$exportButton = $('#exportButton');
        this.$automaticButton = $('#automaticButton');
        this.$reloadButton = $('#reloadButton');
        this.$fullReloadButton = $('#fullReloadButton');
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#callSheetWindowBt').on('click', function () {
            window.app.ui.sheetui.controller.callSelf();
        });
        
        $('#saveButton').on('click', function () {
            window.app.ui.sheetui.controller.saveSheet();
        });
        
        $('#editButton').on('click', function () {
            window.app.ui.sheetui.controller.toggleEdit();
        });
        
        $('#importButton').on('click', function () {
            window.app.ui.sheetui.controller.openImport();
        });
        
        $('#exportButton').on('click', function () {
            window.app.ui.sheetui.controller.exportSheet();
        });
        
        $('#closeButton').on('click', function () {
            window.app.ui.sheetui.controller.closeSheet();
        });
        
        $('#sheetImportForm').on('submit', function () {
            window.app.ui.sheetui.controller.importValues();
        });
        
        $('#reloadButton').on('click', function () {
            window.app.ui.sheetui.controller.reload(true, false);
        });
        
        $('#automaticButton').on('click', function () {
            window.app.ui.sheetui.controller.toggleAuto();
        });
        
        $('#fullReloadButton').on('click', function () {
            window.app.ui.sheetui.controller.reload(true, true);
        });
    };
    
    this.toggleEdit = function () {
        this.styles[this.currentStyle].toggleEdit();
        this.considerEditing();
    };
    
    this.considerEditing = function () {
        if (this.styles[this.currentStyle].editing) {
            this.$editButton.addClass('toggled');
        } else {
            this.$editButton.removeClass('toggled');
        }
    };
    
    this.callSelf = function () {
        if (typeof this.$listed[this.currentInstance] === 'undefined') {
            window.app.ui.sheetui.callSelf();
        } else {
            window.app.ui.callRightWindow('sheetWindow');
        }
    };
    
    this.openSheet = function (sheetid, styleid, gameid, important, dontcallwindow, history) {
        if (typeof dontcallwindow === 'undefined') dontcallwindow = false;
        if (typeof important === 'undefined') important = true;
        if (history === undefined) history = true;
        if (sheetid === this.currentInstance) {
            window.app.ui.callRightWindow('sheetWindow');
            return;
        }
        
        if (!window.app.sheetdb.isLoaded(sheetid)) {
            window.app.ui.blockRight();
            var cbs = window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid, this.gameid, (typeof styleid === 'undefined'), this.dontcallwindow);
                window.app.ui.unblockRight();
                window.app.ui.sheetui.controller.$viewer.trigger('loadedSheet', [this.sheetid]);
            }, {sheetid : sheetid, styleid : styleid, gameid : gameid, dontcallwindow : dontcallwindow});
            
            var cbe = function () {
                window.app.ui.unblockRight();
                window.app.ui.callRightWindow('sheetListWindow');
                window.app.ui.sheetui.$error.show();
            };
            
            window.app.sheetapp.loadSheet(sheetid, cbs, cbe);
        } else {
            styleid = window.app.sheetdb.getSheet(sheetid).system;
            gameid = window.app.sheetdb.getSheet(sheetid).gameid;
        }
        
        if (typeof styleid === 'undefined') {
            return;
        }
        
        if (!window.app.styledb.isLoaded(styleid) && important) {
            window.app.ui.blockRight();
            var cbs = window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid, this.gameid, false, this.dontcallwindow);
                window.app.ui.sheetui.controller.$viewer.trigger('loadedStyle', [this.styleid]);
                window.app.ui.unblockRight();
            }, {sheetid : sheetid, styleid : styleid, gameid : gameid, dontcallwindow : dontcallwindow});
            
            var cbe = function () {
                window.app.ui.unblockRight();
                window.app.ui.callRightWindow('sheetListWindow');
                window.app.ui.sheetui.$error.show();
            };
            
            window.app.sheetapp.loadStyle(styleid, cbs, cbe);
            return;
        }
        
        if (!window.app.sheetdb.isLoaded(sheetid) || !window.app.styledb.isLoaded(styleid)) {
            return;
        }
        
        this.$importForm.hide();
        this.$exportForm.hide();
        this.$importButton.removeClass('toggled');
        this.$exportButton.removeClass('toggled');
        
        this.opening = true;
        
        var oldChanged = window.app.sheetdb.getSheet(sheetid).changed;
        
        if (typeof this.$listed[sheetid] === 'undefined') {
            this.$listed[sheetid] = $('<a class="toggled" />');
            
            this.$listed[sheetid].on('click', window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid);
            }, {sheetid : sheetid, styleid : styleid}));
            
            this.$list.append(this.$listed[sheetid]);
        } else {
            this.$listed[sheetid].addClass('toggled');
        }
        
        if (typeof this.$listed[this.currentInstance] !== 'undefined') {
            this.$listed[this.currentInstance].removeClass('toggled');
        }
        
        if (history && sheetid !== this.currentInstance) {
            window.history.pushState({sheetid : sheetid}, '', window.location);
        }
        
        var oldInstance = this.currentInstance;
        this.currentInstance = sheetid;
        
        if (window.app.sheetdb.getSheet(oldInstance) !== null) {
            window.app.sheetdb.getSheet(oldInstance).values = this.styles[this.currentStyle].getObject();
        }
        
        if (typeof this.styles[styleid] === 'undefined') {
            var lesheet = window.app.sheetdb.getSheet(sheetid);
            var lestyle = window.app.styledb.getStyle(styleid);
            this.styles[styleid] = new Sheet_Style (lesheet, lestyle);
            window.app.ui.language.applyLanguageOn($(this.styles[styleid].visible));
//            this.styles[styleid].process();
//            this.styles[styleid].setValues();
            
            if (this.styles[styleid].sheet.nameField !== null) {
            	this.styles[styleid].sheet.nameField.addChangedListener({
            		handleEvent : function () {
            			window.app.ui.sheetui.controller.updateCurrentButton();
            		}
            	})
            }
            
            var style = this.styles[styleid];
            if (style.sheet.getField('Jogador') !== null) {
            	var player = style.sheet.getField('Jogador');
            } else if (style.sheet.getField('Player') !== null) {
            	var player = style.sheet.getField('Player');
            } else {
            	var player = null;
            }
            
            if (player !== null) {
            	player.addChangedListener({
            		handleEvent : function () {
            			window.app.ui.sheetui.controller.updateCurrentButton();
            		}
            	});
            }
            
            style.sheet.addChangedListener({
            	handleEvent : function () {
            		window.app.ui.sheetui.controller.considerChanged();
            	}
            });
        } else {
            this.styles[styleid].switchInstance(window.app.sheetdb.getSheet(sheetid));
        }
        
        
        if (this.currentStyle !== styleid) {
            this.$css.detach();
            this.$html.detach();
            this.$html = $(this.styles[styleid].visible);
            this.$css = $(this.styles[styleid].css);
            this.$viewer.empty().append(this.$html);
            $('head').append(this.$css);
            this.currentStyle = styleid;
        } else {
            this.currentStyle = styleid;
        }
        
        if (!dontcallwindow) {
            window.app.ui.callRightWindow('sheetWindow', false);
        }
        
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        
        sheet.gameid = gameid;
        
        sheet.changed = oldChanged;
        
        if (sheet.editable) {
            this.$saveButton.show();
            this.$editButton.show();
            this.$importButton.show();
        } else {
            this.$saveButton.hide();
            this.$editButton.hide();
            this.$importButton.hide();
            if (this.styles[this.currentStyle].editing) {
                this.toggleEdit();
            }
        }
        this.opening = false;
        
        this.$reloadButton.show();
        this.$fullReloadButton.show();
        this.$automaticButton.show();
        this.$closeButton.show();
        this.$exportButton.show();
        this.considerChanged();
        this.considerEditing();
        this.updateCurrentButton();
    };
    
    this.considerChanged = function () {
        if (this.opening) {
            return;
        }
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        if (sheet.changed) {
            this.$saveButton.addClass('toggled');
        } else {
            this.$saveButton.removeClass('toggled');
        }
    };
    
    this.updateCurrentButton = function () {
        if (this.opening) {
            return;
        }
        this.$listed[this.currentInstance].removeClass('character nonplayer');
        
        if (typeof this.styles[this.currentStyle] !== 'undefined') {
            var style = this.styles[this.currentStyle];
            if (style.sheet.getField('Jogador') !== null) {
            	var jogador = style.sheet.getField('Jogador').getValue();
            } else if (style.sheet.getField('Player') !== null) {
            	var jogador = style.sheet.getField('Player').getValue();
            } else {
            	var jogador = "";
            }
        } else {
            var sheet = window.app.sheetdb.getSheet(this.currentInstance);
            if (typeof sheet.values['Jogador'] !== 'undefined') {
                var jogador = sheet.values['Jogador'];
            } else if (typeof sheet.values['Player'] !== 'undefined') {
                var jogador = sheet.values['Player'];
            } else {
            	var jogador = "";
            }
        }
        
        
        
        this.$html.removeClass('character nonplayer');
        if ( jogador === 'NPC') {
            this.$listed[this.currentInstance].addClass('nonplayer');
            this.$html.addClass('nonplayer');
        } else {
            this.$listed[this.currentInstance].addClass('character');
            this.$html.addClass('character');
        }
        
        var name = window.app.sheetdb.getSheet(this.currentInstance).name;
        if (name.length > 10) {
            name = name.split(' ');
            if (name[0].length > 3) {
                name = name[0];
            } else {
                name = name[0] + name[1];
            }
            if (name.length > 10) {
                name = name.substring(0, 6) + '...';
            }
        }
        
        this.$listed[this.currentInstance].text(name);
    };
    
    this.closeSheet = function () {
        this.$listed[this.currentInstance].remove();
        delete this.$listed[this.currentInstance];
        
        this.$css.detach();
        this.$html.detach();
        
        window.app.sheetdb.deleteSheet(this.currentInstance);
        this.$viewer.trigger("closedSheet", [this.currentInstance]);
        
        this.currentStyle = 0;
        this.currentInstance = 0;
        
        this.$reloadButton.hide();
        this.$fullReloadButton.hide();
        this.$automaticButton.hide();
        this.$closeButton.hide();
        this.$exportButton.hide();
        this.$editButton.hide();
        this.$importButton.hide();
        this.$saveButton.hide();
    };
    
    this.importValues = function () {
        try {
            var values = JSON.parse(this.$import.val());
        } catch (e) {
            $('#sheetImportError').show();
            return;
        }
        
        if (typeof values !== 'object') {
            $('#sheetImportError').show();
            return;
        }
        
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        sheet.values = values;
        
        var style = this.styles[this.currentStyle];
        style.sheet.updateSheetInstance();
        
        $('#sheetImportForm').fadeOut();
        this.$importButton.removeClass('toggled');
    };
    
    this.openImport = function () {
        $('#sheetExportForm').finish().fadeOut();
        var $form = $('#sheetImportForm');
        if ($form.is(':visible')) {
            $form.finish().fadeOut();
            this.$importButton.removeClass('toggled');
            return;
        }
        
        $('#sheetImportError').hide();
        this.$import.val('');
        
        $form.finish().fadeIn();
        this.$importButton.addClass('toggled');
        this.$exportButton.removeClass('toggled');
    };
    
    this.exportSheet = function () {
        $('#sheetImportForm').finish().fadeOut();
        this.$importButton.removeClass('toggled');
        var $form = $('#sheetExportForm');
        if ($form.is(':visible')) {
            $form.finish().fadeOut();
            this.$exportButton.removeClass('toggled');
            return;
        }
        
        var style = this.styles[this.currentStyle];
        
        this.$export.val(
            JSON.stringify(style.getObject(), undefined, 4)
        );
        
        $form.finish().fadeIn();
        this.$exportButton.addClass('toggled');
    };
    
    this.saveSheet = function () {
        window.app.ui.blockRight();
        
        var cbs = function () {
            $('#sheetSaveSuccess').finish().fadeIn().delay(1500).fadeOut();
            $('#sheetSaveError').finish().hide();
            window.app.ui.unblockRight();
            window.app.ui.sheetui.controller.considerWarning();
            var sheet = window.app.sheetdb.getSheet(window.app.ui.sheetui.controller.currentInstance);
            window.app.memory.unsetMemory("Sheet_" + window.app.ui.sheetui.controller.currentInstance);
            sheet.changed = false;
            window.app.ui.sheetui.controller.considerChanged();
        };
        var cbe = function () {
            $('#sheetSaveSuccess').finish().hide();
            $('#sheetSaveError').finish().fadeIn().delay(1500).fadeOut();
            window.app.ui.unblockRight();
        };
        
        var style = this.styles[this.currentStyle];
        
        var values = style.getObject();
        
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        
        var name = sheet.name;
        
        window.app.sheetapp.sendSheet(this.currentInstance, name, values, cbs, cbe);
    };
    
    this.reload = function (sheet, style) {
        var oldStyle = this.currentStyle;
        var oldInstance = this.currentInstance;
        if (style) {
            var sheet = window.app.sheetdb.getSheet(this.currentInstance);
            var style = this.styles[this.currentStyle];
            sheet.values = style.getObject();
            this.$css.detach();
            this.$html.detach();
            this.$css = this.$cleancss;
            this.$html = this.$cleanhtml;
            style.seppuku();
            delete this.styles[this.currentStyle];
            window.app.styledb.deleteStyle(this.currentStyle);
            
            this.currentStyle = 0;
        }
        
        if (sheet) {
            if (typeof this.$listed[sheet] !== 'undefined') {
                this.$listed[this.currentInstance].remove();
                delete this.$listed[sheet];
            }
            window.app.sheetdb.deleteSheet(this.currentInstance);
            this.currentInstance = 0;
        }
        
        this.openSheet(oldInstance, oldStyle, undefined, true, true);
    };
    
    this.updateSpecificSheet = function (sheetid) {
        if (sheetid === this.currentInstance) {
            this.reload(true, false);
            return;
        }
        var sheet = window.app.sheetdb.getSheet(sheetid);
        if (sheet === null) {
            return;
        }
        window.app.ui.blockRight();
        var cbs = window.app.emulateBind(function () {
            if (window.app.ui.sheetui.controller.currentInstance === this.sheetid) {
                window.app.ui.sheetui.reload();
            }
            window.app.ui.unblockRight();
        }, {sheetid : sheetid, styleid : sheet.system});

        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.callRightWindow('sheetListWindow');
            window.app.ui.sheetui.$error.show();
        };

        window.app.sheetapp.loadSheet(sheetid, cbs, cbe);
    };
    
    this.toggleAuto = function (auto) {
        if (typeof auto === 'undefined') {
            var auto = !this.autoUpdate;
        }
        
        if (auto) {
            $('#automaticButton').addClass('toggled');
            this.autoUpdate = true;
        } else {
            this.autoUpdate = false;
            $('#automaticButton').removeClass('toggled');
        }
    };
    
    this.considerWarning = function () {
        if (window.app.ui.chat.cc.room === null) {
            return false;
        }
        var room = window.app.ui.chat.cc.room;
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        if (room.gameid !== sheet.gameid) {
            return false;
        }
        
        var message = new Message();
        message.setOrigin(window.app.loginapp.user.id);
        message.roomid = window.app.ui.chat.cc.room.id;
        message.module = "sheetup";
        message.setSpecial("sheetid", this.currentInstance);
        
        window.app.ui.chat.cc.room.addLocal(message);
        window.app.chatapp.sendMessage(message);
    };
} 
 
function SheetUI() {
    this.$openBt;
    this.$error;
    this.$list;
    this.$formCreation;
    this.$formPermission;
    
    this.controller = new SheetController();
    
    this.creating = 0;
    this.currentFolder = -1;
    
    this.init = function () {
        this.$openBt = $('#callSheetsWindowBt');
        this.$error = $('#sheetListLoadError').hide();
        this.$list = $('#sheetListDiv').hide();
        this.$formCreation = $('#sheetCreationForm').hide();
        this.$formPermission = $('#sheetPermissionForm').hide();
        
        this.setBindings();
        
        this.controller.init();
    };
    
    this.setBindings = function () {
        this.$openBt.on('click', function () {
            window.app.ui.sheetui.callSelf();
        });
        
        $('#sheetCreationForm').on('submit', function () {
            window.app.ui.sheetui.sendCreation();
        });
        
        this.$formPermission.on('submit', function () {
            window.app.ui.sheetui.sendPrivileges();
        });
    };
    
    this.$createFolder = function (name) {
        var folder = {
            $p : $('<p class="folder" />'),
            $div : $('<div class="folder" />'),
            name : name
        };
        
        folder.$p.append("<a class='icon folderIcon'></a>");
        
        if (name === '') {
            folder.$p.append("<span class='language' data-langhtml='_SHEETSNOFOLDER_'></span>");
        } else {
            folder.$p.append($('<span />').text(name));
        }
        
        folder.$p.on('click', function () {
            $(this).toggleClass('open');
        });
        
        return folder;
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('sheetListWindow');
        window.app.ui.blockRight();
        this.$error.finish().fadeOut();
        this.$list.hide();
        this.$formCreation.hide();
        this.$formPermission.hide();

        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.finish().fadeIn();
        };
        
        var cbs = function (data) {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.finish().fadeOut();
            window.app.ui.sheetui.$list.show();
            window.app.ui.sheetui.controller.$viewer.trigger('loadedSheet');
            window.app.ui.sheetui.fillList(data);
        };

        window.app.sheetapp.callList(cbs, cbe);
    };
    
    this.fillList = function () {
        var $div;
        var $h1;
        var $p;
        var $del;
        var $fold;
        var $priv;
        var $safe;
        var $name;
        var gameList = window.app.gamedb.gamelist;
        var game = window.app.gamedb.getGame(10);
        var sheet = window.app.sheetdb.getSheet(10);
        var folders;
        var folderList;
        var k;
        this.$list.empty();
        for (var i = 0; i < gameList.length; i++) {
            game = window.app.gamedb.getGame(gameList[i]);
            $div = $('<div />');
            $h1 = $("<h2 onclick='$(this).parent().toggleClass(\"open\");' class='language' data-langtitle='_SHEETSGAMETITLE_' />").text(game.name);
            $div.append($h1);
            
            if (game.id === this.creating) {
                $div.addClass("open");
            }
            
            folders = {};
            folderList = [];
            
            for (var j = 0; j < game.sheets.length; j++) {
                sheet = window.app.sheetdb.getSheet(game.sheets[j]);
                $p = $('<p class="sheet" />');
                this.hoverize($p, sheet);
                $div.append($p);
                
                if (sheet.deletar || game.deleteSheet) {
                    $del = $("<a class='floatRight textButton language' data-langhtml='_SHEETSDELETE_' />");
                    $del.on('click', window.app.emulateBind(function () {
                        window.app.ui.sheetui.callDelete(this.id, this.name, this.gameid);
                    }, {id : sheet.id, name : sheet.name, gameid : game.id}));
                    $p.append($del);
                }
                
                if (sheet.promote || game.promote) {
                    $priv = $("<a class='floatRight textButton language' data-langhtml='_SHEETSPRIVILEGES_'>Permissoes</a>");
                    $priv.on('click', window.app.emulateBind(function () {
                        window.app.ui.sheetui.callPrivileges(this.id, this.name, this.gameid);
                    }, {id : sheet.id, name : sheet.name, gameid : game.id}));
                    $p.append($priv);
                }
                
                if (sheet.editable || game.editSheet) {
                    $fold = $('<a class="floatRight textButton language" data-langhtml="_SHEETSSETFOLDER_" />');
                    $fold.on("click", window.app.emulateBind(function () {
                        window.app.ui.sheetui.changeFolder(this.id, this.name, this.gameid);
                    }, {id : sheet.id, name : sheet.name, gameid : game.id}));
                    $p.append($fold);
                }
                
                if (sheet.segura) {
                    $safe = $("<a class='safeIcon icon language' data-langtitle='_SHEETSAFE_'></a>");
                } else {
                    $safe = $("<a class='unsafeIcon icon language' data-langtitle='_SHEETUNSAFE_'></a>");
                }
                $p.append($safe);
                
                $name = $("<a class='sheetName language' data-langtitle='_SHEETSNAMETITLE_' />").text(sheet.name);
                $name.on('click', window.app.emulateBind(function (/** Event */ e) {
                    window.app.ui.sheetui.creating = this.gameid;
                    window.app.ui.sheetui.openSheet(this.id, this.idstyle, this.gameid, e.ctrlKey);
                }, {id : sheet.id, idstyle : sheet.system, gameid : game.id}));
                $p.append($name);
                
                if (folders[sheet.folder] === undefined) {
                    folders[sheet.folder] = this.$createFolder(sheet.folder);
                    folderList.push(sheet.folder);
                }
                folders[sheet.folder].$div.append($p);
            }
            
            if (game.sheets.length === 0) {
                $p = $('<p class="language" data-langhtml="_SHEETSNOSHEETS_" />');
                $div.append($p);
            } else {
                folderList.sort(function (a, b) {
                    a = a.toUpperCase();
                    b = b.toUpperCase();
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                });
                for (k = 0; k < folderList.length; k++) {
                    $div.append(folders[folderList[k]].$p);
                    $div.append(folders[folderList[k]].$div);
                    if (folders[folderList[k]].name === this.currentFolder) {
                        folders[folderList[k]].$p.addClass("open");
                    }
                }
            }
            
            if (game.createSheet) {
                $p = $("<p class='createP' />");
                $name = $("<a class='textLink language' data-langhtml='_SHEETSADD_' />");
                $p.append($name);
                
                $name.on('click', window.app.emulateBind(function () {
                    window.app.ui.sheetui.callCreation(this.id, this.gamename);
                }, {id : game.id, gamename : game.name}));

                $div.append($p);
            }
            
            this.$list.append($div);
        }
        if (gameList.length === 0) {
            $p = $("<p class='language' data-langhtml='_SHEETSNOGAMES_' />");
            this.$list.append($p);
        }
        
        window.app.ui.language.applyLanguageOn(this.$list);
        
        this.creating = 0;
    };
    
    this.changeFolder = function (sheetid, name, gameid) {
        var folder = window.prompt(window.app.ui.language.getLingoOn("_SHEETCHANGEFOLDER_", name));
        window.app.ui.blockRight();
        var cbs = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        this.creating = gameid;
        this.currentFolder = window.app.sheetdb.getSheet(sheetid).folder;
        
        window.app.sheetapp.sendFolder(sheetid, folder, cbs, cbe);
    };
    
    this.callDelete = function (sheetid, nome, gameid) {
        if (!confirm("Deletar " + nome + "? Certeza?")) {
            return false;
        }
        this.creating = gameid;
        window.app.ui.blockRight();
        
        var cbs = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        window.app.sheetapp.sendDelete(sheetid, cbs, cbe);
    };
    
    this.callPrivileges = function (sheetid, name, gameid) {
        window.app.ui.blockRight();
        this.$error.hide();
        this.$list.hide();
        
        this.creating = gameid;
        this.creatingsheet = sheetid;
        this.creatingname = name;
        
        var cbs = function (data) {
            window.app.ui.sheetui.fillPrivileges(data);
            window.app.ui.sheetui.$formPermission.show();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.sheetui.$error.show();
            window.app.ui.unblockRight();
        };
        
        window.app.sheetapp.callPermissions(sheetid, cbs, cbe);
    };
    
    this.fillPrivileges = function (data) {
        $('#sheetPermissionIdSheet').val(this.creatingsheet);
        $('#sheetPermissionsSheetName').text(this.creatingname);
        var $list = $('#sheetPermissionsList').empty();
        
        var $p;
        
        
        data.sort(function (a, b) {
            var nicka = a.nickname.toUpperCase() + '#' + a.nicknamesufix;
            var nickb = b.nickname.toUpperCase() + '#' + b.nicknamesufix;
            if (nicka < nickb) {
                return -1;
            }
            if (nicka > nickb) {
                return 1;
            }
            return 0;
        });
        
        for (var i = 0; i < data.length; i++) {
            $p = $('<p class="permission" />');
            $p.append(
                $('<input type="hidden" class="idAccount" value="' + data[i].userid + '" />')
            );
            $p.append(
                $('<span />').text(data[i].nickname + '#' + data[i].nicknamesufix)
            );
    
            $p.append(
                $('<label for="promperm' + data[i].userid + '" class="language" data-langtitle="_SHEETPERMISSIONPROMEXP_" data-langhtml="_SHEETPERMISSIONPROM_" />')
            );
    
            $p.append(
                $('<input id="promperm' + data[i].userid + '" class="promPerm language"  data-langtitle="_SHEETPERMISSIONPROMEXP_" type="checkbox" ' + (data[i].promote ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="delperm' + data[i].userid + '" class="language" data-langhtml="_SHEETPERMISSIONDELETE_" />')
            );
    
            $p.append(
                $('<input id="delperm' + data[i].userid + '" class="deletePerm" type="checkbox" ' + (data[i].deletar ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="editperm' + data[i].userid + '" class="language" data-langhtml="_SHEETPERMISSIONEDIT_" />')
            );
    
            $p.append(
                $('<input id="editperm' + data[i].userid + '" class="editPerm" type="checkbox" ' + (data[i].editar ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="viewperm' + data[i].userid + '" class="language" data-langhtml="_SHEETPERMISSIONVIEW_" />')
            );
    
            $p.append(
                $('<input id="viewperm' + data[i].userid + '" class="viewPerm" type="checkbox" ' + (data[i].visualizar ? 'checked' : '') + ' />')
            );
            
            $list.append($p);
        }
        
        window.app.ui.language.applyLanguageOn($list);
    };
    
    this.sendPrivileges = function () {
        window.app.ui.blockRight();
        
        var cbs = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.callSelf();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        var $permissions = this.$formPermission.find('p.permission');
        var $permission;
        
        var permissionArray = [];
        var permission;
        
        for (var i = 0; i < $permissions.length; i++) {
            $permission = $($permissions[i]);
            permission = {
                userid : $($permission.find('.idAccount')[0]).val(),
                deletar : $permission.find('.deletePerm')[0].checked,
                editar : $permission.find('.editPerm')[0].checked,
                visualizar : $permission.find('.viewPerm')[0].checked,
                promote : $permission.find('.promPerm')[0].checked
            };
            
            permissionArray.push(permission);
        }
        
        window.app.sheetapp.sendPrivileges (this.creatingsheet, permissionArray, cbs, cbe);
    };
    
    this.callCreation = function (gameid, gamename) {
        this.$list.hide();
        this.$formCreation.hide();
        this.$error.hide();
        this.$formPermission.hide();
        
        window.app.ui.blockRight();
        
        var cbs = window.app.emulateBind(function (data) {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.fillCreation(data, this.gameid, this.gamename);
            window.app.ui.sheetui.$formCreation.fadeIn();
        }, {gameid : gameid, gamename : gamename}
        );
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        window.app.sheetapp.callCreation(gameid, cbs, cbe);
    };
    
    this.fillCreation = function (data, gameid, gamename) {
        $('#sheetCreationGameName').text(gamename);
        this.creating = gameid;
        
        var $select = $('#sheetCreationGame').empty();
        var $option;
        var name;
        
        data.sort(function (a,b) {
            var na = a.name;
            if (na.charAt(0) === '_') na = window.app.ui.language.getLingo(na);
            na = na.toUpperCase();
            var nb = b.name;
            if (nb.charAt(0) === '_') nb = window.app.ui.language.getLingo(nb);
            nb = nb.toUpperCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
            return 0;
        });
        
        for (var i = 0; i < data.length; i++) {
            name = data[i].name;
            if (name.charAt(0) === '_') {
                name = window.app.ui.language.getLingo(name);
            }
            $option = $('<option value="' + data[i].id + '" />').text(name);
            if (data[i].id === 1) {
                $option[0].selected = true;
            }
            $select.append($option);
        }
    };
    
    this.sendCreation = function () {
        var sheetname = $('#sheetCreationName').val();
        var idstyle = parseInt($('#sheetCreationGame').val());
        var public = $('#sheetCreationPublic').prop('checked');
        
        window.app.ui.blockRight();
        
        var cbs = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
            $('#sheetCreationName').val('');
            $('#sheetCreationPublic').prop('checked', false);
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        window.app.sheetapp.sendCreation (this.creating, sheetname, idstyle, public, cbs, cbe);
    };
    
    this.updateConfig = function () {
        
    };
    
    this.openSheet = function (sheetid, styleid, gameid, ctrlKey) {
        this.controller.openSheet (sheetid, styleid, gameid, undefined, ctrlKey);
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @param {Sheet_Instance} sheet
     * @returns {undefined}
     */
    this.hoverize = function ($dom, sheet) {
        $dom.on('mouseenter', window.app.emulateBind(function (e) {
            window.app.ui.addonui.$handle.text(sheet.name);
            var $ul = window.app.ui.addonui.$ul.empty();
            $ul.append(
                $('<li />').append('<strong>' + window.app.ui.language.getLingo("_SHEETHOVERCREATOR_") + ": </strong>"
                                 + sheet.criadorNick + '#' + sheet.criadorNickSufix)
            ).append(
                $('<li />').append('<strong>' + window.app.ui.language.getLingo("_SHEETHOVERSTYLE_") + ": </strong>"
                                 + sheet.styleName)
            ).append(
                $('<li />').append('<strong>' + window.app.ui.language.getLingo("_SHEETHOVERSTYLECREATOR_") + ": </strong>"
                                 + sheet.nickStyleCreator + '#' + sheet.nicksufixStyleCreator)
            );
            window.app.ui.addonui.$box.stop(true, false).fadeIn(100);
            window.app.ui.addonui.moveAddonBox(e);
        }, {sheet : sheet}))
        .on('mouseleave', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove', function(e) {
            window.app.ui.addonui.moveAddonBox(e);
        });
    };
} 
 
function SimpleFloater () {
    this.$floater = $('#simpleFloater');
    
    this.apply = function ($title) {
        $title.off('.tooltip').on('mouseenter.tooltip', function () {
            var $this = $(this);
            var $p = $('<p />').text($this.attr('data-title'));
            window.app.ui.simplefloater.showFloaterAtElement($p, $this);
        }).on('mousemove.tooltip', function () {
            window.app.ui.simplefloater.moveFloaterToElement($(this));
        }).on('mouseleave.tooltip', function () {
            window.app.ui.simplefloater.hideFloater();
        });
    };
    
    this.showFloaterAtElement = function ($content, $element) {
        this.$floater.empty().append($content);
        this.$element = $element;
        this.moveFloaterToElement($element);
        this.$floater.stop(true,false).fadeIn(100);
    };
    
    this.moveFloaterToElement = function ($element) {
        if ($element === undefined) var $element = this.$element;
        var offset = $element.offset();
        var left = offset.left + 6;
        if (left + this.$floater.width() > ($(window).width() - 10)) {
            left = $(window.width() - 10 - this.$floater.width());
        }
        var top = offset.top + 8 + $element.height();
        if (top < 10) {
            top = 10;
        }
        this.$floater.css({
            top: offset.top - this.$floater.height() - 8,
            left: left
        });
    };
    
    this.hideFloater = function () {
        this.$floater.stop(true,false).fadeOut(100);
    };
} 
 
function SoundUI () {
    this.$bgmcheck;
    this.$dropbox;
    this.$soundList;
    this.$soundSelect;
    this.$soundSelectList;
    this.$soundSelectNone;
    this.$soundSelectNew;
    this.$soundInputNew;
    this.$linkradio;
    this.$fileradio;
    this.$fileList;
    this.$link;
    this.$foldererror;
    this.$corserror;
    
    
    this.init = function () {
        
        this.$bgmcheck = $('#soundsBGM');
        this.$soundList = $('#soundList').empty();
        this.$soundSelect = $('#folderSelect');
        this.$soundSelectList = $('#foldersOptions');
        this.$soundSelectNone = $('#folderSelectNone');
        this.$soundSelectNew = $('#newFolderOption');
        this.$soundInputNew = $('#folderCreate');
        this.$fileList = $('#soundFileList');
        this.$link = $('#soundFileLink');
        this.$linkform = $('#soundLinkForm');
        this.$fileform = $('#soundFileInput');
        this.$foldererror = $('#soundFolderError');
        this.$corserror = $('#tryCors');
        
        
        this.$linkradio = $('#soundsLinkMethod');
        this.$fileradio = $('#soundsFolderMethod');
        
        //this.updateConfig();
        this.setBindings();
        
        window.app.storage.registerStorage("sounds", this);
    };
    
    this.storageChanged = function () {
        this.printSounds();
    };
    
    this.storageValidation = function (value) {
        if (!Array.isArray(value)) return false;
        var folder;
        var sound;
        for (var i = 0; i < value.length; i++) {
            folder = value[i];
            if (typeof folder !== 'object') return false;
            if (typeof folder.index !== "number") return false;
            if (typeof folder.name !== 'string') return false;
            if (!Array.isArray(folder.sounds)) return false;
            if (Object.keys(folder).length !== 3) return false;
            
            for (var k = 0; k < folder.sounds.length; k++) {
                sound = folder.sounds[k];
                if (typeof sound !== 'object') return false;
                if (typeof sound.name !== 'string') return false;
                if (typeof sound.link !== 'string') return false;
                if (typeof sound.bgm !== 'boolean') return false;
                if (typeof sound.folderIndex !== 'number') return false;
                if (typeof sound.index !== 'number') return false;
                if (Object.keys(sound).length !== 5) return false;
            }
        }
        return true;
    };
    
    this.storageDefault = function () {
        return [];
    };
    
    this.isBGM = function () {
        return this.$bgmcheck.prop('checked');
    };
    
    this.setBindings = function () {
        $('#openSounds').bind('click', function () {
            window.app.ui.soundui.callSelf();
        });
        
        $('#soundSaveButton').bind('click', function() {
            window.app.ui.blockRight();
            var cbs = function () {
                window.app.ui.unblockRight();
            };
            var cbe = function () {
                alert("Não foi possível salvar sons.");
                window.app.ui.unblockRight();
            };
            
            window.app.storageapp.sendStorage("sounds", cbs, cbe);
        });
        
        this.$soundSelect.bind('change', function () {
            if (window.app.ui.soundui.$soundSelectNew.prop('selected')) {
                window.app.ui.soundui.$soundSelect.hide();
                window.app.ui.soundui.$soundInputNew.show().focus();
            }
        });
        
        $('#soundLinkForm').bind('submit', function () {
            window.app.ui.soundui.fetchLink();
        });
        
        $('#soundFileListSubmit').bind('click', function () {
            window.app.ui.soundui.fetchFiles();
        });
        
        $('#soundLinkDropbox').bind('submit', function () {
            //window.app.ui.soundui.processLink(window.app.ui.soundui.$dropbox.val(), true);
            window.app.ui.soundui.$iframe = $('<iframe />').attr('src', window.app.ui.soundui.$dropbox.val()).bind('load', function () {
                console.log(window.app.ui.soundui.$iframe.contents().find('a.thumb-link'));
                window.app.ui.soundui.$iframe.remove();
                window.app.ui.soundui.$iframe = null;
            }).bind('error', function () {
                alert("error loading");
            }).hide().appendTo('body');;
        });
        
        this.$linkradio.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.ui.soundui.$linkform.show();
                window.app.ui.soundui.$fileform.hide();
            }
        });
        
        this.$fileradio.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.ui.soundui.$linkform.hide();
                window.app.ui.soundui.$fileform.show();
            }
        });
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('soundWindow');
        window.app.ui.soundui.$soundSelect.show();
        window.app.ui.soundui.$soundInputNew.hide();
        window.app.ui.soundui.$linkradio.prop('checked', false);
        window.app.ui.soundui.$fileradio.prop('checked', true);
        window.app.ui.soundui.$linkform.hide();
        window.app.ui.soundui.$fileform.show();
        window.app.ui.soundui.$corserror.hide();
        window.app.ui.soundui.$foldererror.hide();
        
        window.app.ui.blockRight();
        var cbs = function () {
            window.app.ui.unblockRight();
            window.app.ui.soundui.printSounds();
        };
        var cbe = function () {
            alert ("Erro abrindo sons.");
        };
        window.app.storageapp.updateStorage("sounds", cbs, cbe);
    };
    
    this.moveUp = function (index, $this) {
        if (index < 0 || (index - 1) < 0 || index >= window.app.storage.get("sounds").length) {
            return false;
        }
        
        var a = window.app.storage.get("sounds")[index];
        var b = window.app.storage.get("sounds")[index - 1];
        window.app.storage.get("sounds")[index - 1] = a;
        window.app.storage.get("sounds")[index] = b;
        
        $this.after($this.prev());
        this.updateIndexes();
    };
    
    this.moveDown = function (index, $this) {
        if (index < 0 || (index + 1) >= window.app.storage.get("sounds").length) {
            return false;
        }
        
        var a = window.app.storage.get("sounds")[index];
        var b = window.app.storage.get("sounds")[index + 1];
        window.app.storage.get("sounds")[index + 1] = a;
        window.app.storage.get("sounds")[index] = b;
        
        this.printSounds();
        
        $this.before($this.next());
        this.updateIndexes();
    };
    
    this.deleteFolder = function (index, $this) {
        $this.remove();
        window.app.storage.get("sounds").splice(index, 1);
        this.updateIndexes();
    };
    
    this.deleteSound = function (sound, $div) {
        $div.remove();
        window.app.storage.get("sounds")[sound.folderIndex].sounds.splice(sound.index, 1);
        this.updateIndexes();
    };
    
    this.updateIndexes = function () {
        var folder;
        var sound;
        for (var i = 0; i < window.app.storage.get("sounds").length; i++) {
            folder = window.app.storage.get("sounds")[i];
            folder.index = i;
            for (var k = 0; k < folder.length; k++) {
                sound = folder[k];
                sound.index = k;
                sound.folderIndex = i;
            }
        }
    };
    
    this.create$sound = function (sound) {
//        {
//            index : position in list,
//            folderIndex : folder position on masterlist,
//            bgm : true/false,
//            name : sound name,
//            link : link to file
//        }
        var $html = $('<p />');
        
        var playFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.play(this.sound);
            }, {sound : sound}
        );

        var shareFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.share(this.sound);
            }, {sound : sound}
        );

        var deleteFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.deleteSound(this.sound, this.$div);
            }, {sound : sound, $div : $html}
        );
        
        $html.append(
            $("<a class='button textLink language' data-langhtml='_PLAYMUSIC_' />").bind('click', playFunc)
        );

        $html.append(' - ');
        
        $html.append(
            $("<a class='button textLink language' data-langhtml='_SHAREMUSIC_' />").bind('click', shareFunc)
        );
        
        $html.append(
            $("<a class='button textLink language floatRight' data-langhtml='_DELETEMUSIC_' />").bind('click', deleteFunc)
        );

        $html.append(' - ');

        $html.append($('<span class="selectable" />').text(sound.name));
        
        return $html;
    };
    
    this.create$folder = function (folder) {
        var $html = $('<div class="folder" />');
        var $title = $('<div class="folderTitle" />');
        
        var onClick = function () {
            $(this).parent().toggleClass('toggled');
        };

        var moveUp = window.app.emulateBind(
            function () {
                window.app.ui.soundui.moveUp(this.folder.index, this.$div);
            }, {folder : folder, $div : $html}
        );

        var moveDown = window.app.emulateBind(
            function () {
                window.app.ui.soundui.moveDown(this.folder.index, this.$div);
            }, {folder : folder, $div : $html}
        );

        var deleteFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.deleteFolder(this.folder.index, this.$div);
            }, {folder : folder, $div : $html}
        );
        
        $title.append(
            $('<a class="left melded openIcon language" data-langtitle="_SOUNDSOPEN_" />').bind('click', onClick)
        );

        $title.append(
            $('<a class="right button upIcon language" data-langtitle="_SOUNDSMOVEUP_" />').bind('click', moveUp)
        );

        $title.append(
            $('<a class="right button downIcon language" data-langtitle="_SOUNDSMOVEDOWN_" />').bind('click', moveDown)
        );

        $title.append(
            $('<a class="right button delIcon language" data-langtitle="_SOUNDSDELETE_" />').bind('click', deleteFunc)
        );

        $title.append(
            $('<p class="language" data-langtitle="_SOUNDSOPEN_" />').text(folder.name).bind('click', onClick)
        );
        
        $html.append($title);
        
        var $sl = $('<div class="folderSounds" />');
        folder.sounds.sort(function (a, b) {
            var na = a.name.toUpperCase();
            var nb = b.name.toUpperCase();
            if (na < nb) {
                return -1;
            }
            if (na > nb) {
                return 1;
            }
            return 0;
        });
        for (var i = 0; i < folder.sounds.length; i++) {
            folder.sounds[i].index = i;
            folder.sounds[i].folderIndex = folder.index;
            $sl.append(this.create$sound(folder.sounds[i]));
        }
        $html.append($sl);
        
        return $html;
    };
    
    this.oldSounds = "";
    this.printSounds = function () {
        var newSounds = JSON.stringify(window.app.storage.get("sounds"));
        if (newSounds === this.oldSounds) return;
        this.oldSounds = newSounds;
        this.$soundList.empty();
        this.$soundInputNew.val('').hide();
        this.$soundSelectList.empty();
        this.$soundSelect.show().find('option').prop('selected', false);
        this.$soundSelectNone.prop('selected', true);
        
        for (var i = 0; i < window.app.storage.get("sounds").length; i++) {
            window.app.storage.get("sounds")[i].index = i;
            this.$soundList.append(this.create$folder(window.app.storage.get("sounds")[i]));
            this.$soundSelectList.append(
                $('<option />').text(window.app.storage.get("sounds")[i].name).val(window.app.storage.get("sounds")[i].name)
            );
        }
        window.app.ui.language.applyLanguageOn(this.$soundList);
    };
    
    this.play = function (sound) {
        if (sound.bgm) {
            window.app.ui.chat.audioc.play(sound.link);
        } else {
            window.app.ui.chat.audioc.playse(sound.link);
        }
    };
    
    this.share = function (sound) {
        if (window.app.ui.chat.cc.room === null) {
            window.app.ui.chat.cc.callSelf(false);
            return;
        }
        
        var message = new Message();
        message.setOrigin(window.app.loginapp.user.id);
        if (sound.bgm) {
            message.module = 'bgmplay';
        } else {
            message.module = 'seplay';
        }
        message.setMessage(sound.link);
        message.setSpecial('name', sound.name);
        
        window.app.chatapp.fixPrintAndSend(message, true);
    };
    
    this.fetchLink = function () {
        window.app.ui.soundui.$corserror.hide();
        window.app.ui.soundui.$foldererror.hide();
        var cbs = function (data) {
            window.app.ui.unblockRight();
            window.app.ui.soundui.processLink(data, false);
            window.app.ui.soundui.$link.val('');
        };
        
        var cbe = function (data) {
            if (data.status === 0) {
                window.app.ui.soundui.$corserror.show();
            }
            window.app.ui.unblockRight();
        };
        
        var link = this.$link.val();
        
        var ajax = new AjaxController();
        
        window.app.ui.blockRight();
        
        ajax.requestPage({
            url : link,
            success : cbs,
            error: cbe
        });
    };
    
    this.processLink = function (data) {
        var link = this.$link.val();
        var dropbox = link.indexOf('dropbox.com') !== -1;
        if (!dropbox) {
            if (link.charAt(link.length - 1) !== '/') {
                link = link + '/';
            }
        } else {
            var link = '';
        }
        if (!dropbox) {
            var files = $(data).find('a');
        } else {
            var files = $(data).find('a.thumb-link');
        }
        var $file;
        var names = [];
        var split;
        for (var i = 0; i < files.length; i++) {
            $file = $(files[i]);
            if (typeof $file.attr('href') === 'undefined' || $file.attr('href') === null || $file.attr('href') === '../' && $file.attr('href') === '/') continue;
            split = [$file.attr('href').substr(0, $file.attr('href').lastIndexOf('.')), $file.attr('href').substr($file.attr('href').lastIndexOf('.') + 1)];
            if (split.length === 2) {
                split[1] = split[1].replace("?dl=0", "").replace("?dl=1", "");
            }
            if (split.length !== 2 || (['SPC', 'MP3', 'MP4', 'M4A', 'AAC', 'OGG', 'WAV', 'WAVE', 'OPUS']).indexOf(split[1].toUpperCase()) === -1) {
                continue;
            }
            if (names.indexOf(split) === -1) names.push(split);
        }
        
        var cleanNames = [];
        var cleanName;
        for (var i = 0; i < names.length; i++) {
            split = names[i];
            cleanName = {
                fileName : split[0],
                fileExt : split[1]
            };
            
            if (cleanName.fileName.indexOf('://') !== -1) {
                cleanName.name = cleanName.fileName.replace(/^.*[\\\/]/, '');
                if (dropbox) {
                    cleanName.fileExt = cleanName.fileExt + '?dl=1';
                }
            } else {
                cleanName.name = split[0];
                cleanName.fileName = link + cleanName.fileName;
            }
            cleanNames.push(cleanName);
        }
        
        var folderName = this.$soundSelect.val();
        if (folderName === '-1' || folderName === '' || folderName === null) {
            folderName = this.$soundInputNew.val();
            if (folderName === '' || folderName === null) {
                this.$foldererror.show();
                return false;
            }
        }
        var folder = null;
        for (i = 0; i < window.app.storage.get("sounds").length; i++) {
            if (window.app.storage.get("sounds")[i].name.toUpperCase() === folderName.toUpperCase()) {
                folder = window.app.storage.get("sounds")[i];
            }
        }
        if (folder === null) {
            folder = {
                name : folderName,
                sounds : []
            };
            window.app.storage.get("sounds").push(folder);
        }
        
        var sounds = folder.sounds;
        for (i = 0; i < cleanNames.length; i++) {
            sounds.push({
                name : decodeURIComponent(cleanNames[i].name),
                link : cleanNames[i].fileName + '.' + cleanNames[i].fileExt,
                bgm : this.isBGM()
            });
        }
        this.updateIndexes();
        this.printSounds();
    };
    
    this.fetchFiles = function () {
        this.$foldererror.hide();
        var files = this.$fileList.prop('files');
        var names = $.map(files, function(val) { return val.name; });
        var cleanNames = [];
        var cleanName;
        var split;
        for (var i = 0; i < names.length; i++) {
            split = [names[i].substr(0, names[i].lastIndexOf('.')), names[i].substr(names[i].lastIndexOf('.') + 1)];
            if (split.length !== 2) {
                continue;
            }
            cleanName = {
                fileName : split[0],
                fileExt : split[1]
            };
            cleanNames.push(cleanName);
        }
        
        var folderName = this.$soundSelect.val();
        if (folderName === '-1' || folderName === '' || folderName === null) {
            folderName = this.$soundInputNew.val();
            if (folderName === '' || folderName === null) {
                this.$foldererror.show();
                return false;
            }
        }
        var folder = null;
        for (i = 0; i < window.app.storage.get("sounds").length; i++) {
            if (window.app.storage.get("sounds")[i].name.toUpperCase() === folderName.toUpperCase()) {
                folder = window.app.storage.get("sounds")[i];
            }
        }
        if (folder === null) {
            folder = {
                name : folderName,
                sounds : []
            };
            window.app.storage.get("sounds").push(folder);
        }
        
        var sounds = folder.sounds;
        for (i = 0; i < cleanNames.length; i++) {
            sounds.push({
                name : cleanNames[i].fileName,
                link : cleanNames[i].fileName + '.' + cleanNames[i].fileExt,
                bgm : this.isBGM()
            });
        }
        this.updateIndexes();
        this.printSounds();
    };
} 
 
function StyleUI () {
    
    this.$form = $('#styleEditCreate').on('submit', function (e) {
        e.preventDefault();
        window.app.ui.styleui.submitForm();
    }).hide();
    
    this.$stylelist = $('#styleList');
    
    this.$idinput = $('#styleIdInput');
    this.$nameinput = $('#styleNameInput');
    this.$publicinput = $('#stylePublicInput').on('change', function () {
        if (this.checked) {
            window.app.ui.styleui.$notPublic.hide();
        } else {
            window.app.ui.styleui.$notPublic.show();
        }
    });
    this.$afterinput = $('#styleAfterInput');
    this.$htmlinput = $('#styleHtmlInput');
    this.$cssinput = $('#styleCssInput');
    this.$beforeinput = $('#styleBeforeInput');
    this.$stayinput = $('#styleStayInput');
    this.$gameSelect = $('#styleForGame');
    this.$formError = $('#formError').empty();
    this.$notPublic = $('#styleNotPublic');
    
    this.$copyInput = $('#styleCopyId');
    this.$copyBt = $('#styleCopyBt').on('click', function () {
        window.app.ui.styleui.copyStyle();
    });
    
    this.callSelf = function () {
        this.$form.hide();
        window.app.ui.callLeftWindow('styleWindow');
        
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.styleui.fillList();
        };
        
        var cbe = function () {
            window.app.ui.unblockLeft();
            alert("Erro");
        };
        window.app.ui.blockLeft();
        window.app.sheetapp.loadMyStyles(cbs, cbe);
    };
    
    this.fillList = function () {
        this.$stylelist.empty();
        
        var $style;
        var $edit;
        var style;
        
        for (var id in window.app.styledb.styles) {
            style = window.app.styledb.getStyle(id);
            if (style.idCreator !== window.app.loginapp.user.id) continue;
            $style = $('<p class="textLink hoverable" />').text(style.name).on('click', window.app.emulateBind(function () {
                window.app.ui.styleui.callEdit(this.id);
            }, {id : id}));
            this.$stylelist.append($style);
        }
        
        var $p = $('<p class="textLink hoverable language" data-langhtml="_STYLECREATE_" />').on('click', function () {
            window.app.ui.styleui.callEdit(0);
        });
        
        window.app.ui.language.applyLanguageTo($p);
        
        this.$stylelist.append($p).show();
    };
    
    this.callEdit = function (id) {
        this.$idinput.val(id);
        this.$stylelist.hide();
        window.app.ui.blockLeft();
        this.$gameSelect.empty().append("<option disabled>Loading...</option>");
        
        var cbs = function () {
            window.app.ui.styleui.fillEdit();
            window.app.ui.unblockLeft();
        };
        
        var cbe = function () {
            alert('erro');
            window.app.ui.unblockLeft();
        };
        if (id !== 0) {
            window.app.sheetapp.loadStyle(id, cbs, cbe);
        } else {
            cbs();
        }
        
        cbs = function () {
            window.app.ui.styleui.fillGames();
        };
        
        cbe = function () {
            alert("Error loading games");
        };
        
        window.app.gameapp.updateLists(cbs, cbe);
    };
    
    this.fillGames = function () {
        this.$gameSelect.empty();
        
        var $option;
        var game;
        
        var id = parseInt(this.$idinput.val());
        var style = window.app.styledb.getStyle(id);
        if (style === null) style = new Style_Instance();
        
        for (var id in window.app.gamedb.games) {
            game = window.app.gamedb.getGame(id);
            if (game.creatorid !== window.app.loginapp.user.id) continue;
            
            $option = $('<option ' + (game.id === style.gameid ? 'selected' : '') + '/>').val(game.id).text(game.name);
            this.$gameSelect.append($option);
        }
    };
    
    this.fillEdit = function () {
        this.$form.show();
        var id = parseInt(this.$idinput.val());
        this.fillEditWith(id);
        
        this.$copyInput.empty();
        
        var $select;
        var style;
        var none = true;
        for (var id in window.app.styledb.styles) {
            style = window.app.styledb.getStyle(id);
            if (style === null || parseInt(id) === parseInt(this.$idinput.val()) || !style.isLoaded()) continue;
            $select = $('<option />').val(id).text(style.name);
            this.$copyInput.append($select);
            none = false;
        }
        
        if (none) {
            this.$copyBt.hide();
            this.$copyInput.hide();
        } else {
            this.$copyBt.show();
            this.$copyInput.show();
        }
        
        if (window.app.loginapp.user.level < 9) {
            this.$publicinput.hide();
            $('#stylePublicLabel').hide();
        } else {
            $('#stylePublicLabel').show();
            this.$publicinput.show();
        }
    };
    
    this.fillEditWith = function (id) {
        var style = window.app.styledb.getStyle(id);
        if (style === null) style = new Style_Instance();
        
        this.$afterinput.val(style.afterProcess);
        this.$beforeinput.val(style.beforeProcess);
        this.$cssinput.val(style.css);
        this.$htmlinput.val(style.html);
        this.$nameinput.val(style.name);
        if (window.app.loginapp.user.level >= 9) {
            this.$publicinput[0].checked = style.public;
        }
    };
    
    this.copyStyle = function () {
        var id = parseInt(this.$copyInput.val());
        this.fillEditWith(id);
    };
    
    this.submitForm = function () {
        var style = new Style_Instance();
        style.afterProcess = this.$afterinput.val();
        style.beforeProcess = this.$beforeinput.val();
        style.css = this.$cssinput.val();
        style.html = this.$htmlinput.val();
        style.id = parseInt(this.$idinput.val());
        style.name = this.$nameinput.val();
        style.public = this.$publicinput[0].checked;
        style.gameid = this.$gameSelect.val();
        
        var cbs = function () {
            window.app.ui.styleui.$formError.hide();
            window.app.ui.unblockLeft();
            if (!window.app.ui.styleui.$stayinput[0].checked) {
                window.app.ui.styleui.callSelf();
            }
        };
        
        var cbe = function () {
            window.app.ui.unblockLeft();
            window.app.ui.styleui.$formError.text("Error").show();
        };
        
        window.app.ui.blockLeft();
        
        window.app.sheetapp.sendStyleUpdate(style, cbs, cbe);
    };
} 
 
function YoutubeUI () {
    //src = http://www.youtube.com/v/XGSy3_Czz8k
    
    this.$player;
    
    this.init = function () {
        window.app.config.registerConfig('autoVIDEO', this);
        
        this.$player = $('#youtubePlayer');
        this.$button = $('<a id="openYoutube" class="button"><span class="language" data-langhtml="_OPENYOUTUBE_"></span></a>');
        this.$button.on('click', function () {
            window.app.ui.callRightWindow("youtubeWindow");
        });
    };
    
    this.configValidation = function (id, value) {
        if (id === 'autoVIDEO') {
            if (typeof value === 'number' && value >= 0 && value <= 2 && parseInt(value) === value) return true;
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'autoVIDEO') return 1;
    };
    
    this.configChanged = function (id) {
        
    };
    
    this.parseUrl = function (url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return null;
        }
    };
    
    this.play = function (id, autoplay, repeat) {
        //https://www.youtube.com/v/ID?autoplay=1&loop=1&playlist=ID
        //Autoplay loop
        //But no good, won't be added.
        if (typeof autoplay === 'undefined') var autoplay = false;
        if (typeof repeat === 'undefined') var repeat = false;
        id = id.replace(/"/g, '');
        var initialid = id;
        
        id = id + '?iv_load_policy=3';
        
        if (autoplay) {
            id = id + "&autoplay=1";
        }
        if (repeat) {
            id = id + "&loop=1&playlist=" + initialid;
        }
        
        //var $play = $('<embed type="application/x-shockwave-flash" src="http://www.youtube.com/v/' + id + '" />');
        
        var $play = $('<iframe id="youtubeiFrame" class="youtube-player" type="text/html" src="http://www.youtube.com/embed/' + id + '" allowfullscreen frameborder="0"></iframe>');
        
        this.$player.empty().append($play);
        
        window.app.ui.callRightWindow('youtubeWindow');
        window.app.ui.$rightHandler.append(this.$button);
        window.app.ui.language.applyLanguageOn(this.$button);
    };
    
    this.close = function () {
        this.$player.empty();
        window.app.ui.closeRightWindow();
    };
} 
 
