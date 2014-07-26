/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'vote',
    
    Slash : ['/vote', '/voto', '/vota', '/votar'],
    
    poller : {},
    vote : {},
    $votes : {},
    
    addVotes : function (votefor, user) {
        if (typeof this.vote[votefor] === 'undefined' || this.poller[votefor] === user) {
            return null;
        }
        var index = this.vote[votefor].indexOf(user);
        if (index === -1) {
            this.vote[votefor].push(user);
        } else {
            this.vote[votefor].splice(index, 1);
        }
        this.$votes[votefor].text(this.vote[votefor].length);
    },
    
    isValid : function (slashCMD, message) {
        return (message !== null && message.length > 0);
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        
        var votefor = msg.getSpecial('castvote', null);
        var user = msg.getUser();
        var $msg = $('<p class="chatVote" />');
        
        var $voteCount = $('<span class="voteCount" />').text('0');
        $msg.append($voteCount);
        
        if (user === null) {
            user = new User();
            user.id = msg.origin;
            user.nickname = '?';
            user.nicknamesufix = '?';
            var snowflake = false;
        } else {
            var snowflake = user.specialSnowflakeCheck();
        }
        
        if (votefor !== null) {
            this.addVotes(votefor, user.id);
            return null;
        }
        
        var $jogador = $('<b />');
        if (!snowflake) {
            $jogador.text(user.nickname + '#' + user.nicknamesufix + ' ');
        } else {
            $jogador.text(user.nickname + ' ');
        }
        $msg.append($jogador);
        
        $msg.append($('<span class="language" data-langhtml="_VOTECREATED_" />'));
                
        $msg.append(': ' + $('<p />').text(msg.msg).html());
        
        $msg.append("<br />");
        
        if (msg.id !== null && msg.origin !== window.app.loginapp.user.id) {
            this.poller[msg.id] = msg.origin;
            this.vote[msg.id] = [];
            this.$votes[msg.id] = $voteCount;
            
            $voteCount.bind('click', window.app.emulateBind(
                function () {
                    var $this = this.$voteCount;
                    var msg = new Message();
                    msg.setSpecial('castvote', this.id);
                    msg.setMessage('');
                    msg.module = 'vote';
                    msg.origin = window.app.loginapp.user.id;
                    msg.roomid = this.room;
                    var room = window.app.roomdb.getRoom(this.room);
                    room.addLocal(msg);
                    
                    var $load = $('<span class="load" />').text('LOAD');
                    
                    //$load.insertAfter(this.$voteCount);
                    
                    this.$voteCount.addClass('load');
                    
                    msg.bindSaved(window.app.emulateBind(
                        function () {
                            this.$load.removeClass('load');
                            this.mod.addVotes(this.id, this.me);
                        }, {$load : this.$voteCount, mod : this.mod, me : msg.origin, id : this.id}
                    ));
            
                    msg.bindError(window.app.emulateBind(
                        function () {
                            window.app.chatapp.sendMessage(this.msg);
                        }, {$load : this.$voteCount, msg : msg}
                    ));
                    
                    window.app.chatapp.sendMessage(msg);
                }, {id : msg.id, $voteCount : $voteCount, room : msg.roomid, mod : this}
            ));
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.mod.poller[this.msg.id] = this.msg.origin;
                    this.mod.vote[this.msg.id] = [];
                    this.mod.$votes[this.msg.id] = this.$voteCount;
                }, {msg : msg, mod : this, $voteCount : $voteCount}
            ));
    
            $voteCount.addClass("owner");
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        msg.msg = message;
        msg.setSpecial('castvote', null);
        
        
        return msg;
    }
});