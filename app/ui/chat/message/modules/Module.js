function Module () {
    /**
     * Module ID. Should be unique and readable.
     * @type String
     */
    this.ID;
    
    /**
     * Holds every slash command that should point to this module.
     * @type Array of String
     */
    this.Slash = [];
    
    /**
     * Creates Message object from a String.
     * @param {String} message
     * @returns {Message}
     */
    this.createObject = function (message) {
        
    };
    
    /**
     * Creates HTML String out of a Message Object.
     * @param {Message} message
     * @returns {String}
     */
    this.createHTML = function (message) {
        
    };
}