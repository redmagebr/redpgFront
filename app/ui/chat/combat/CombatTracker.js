function CombatTracker () {
    this.$tracker = $('#combatTracker').draggable({
        containment : 'window',
        handle : '#combatTrackerHandle'
    });
    
    this.init = function () {
        window.registerRoomMemory('combat', this);
    };
    
    this.updateMemory = function () {
        
    };
}