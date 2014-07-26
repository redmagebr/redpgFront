/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'seplay',
    
    Slash : ['/se', '/seplay', '/soundeffect', '/wav', '/wave'],
    
    
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
        
        var $who = $('<span class="language" data-langhtml="_SHAREDSOUNDEFFECT_" />');
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
        $link.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.chat.audioc.playse(this.link);
            }, {link : cleanMsg}
        ));

        var $link2 = $('<a class="language" data-langhtml="_SOUNDSTOP_" />');
        $link2.bind('click', function () {
            window.app.ui.chat.audioc.stopse();
        });

        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null) && !(window.app.ui.chat.cc.firstPrint));
        var StorytellerPlayedItNow = user.isStoryteller() && !(window.app.ui.chat.cc.firstPrint) && window.app.configdb.get("autoSE", true);

        if (IPlayedItNow || StorytellerPlayedItNow) {
            window.app.ui.chat.audioc.playse(cleanMsg);
        }

        $msg.append(' ');
        $msg.append($link);
        $msg.append(' ');
        $msg.append($link2);
        
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