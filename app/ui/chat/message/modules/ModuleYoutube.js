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