if (window.chatModules === undefined) window.chatModules = [];
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
        if (msg.destination !== null && msg.destination !== 0 && window.app.ui.isStreaming()) {
            return null;
        }
        var user = msg.getUser();
        var $msg = $('<p class="chatDice" />');
        
        if (msg.getSpecial('rolls', null) === null) {
            var mod = window.app.ui.chat.mc.getModule(msg.module);
            var cbs = window.app.emulateBind(
                function () {
                    var $html = this.mod.get$(this.msg);
                    $html.attr('data-msgid', this.msg.id);
                    this.$msg.replaceWith($html);
                    window.app.ui.language.applyLanguageOn($html);
                    window.app.ui.chat.cc.hoverizeSender($html, this.msg);
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

            var maxxes = 0;
            for (var i = 0; i < rolls.length; i++) {
            	var classes = 'box';
            	if (dices[i] === rolls[i]) {
            		classes += " rainbow";
            		maxxes += 1;
            	}
                $results.append($('<a class="' + classes + '" />').text(rolls[i]));
                if (i + 1 < rolls.length) {
                    $results.append($('<a class="plus" />').text('+'));
                }
            }

            if (mod !== 0) {
                $results.append($('<a class="plus" />').text('+'));
                $results.append($('<a class="box mod" />').text(mod));
            }

            $msg.append($results);
            
            if (maxxes === rolls.length && maxxes > 1) {
            	$results.find(".rainbow").removeClass("rainbow");
            	$msg.addClass("rainbow");
            }

            $msg.append($('<a class="equals" />').text('='));
            $msg.append($('<span class="box square sum" />').text(sum));
        }
        
        if (msg.msg !== null && msg.msg !== '') {
            var $reason = $('<span class="reason" />');
            $reason.append($('<b class="language" data-langhtml="_DICEREASON_" />'));
            $reason.append($('<p />').text(msg.msg).html());

            $msg.append($reason);
        }
        
        
        // Allow Styles to intercept dices
        var style = msg.getSpecial("style", null);
        if (style !== null) {
        	window.app.ui.chat.dc.interceptDice(style, msg, $msg);
        }
        
        // Back to default dice behavior
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
});