function GamePrivilegeUI () {
    this.$gameId = $("#gamePermissionGameID");
    this.$priv = $("#gamePermissionPrivileges");
    this.$error = $("#gamePermissionsError").hide();
    this.$submit = $("#gamePermissionSubmit");
    
    this.gameId = 0;
    this.ids = [];
    
    this.callSelf = function (id) {
        window.app.ui.callLeftWindow("gamePermissionWindow");
        this.gameId = id;
        
        var game = window.app.gamedb.getGame(id);
        this.$gameId.text(game.name);
        this.$error.hide();
        
        window.app.ui.blockLeft();
        
        var cbs = function (data) {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.privui.fill(data);
        };
        
        var cbe = function (data) {
            window.app.ui.unblockLeft();
            window.app.ui.gameui.privui.$error.show();
        };
        
        window.app.gameapp.getPrivileges(id, cbs, cbe);
    };
    
    this.fill = function (json) {
        this.ids = [];
        this.$priv.empty();
        
        json.sort(function (a,b) {
            var na = (a.nickname + "#" + a.nicknamesufix).toUpperCase();
            var nb = (b.nickname + "#" + b.nicknamesufix).toUpperCase();
            
            if (na < nb) return -1;
            if (nb < na) return 1;
        });
        
        for (var i = 0; i < json.length; i++) {
            this.ids.push(json[i].userid);
            this.addUser(json[i]);
        }
    };
    
    this.addUser = function (user) {
        // userid
        // nickname
        // nicknamesufix
        // createSheet
        // editSheet
        // viewSheet
        // invite
        
        var $name = $("<span />").text(user.nickname + "#" + user.nicknamesufix).addClass("name");
        var $p = $("<p />").append($name);
        
        //CRIAR FICHA
        var $createSheet = $("<span />");
        var $label = $("<label />").attr("for", "create" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONCREATE_")
                            .addClass("gamePermIconCreate");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "create" + user.userid);
        $input[0].checked = user.createSheet;
                    
        $createSheet.append($label, $input);
        $p.append($createSheet);
        
        //VIEW FICHA
        var $viewSheet = $("<span />");
        var $label = $("<label />").attr("for", "view" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONVIEW_")
                            .addClass("gamePermIconView");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "view" + user.userid);
        $input[0].checked = user.editSheet;
                    
        $viewSheet.append($label, $input);
        $p.append($viewSheet);
        
        //EDITAR FICHA
        var $editSheet = $("<span />");
        var $label = $("<label />").attr("for", "edit" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONEDIT_")
                            .addClass("gamePermIconEdit");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "edit" + user.userid);
        $input[0].checked = user.editSheet;
                    
        $editSheet.append($label, $input);
        $p.append($editSheet);
        
        //INVITE
        var $invite = $("<span />");
        var $label = $("<label />").attr("for", "invite" + user.userid).addClass("language")
                            .attr("data-langtitle", "_GAMEPERMISSIONINVITE_")
                            .addClass("gamePermIconInvite");
        var $input = $("<input />").attr("type", "checkbox").attr("id", "invite" + user.userid);
        $input[0].checked = user.invite;
                    
        $invite.append($label, $input);
        $p.append($invite);
        
        
        var $kick = $("<a />").addClass("textButton").addClass("language").attr("data-langhtml", "_GAMEPERMISSIONKICK_");
        $p.append($kick);
        
        
        
        window.app.ui.language.applyLanguageOn($p);
        this.$priv.append($p);
    };
}