function PlayerController() {
    
    /** @type Room */ this.room;
    
    this.$users = {};
    this.userState = {};
    
    this.init = function () {
        
    };
    
    this.setBindings = function () {
        
    };
    
    this.checkUsers = function () {
        var users = this.room.users.users;
        var isListed;
        var userState;
        for (var index in users) {
            if (users[index].nickname === null) {
                if (window.app.ui.chat.cc.room !== null) {
                    window.app.ui.chat.cc.room.requiresUsers = true;
                }
            }
            isListed = typeof this.$users[users[index].id] !== 'undefined';
            if (users[index].isOffline(window.app.chatapp.userTime, window.app.chatapp.afkTime)) {
                if (isListed) {
                    // Disconnected
                    this.$users[users[index].id].remove();
                    delete this.userState[users[index].id];
                    delete this.$users[users[index].id];
                }
            } else {
                if (!isListed) {
                    // Connected
                    this.$users[users[index].id] = window.app.ui.chat.ac.create$avatar(users[index]);
                    window.app.ui.chat.ac.append(this.$users[users[index].id]);
                    window.app.ui.chat.ac.considerScrollers();
                    userState = {
                        'focused' : users[index].focused,
                        'nick' : users[index].nickname + '#' + users[index].nicknamesufix,
                        'typing' : users[index].typing,
                        'avatar' : users[index].avatarS,
                        'persona' : users[index].personaS
                    };
                    this.userState[users[index].id] = userState;
                } else {
                    window.app.ui.chat.ac.update$(this.$users[users[index].id], users[index], this.userState[users[index].id]);
                }
            }
        }
    };
    
    this.clear = function () {
        for (var i in this.$users) {
            this.$users[i].remove();
        }
        this.$users = {};
        window.app.ui.chat.ac.$container.empty();
    };
    
}