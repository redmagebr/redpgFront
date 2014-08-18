function CombatTracker () {
    this.$tracker = $('#combatTracker').draggable({
        containment : 'window',
        handle : '#combatTrackerHandle'
    }).hide();
    
    this.$sheets = $("#combatTrackerSheet").empty();
    this.$trackerButton = $('#combatTrackerButton');
    
    this.init = function () {
        window.registerRoomMemory('combat', this);
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#sheetViewer').on('loadedSheet.CombatTracker closedSheet.CombatTracker', function () {
            window.app.ui.chat.tracker.updateSheetList();
        });
        
        $('#combatTrackerHide').on('click', function () {
            window.app.ui.chat.tracker.toggleTracker();
        });
        
        this.$trackerButton.on('click', function () {
            window.app.ui.chat.tracker.toggleTracker();
        });
    };
    
    this.toggleTracker = function () {
        var offset = this.$trackerButton.offset();
        if (this.$tracker.is(":visible")) {
            this.$tracker.stop(true,false).animate({
                top : offset.top + 20,
                left : offset.left + 20,
                height: '0px',
                width: '0px'
            }, function () {
                $(this).hide();
            });
        } else {
            this.$tracker.show().css('height', '').css('width', '').css('top', offset.top + 20).css('left', offset.left + 20);
            var height = this.$tracker.height();
            var width = this.$tracker.width();
            this.$tracker.css('height', '0px').css('width', '0px');
            this.$tracker.stop(true,false).animate({
                top : offset.top - 100,
                left: offset.left - 20 - width,
                height: height + 'px',
                width: width + 'px'
            });
        }
    };
    
    this.updateMemory = function () {
        
    };
    
    this.updateSheetList = function () {
        this.$sheets.empty();
        if (window.app.chatapp.room === null) {
            return;
        }
        var room = window.app.chatapp.room;
        var sheet;
        var $sheet;
        var sheets = window.app.sheetdb.sheets;
        for (var i in sheets) {
            sheet = sheets[i];
            if (sheet.gameid === room.gameid) {
                $sheet = $('<option />').val(sheet.id).text(sheet.name);
                this.$sheets.append($sheet);
            }
        }
    };
}