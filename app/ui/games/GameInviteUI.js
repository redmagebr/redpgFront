/**
 * @returns {GameInviteUI}
 */
function GameInviteUI () {
    this.gameid = null;
    
    this.$ = new GameInvite$();
    
    // Elements
    this.$inviteinput;
    this.$messageinput;
    this.$keepgoing;
    this.$error401;
    this.$error404;
    this.$error500;
    this.$error;
    this.$success;
    this.$currentgame;
    
    this.$invitelist;
    this.$identifier;
    
    this.openForm = function (gameid) {
        this.gameid = gameid;
        var game = window.app.gamedb.getGame(gameid);
        if (game === null) {
            this.$currentgame.attr('data-langp', '?????');
        } else {
            this.$currentgame.attr('data-langp', game.name);
        }
        window.app.ui.language.applyLanguageTo(this.$currentgame);
        window.app.ui.callLeftWindow('gamesInviteWindow');
    };
    
    this.submitCreation = function () {
        this.$error.hide();
        this.$error404.hide();
        this.$error401.hide();
        this.$error500.hide();
        this.$success.hide();
        
        window.app.ui.blockLeft();
        var cbs = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$success.show();
                this.$input.val('');
                this.$message.val('');
                if (!this.$keepgoing.is(':checked')) {
                    window.app.ui.gameui.callSelf();
                }
            }, {$success : this.$success, $input : this.$inviteinput,
                $message : this.$messageinput, $keepgoing : this.$keepgoing}
        );

        var cbe = window.app.emulateBind(
            function (data) {
                window.app.ui.unblockLeft();
                if (data.status === 404) {
                    this.$error404.show();
                } else if (data.status === 401) {
                    this.$error401.show();
                } else if (data.status === 500) {
                    this.$error500.show();
                } else {
                    this.$error.show();
                }
            }, {$error : this.$error, $error404 : this.$error404, $error500 : this.$error500,
                $error401 : this.$error401}
        );

        var val = this.$inviteinput.val();
        var message = this.$messageinput.val();
        var nick = val.split('#');
        if (nick.length !== 2) {
            cbe({status:404});
            return false;
        }
        
        window.app.gameapp.sendInvite(this.gameid, nick[0], nick[1], message, cbs, cbe);
    };
    
    this.callMyInvites = function () {
        window.app.ui.callLeftWindow('gamesMyInvitesWindow');
        this.$invitelist.empty().hide();
        window.app.ui.blockLeft();
        
        var user = window.app.loginapp.user;
        if (user === null) {
            this.$identifier.attr("data-langp", "?");
        } else {
            this.$identifier.attr("data-langp", user.nickname + '#' + user.nicknamesufix);
        }
        window.app.ui.language.applyLanguageTo(this.$identifier);
        
        var cbs = window.app.emulateBind(
            function (json) {
                var inviteList = [];
                var invite;
                for (var i = 0; i < json.length; i++) {
                    invite = new Invite();
                    invite.updateFromJSON(json[i]);
                    inviteList.push(invite);
                }
                window.app.ui.unblockLeft();
                this.$.appendInvites(inviteList, this.$list);
                this.$list.fadeIn();
            }, {$ : this.$, $list : this.$invitelist}
        );

        var cbe = window.app.emulateBind(
            function (data) {
                window.app.ui.unblockLeft();
            }, {}
        );

        window.app.gameapp.getInvites(cbs, cbe);
    };
    
    this.init = function () {
        this.$error = $('#inviteErrorDef').hide();
        this.$error401 = $('#inviteError401').hide();
        this.$error404 = $('#inviteError404').hide();
        this.$error500 = $('#inviteError500').hide();
        this.$success = $('#inviteSuccess200').hide();
        this.$currentgame = $('#gamesInviteCurrentGame');
        this.$inviteinput = $('#gamesInviteInput');
        this.$messageinput = $('#gamesInviteMessage');
        this.$keepgoing = $('#gamesInviteKeepGoing');
        this.$invitelist = $('#gamesMyInvitesList');
        this.$identifier = $('#gamesMyInvitesIdentifier');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#gamesInviteForm').on('submit', function () {
            window.app.ui.gameui.inviteui.submitCreation();
        });
        
        $('#gamesInviteListButton').bind('click', function () {
            window.app.ui.gameui.inviteui.callMyInvites();
        });
    };
    
    
    this.acceptInvite = function (gameid, $div) {
        window.app.ui.blockLeft();
        
        var cbs = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$div.remove();
            }, {$div : $div}
        );

        var cbe = function () {
            window.app.ui.unblockLeft();
        };
        
        window.app.gameapp.acceptInvite(gameid, cbs, cbe);
    };
    
    this.rejectInvite = function (gameid, $div) {
        window.app.ui.blockLeft();
        
        var cbs = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$div.remove();
            }, {$div : $div}
        );

        var cbe = function () {
            window.app.ui.unblockLeft();
        };
        
        window.app.gameapp.rejectInvite(gameid, cbs, cbe);
    };
}