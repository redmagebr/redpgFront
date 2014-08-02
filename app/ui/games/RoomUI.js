function RoomUI () {
    this.gameid = null;
    this.$window;
    this.$error;
    this.$form;
    this.$currentgame;
    this.$nameinput;
    this.$descinput;
    this.$privateinput;
    this.$streaminput;
    this.$pbpinput;
    
    this.init = function () {
        this.$window = $('#createRoomWindow');
        this.$form = $('#createRoomForm');
        this.$error = $('#newRoomError').hide();
        
        this.$nameinput = $('#NRName');
        this.$descinput = $('#NRDesc');
        this.$privateinput = $('#NRPrivate');
        this.$streaminput = $('#NRStreamable');
        this.$currentgame = $('#CRCurrentGame');
        this.$pbpinput = $('#NRPBP');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        this.$form.on('submit', window.app.emulateBind(
            function () {
                this.roomui.submitCreation();
            }, {roomui : this}
        ));
    };
    
    this.submitCreation = function () {
        this.$form.find('.error').removeClass('error');
        this.$error.hide();
        var valid = new FormValidator(this.$form);
        if (!valid.validated) {
            for (var i = 0; i < valid.$errors.length; i++) {
                valid.$errors[i].addClass('error');
            }
            return false;
        }
        
        window.app.ui.blockLeft();
        
        var obj = {
            name : this.$nameinput.val(),
            description : this.$descinput.val(),
            private: this.$privateinput.is(':checked'),
            streamable : this.$streaminput.is(':checked'),
            playbypost : this.$pbpinput.is(':checked'),
            gameid : this.gameid
        };
        
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.callSelf();
        };
        
        var cbe = window.app.emulateBind(
            function () {
                window.app.ui.unblockLeft();
                this.$error.show();
            }, {$error : this.$error}
        );
        
        window.app.roomapp.createRoom(obj, cbs, cbe);
    };
    
    this.openCreation = function (gameid) {
        this.gameid = gameid;
        var game = window.app.gamedb.getGame(this.gameid);
        if (game === null) {
            this.$currentgame.attr('data-langp', '????');
        } else {
            this.$currentgame.attr('data-langp', game.name);
        }
        window.app.ui.language.applyLanguageTo(this.$currentgame);
        this.cleanUpCreation();
        window.app.ui.callLeftWindow('createRoomWindow');
    };
    
    this.cleanUpCreation = function () {
        this.$form.find('.error').removeClass('error');
        this.$error.hide();
        this.$streaminput.removeAttr('checked');
        this.$privateinput.removeAttr('checked');
        this.$nameinput.val('');
        this.$descinput.val('');
    };
}