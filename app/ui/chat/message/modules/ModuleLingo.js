window.AvailableLanguages = ['Elvish', 'Musical', 'Abyssal', 'Celestan', 'Alien', 'AncientMagi', 'AncientTech', 'BestialCommon', 'Binary', 'Draconic'];
window.AvailableLanguages = ['Elvish'];
window.chatModules.push({

    ID : 'lingo',
    
    Slash : ['/lang', '/language', '/lingo', '/lingua', '/ling'],
    
    linguas : window.AvailableLanguages,
    
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
        var trespontos = word.indexOf('...') !== -1;
        var doispontos = word.indexOf(':') !== -1;
        var virgula = word.indexOf(',') !== -1;
        word = word.replace(/\!/g, '');
        word = word.replace(/\?/g, '');
        word = word.replace(/\./g, '');
        word = word.replace(/\:/g, '');
        word = word.replace(/\,/g, '');
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
            var char;
            for (var i = 0; i < selected.length; i++) {
                if (i > (word.length - 1)) {
                    char = word.charAt(word.length - 1);
                } else {
                    char = word.charAt(i);
                }
                if (char === char.toUpperCase()) {
                    newWord += selected.charAt(i).toUpperCase();
                } else {
                    newWord += selected.charAt(i);
                }
            }
        }
        
        if (allowpoints) {
            newWord = newWord +
                    (virgula ? ',' : '') +
                    (doispontos ? ':' : '') +
                    (exclamation ? '!' : '') +
                    (interrobang ? '?' : '') +
                    (finish ? '.' : '') +
                    (trespontos ? '..' : '');
        }
        
        return newWord;
    },
    
    translatePhrase : function (phrase, language) {
        phrase = phrase.split(' ');
        for (var i = 0; i < phrase.length; i++) {
            if (phrase[i].length > 0) {
                phrase[i] = this.translate(phrase[i], language);
            }
        }
        phrase = phrase.join(' ');
        return phrase;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        return null;
    },
    
    getMsg : function (slashCMD, message) {
        var room = window.app.chatapp.room;
        var msg = new Message();
        msg.module = 'roleplay';
        msg.roomid = room.id;
        msg.origin = window.app.loginapp.user.id;
        
        if (room.persona === null) {
            msg.setSpecial('persona', '?????');
        } else {
            msg.setSpecial('persona', room.persona);
        }
        var lingua = message.substring(0, message.indexOf(','));
        msg.setSpecial('lingua', lingua);
        
        var cleanMsg = message.substring(message.indexOf(',') + 1, message.length).trim();
        
        var pseudo = '';
        var sentence = '';
        var skipfor = null;
        var char;
        for (var i = 0; i < cleanMsg.length; i++) {
            char = cleanMsg.charAt(i);
            if (skipfor === null) {
                if (['*', '[', '('].indexOf(char) === -1) {
                    sentence += char;
                } else {
                    if (char === '*') {
                        skipfor = '*';
                    } else if (char === '[') {
                        skipfor = ']';
                    } else if (char === '(') {
                        skipfor = ')';
                    }
                    if (sentence.length > 0) {
                        pseudo += this.translatePhrase(sentence, lingua);
                    }
                    sentence = char;
                }
            } else {
                sentence += char;
                if (char === skipfor) {
                    pseudo += sentence;
                    sentence = '';
                    skipfor = null;
                }
            }
            
        };
        
        if (sentence.length > 0) {
            pseudo += this.translatePhrase(sentence, lingua);
        }
        
        msg.setMessage(pseudo);
        msg.setSpecial('translation', cleanMsg);
        
        var speakers = this.whoSpeaks(lingua);
        var plebs = [];
        for (var i in room.users.users) {
            if (speakers.indexOf(room.users.users[i].id) === -1) {
                plebs.push(room.users.users[i].id);
            }
        }
        
        msg.setDestination(speakers);
        window.app.chatapp.printAndSend(msg, true);
        if (plebs.length > 0) {
            msg.unsetSpecial('translation');
            msg.setDestination(plebs);
            msg.clone = true;
            window.app.chatapp.sendMessage(msg);
        }
        
        return null;
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