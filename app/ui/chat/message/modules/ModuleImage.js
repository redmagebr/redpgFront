/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'image',
    
    Slash : ['/img', '/image', '/pic', '/picture', '/imagem', '/desenho'],
    
    
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
        
        if (msg.getSpecial("name", null) === null) {
            var $who = $('<span class="language" data-langhtml="_SHAREDIMAGE_" />');
            $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
            $msg.append($who);

            $msg.append (' ');
        } else {
            var $who = $('<span class="language" data-langhtml="_SHAREDTHEIMAGE_" />');
            $who.attr('data-langp', (user.nickname + '#' + user.nicknamesufix));
            $msg.append($who);

            $msg.append (': ');
            
            $msg.append($('<span />').text(msg.getSpecial("name", null)));
        }
        
        var cleanMsg = msg.msg.trim();
        
        var $link = $('<a class="language" data-langhtml="_IMAGELINK_" />');
        $link.bind('click', window.app.emulateBind(
            function (/** Event */ event) {
                window.app.ui.showPicture(this.link);
                event.preventDefault();
            }, {link : cleanMsg}
        ));
        $link.attr('href', cleanMsg);
        $link.attr('target', '_blank');
        
        if ((typeof slashCMD === 'undefined' || slashCMD === null) && !window.app.ui.chat.cc.firstPrint && user.isStoryteller() && window.app.configdb.get("autoImage", true)) {
            window.app.ui.showPicture(cleanMsg);
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