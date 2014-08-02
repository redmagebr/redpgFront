/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'stream',
    
    isStream : false,
    $css : null,
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/stream'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (msg === null || msg.msg === null || (typeof message !== 'undefined' && message !== null && message !== '')) {
            return null;
        }
        
        if (!this.isStream || (msg.getUser() === null || (!msg.getUser().isStoryteller()) && msg.origin !== window.app.loginapp.user.id)) {
            return null;
        }
        
        var clean = msg.msg.toUpperCase();
        
        if (clean === 'CLOSEPICTURE' || clean === 'PICTURE') {
            window.app.ui.$pictureContainer.animate({
                'opacity' : 0
            }, 200, function () {
                $(this).css('visibility', 'hidden');
            });
        } else if (clean === 'CLOSEYOUTUBE' || clean === 'YOUTUBE') {
            window.app.ui.hideRightWindows(function () {
                window.app.ui.youtubeui.$player.empty();
            });
        } else if (clean === 'CLEAR') {
            window.app.ui.chat.$chatHeader.hide();
            window.app.ui.chat.$chatMessages.empty();
            window.app.ui.chat.fixScrollpane();
        } else if (msg.msg.indexOf('://') !== -1) {
            $('#stream').empty().append($('<img />').attr('src', msg.msg));
        }
        
        
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
        var msg = null;
        if (message === '' || message === null) {
            if (this.isStream) {
                this.isStream = false;
                window.app.ui.chat.$chatHeader.show();
                window.app.configdb.store('showWhispers', true);
                window.app.configdb.store('autoSE', true);
                window.app.configdb.store('autoBGM', true);
                window.app.ui.nonotifications = false;
                window.app.ui.chat.cc.room.hidePersona = false;
                window.app.ui.title = "RedPG";
                window.app.ui.chat.alwaysBottom = false;
                window.app.ui.removeNotifications();
                this.$css.remove();
                var $notification = $('<p class="chatSistema language" data-langhtml="_STREAMOFF_" />');
                window.app.ui.language.applyLanguageTo($notification);
                window.app.ui.chat.appendToMessages($notification);
                $('#favicon').attr('href', 'favicon.ico');
            } else {
                this.isStream = true;
                window.app.configdb.store('showWhispers', false);
                window.app.configdb.store('autoSE', false);
                window.app.configdb.store('autoBGM', false);
                window.app.ui.chat.alwaysBottom = true;
                window.app.ui.nonotifications = true;
                window.app.ui.chat.cc.room.hidePersona = true;
                window.app.ui.title = "RedPGCamera";
                window.app.ui.removeNotifications();
                $('#favicon').attr('href', 'img/favicon.ico');
                var $notification = $('<p class="chatSistema language" data-langhtml="_STREAMON_" />');
                window.app.ui.language.applyLanguageTo($notification);
                window.app.ui.chat.appendToMessages($notification);
                this.$css = $('<link rel="stylesheet" href="css/stream.css" type="text/css" />');
                $('head').append(this.$css);
                this.$css.bind('load', function (){
                    window.app.ui.chat.fixScrollpane();
                    window.app.ui.hideRightWindows();
                });
            }
        } else {
            msg = new Message();
            msg.setMessage(message);
        }
        return msg;
    },
    
    get$error : function () {
        return null;
    }
});