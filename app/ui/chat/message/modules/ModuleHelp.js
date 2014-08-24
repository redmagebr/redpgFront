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