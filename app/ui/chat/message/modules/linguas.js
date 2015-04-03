if (window.chatModules === undefined) window.chatModules = [];
function ModuleMensagem () {
    /**
     * Hook é o slash command que irá, preferencialmente, ser enviado a esse módulo.
     * Slash command vazio ("") significa quando não há slash command.
     * @type String
     */
    this.hook = "/lang";
    
    /**
     * Guarda os valores padrões para as mensagens do módulo.
     * A função disso é não entregar mensagens de erro caso o servidor tenha guardado uma mensagem incompleta enviada por esse módulo.
     * @type object
     */
    this.default = {
        mensagem:"Mensagem inválida.",
        personagem: "Personagem Inválido",
        lingua: "Comum"
    };
    
    /**
     * Checa se a mensagem realmente é desse módulo.
     * Nesse módulo: é necessário ter uma persona ativa. A mensagem não pode estar vazia.
     * @param {String} mensagem
     * @returns {boolean}
     */
    this.checkMessage = function (mensagem) {
        return false;
    };
}