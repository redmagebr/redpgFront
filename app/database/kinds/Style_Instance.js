function Style_Instance () {
    this.id = null;
    this.name = null;
    
    this.html = null;
    this.css = null;
    
    this.beforeProcess = null;
    this.afterProcess = null;
    
    this.updateFromJSON = function (json) {
        console.log("Updating Style from JSON");
        console.log(json);
        var attributes = ["id", "name", "html", "css", "beforeProcess", "afterProcess"];
        for (var i = 0; i < attributes.length; i++) {
            if (json[attributes[i]] !== undefined) {
                this[attributes[i]] = json[attributes[i]];
            }
        }
    };
}