function GameInvite$ () {
    /**
     * 
     * @param {Invite} invite
     * @returns {jQuery}
     */
    this.$createInvite = function (invite) {
        var $invite = $('<div />');
        
        var $nameline = $('<p class="nameLine" />');
        $nameline.append("<strong class='language' data-langhtml='_INVITESGAME_'></strong>")
                 .append(": ")
                 .append(
            $('<span />').text(invite.gamename)
        );

        var $aaccept = $('<a class="language textLink" data-langhtml="_GAMESMYINVITESACCEPT_" />');
        $aaccept.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.gameui.inviteui.acceptInvite(this.gameid, this.$div);
            }, {gameid : invite.gameid, $div : $invite}
        ));

        var $areject = $('<a class="language textLink" data-langhtml="_GAMESMYINVITESREJECT_" />');
        $areject.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.gameui.inviteui.rejectInvite(this.gameid, this.$div);
            }, {gameid : invite.gameid, $div : $invite}
        ));

        $nameline.append(" - ").append($aaccept).append(" | ").append($areject);
        
        $invite.append($nameline);
        
        
        var $creatorline = $('<p />');
        //<p><span class="language" data-langhtml="_GAMESMYINVITESCREATOR_"></span>: Nome#Sufix</p>
        $creatorline.append($('<strong class="language" data-langhtml="_GAMESMYINVITESCREATOR_" />'));
        $creatorline.append(': ' + invite.creatornick + '#' + invite.creatornicksufix);
        
        $invite.append($creatorline);
        
        if (invite.message === "") {
            $invite.append($('<p class="inviteMessage language" data-langhtml="_GAMESMYINVITESNOMESSAGE_" />'));
        } else {
            $invite.append($('<p class="inviteMessage" />').text(invite.message));
        }
        
        return $invite;
    };
    
    /**
     * 
     * @param {Array} inviteList
     * @param {jQuery} $list
     * @returns {undefined}
     */
    this.appendInvites = function (inviteList, $list) {
        $list.empty();
        for (var i = 0; i < inviteList.length; i++) {
            $list.append(this.$createInvite(inviteList[i]));
        }
        if (inviteList.length === 0) {
            $list.append("<p class='language' data-langhtml='_INVITESNOINVITES_'></p>");
        }
        window.app.ui.language.applyLanguageOn($list);
    };
}

//<div>
//    <p class="nameLine">
//        <span>Nome do Jogo</span>
//        <a class="language" data-langhtml="_GAMESMYINVITESACCEPT_"></a>
//        <a class="language" data-langhtml="_GAMESMYINVITESREJECT_"></a>
//    </p>
//    <p><span class="language" data-langhtml="_GAMESMYINVITESCREATOR_"></span>: Nome#Sufix</p>
//    <p class="inviteMessage">
//            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
//
//    </p>
//</div>