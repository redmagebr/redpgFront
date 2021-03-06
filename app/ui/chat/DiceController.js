function DiceController () {
    this.$diceqt;
    this.$dicefaces;
    this.$dicereason;
    this.$dicemod;
    this.$dicesecret;
    this.dicese;
    
    this.init = function () {
        this.$diceqt = $('#dadosFormQuantidade');
        this.$dicefaces = $('#dadosFormFaces');
        this.$dicereason = $('#dadosFormMotivo');
        this.$dicemod = $('#dadosFormMod');
        this.$dicesecret = $('#dadosFormSecret');
        this.dicese = document.getElementById('diceRollAudio');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        var submitFunc = function () {
            window.app.ui.chat.dc.submit();
        };
        $('#chatDadosForm').on('submit', submitFunc);
        
        this.$dicereason.bind('keydown', function (e) {
            if (e.keyCode === 9 && !e.shiftKey) {
                window.app.ui.chat.$chatinput.focus();
                e.preventDefault();
                e.stopPropagation();
            }
        });
        
        var dice = [4, 6, 8, 10, 12, 20, 100];
        for (var i = 0; i < dice.length; i++) {
            $('#d'+dice[i]+'Button').bind('click', window.app.emulateBind(
                function () {
                    window.app.ui.chat.dc.$dicefaces.val(this.dice);
                    if (window.app.ui.chat.dc.$diceqt.val() === '' || window.app.ui.chat.dc.$diceqt.val() === '1') {
                        window.app.ui.chat.dc.$diceqt.val('1');
                    }
                    this.submit();
                }, {dice : dice[i], submit : submitFunc}
            ));
        }
        
        this.$dicesecret.bind('click', function () {
            $(this).toggleClass('toggled');
        });
    };
    
    this.submit = function () {
        var message = new Message();
        message.setMessage(this.$dicereason.val());
        message.module = 'dice';
        
        if (this.$dicesecret.hasClass('toggled')) {
            var storytellers = window.app.ui.chat.cc.room.getStorytellers();
            message.destination = storytellers;
        }
        
        if (isNaN(this.$dicefaces.val())) {
            this.$dicefaces.val('6');
        }
        
        if (isNaN(this.$diceqt.val())) {
            this.$diceqt.val('1');
        }
        
        if (isNaN(this.$dicemod.val())) {
            this.$dicemod.val('0');
        }
        
        var rolls = parseInt(this.$diceqt.val());
        
        if (rolls < 1) {
            rolls = 0;
        } else if (rolls > 99) {
            rolls = 99;
        }
        
        var faces = parseInt(this.$dicefaces.val());
        if (faces < 1) {
            faces = 1;
        }
        var mod = parseInt(this.$dicemod.val());
        
        var specialDice = [];
        
        for (var i = 0; i < rolls; i++) {
            specialDice.push(faces);
        }
        
        message.setSpecial('dice', specialDice);
        message.setSpecial('mod', mod);
        message.setSpecial('persona', window.app.ui.chat.cc.room.persona);
        
        
        this.$dicereason.val('');
        
        var mod = window.app.ui.chat.mc.getModule('dice');
        var $html = mod.get$(message);
        
        window.app.chatapp.fixPrintAndSend(message, true);
        
        
        this.dicese.currentTime = 0;
        this.dicese.volume = 0.3;
        this.dicese.play();
    };
    
    this.rollDice = function (diceInfo) {
    	if (!Array.isArray(diceInfo.dices)) {
    		diceInfo.dices = []
    	}
    	for (var i = 0; i < diceInfo.dices.length; i++) {
    		if (isNaN(diceInfo.dices[i], 10)) {
    			diceInfo.dices = [];
    			break;
    		}
    	}
    	if (isNaN(diceInfo.mod, 10)) {
    		diceInfo.mod = 0;
    	}
    	if (window.app.chatapp.room === null) return;
    	var message = new Message();
    	message.module = 'dice';
    	message.setMessage(diceInfo.message);
    	
    	if (this.$dicesecret.hasClass('toggled')) {
            var storytellers = window.app.ui.chat.cc.room.getStorytellers();
            message.destination = storytellers;
        }
    	
    	message.setSpecial('dice', diceInfo.dices);
        message.setSpecial('mod', diceInfo.mod);
        
        for (key in diceInfo.special) {
        	message.setSpecial(key, diceInfo.special[key]);
        }
        
        window.app.chatapp.fixPrintAndSend(message, true);
        
        this.dicese.currentTime = 0;
        this.dicese.volume = 0.3;
        this.dicese.play();
    };
    
    this.diceListener = {};
    
    this.registerDiceListener = function (style, listener) {
    	this.diceListener['' + style.id] = listener;
    };
    
    this.interceptDice = function (styleid, message, $message) {
    	if (this.diceListener[styleid] === undefined) {
    		//var $span = $('<span class="language" data-langhtml="_DICENOSTYLE_" />');
    		var nome = message.getSpecial("styleName", null);
    		nome = nome === null ? '?????' : nome;
    		var noStyleMSG = window.app.ui.language.getLingo("_DICENOSTYLE_").replace("%p", nome);
    		window.app.ui.hover.makeHover($message[0], noStyleMSG);
    		//$span.attr('data-langp', nome);
    		//$message.append("(").append($span).append(")");
    	} else {
    		try {
	    		if (typeof this.diceListener[styleid] === 'function') {
	    			this.diceListener[styleid](message, $message);
	    		} else {
	    			this.diceListener[styleid].handleEvent(message, $message);
	    		}
    		} catch (e) {
    			alert("Faulty Dice Interceptor for style " + styleid + ".");
    		}
    	}
    };
}