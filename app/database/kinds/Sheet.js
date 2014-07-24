function Sheet () {
    this.gameid;
    
    this.id;
    this.criador;
    this.idstyle;
    this.segura;
    this.publica;
    
    this.visualizar;
    this.editar;
    this.deletar;
    
    this.nome;
    this.values;
    
    this.isOwner = function () {
        return window.app.loginapp.user.id === this.criador;
    };
    
    this.updateFromJSON = function (json) {
        console.log("Updating Sheet from JSON");
        console.log(json);
        
        var attributes = ['id', 'criador', 'idstyle', 'segura', 'publica', 'visualizar', 'editar', 'deletar', 'nome', 'values'];
        for (var i = 0; i < attributes.length; i++) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[attributes[i]] = json[attributes[i]];
            }
        }
    };
}