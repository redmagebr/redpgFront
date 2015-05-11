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