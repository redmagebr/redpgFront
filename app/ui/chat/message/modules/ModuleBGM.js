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