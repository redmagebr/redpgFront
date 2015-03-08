/**
 * 
 * @param {CombatTracker} mainTracker
 * @returns {BuffTracker}
 */
function BuffTracker (mainTracker) {
    this.mainTracker = mainTracker;
    
    this.init = function () {
        window.registerRoomMemory('buff', this);
    };
    
    this.printBuffs = function (id) {
        var buffs = [];
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = this.myStuff.buffs.length - 1; i >= 0; i--) {
            if (this.myStuff.buffs[i][1] === id) {
                buffs.push(this.myStuff.buffs[i]);
            }
        }
        
        if (buffs.length === 0) {
            return;
        }
        
        var idToName = {};
        for (var i = 0; i < this.mainTracker.myStuff.ordered.length; i++) {
            idToName[this.mainTracker.myStuff.ordered[i].id] = this.mainTracker.myStuff.ordered[i].name;
        }
        var $html = $('<p class="chatSistema" />');
        $html.append("<span class='language' data-langhtml='_CURRENTBUFFS_'></span> " + idToName[id] + ": ");
        var buffMessages = [];
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = 0; i < buffs.length; i++) {
             buffMessages.push(buffs[i][3] + " <span class='language' data-langhtml='_CURRENTBUFFBY_'></span> " + idToName[buffs[i][0]]);
        }
        $html.append(buffMessages.join(", "));
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.moveTurns = function (oldTurn, newTurn) {
        var oldGuy = this.mainTracker.myStuff.ordered[oldTurn].id;
        var newGuy = this.mainTracker.myStuff.ordered[newTurn].id;
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = this.myStuff.buffs.length - 1; i >= 0; i--) {
            // OldGuy and EndOfTurn!
            if (this.myStuff.buffs[i][0] === oldGuy && this.myStuff.buffs[i][4] === 1) {
                this.myStuff.buffs[i][2] -= 1;
                if (this.myStuff.buffs[i][2] <= 0) {
                    this.announceRemoval(this.myStuff.buffs.splice(i, 1));
                }
                continue;
            }
            
            // NewGuy and StartOfTurn
            if (this.myStuff.buffs[i][0] === newGuy && this.myStuff.buffs[i][4] === 0) {
                this.myStuff.buffs[i][2] -= 1;
                if (this.myStuff.buffs[i][2] <= 0) {
                    this.announceRemoval(this.myStuff.buffs.splice(i, 1));
                }
            }
        }
    };
    
    this.announceRemoval = function (buff) {
        var $html = $('<p class="chatSistema" />');
        var idToName = {};
        for (var i = 0; i < this.mainTracker.myStuff.ordered.length; i++) {
            idToName[this.mainTracker.myStuff.ordered[i].id] = this.mainTracker.myStuff.ordered[i].name;
        }
        $html.append("<span class='language' data-langhtml='_BUFFREMOVED_'></span>: " + buff[0][3])
                .append(" <span class='language' data-langhtml='_BUFFREMOVEDFROM_'></span> " + idToName[buff[0][1]]);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.deleteApplier = function (orderedId) {
        var guy = this.mainTracker.myStuff.ordered[orderedId].id;
        //[buffer, targetId, duration, buffName, buffEndOfTurn]
        for (var i = this.myStuff.buffs.length - 1; i >= 0; i--) {
            if (this.myStuff.buffs[i][0] === guy || this.myStuff.buffs[i][1] === guy) {
                this.myStuff.buffs.splice(i, 1);
            }
        }
        this.saveMemory(false);
    };
    
    this.addBuff = function (buffer, targetId, duration, buffName, buffEndOfTurn) {
        var ordered = this.mainTracker.myStuff.ordered;
        var guy1;
        var guy2;
        
        for (var i = 0; i < ordered.length; i++) {
            if (ordered[i].id === buffer) {
                guy1 = ordered[i];
                if (guy2 !== undefined) break;
            }
            
            if (ordered[i].id === targetId) {
                guy2 = ordered[i];
                if (guy1 !== undefined) break;
            }
        }
        
        if (guy1 === undefined || guy2 === undefined) {
            this.announceImpossible();
            return;
        }
        
        duration = isNaN(duration, 10) ? 1 : parseInt(duration);
        buffEndOfTurn = buffEndOfTurn ? 1 : 0;
        
        this.myStuff.buffs.push([buffer, targetId, duration, buffName, buffEndOfTurn]);
        
        this.announcePlaced(buffName);
        
        this.saveMemory(true);
    };
    
    this.saveMemory = function (save) {
        this.memory.setMemory('buff', this.myStuff, !save);
    };
    
    this.announcePlaced = function (information) {
        var $html = $('<p class="chatSistema" />');
        $html.append("<span class='language' data-langhtml='_BUFFAPPLIED_'></span>: " + information);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.announceImpossible = function () {
        alert("Impossible buffs detected - sorry, this shouldn't happen");
    };
    
    this.updateMemory = function (memory) {
        this.memory = memory;
        this.myStuff = memory.getMemory('buff', {buffs : []});
    };
}