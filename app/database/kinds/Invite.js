function Invite () {
    this.gameid = null;
    this.gamename = "?";
    this.creatornick = "????????";
    this.creatornicksufix = "????";
    this.message = "";
    
    this.updateFromJSON = function (json) {
        var attributes = {
            gameid : 'id',
            gamename : 'name',
            creatornick : 'creatornick',
            creatornicksufix : 'creatornicksufix',
            message : 'MensagemConvite'
        };
        var i;
        for (i in attributes) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[i] = json[attributes[i]];
            }
        }
    };
}