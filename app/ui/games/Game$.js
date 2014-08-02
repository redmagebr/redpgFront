function Game$ () {
    /**
     * 
     * @param {Game} game
     * @returns {jQuery}
     */
    this.createGame = function (game) {
        var $game = $('<div id="game' + game.id + '" class="gameDiv" />');
        if (game.isOwner()) {
            var $deletebutton = $('<a class="right button delete language" data-langtitle="_GAMESDELETE_"></a>');
            $deletebutton.bind('click', window.app.emulateBind(
                function () {
                    if (confirm(window.app.ui.language.getLingoOn('_GAMESCONFIRMDELETE_', this.gamename))) {
                        window.app.ui.gameui.deleteGame(this.gameid);
                    }
                }, {gamename : game.name, gameid : game.id}
            ));
            
            var $options = $('<a class="right button options language" data-langtitle="_GAMESOPTIONS_"></a>');
            $options.bind('click', function () {
                alert("Options - Not implemented");
            });
            
            $game.append($deletebutton);
            $game.append($options);
        } else {
            var $leavebutton = $('<a class="right button leave language" data-langtitle="_GAMESLEAVE_"></a>');
            $leavebutton.bind('click', function () {
                alert("Leave - Not Implemented");
            });
            $game.append($leavebutton);
        }
        
        if (game.promote) {
            var $permissions = $('<a class="right button permissions language" data-langtitle="_GAMESPERMISSIONS_"></a>');
            $permissions.bind("click", function () {
                alert("Permissions - Not implemented");
            });
            
            $game.append($permissions);
        }
        
        var $nameline = $('<span class="button paraButton language unselectable" data-langtitle="_GAMESOPENCLOSE_">');
        $nameline.bind("click", function () {
            $(this).toggleClass('toggled');
        });
        
        $nameline.append($('<a class="left button openclose"></a>'));
        $nameline.append($('<span />').text(game.name));
        
        $game.append($nameline);
        
        var $rooms = $('<div />');
        
        if (game.isOwner()) {
            var $creatorline = $('<p class="creatorP" />');
            $creatorline.append($("<span class='language' data-langhtml='_GAMESCREATORTOOLTIP_' />"));
            $creatorline.append(": " + game.creatornick + '#' + game.creatorsufix);
            $rooms.append($creatorline);
        }
        
        if (game.rooms.length === 0) {
            $rooms.append('<p class="language noRooms" data-langhtml="_GAMESNOROOMS_"></p>');
        } else {
            /**
             * @type Room
             */
            var room;
            
            var $room;
            var $rooma;
            var $roomdelete;
            var $roomoptions;
            var $roomleave;
            
            for (var i = 0; i < game.rooms.length; i++) {
                room = window.app.roomdb.getRoom(game.rooms[i]);
                $room = $('<p class="selectable hoverMark" />');
                
                $rooma = $('<a class="language" data-langtitle="_GAMESJOINROOM_" />');
                $rooma.append(room.name);
                $rooma.bind('click', window.app.emulateBind(
                    function () {
                        window.app.ui.chat.cc.openRoom(this.roomid);
                    }, {roomid : room.id}
                ));
                
                if (room.isOwner()) {
                    $roomdelete = $('<a class="language right delete button" data-langtitle="_GAMESDESTROYROOM_" />');
                    $roomdelete.bind('click', window.app.emulateBind(
                        function () {
                            window.app.ui.gameui.deleteRoom(this.id);
                        }, {id : room.id}
                    ));
                    
                    $roomoptions = $('<a class="language right options button" data-langtitle="_GAMESROOMOPTIONS_" />');
                    $roomoptions.bind('click', function () {
                        alert("Room options - not implemented");
                    });
                    
                    $room.append($roomdelete);
                }
                
                
                
                
                $room.append ($rooma);
                
                $rooms.append($room);
            }
        }
        
        if (game.storyteller || game.invite) {
            $rooms.append('<hr />');
        }
        
        if (game.storyteller) {
            
            var $newroomp = $('<p />');
            
            var $newrooma = $('<a class="language" data-langhtml="_GAMESNEWROOM_" />');
            $newrooma.bind("click", window.app.emulateBind(
                function () {
                    window.app.ui.gameui.roomui.openCreation(this.gameid);
                }, {gameid : game.id}
            ));
            
            
            $newroomp.append($newrooma);
            $rooms.append($newroomp);
        }
        
        if (game.invite) {
            var $newplayerp = $('<p />');
            
            var $newplayera = $('<a class="language" data-langhtml="_GAMESINVITE_" />');
            $newplayera.bind("click", window.app.emulateBind(
                function () {
                    window.app.ui.gameui.inviteui.openForm(this.gameid);
                }, {gameid : game.id}
            ));
            
            $newplayerp.append($newplayera);
            $rooms.append($newplayerp);
        }
        
        $game.append($rooms);
        
        return $game;
    };
    
    this.createList = function ($list) {
        $list.empty();
        
        var gamelist = window.app.gamedb.gamelist;
        
        for (var i = 0; i < gamelist.length; i++) {
            $list.append(
                this.createGame(
                    window.app.gamedb.getGame(gamelist[i])
                )
            );
        }
        
        window.app.ui.language.applyLanguageOn($list);
    };
}



//<div id="gameID" class="gameDiv">
//    <a class="right button delete language" data-langtitle="_GAMESDELETE_"></a>
//    <a class="right button options language" data-langtitle="_GAMESOPTIONS_"></a>
//    <span class="button paraButton language" data-langtitle="_GAMESOPENCLOSE_" onclick="$(this).toggleClass('toggled');">
//        <a class="left button openclose"></a>
//        <span>Um nome muito comprido mesmoeim</span>
//    </span>
//    <div>
//        <p class="creatorP"><span class='language' data-langhtml='_GAMESCREATORTOOLTIP_'></span>: Criador#IIID</p>
//
//        <p class="language noRooms" data-langhtml="_GAMESNOROOMS_"></p>
//
//        <p class="selectable hoverMark">
//            <a class="language" data-langtitle="_GAMESJOINROOM_">
//                012345678901234567890123456789
//            </a>
//            <a class="language right delete button" data-langtitle="_GAMESDESTROYROOM_"></a>
//            <a class="language right options button" data-langtitle="_GAMESROOMOPTIONS_"></a>
//        </p>
//
//        <hr />
//        <p><a class="language" data-langhtml="_GAMESNEWROOM_"></a></p>
//        <h1>Logs</h1>
//
//        <p class="language noLogs" data-langhtml="_GAMESNOLOGS_"></p>
//
//        <p class="selectable hoverMark">
//            <a class="language" data-langtitle="_GAMESJOINROOM_">
//                012345678901234567890123456789
//            </a>
//            <a class="language right delete button" data-langtitle="_GAMESDESTROYLOG_"></a>
//            <a class="language right options button" data-langtitle="_GAMESLOGPERMISSIONS_"></a>
//        </p>
//
//    </div>
//</div>