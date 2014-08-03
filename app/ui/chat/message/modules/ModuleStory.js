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
        var open = false;
        
        for (var i = 0; i < msgText.length; i++) {
            if (msgText.charAt(i) === '[' && !open) {
                open = true;
                msgFinal += "<span class='important'>";
            } else if (msgText.charAt(i) === ']' && open) {
                msgFinal += "</span>";
            } else {
                msgFinal += msgText.charAt(i);
            }
        }
        
        $msg.append('- ' + msgFinal);
        
        var $tooltip = $('<span class="tooltip" />');
        if (user.isStoryteller()) {
            $tooltip.append($('<b class="language" data-langhtml="_STORYTELLERTOOLTIP_" />'));
        } else {
            $tooltip.append($('<b class="language" data-langhtml="_PLAYERTOOLTIP_" />'));
        }

        $tooltip.append(': ' + user.nickname + '#' + user.nicknamesufix);

        $msg.append($tooltip);
        
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