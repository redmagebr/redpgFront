/**
 * Controlador da interface do CHAT apenas.
 * @class Chat
 * @requires MessageController
 * @requires PersonaController
 * @constructor
 */
function Chat () {
    this.$hidingCSS = $('<style type="text/css" />');
    $('head').append(this.$hidingCSS);
    
    this.tracker = new CombatTracker();
    this.langtab = new LanguageTracker();
    this.mc = new MessageController();
    this.pc = new PersonaController();
    this.ac = new AvatarController();
    this.dc = new DiceController();
    this.cc = new ChatController(this);
    this.audioc = new AudioController();
    this.logger = new Logger();
    
    // Elements
    this.$chatbox;
    this.$chatmensagemtipo;
    this.$chatscrolltobottom;
    this.$window;
    this.$dicereasonprompt;
    this.$dicefacesprompt;
    this.$dicequantityprompt;
    this.$chatmessageprompt;
    this.$dicemodprompt;
    this.$roomName;
    this.$roomDesc;
    this.$chatHeader;
    this.$chatMessages;
    
    
    // Inputs
    this.$chatinput;
    this.$dicequantity;
    this.$dicefaces;
    this.$dicereason;
    
    // Chat notification area
    this.$longloadicon;
    this.$connectionerroricon;
    
    
    /**
     * Tamanho atual da fonte mostrada no chat.
     * @type Number
     */
    this.alwaysBottom = true;
    this.powerBottom;
    
    this.configChanged = function (id) {
        if (id === 'chatfontsize') {
            this.$chatbox.css({'font-size' : window.app.config.get("chatfontsize") + 'em'});
        } else if (id === 'chatuseprompt') {
            this.considerPrompts();
        }
    };
    
    this.configValidation = function (id, value) {
        if (id === 'chatfontsize' && typeof value === 'number') {
            if (value >= 0.95 && value <= 1.90) return true;
            return false;
        }
        if ((id === 'chatuseprompt' || id === 'autoImage') && typeof value === 'number') {
            if (value >= 0 && value <=2 && parseInt(value) === value) {
                return true;
            }
            return false;
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'chatfontsize') return 0.95;
        if (id === 'chatuseprompt') return 2;
        if (id === 'autoImage') return 1;
    };
    
    
    /**
     * Adds diff to the current font size.
     * @param {Number} diff
     * @returns {void}
     */
    this.changeChatFont = function (diff) {
        var fontsize = window.app.config.get("chatfontsize") + diff;
        fontsize = +fontsize.toFixed(2);
        if (fontsize > 1.8) {
            fontsize = 1.8;
        }
        window.app.config.store('chatfontsize', fontsize);
    };
    
    /**
     * Initializes Chat UI.
     * @returns {void}
     */
    this.init = function () {
        window.app.config.registerConfig('chatfontsize', this);
        window.app.config.registerConfig('chatuseprompt', this);
        window.app.config.registerConfig('autoImage', this);
        
        
        // Now that the document is ready, initialize elements
        this.$longloadicon = $('#chatNotLoad');
        this.$connectionerroricon = $('#chatNotConnError');
        this.$chatbox = $('#areaChatBox');
        this.$chatinput = $('#chatMensagemInput');
        this.$chatmensagemtipo = $('#chatMensagemTipo');
        this.$chatscrolltobottom = $('#chatScrolltoBottom').hide();
        this.$window = $('#chatWindow');
        this.$dicequantity = $('#dadosFormQuantidade');
        this.$dicefaces = $('#dadosFormFaces');
        this.$dicereason = $('#dadosFormMotivo');
        this.$dicereasonprompt = $('#dadosFormMotivoPrompt');
        this.$dicefacesprompt = $('#dadosFormFacesPrompt');
        this.$dicequantityprompt = $('#dadosFormQuantidadePrompt');
        this.$chatmessageprompt = $('#chatMensagemPrompt');
        this.$dicemodprompt = $('#dadosFormModPrompt');
        this.$chatHeader = $('#chatIntro');
        this.$chatMessages = $('#chatMessages');
        this.$roomName = $('#roomName');
        this.$roomDesc = $('#roomDesc');
        
        // Clear "show everythings"
        //this.$chatbox.html('');
        this.$longloadicon.hide();
        this.$connectionerroricon.hide();
        
        // Bind stuff
        this.setBindings();
        this.considerPrompts();
        
        this.pc.init();
        this.mc.init();
        this.ac.init();
        this.audioc.init();
        this.cc.init();
        this.dc.init();
        this.logger.init();
        this.tracker.init();
        this.langtab.init();
    };
    
    /**
     * Reinitialises jScrollpane on chatbox.
     * @returns {undefined}
     */
    this.clearInformation = false;
    
    this.appendToHeader = function ($html) {
        this.$chatHeader.append($html);
        if (this.alwaysBottom) {
            this.scrollToBottom(true);
        }
    };
    
    this.appendToMessages = function ($html) {
        this.$chatMessages.append($html);
        if (this.alwaysBottom) {
            this.scrollToBottom(true);
        }
    };
    
    /**
     * Empties the whole of chatPane.
     * @returns {undefined}
     */
    this.clear = function () {
        this.$chatMessages.empty();
    };
    
    /**
     * Decides whether or not to use prompts instead of inputs.
     * @returns {undefined}
     */
    this.considerPrompts = function () {
        if (this.usePrompt === 2) {
            if (jQuery.browser.mobile) {
                this.showPrompts();
            } else {
                this.hidePrompts();
            }
        } else if (this.usePrompt === 1) {
            this.showPrompts();
        } else if (this.usePrompt === 0) {
            this.hidePrompts();
        }
    };
    
    this.showPrompts = function () {
        this.$dicefacesprompt.show();
        this.$dicequantityprompt.show();
        this.$dicereasonprompt.show();
        this.$chatmessageprompt.show();
        this.$dicemodprompt.show();
    };
    
    this.hidePrompts = function () {
        this.$dicefacesprompt.hide();
        this.$dicequantityprompt.hide();
        this.$dicereasonprompt.hide();
        this.$chatmessageprompt.hide();
        this.$dicemodprompt.hide();
    };
    
    /**
     * Sets all bindings on page elements.
     * Also calls other specialized binding functions which were too big to be here.
     * @returns {void}
     */
    this.setBindings = function () {
        this.setChatInputBindings();
        
        this.$chatbox.on('scroll', function (e) {
            var $this = $(this);
            var scrolled = this.scrollTop + $this.height();
            scrolled = this.scrollHeight - scrolled;
            if (scrolled > 2) {
                window.app.ui.chat.notAtBottom();
            } else {
                window.app.ui.chat.atBottom();
            }
        });
        
        this.$chatscrolltobottom.bind('click', function () {
            window.app.ui.chat.scrollToBottom(false);
        });
        
        $('#changeFontBig').bind('click', function () {
            window.app.ui.chat.changeChatFont(0.1);
        });
        
        $('#changeFontSmall').bind('click', function () {
            window.app.ui.chat.changeChatFont(-0.1);
        });
        
        this.$dicequantityprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICENUMBERPROMPT_');
            var input = window.prompt(lingo + ':');
            if (!isNaN(parseInt(input)) && isFinite(input)) {
                window.app.ui.chat.$dicequantity.val(input);
            } else {
                window.app.ui.chat.$dicequantity.val('');
            }
        });
        
        this.$dicemodprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICEMODPROMPT_');
            var input = window.prompt(lingo + ':');
            if (!isNaN(parseInt(input)) && isFinite(input)) {
                window.app.ui.chat.dc.$dicemod.val(input);
            } else {
                window.app.ui.chat.dc.$dicemod.val('');
            }
        });
        
        this.$dicefacesprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICEFACESPROMPT_');
            var input = window.prompt(lingo + ':');
            if (!isNaN(parseInt(input)) && isFinite(input)) {
                window.app.ui.chat.$dicefaces.val(input);
            } else {
                window.app.ui.chat.$dicefaces.val('');
            }
        });
        
        this.$dicereasonprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_DICEREASONPROMPT_');
            var input = window.prompt(lingo + ':');
            window.app.ui.chat.$dicereason.val(input);
        });
        
        $('#chatSettings').bind('click', function () {
            alert("Não implementado");
        });
        
        $('#modulesButton').bind('click', function () {
            alert("Não implementado");
        });
        
        this.$chatinput.bind('keydown keyup', function () {
            window.app.chatapp.updateTyping ($(this).val() !== '');
        });
    };
    
    /**
     * Bindings specific to the input.
     * Separated from the others for being the biggest.
     * @returns {void}
     */
    this.setChatInputBindings = function () {
        this.$chatinput.bind('keyup keydown', function(e) {
            window.app.ui.chat.$chatmensagemtipo.removeClass('chatNarrativa');
            window.app.ui.chat.$chatmensagemtipo.removeClass('chatAcao');
            window.app.ui.chat.$chatmensagemtipo.removeClass('chatOff');
            
            if (e.shiftKey) {
                window.app.ui.chat.$chatmensagemtipo.addClass('chatNarrativa');
            } else if (e.ctrlKey) {
                window.app.ui.chat.$chatmensagemtipo.addClass('chatAcao');
            } else if (e.altKey) {
                window.app.ui.chat.$chatmensagemtipo.addClass('chatOff');
            }
            
            if (e.keyCode === 18) {
                e.preventDefault();
            }
        });
        
        this.$chatinput.bind('keydown', function(e) {
            if (e.keyCode === 9 && $(this).val() === '') {
                if (!e.shiftKey) {
                    window.app.ui.chat.dc.$diceqt.focus();
                } else {
                    window.app.ui.chat.dc.$dicereason.focus();
                }
                e.preventDefault();
            }
        });
        
        $(document).bind('keypress',function(e) {
            window.app.ui.chat.considerRedirecting(e);
        });
        
        $(document).bind('keydown',function(e) {
            if (e.ctrlKey && e.keyCode === 86) {
                window.app.ui.chat.considerRedirecting(e);
            }
        });
        
        $('#sendMessageButton').bind('click', function () {
            window.app.ui.chat.mc.eatMessage();
        });
        
        this.$chatinput.bind('keydown', function(e) {
            // ENTER
            if (e.keyCode === 10 || e.keyCode === 13) {
                window.app.ui.chat.mc.eatMessage(e);
                e.preventDefault();
            }
            
            // UP
            if (e.keyCode === 38) {
                window.app.ui.chat.mc.messageRollUp();
                e.preventDefault();
            }
            
            // DOWN
            if (e.keyCode === 40) {
                window.app.ui.chat.mc.messageRollDown();
                e.preventDefault();
            }
            
            // ESC
            if (e.keyCode === 27) {
                window.app.ui.chat.$chatinput.val('');
                e.preventDefault();
            }
            
            // TAB
            if (e.keyCode === 9) {
                var msg = window.app.ui.chat.$chatinput.val().trim();
                if (msg.indexOf('/whisper') === 0 || msg.indexOf('/w') === 0) {
                    if (msg.indexOf(' ') !== -1) {
                        var slashCMD = msg.substr(0,msg.indexOf(' '));
                        var msgOnly = msg.substr(msg.indexOf(' ')+1);
                    } else {
                        var slashCMD = msg;
                        var msgOnly = '';
                    }
                    var mod = window.app.ui.chat.mc.getModule('Whisper');
                    if (mod.isValid(slashCMD, msgOnly)) {
                        window.app.ui.chat.$chatinput.val(mod.autoComplete(slashCMD, msgOnly));
                    } else {
                        var $autocomplete = mod.autoComplete(slashCMD, msgOnly);
                        window.app.ui.language.applyLanguageOn($autocomplete);
                        window.app.ui.chat.appendToMessages($autocomplete);
                    }
                }
                e.preventDefault();
            }
            
            // Space and tab
            if (e.keyCode === 9 || e.keyCode === 32) {
                var trimmed = window.app.ui.chat.$chatinput.val().trim();
                if (window.app.ui.chat.cc.room.lastWhisper !== null && (trimmed === '/r' || trimmed === '/reply')) {
                    var user = window.app.ui.chat.cc.room.lastWhisper;
                    window.app.ui.chat.$chatinput.val('/whisper ' + user.nickname + '#' + user.nicknamesufix + ', ');
                    window.app.ui.chat.$chatinput.focus();
                }
            }
        });
        
        this.$chatmessageprompt.bind('click', function () {
            var lingo = window.app.ui.language.getLingo('_MESSAGEPROMPT_');
            var msg = window.prompt(lingo + ':');
            window.app.ui.chat.mc.processMessage(msg);
        });
    };
    
    /**
     * 
     * @param {Event} event
     * @returns {undefined}
     */
    this.considerRedirecting = function (event) {
        if ((!event.ctrlKey && !event.altKey) || (event.ctrlKey && event.keyCode === 86)) {
            if (this.$window.is(':visible')) {
                var $focus = $(':focus');
                if (typeof $focus === 'undefined' || !($focus.is("input") || $focus.is("textarea") || $focus.is("select"))) {
                    window.app.ui.chat.$chatinput.focus();
                }
            }
        }
    };
    
    /**
     * Updates window sizes to resizes.
     * @returns {void}
     */
    this.handleResize = function () {
        this.ac.handleResize();
    };
    
    
    this.scrollToBottom = function (instant) {
        var scrolltop = this.$chatbox[0].scrollHeight - this.$chatbox.height();
        if (instant) {
            this.$chatbox.stop(true, false).scrollTop(scrolltop);
            return;
        }
        this.$chatbox.stop(true, false).animate({
            scrollTop : scrolltop
        }, 300, function () {
            window.app.ui.chat.animating = false;
        });
        this.animating = true;
        this.atBottom();
    };
    
    this.notAtBottom = function () {
        if (this.animating) return;
        if (this.powerBottom) return this.atBottom();
        this.alwaysBottom = false;
        this.$chatscrolltobottom.stop(true, true).fadeIn(200);
    };
    
    this.atBottom = function () {
        if (this.animating) return;
        this.alwaysBottom = true;
        this.$chatscrolltobottom.stop(true, true).fadeOut(200);
    };
    
    this.considerBottoming = function () {
        if (this.alwaysBottom || this.powerBottom) {
            this.scrollToBottom(true);
        }
    };
    
    this.showEverything = function () {
        this.$hidingCSS.empty();
    };
    
    this.hideUnnecessary = function () {
        this.$hidingCSS.append("#avatarContainer, #chatBarra, #personaBox, #dadosForm, #dadosButtons > a { display: none; } #areaChat { top: 10px; bottom: 60px; }");
    };
}