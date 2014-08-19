function Room_Memory (room) {
    /** @type Room */ this.room = room;
    this.memory = {};
    
    this.updateFromJSON = function (json) {
        this.memory = {};
        for (var i in json) {
            if (typeof window.registeredRoomMemory[i] !== 'undefined') {
                this.setMemory(i, json[i], true);
            }
            console.log(i);
        }
        for (var i in window.registeredRoomMemory) {
            window.registeredRoomMemory[i].updateMemory(this);
        }
    };
    
    this.getMemory = function (id, def) {
        if (typeof this.memory[id] === 'undefined') {
            this.setMemory(id, def, false);
        } else {
            this.cleanMemory(id, def);
        }
        
        return this.memory[id];
    };
    
    this.cleanMemory = function (id, def) {
        var memory = this.memory[id];
        var changed = false;
        
        if (!memory instanceof Object && def instanceof Object) {
            memory = def;
            changed = true;
        } else if (!memory instanceof Array && def instanceof Array) {
            memory = def;
            changed = true;
        } else if (typeof memory !== typeof def) {
            memory = def;
            changed = true;
        }
        
        if (def instanceof Object) {
            // Remove unneeded fields
            for (var i in memory) {
                if (typeof def[i] === 'undefined') {
                    delete memory[i];
                    changed = true;
                }
            }

            // Add missing fields and correct mismatched ones
            for (var i in def) {
                if (typeof def[i] !== typeof memory[i]) {
                    memory[i] = def[i];
                    changed = true;
                } else if (typeof memory[i] === 'undefined') {
                    memory[i] = def[i];
                    changed = true;
                } else if (def[i] instanceof Array && !memory[i] instanceof Array) {
                    memory[i] = def[i];
                    changed = true;
                } else if (def[i] instanceof Object && !memory[i] instanceof Object) {
                    memory[i] = def[i];
                    changed = true;
                }
            }
        }
        
        var user = this.room.getMe();
        if (changed && user.isStoryteller()) {
            this.setMemory(id, memory, false);
        }
    };
    
    this.setMemory = function (id, value, skipSave) {
        console.log("Saving memory :" + id + (skipSave ? ' skip: true' : ' skip: false'));
        this.memory[id] = value;
        if (!skipSave) {
            window.app.chatapp.saveMemory();
        }
    };
}

window.registeredRoomMemory = {};
    
window.registerRoomMemory = function (id, obj) {
    window.registeredRoomMemory[id] = obj;
};