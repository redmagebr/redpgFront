function GameUI () {
    this.$ = new Game$();
    this.inviteui = new GameInviteUI();
    this.roomui = new RoomUI();
    
    this.edit = null;
    
    this.$nickobj;
    this.$list;
    this.$createbutton;
    
    this.$error;
    this.$deleteError;
    this.$loadError;
    this.$form;
    this.$formname;
    this.$formdesc;
    this.$formfreejoin;
    this.$formsubmit;
    this.$header;
    
    this.init = function () {
        this.$nickobj = $('#gamesNickInformant');
        this.$list = $('#gamesList');
        this.$createbutton = $('#gamesNewGameButton');
        this.$header = $('#newgameHeader');
        
        this.$error = $('#newGameError');
        this.$deleteError = $('#gamesDeleteError');
        this.$loadError = $('#gamesLoadError');
        this.$form = $('#createGameForm');
        this.$formname = $('#CGName');
        this.$formdesc = $('#CGDesc');
        this.$formfreejoin = $('#CGFreejoin');
        this.$formsubmit = $('#createGameSubmit');
        
        this.inviteui.init();
        this.roomui.init();
        
        this.$deleteError.hide();
        this.$loadError.hide();
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#callGamesWindowBt').bind('click', function () {
            window.app.ui.gameui.callSelf();
        });
        
        this.$createbutton.bind('click', function () {
            window.app.ui.gameui.callCreation();
        });
        
        this.bindForm();
    };
    
    this.bindForm = function () {
        this.$form.bind('submit', window.app.emulateBind(function () {            
            this.$formname.removeClass('error');
            var Validation = new FormValidator(this.$form);
            if (!Validation.validated) {
                this.$formname.addClass('error');
                return false;
            }
            
            window.app.ui.blockLeft();
            
            var obj = {};
            obj.name = this.$formname.val();
            obj.desc = this.$formdesc.val();
            obj.freejoin = this.$formfreejoin.is(':checked');
            
            var cbs = function () {
                window.app.ui.gameui.callSelf();
                window.app.ui.unblockLeft();
            };
            
            console.log(this.$error);
            
            var cbe = window.app.emulateBind(
                function () {
                    window.app.ui.unblockLeft();
                    this.$error.show();
                }, {
                    $error : this.$error
                }
            );
            
            
            if (this.base.edit !== null) {
                obj.id = this.base.edit;
                window.app.gameapp.editGame(obj, cbs, cbe);
            } else {
                window.app.gameapp.createGame(obj, cbs, cbe);
            }
        }, {$formname : this.$formname, $form : this.$form, $formdesc : this.$formdesc,
            $formfreejoin : this.$formfreejoin, $error : this.$error, base : this,
            $loadError : this.$loadError})
        );
    };
    
    this.callCreation = function () {
        // empty the form
        this.edit = null;
        this.$header.attr("data-langhtml", "_NEWGAMEHEADER_");
        this.$formsubmit.attr("data-langvalue", "_SENDNEWGAME_");
        window.app.ui.language.applyLanguageTo(this.$header);
        window.app.ui.language.applyLanguageTo(this.$formsubmit);
        this.$error.hide();
        this.$formdesc.val('');
        this.$formname.val('');
        this.$formfreejoin.attr('checked', false);
        // call window
        window.app.ui.callLeftWindow('createGameWindow');
    };
    
    this.callEdit = function (id) {
        var game = window.app.gamedb.getGame(id);
        
        if (game === null) {
            alert(window.app.ui.language.getLingo("_INVALIDGAME_"));
            return;
        }
        
        this.$error.hide();
        
        this.edit = id;
        
        this.$header.attr("data-langhtml", "_EDITGAMEHEADER_");
        this.$formsubmit.attr("data-langvalue", "_SENDEDITGAME_");
        window.app.ui.language.applyLanguageTo(this.$header);
        window.app.ui.language.applyLanguageTo(this.$formsubmit);
        this.$formdesc.val(game.description);
        this.$formname.val(game.name);
        this.$formfreejoin.attr('checked', game.freejoin);
        // call window
        window.app.ui.callLeftWindow('createGameWindow');
    };
    
    this.callSelf = function () {
        this.$loadError.hide();
        this.$list.finish().fadeOut(100);
        this.$createbutton.finish().fadeOut(100);
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.refreshWindow();
        };
        var cbe = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.$loadError.show();
        };
        window.app.gameapp.updateLists(cbs, cbe);
        window.app.ui.blockLeft();
        window.app.ui.callLeftWindow("gamesWindow");
    };
    
    this.refreshWindow = function () {
        this.$list.finish();
        this.$createbutton.finish();
        this.$.createList(this.$list);
        this.$list.finish().fadeIn(200);
        this.$createbutton.finish().fadeIn(200);
    };
    
    this.deleteGame = function (id) {
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.callSelf();
        };
        
        var cbe = function () {
            this.$error.show();
            window.app.ui.unblockLeft();
        };
        
        window.app.ui.blockLeft();
        window.app.gameapp.deleteGame(id, cbs, cbe);
    };
    
    this.deleteRoom = function (id) {
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.callSelf();
        };
        
        var cbe = function () {
            window.app.ui.gameui.$error.show();
            window.app.ui.unblockLeft();
        };
        
        window.app.ui.blockLeft();
        window.app.roomapp.deleteRoom(id, cbs, cbe);
    };
    
    this.updateConfig = function () {
        var nickname = window.app.loginapp.user.nickname + '#' + window.app.loginapp.user.nicknamesufix;
        this.$nickobj.attr('data-langp', nickname);
        window.app.ui.language.applyLanguageTo(this.$nickobj);
    };
    
    this.invitePlayers = function (gameId) {
        alert("Invite for gameId");
    };
}