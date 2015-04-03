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
        var open = false;
        
        var $spans = [];
        var $span = null;
        for (var i = 0; i < msgText.length; i++) {
            if (msgText.charAt(i) === '[' && !open) {
                open = true;
                $span = $('<span class="lingua' + lingua + '" />').html(msgFinal);
                $spans.push($span);
                msgFinal = '';
            } else if (msgText.charAt(i) === ']' && open) {
                $span = $('<span class="important" />').html(msgFinal);
                $spans.push($span);
                msgFinal = '';
                open = false;
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