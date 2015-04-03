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