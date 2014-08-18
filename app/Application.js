/** 
 * @param {boolean} debug
 * @class Application
 * @constructor
 * @requires UI
 */
function Application (debug) {
    if (typeof debug === 'undefined' || debug) {
        this.debug = true;
    } else {
        this.debug = false;
        console.log = function () {};
    }
    
    /**
     * Host must point to the server we're using.
     * It will be prepended to every AJAX url.
     */
    this.host = 'http://redpg.com.br/service/';
    this.staticHost = 'http://redpg.com.br/';
    this.wshost = 'ws://redpg.com.br:8080/service/';
    
    
    
    /**
     * Major, Minor, Release
     * Major covers breakpoints.
     * Minor covers new functions.
     * Release covers bugfixes only.
     */
    this.version = [0, 16, 0];
    
    /**
     * Databases
     */
    this.configdb = new ConfigDB();
    this.sheetdb = new SheetDB();
    this.gamedb = new GameDB();
    this.roomdb = new RoomDB();
    this.userdb = new UserDB();
    this.sheetdb = new SheetDB();
    this.memory = new Memory();
    
    /**
     * Apps
     */
    this.loginapp = new LoginApp();
    this.gameapp = new GameApp();
    this.roomapp = new RoomApp();
    this.chatapp = new ChatWsApp();
    this.sheetapp = new SheetApp();
    
    this.ui = new UI();
    
    this.updateConfig = function () {
        this.ui.updateConfig();
        this.memory.init();
    };
    
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
}