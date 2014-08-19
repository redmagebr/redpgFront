function LanguageTracker() {
    this.$tracker = $('#languageTracker').draggable({
        containment : 'window',
        handle : '#languageTrackerHandle'
    }).hide();
    
    this.$tabButton = $('#languagesButton');
    
    /** @type Room_Memory */ this.memory;
    
    this.init = function () {
        window.registerRoomMemory('lingo', this);
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#languageTrackerHide').on('click', function () {
            window.app.ui.chat.langtab.toggleTab();
        });
        
        this.$tabButton.on('click', function () {
            window.app.ui.chat.langtab.toggleTab();
        });
    };
    
    this.toggleTab = function () {
        var offset = this.$tabButton.offset();
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
    
    this.updateMemory = function (memory) {
        this.memory = memory;
        this.myStuff = this.memory.getMemory('lingo', {});
        /**
         * id : [lingua1, lingua2]
         */
        var changed = false;
        for (var i in this.myStuff) {
            if (isNaN(i, 10) || !(this.myStuff[i] instanceof Array)) {
                changed = true;
                delete this.myStuff[i];
            }
        }
        
        var user = window.app.chatapp.room.getMe();
        if (user.isStoryteller()) {
            if (changed) {
                this.memory.setMemory('lingo', this.myStuff, false);
            }
        } else {
            
        }
    };
}