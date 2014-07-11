/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'dice',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg, slashcmd) {
        if (msg.destination !== null && msg.destination !== 0 && !(window.app.configdb.get('showWhispers', true))) {
            return null;
        }
        var user = msg.getUser();
        var $msg = $('<p class="chatDice" />');
        
        if (msg.getSpecial('rolls', null) === null) {
            var mod = window.app.ui.chat.mc.getModule(msg.module);
            var cbs = window.app.emulateBind(
                function () {
                    this.$msg.replaceWith(this.mod.get$(this.msg));
                }, {mod : mod, msg : msg, $msg : $msg}
            );
    
    
            var cbe = window.app.emulateBind(
                function () {
                    this.$msg.attr('data-langhtml', '_DICEERROR_');
                    window.app.ui.language.applyLanguageTo(this.$msg);
                }, {$msg : $msg}
            );
            
            msg.bindError(cbe);
            msg.bindSaved(cbs);
            
            $msg.addClass("language");
            $msg.attr("data-langhtml", "_DICEWAITING_");
            
            return $msg;
        }
        
        var $persona = $('<b />').text('* ' + msg.getSpecial('persona', '????'));
        
        $msg.append($persona);
        if (msg.destination === null || msg.destination === 0) {
            var $rollmsg = $('<span class="language" data-langhtml="_DICEHASROLLED_" />');
        } else {
            var $rollmsg = $('<span class="language" data-langhtml="_DICEHASSECRETLYROLLED_" />');
        }
        $msg.append(' ').append($rollmsg);
        
        
        var diceText = "";
        
        var dices = msg.getSpecial("dice", []);
        var rolls = msg.getSpecial("rolls", []);
        var mod = msg.getSpecial("mod", 0);
        
        var diceAmount = {};
        
        var diceArray = [];
        
        for (var i = 0; i < dices.length; i++) {
            if (typeof diceAmount[dices[i]] === 'undefined') {
                diceAmount[dices[i]] = 1;
            } else {
                diceAmount[dices[i]] += 1;
            }
        }
        
        for (var i in diceAmount) {
            diceArray.push(diceAmount[i] + 'd' + i);
        }
        
        var sum = 0;
        
        for (var i = 0; i < rolls.length; i++) {
            sum += rolls[i];
        }
        
        sum += mod;
        
        diceText = diceArray.join(' + ');
        
        if (mod !== 0) {
            diceText = diceText + ' + ' + mod;
        }
        
        
        if (diceArray.length === 0) {
            $msg.append($('<span class="box mod" />').text(sum));
            $rollmsg.attr("data-langhtml", "_HASTHROWN_");
        } else {
            var $initialRoll = $('<span class="box square" />');
            $initialRoll.text(diceText);
            $msg.append($initialRoll);

            $msg.append($('<a class="equals" />').text('='));

            var $results = $('<span class="results" />');

            rolls.sort();
            rolls.reverse();

            for (var i = 0; i < rolls.length; i++) {
                $results.append($('<a class="box" />').text(rolls[i]));
                if (i + 1 < rolls.length) {
                    $results.append($('<a class="plus" />').text('+'));
                }
            }

            if (mod !== 0) {
                $results.append($('<a class="plus" />').text('+'));
                $results.append($('<a class="box mod" />').text(mod));
            }

            $msg.append($results);

            $msg.append($('<a class="equals" />').text('='));
            $msg.append($('<span class="box square sum" />').text(sum));


            if (msg.msg !== null && msg.msg !== '') {
                var $reason = $('<span class="reason" />');
                $reason.append($('<b class="language" data-langhtml="_DICEREASON_" />'));
                $reason.append($('<p />').text(msg.msg).html());

                $msg.append($reason);
            }
        
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
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
});