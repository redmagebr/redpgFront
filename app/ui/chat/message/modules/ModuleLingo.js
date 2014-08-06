/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'lingo',
    
    Slash : ['/lang', '/language', '/lingo', '/lingua', '/ling'],
    
    linguas : ['Elvish', 'Musical', 'Abyssal', 'Celestan', 'Alien', 'AncientMagi', 'AncientTech', 'BestialCommon', 'Binary', 'Draconic'],
    
    isValid : function (slashCMD, message) {
        var lingua = message.substring(0, message.indexOf(','));
        return this.linguas.indexOf(lingua) !== -1 && this.doISpeak(lingua);
    },
    
    
    /**
     * Scours a Game Controller Sheet for who can speak a certain language
     * @param {String} language
     * @returns {Array}
     */
    whoSpeaks : function (language) {
        return [1];
    },
    
    doISpeak : function (language) {
        return !window.app.ui.chat.mc.getModule("stream").isStream && this.whoSpeaks(language).indexOf(window.app.loginapp.user.id) !== -1;
    },

    /**
     * Translates a word into a set language.
     * @param {String} word
     * @param {String} language
     * @returns {String}
     */
    translate : function (word, language) {
        var exclamation = word.indexOf('!') !== -1;
        var interrobang = word.indexOf('?') !== -1;
        var finish = word.indexOf('.') !== -1;
        var doispontos = word.indexOf(':') !== -1;
        word = word.replace(/\!/g, '');
        word = word.replace(/\?/g, '');
        word = word.replace(/\./g, '');
        word = word.replace(/\:/g, '');
        var words;
        var knownWords;
        var uppercase = false;
        var allowpoints;
        switch (language) {
            case "Elvish":
                words = {
                    1 : ['a', 'li', 'e','i','o','u', 'la'],
                    2 : ['ae', 'ea', 'la', 'lea', 'mia', 'thal'],
                    3 : ['laeu', 'maa', 'eaat', 'tenlar', 'umil'],
                    4 : ['luquia', 'tamira', 'lavia', 'mera', 'ligha'],
                    Bigger : ['lamiaala', 'elatria', 'mialita', 'talvalbas', 'palaastri']
                };
                knownWords = {
                    'uroloki' : ['CALOR','QUENTE','FOGO','CHAMA','FLAMEJANTE','CHAMAS','FOGOS'],
                    'tengwar' : ['LETRA', 'LETRAS', 'LETTER', 'LETTERS'],
                    'thalias' : ['CORAGEM', 'CONFIANÇA', 'CONFIANCA', 'BRAVERY'],
                    'laer' : ['VERAO', 'VERÃO', 'SUMMER'],
                    'tar' : ['ALTO', 'GRANDE'],
                    'mellon' : ['AMIGO', 'COMPADRE', 'CAMARADA'],
                    'luin' : ['AZUL', 'AZULADO']
                };
                uppercase = true;
                allowpoints = true;
                break;
            default:
                return word;
        }
        
        for (var index in knownWords) {
            if (typeof knownWords[index] === 'string') {
                words[knownWords[index]] = [index];
            } else {
                for (var k = 0; k < knownWords[index].length; k++) {
                    words[knownWords[index][k]] = [index];
                }
            }
        }
        
        var resultFrom = "Bigger";
        if (typeof words[word.toUpperCase()] !== 'undefined') {
            resultFrom = word.toUpperCase();
        } else if (typeof words[word.length] !== 'undefined') {
            resultFrom = word.length;
        }
        
        var myrng = new Math.seedrandom(word.toUpperCase());
        var result = Math.floor(myrng() * words[resultFrom].length);
        var selected = words[resultFrom][result];
        
        if (!uppercase) {
            var newWord = selected;
        } else {
            var newWord = '';
            for (var i = 0; i < selected.length; i++) {
                if (word.charAt(i) !== '' && word.charAt(i) === word.charAt(i).toUpperCase()) {
                    newWord += selected.charAt(i).toUpperCase();
                } else {
                    newWord += selected.charAt(i);
                }
            }
        }
        
        if (allowpoints) {
            newWord = newWord +
                    (exclamation ? '!' : '') +
                    (interrobang ? '?' : '') +
                    (finish ? '.' : '') +
                    (doispontos ? ':' : '');
        }
        
        return newWord;
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
                        $span = $('<span />').text(this.translate(pmsg, lingua));
                        $span.addClass('lingua' + lingua);
                        $span.addClass();
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
                        $span = $('<span />').text(this.translate(pmsg, lingua));
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
                        $span = $('<span />').text(this.translate(pmsg, lingua));
                        $span.addClass('lingua' + lingua);
                        $spans.push($span);
                    }
                    pmsg = '';
                } else {
                    pmsg = pmsg + char;
                }
            } else if (char === ' ' && open === null) {
                if (pmsg.length > 0) {
                    $span = $('<span />').text(this.translate(pmsg, lingua));
                    $span.addClass('lingua' + lingua);
                    $spans.push($span);
                }
                pmsg = '';
            } else {
                pmsg = pmsg + char;
            }
        }
        if (open !== null) {
            pmsg = open + pmsg;
        }
        
        if (pmsg.length > 0) {
            pmsg = pmsg.split(' ');
            for (i = 0; i < pmsg.length; i++) {
                $span = $('<span />').text(this.translate(pmsg[i], lingua));
                $span.addClass('lingua' + lingua);
                $spans.push($span);
            }
        }
        
               
        $msg.append($persona).append(': ');
        for (i = 0; i < $spans.length; i++) {
            $msg.append($spans[i]);
            $msg.append(' ');
        }
        if (this.doISpeak(lingua)) {
            $msg.append(
                    $('<span class="langTranslation" />')
                            .append($('<b class="language" data-langhtml="_CHATTRANSLATEDAS_" />'))
                        .append(": ")
                        .append(msg.getMessage())
            );
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
        
        msg.setSpecial('lingua', message.substring(0, message.indexOf(',')));
        msg.msg = message.substring(message.indexOf(',') + 1, message.length).trim();
        
        
        return msg;
    },
    
    get$error : function (slash, msg, storyteller) {
        var lingua = msg.substring(0, msg);
        var $error = $('<p class="chatSistema" class="language" />');
        
        if (this.linguas.indexOf(lingua) === -1) {
            $error.attr('data-langhtml', '_CHATLANGINVALID_');
        } else if (!this.doISpeak(lingua)) {
            $error.attr('data-langhtml', '_CHATLANGUNKNOWN_');
        } else {
            $error.attr('data-langhtml', '_INVALIDSLASHMESSAGE_');
        }
        
        return $error;
    }
});