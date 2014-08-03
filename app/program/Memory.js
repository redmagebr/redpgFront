function Memory () {
    this.memory = null;
    
    this.init = function () {
        if (typeof localStorage[window.app.loginapp.user.id] === 'undefined') {
            localStorage[window.app.loginapp.user.id] = "{}";
            this.memory = {};
        } else {
            this.memory = JSON.parse(localStorage[window.app.loginapp.user.id]);
        }
    };
    
    this.getMemory = function (id, obj) {
        if (typeof this.memory[id] === 'undefined') {
            this.memory[id] = obj;
            this.saveMemory();
        }
        return this.memory[id];
    };
    
    this.setMemory = function (id, obj) {
        this.memory[id] = obj;
        this.saveMemory();
    };
    
    this.saveMemory = function () {
        localStorage[window.app.loginapp.user.id] = JSON.stringify(this.memory);
    };
}