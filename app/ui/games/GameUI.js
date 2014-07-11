function GameUI () {
    this.$ = new Game$();
    this.inviteui = new GameInviteUI();
    this.roomui = new RoomUI();
    
    this.edit = null;
    
    this.$nickobj;
    this.$loading;
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
    
    this.init = function () {
        this.$nickobj = $('#gamesNickInformant');
        this.$list = $('#gamesList');
        this.$loading = $('#gamesWindowLoading');
        this.$createbutton = $('#gamesNewGameButton');
        
        this.$error = $('#newGameError');
        this.$deleteError = $('#gamesDeleteError');
        this.$loadError = $('#gamesLoadError');
        this.$form = $('#createGameForm');
        this.$formname = $('#CGName');
        this.$formdesc = $('#CGDesc');
        this.$formfreejoin = $('#CGFreejoin');
        
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
                    $error : this.$loadError
                }
            );
            
            
            if (this.base.edit !== null) {
                obj.id = this.base.edit;
                window.app.gameapp.editGame(obj, cbs, cbe);
            } else {
                window.app.gameapp.createGame(obj, cbs, cbe);
            }
        }, {$formname : this.$formname, $form : this.$form, $formdesc : this.$formdesc,
            $formfreejoin : this.$formfreejoin, $error : this.$error, base : this})
        );
    };
    
    this.callCreation = function () {
        // empty the form
        this.$error.hide();
        this.$formdesc.val('');
        this.$formname.val('');
        this.$formfreejoin.attr('checked', false);
        // call window
        window.app.ui.callLeftWindow('createGameWindow');
    };
    
    this.callSelf = function () {
        this.$loadError.hide();
        this.$list.finish().fadeOut(100);
        this.$createbutton.finish().fadeOut(100, window.app.emulateBind(
            function () {
                this.$loading.finish().fadeIn(200);
            }, {$loading : this.$loading})
        );
        var cbs = function () {
            window.app.ui.gameui.refreshWindow();
        };
        var cbe = function () {
            window.app.ui.gameui.$loading.finish().fadeOut(200, function () {
                window.app.ui.gameui.$loadError.show();
            });
        };
        window.app.gameapp.updateLists(cbs, cbe);
        window.app.ui.callLeftWindow("gamesWindow");
    };
    
    this.refreshWindow = function () {
        this.$list.finish();
        this.$createbutton.finish();
        this.$loading.finish().fadeOut(100,
            window.app.emulateBind(function () {
                this.Game$.createList(this.$list);
                this.$list.finish().fadeIn(200);
                this.$createbutton.finish().fadeIn(200);
            }, {$list : this.$list,
                $createbutton : this.$createbutton,
                Game$ : this.$})
        );
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
            this.$error.show();
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