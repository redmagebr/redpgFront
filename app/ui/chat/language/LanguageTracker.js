function LanguageTracker() {
    this.$tracker = $('#languageTracker').draggable({
        containment : 'window',
        handle : '#languageTrackerHandle'
    }).hide();
    
    this.$tabButton = $('#languagesButton');
    this.$body = $('#languageTrackerBody').empty();
    
    /** @type Room_Memory */ this.memory;
    
    this.init = function () {
        window.registerRoomMemory('lingo', this);
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#languageTrackerHide').on('click', function () {
            window.app.ui.chat.langtab.toggleTab();
        });
        
        this.$tabButton.on('click', function () {
            window.app.ui.chat.langtab.toggleTab();
        });
    };
    
    this.toggleTab = function () {
        var offset = this.$tabButton.offset();
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
    
    this.updateMemory = function (memory) {
        this.memory = memory;
        this.myStuff = this.memory.getMemory('lingo', {lingo : {}});
        this.myStuff = this.myStuff.lingo;
        /**
         * id : [lingua1, lingua2]
         */
        var changed = false;
        var ling;
        // Remove invalid/unnecessary stores
        for (var i in this.myStuff) {
            if (isNaN(i, 10) || !(this.myStuff[i] instanceof Array)) {
                changed = true;
                delete this.myStuff[i];
            } else {
                if (this.myStuff[i].length === 0) {
                    changed = true;
                    delete this.myStuff[i];
                    continue;
                }
                for (ling = 0; ling < this.myStuff[i].length; ling++) {
                    if (typeof this.myStuff[i][ling] !== 'string') {
                        changed = true;
                        delete this.myStuff[i];
                        break;
                    }
                }
            }
        }
        
        this.updateList();
        
        var user = window.app.chatapp.room.getMe();
        if (user.isStoryteller()) {
            if (changed) {
                this.saveMemory();
            }
            this.$body.find('a.deleteLanguage, a.addLanguage, select').show();
        } else {
            this.$body.find('a.deleteLanguage, a.addLanguage, select').hide();
        }
    };
    
    this.updateList = function () {
        this.$body.empty();
        
        var memory = this.myStuff;
        
        var $select = $('<select />');
        
        var i;
        
        for (i = 0; i < window.AvailableLanguages.length; i++) {
            $select.append(
                $('<option />').val(window.AvailableLanguages[i]).text(window.AvailableLanguages[i])
            );
        }
        
        var intid;
        var $p;
        var $player;
        var $languages;
        var $language;
        var $remove;
        var $myselect;
        var $add;
        /** @type User */ var player;
        for (var id in window.app.chatapp.room.users.users) {
            player = window.app.chatapp.room.users.users[id];
            if (player.isStoryteller()) continue;
            intid = player.id;
            $p = $('<p />');
            $player = $('<span class="player" />').text(player.nickname + '#' + player.nicknamesufix + ": ");
            $languages = $('<span class="languages" />');
            if (typeof memory[id] !== 'undefined') {
                for (i = 0; i < memory[id].length; i++) {
                    var $remove = $('<a class="deleteLanguage">(X)</a>');
                    var $language = $('<span class="language" />').text(memory[id][i]);
                    $language.prepend($remove);
                    $languages.append($language);
                    
                    $remove.on('click', window.app.emulateBind(function () {
                        window.app.ui.chat.langtab.removeLing(this.player, this.ling);
                    }, {player : intid, ling : i, $lang : $language}));
                }
            }
            $myselect = $select.clone();
            $add = $('<a class="addLanguage">(+)</a>');
            
            $add.on('click', window.app.emulateBind(function () {
                window.app.ui.chat.langtab.addLing(this.player, this.$select.val());
            }, {player : intid, $select : $myselect}));
            
            $p.append($player).append($languages).append("<br />").append($myselect).append($add);
            this.$body.append($p);
        }
        
        this.$tracker.css('height', '');
    };
    
    this.removeLing = function (playerid, lingindex) {
        if (typeof this.myStuff[playerid] !== 'undefined') {
            this.myStuff[playerid].splice(lingindex, 1);
            this.saveMemory();
        }
    };
    
    this.addLing = function (playerid, ling) {
        if (typeof this.myStuff[playerid] === 'undefined') {
            this.myStuff[playerid] = [];
        }
        if (this.myStuff[playerid].indexOf(ling) !== -1) {
            return;
        }
        this.myStuff[playerid].push(ling);
        this.saveMemory();
    };
    
    this.saveMemory = function () {
        console.log(this.myStuff);
        this.memory.setMemory('lingo', {lingo : this.myStuff}, false);
    };
    
    this.whoSpeaks = function (ling) {
        var speakers = [];
        var player;
        for (var id in window.app.chatapp.room.users.users) {
            player = window.app.chatapp.room.users.users[id];
            if (player.isStoryteller()) {
                speakers.push(player.id);
            } else {
                if (typeof this.myStuff[player.id] !== 'undefined' && this.myStuff[player.id].indexOf(ling) !== -1) {
                    speakers.push(player.id);
                }
            }
        }
        return speakers;
    };
}