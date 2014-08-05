function Sheet_Instance () {
    this.gameid;
    
    this.id;
    this.criador;
    this.system;
    this.segura;
    this.publica;
    
    this.visualizar;
    this.editable;
    this.deletar;
    
    this.name;
    this.values;
    
    this.changed = false;
    
    this.isOwner = function () {
        return window.app.loginapp.user.id === this.criador;
    };
    
    this.updateFromJSON = function (json) {
        console.log("Updating Sheet from JSON");
        console.log(json);
        
        var attributes = ['id', 'criador', 'segura', 'publica', 'visualizar', 'deletar', 'values', 'gameid'];
        for (var i = 0; i < attributes.length; i++) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[attributes[i]] = json[attributes[i]];
            }
        }
        
        if (typeof json['nome'] !== 'undefined') this.name = json['nome'];
        if (typeof json['idstyle'] !== 'undefined') this.system = json['idstyle'];
        if (typeof json['editar'] !== 'undefined') this.editable = json['editar'];
    };
    
    this.setValues = function (values) {
        this.values = values;
    };
}