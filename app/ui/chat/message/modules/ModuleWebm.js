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
        
        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null) && !(window.app.ui.chat.cc.firstPrint));
        var StorytellerPlayedItNow = user.isStoryteller() && !(window.app.ui.chat.cc.firstPrint) && (window.app.config.get("autoImage") === 1);

        if (IPlayedItNow || StorytellerPlayedItNow || (window.app.config.get("autoImage") === 2)) {
            window.app.ui.pictureui.open(cleanMsg, true);
        }

        $msg.append($link);
        
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