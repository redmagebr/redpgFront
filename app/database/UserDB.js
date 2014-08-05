function UserDB () {
    this.users = {};
    
    this.empty = function () {
        this.users = {};
    };
    
    this.updateFromJSON = function (json) {
        for (var i = 0; i < json.length; i++) {
            if (typeof this.users[json[i].id] === 'undefined') {
                this.users[json[i].id] = new User ();
            }
            this.users[json[i].id].updateFromJSON(json[i]);
            console.log(this.users[json[i].id]);
        }
    };
    
    this.updateFromJSONObject = function (json, onlineonly) {
        for (var i in json) {
            if (typeof this.users[i] === 'undefined') {
                this.users[i] = new User();
            }
            this.users[i].updateFromJSON(json[i]);
            if (onlineonly) {
                this.users[i].online = true;
            }
        }
    };
    
    this.getUser = function (id) {
        if (typeof this.users[id] === 'undefined') {
            return null;
        }
        return this.users[id];
    };
}