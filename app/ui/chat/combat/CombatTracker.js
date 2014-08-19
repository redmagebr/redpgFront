function CombatTracker () {
    this.$tracker = $('#combatTracker').draggable({
        containment : 'window',
        handle : '#combatTrackerHandle'
    }).hide();
    
    this.$sheets = $("#combatTrackerSheet").empty();
    this.$players = $('#combatTrackerPlayer');
    this.$trackerButton = $('#combatTrackerButton');
    
    this.$body = $('#combatTrackerBody').empty();
    this.$footer = $('#combatTrackerFooter').hide();
    
    this.target = -1;
    
    /** @type Room_Memory */ this.memory;
    this.myStuff = {};
    
    this.init = function () {
        window.registerRoomMemory('combat', this);
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#sheetViewer').on('loadedSheet.CombatTracker closedSheet.CombatTracker', function () {
            window.app.ui.chat.tracker.updateSheetList();
        });
        
        $('#combatTrackerHide').on('click', function () {
            window.app.ui.chat.tracker.toggleTracker();
        });
        
        this.$trackerButton.on('click', function () {
            window.app.ui.chat.tracker.toggleTracker();
        });
        
        $('#combatTrackerAddSheet').on('click', function () {
            var player = parseInt($('#combatTrackerPlayer').val());
            var sheet = parseInt($('#combatTrackerSheet').val());
            if (isNaN(sheet, 10) || isNaN(player, 10)) {
                return;
            }
            var name = window.app.sheetdb.getSheet(sheet).name;
            var init = 0;
            window.app.ui.chat.tracker.myStuff.ordered.push({
                id : sheet,
                player : player,
                name : name,
                init : init
            });
            window.app.ui.chat.tracker.saveMemory();
        });
        
        $('#combatTrackerTurn').on('click', function () {
            window.app.ui.chat.tracker.myStuff.turn++;
            if (window.app.ui.chat.tracker.myStuff.turn > (window.app.ui.chat.tracker.myStuff.ordered.length - 1)) {
                window.app.ui.chat.tracker.myStuff.turn = 0;
            }
            window.app.ui.chat.tracker.saveMemory();
            window.app.ui.chat.tracker.warnTurn();
        });
        
        $('#combatTrackerNewRound').on('click', function () {
            window.app.ui.chat.tracker.myStuff.turn = 0;
            window.app.ui.chat.tracker.saveMemory();
            window.app.ui.chat.tracker.warnTurn();
        });
    };
    
    this.saveMemory = function () {
        this.memory.setMemory('combat', this.myStuff, false);
    };
    
    this.toggleTracker = function () {
        var offset = this.$trackerButton.offset();
        if (this.$tracker.is(":visible")) {
            this.$tracker.stop(true,false).animate({
                top : offset.top + 20,
                left : offset.left + 20,
                height: '0px',
                width: '0px'
            }, function () {
                $(this).hide();
            });
        } else {
            this.$tracker.show().css('height', '').css('width', '').css('top', offset.top + 20).css('left', offset.left + 20);
            var height = this.$tracker.height();
            var width = this.$tracker.width();
            this.$tracker.css('height', '0px').css('width', '0px');
            this.$tracker.stop(true,false).animate({
                top : offset.top - 100,
                left: offset.left - 20 - width,
                height: height + 'px',
                width: width + 'px'
            });
        }
    };
    
    this.getUser = function () {
        if (window.app.chatapp.room !== null && window.app.chatapp.room.getMe() !== null) {
            return window.app.chatapp.room.getMe();
        }
        return new User();
    };
    
    this.updateMemory = function (memory) {
        var user = this.getUser();
        this.memory = memory;
        this.myStuff = memory.getMemory('combat', {ordered : [], turn : 0});
        
        
        this.updateParticipants();
        // Show and hide parts of self
        if (user.isStoryteller()) {
            this.$footer.show();
            this.updateUserList();
            this.$body.find('input').prop('disabled', false);
            this.$body.find('a.deleteRow').show();
            this.$body.find('a.setTurn').show();
        } else {
            this.$footer.hide();
            this.$body.find('input').prop('disabled', true);
            this.$body.find('a.deleteRow').hide();
            this.$body.find('a.setTurn').hide();
        }
        this.$tracker.css('height', '');
    };
    
    this.updateParticipants = function () {
        var user = this.getUser();
        var changed = false;
        var messedup = false;
        var turn = this.myStuff.turn;
        var participant;
        var participants = [];
        for (var i = 0; i < this.myStuff.ordered.length; i++) {
            participant = this.myStuff.ordered[i];
            if (participant instanceof Object && typeof participant.id === 'number' && typeof participant.name === 'string' && typeof participant.init === 'number' && typeof participant.player === 'number') {
                messedup = false;
                //console.log(participant);
                for (var k in participant) {
                    if (['name', 'id', 'player', 'init'].indexOf(k) === -1) {
                        messedup = true;
                        break;
                    }
                }
                //console.log(messedup);
                if (!messedup) participants.push(participant);
            } else {
                //console.log("why");
                //console.log(participant);
                changed = true;
            }
        }
        
        //console.log(participants);
        //console.log(this.myStuff.ordered);
        
        participants.sort(function (a, b) {
            return b.init - a.init;
        });
        
        this.myStuff.ordered = participants;
        
        if (turn > participants.length - 1 && participants.length > 0) {
            turn = 0;
            changed = true;
        }
        
        
        var $participant;
        this.$body.empty();
        var $init;
        var $opensheet;
        var $target;
        var $delete;
        var $setturn;
        var $hp;
        var $mp;
        var hp;
        var mp;
        var sheet;
        for (var i = 0; i < participants.length; i++) {
            participant = participants[i];
            $participant = $('<p />');
            
            
            $init = $('<input type="text" class="language" data-langtitle="_COMBATTRACKERINITIATIVE_" />')
                    .val(participant.init)
                    .attr('data-id', participant.id);
            
            $init.on('change', window.app.emulateBind(function () {
                var val = this.$this.val();
                if (isNaN(val, 10)) {
                    this.$this.val(this.tracker.myStuff.ordered[this.ordered].init);
                } else {
                    val = parseInt(val);
                    this.tracker.myStuff.ordered[this.ordered].init = val;
                    this.tracker.memory.setMemory('combat', this.tracker.myStuff, false);
                }
            }, {tracker : this, ordered : i, $this : $init}));
            
            $opensheet = $('<a class="openSheet button language" data-langtitle="_COMBATTRACKEROPENSHEET_" />').on('click', window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.id);
            }, {id : participant.id}));
            
            $delete = $('<a class="deleteRow button language" data-langtitle="_COMBATTRACKERDELETEROW_" />');
            $delete.on('click', window.app.emulateBind(function () {
                this.tracker.myStuff.ordered.splice(this.ordered, 1);
                this.tracker.warnTurn();
                this.tracker.memory.setMemory('combat', this.tracker.myStuff, false);
            }, {tracker : this, ordered : i}));
            
            $target = $('<a class="setTarget button language" data-langtitle="_COMBATTRACKERSETTARGET_" />');
            $target.on('click', window.app.emulateBind(function () {
                if (this.$p.hasClass('target')) {
                    this.$p.removeClass('target');
                    this.tracker.target = -1;
                    return;
                }
                this.tracker.$body.children('p').removeClass('target');
                this.tracker.target = this.id;
                this.$p.addClass('target');
            }, {$p : $participant, tracker : this, id : i}));
            
            $setturn = $('<a class="setTurn button language" data-langtitle="_COMBATTRACKERSETTURN_" />');
            $setturn.on('click', window.app.emulateBind(function () {
                this.tracker.myStuff.turn = this.order;
                this.tracker.warnTurn();
                this.tracker.saveMemory();
            }, {order : i, tracker : this}));
            
            sheet = window.app.sheetdb.getSheet(participant.id);
            hp = '';
            mp = '';
            if (sheet !== null) {
                if (typeof sheet.values['HPAtual'] !== 'undefined' && typeof sheet.values['HPMaximo'] !== 'undefined') {
                    hp = sheet.values['HPAtual'] + '/' + sheet.values['HPMaximo'];
                }
                if (typeof sheet.values['MPAtual'] !== 'undefined' && typeof sheet.values['MPMaximo'] !== 'undefined') {
                    mp = sheet.values['MPAtual'] + '/' + sheet.values['MPMaximo'];
                }
            }
            if (hp !== '') $hp = $('<span class="hp" />').text(hp);
            if (mp !== '') $mp = $('<span class="mp" />').text(mp);
            
            $participant
                    .append($delete)
                    .append($('<span class="personagem" />').text(participant.name))
                    .append(
                        $('<span class="floatRight" />')
                            .append((hp !== '' ? $hp : ''))
                            .append((mp !== '' ? $mp : ''))
                            .append($init)
                            .append($setturn)
                            .append($target)
                            .append($opensheet)
                    );
            if (turn === i) {
                $participant.addClass('hisTurn');
            }
            if (i === this.target) {
                $participant.addClass('target');
            }
            $participant.attr('data-id', participant.id);
            this.$body.append($participant);
        }
        
        window.app.ui.language.applyLanguageOn(this.$body);
        
        if (changed && user.isStoryteller()) {
            this.myStuff.ordered = participants;
            this.myStuff.turn = turn;
            this.memory.setMemory('combat', this.myStuff, false);
        }
    };
    
    this.updateUserList = function () {
        if (window.app.chatapp.room === null) {
            return;
        }
        var room = window.app.chatapp.room;
        var usersDB = room.users.users;
        var users = [];
        for (var i in usersDB) {
            users.push(usersDB[i]);
        }
        if (this.$players.children().length !== (users.length + 1)) {
            users.sort(function (a, b) {
                var na = a.nickname.toUpperCase() + '#' + a.nicknamesufix.toUpperCase();
                var nb = b.nickname.toUpperCase() + '#' + b.nicknamesufix.toUpperCase();
                if (na < nb) {
                    return -1;
                }
                if (na > nb) {
                    return 1;
                }
                return 0;
            });
            this.$players.empty().append('<option value="0">NPC</option>');
            var $player;
            for (var i = 0; i < users.length; i++) {
                $player = $('<option />').val(users[i].id).text(users[i].nickname + '#' + users[i].nicknamesufix);
                this.$players.append($player);
            }
        }
    };
    
    this.updateSheetList = function () {
        var user = this.getUser();
        if (!user.isStoryteller()) {
            return;
        }
        this.$sheets.empty();
        if (window.app.chatapp.room === null) {
            return;
        }
        var room = window.app.chatapp.room;
        var sheet;
        var $sheet = [];
        var sheets = window.app.sheetdb.sheets;
        for (var i in sheets) {
            sheet = sheets[i];
            if (sheet.gameid === room.gameid) {
                $sheet.push($('<option />').val(sheet.id).text(sheet.name));
            }
        }
        $sheet.sort(function ($a,$b) {
            var na = $a.text().toUpperCase();
            var nb = $b.text().toUpperCase();
            if (na < nb) {
                return -1;
            }
            if (na > nb) {
                return 1;
            }
            return 0;
        });
        
        for (var i = 0; i < $sheet.length; i++) {
            this.$sheets.append($sheet[i]);
        }
    };
    
    this.warnTurn = function () {
        var room = window.app.chatapp.room;
        if (room === null) {
            return;
        }
        var message = new Message();
        message.module = "sheettr";
        message.setSpecial('sheetname', this.myStuff.ordered[this.myStuff.turn].name);
        message.setOrigin(window.app.loginapp.user.id);
        message.roomid = window.app.ui.chat.cc.room.id;
        message.setSpecial('player', this.myStuff.ordered[this.myStuff.turn].player);
        window.app.chatapp.printAndSend(message, true);
    };
}