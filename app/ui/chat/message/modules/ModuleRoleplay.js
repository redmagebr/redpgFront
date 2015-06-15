if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'roleplay',
    
    Slash : [''],
    
    showHelp : false,
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var ignoreFor = msg.getSpecial("ignoreFor", []);
        if (ignoreFor.indexOf(window.app.loginapp.user.id) !== -1) {
            return null;
        }
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
                    $span = $('<span class="action" />').html('*' + pmsg + '*');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (open === null) {
                    open = '*';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['[', ']'].indexOf(char) !== -1) {
                if (char === ']' && open === '[') {
                    $span = $('<span class="important" />').html('[' + pmsg + ']');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '[' && open === null) {
                    open = '[';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['{', '}'].indexOf(char) !== -1) {
                if (char === '}' && open === '{') {
                    $span = $('<span class="highlight" />').html(pmsg);
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '{' && open === null) {
                    open = '{';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (['(', ')'].indexOf(char) !== -1) {
                if (char === ')' && open === '(') {
                    $span = $('<span class="thought" />').html('(' + pmsg + ')');
                    $spans.push($span);
                    pmsg = '';
                    open = null;
                } else if (char === '(' && open === null) {
                    open = '(';
                    if (pmsg.length > 0) {
                        $span = $('<span />').html(pmsg);
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
            $span = $('<span />').html(pmsg);
            $span.addClass('lingua' + lingua);
            $spans.push($span);
        }
        
        $msg.append($persona).append(': ');
        for (i = 0; i < $spans.length; i++) {
            $msg.append($spans[i]);
        }
        
        var translation = msg.getSpecial('translation', null);
        if (translation !== null && !(window.app.ui.chat.cc.mc.getModule("stream") !== null && window.app.ui.chat.cc.mc.getModule("stream").isStream)) {
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