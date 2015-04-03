if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'sheetup',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var sheetid = msg.getSpecial('sheetid', 0);
        if (typeof window.app.ui.sheetui.controller.$listed[sheetid] === 'undefined') {
            return null;
        }
        
        var sheet = window.app.sheetdb.getSheet(sheetid);
        
        var user = msg.getUser();
        var $msg = $('<p class="chatSistema" />');
        
        $msg.text(sheet.name);
        $msg.append(' ');
        
        if (window.app.ui.sheetui.controller.autoUpdate && !sheet.changed) {
            window.app.ui.sheetui.controller.updateSpecificSheet(sheetid);
            return null;
        } else {
            $msg.append('<span class="language" data-langhtml="_SHEETWASUPDATED_" />');
            $msg.append(' ');

            var $clickupdate = $('<a class="language" data-langhtml="_SHEETCLICKTOUPDATE_" />');

            $clickupdate.on('click', function () {
                window.app.ui.sheetui.controller.updateSpecificSheet(sheetid);
            });

            $msg.append($clickupdate);
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
        return null;
    }
});