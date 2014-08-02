/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'roleplay',
    
    Slash : [''],
    
    
    isValid : function (slashCMD, message) {
        return true;
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
        
        
        var $msg = $('<p class="chatMensagem" />');
        
        var $persona = $('<b />').text(msg.getSpecial('persona', '????'));
        var msgText = $('<p />').text(msg.msg).html();
        
        
        var $spans = [];
        var pmsg = '';
        var open = null;
        
        var char;
        var $span;
        for (var i = 0; i < msgText.length; i++) {
            char = msgText.charAt(i);
            if (char === '*') {
                if (open === '*') {
                    $span = $('<span class="action" />').text('*' + pmsg + '*');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (open === null) {
                    open = '*';
                    if (pmsg.length > 0) {
                        $span = $('<span />').text(pmsg);
                        $span.addClass('lingua' + lingua);
                        $span.addClass()
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['[', ']'].indexOf(char) !== -1) {
                if (char === ']' && open === '[') {
                    $span = $('<span class="important" />').text('[' + pmsg + ']');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '[' && open === null) {
                    open = '[';
                    if (pmsg.length > 0) {
                        $span = $('<span />').text(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['(', ')'].indexOf(char) !== -1) {
                if (char === ')' && open === '(') {
                    $span = $('<span class="thought" />').text('(' + pmsg + ')');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '(' && open === null) {
                    open = '(';
                    if (pmsg.length > 0) {
                        $span = $('<span />').text(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else {
                pmsg = pmsg + char;
            }
        }
        if (open !== null) {
            pmsg = open + pmsg;
        }
        
        if (pmsg.length > 0) {
            $span = $('<span />').text(pmsg);
            $span.addClass('lingua' + lingua);
            $spans.push($span);
        }
        
        
//        msgText = msgText.split('*');
//        if (msgText.length === 1) {
//            msgText = msgText[0];
//        } else {
//            for (var i = 1; i < msgText.length; i += 2) {
//                msgText[i] = '<span class="action">*' + msgText[i] + '*</span>';
//            }
//            msgText = msgText.join('');
//        }
//        
//        var go = true;
//        var idx1;
//        var idx2;
//        while (go) {
//            idx1 = msgText.indexOf('[');
//            idx2 = msgText.indexOf(']');
//            if (idx1 === -1 || idx2 === -1) {
//                go = false;
//            } else {
//                msgText = msgText.replace('[', '<span class="important">');
//                msgText = msgText.replace(']', '</span>');
//            }
//        }
//        
//        var newMsg = '';
//        var open = false;
//        for (var i = 0; i < msgText.length; i++) {
//            if (msgText.charAt(i) !== '(' && msgText.charAt(i) !== ')') {
//                newMsg += msgText.charAt(i);
//            } else if (msgText.charAt(i) === '(') {
//                newMsg += '<span class="thought">(';
//                open = true;
//            } else {
//                newMsg += ')</span>';
//                open = false;
//            }
//        }
//        if (open) newMsg += ")</span>";
//        
//        msgText = newMsg;
        
        $msg.append($persona).append(': ');
        for (i = 0; i < $spans.length; i++) {
            $msg.append($spans[i]);
        }
        
        if (user === null) {
            user = new User();
            user.nickname = '?';
            user.nicknamesufix = '?';
        }
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
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        if (room.persona === null) {
            msg.setSpecial('persona', '?????');
        } else {
            msg.setSpecial('persona', room.persona);
        }
        msg.msg = message;
        
        
        return msg;
    }
});