/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'splay',
    
    Slash : [],
    
    
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
        }
        
        var $who = $('<span class="language" data-langhtml="_SHAREDSOUND_" />');
        $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
        $msg.append($who);
        
        $msg.append (' ');
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_SOUNDLINK_" />');
        $link.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.chat.audioc.play(this.link);
            }, {link : cleanMsg}
        ));
        

        var IPlayedItNow = ((typeof slashCMD !== 'undefined' && slashCMD !== null) && !(window.app.ui.chat.cc.firstPrint));
        var StorytellerPlayedItNow = user.isStoryteller() && !(window.app.ui.chat.cc.firstPrint) && (window.app.config.get("autoBGM") === 1);

        if (IPlayedItNow || StorytellerPlayedItNow || (window.app.config.get("autoBGM") === 2)) {
            window.app.ui.chat.audioc.play(cleanMsg);
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