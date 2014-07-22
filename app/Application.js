/** 
 * @param {boolean} debug
 * @class AplicaÃ§Ã£o Completa
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
    //this.host = 'http://localhost:8080/RedPG/';
    this.host = 'http://redpg.com.br/service/';
    
    
    
    /**
     * Major, Minor, Release
     * Major covers breakpoints.
     * Minor covers new functions.
     * Release covers bugfixes only.
     */
    this.version = [0, 10, 7];
    
    /**
     * Databases
     */
    this.configdb = new ConfigDB();
    this.gamedb = new GameDB();
    this.roomdb = new RoomDB();
    this.userdb = new UserDB();
    
    /**
     * Apps
     */
    this.loginapp = new LoginApp();
    this.gameapp = new GameApp();
    this.roomapp = new RoomApp();
    this.chatapp = new ChatApp();
    
    this.ui = new UI();
    
    this.updateConfig = function () {
        this.ui.updateConfig();
    };
    
    this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
    };
}