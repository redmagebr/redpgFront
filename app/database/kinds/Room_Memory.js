function Room_Memory () {
    this.memory = {};
    
    this.updateFromJSON = function (json) {
        for (var i in json) {
            if (typeof window.registeredRoomMemory[i] !== 'undefined') {
                this.setMemory(i, json[i], true);
                window.registeredRoomMemory[i].updateMemory();
            }
            console.log(i);
        }
    };
    
    this.getMemory = function (id, def) {
        if (typeof this.memory[id] === 'undefined') {
            this.setMemory(id, def, false);
        }
        
        return this.memory;
    };
    
    this.setMemory = function (id, value, skipSave) {
        if (typeof this.memory[id] === 'undefined' || this.memory[id] !== value) {
            this.memory[id] = value;
            if (!skipSave) {
                window.app.chatapp.saveMemory();
            }
        }
    };
}

window.registeredRoomMemory = {};
    
window.registerRoomMemory = function (id, obj) {
    window.registeredRoomMemory[id] = obj;
};