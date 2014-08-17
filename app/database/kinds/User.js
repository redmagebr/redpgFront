function User () {
    this.id = null;
    this.nickname = null;
    this.nicknamesufix = null;
    this.nome = null;
    this.avatar = null;
    this.avatarS = null;
    this.persona = null;
    this.personaS = null;
    this.storyteller = false;
    this.lastrefresh = 0;
    this.lastupdate = 0;
    this.online = false;
    
    this.focused = true;
    this.typing = false;
    
    this.updateFromJSON = function (json) {
        var attributes = [
            'id',
            'nickname', 
            'nicknamesufix', 
            'name', 
            'avatar', 
            'persona', 
            'storyteller', 
            'lastrefresh',
            'lastupdate',
            'focused',
            'typing',
            'online'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[attributes[i]] = json[attributes[i]];
            }
        }
        console.log(json['persona']);
        this.personaS = this.persona;
        this.avatarS = this.avatar;
    };
    
    this.hasAvatar = function () {
        return this.avatar !== null;
    };
    
    this.hasPersona = function () {
        return this.persona !== null;
    };
    
    this.isStoryteller = function () {
        return this.storyteller;
    };
    
    this.isOffline = function (currenttime, afktime) {
        return !this.online;
        return !(currenttime <= (this.lastrefresh + afktime));
    };
    
    this.specialSnowflakeCheck = function () {
        var users = window.app.userdb.users;
        
        for (var i in users) {
            if (users[i].id !== this.id && users[i].nickname === this.nickname) {
                return false;
            }
        }
        return true;
    };
}