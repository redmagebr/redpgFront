function Logger () {
    
    this.$window = $("#loggerWindow");
    this.$messages = $("#loggerMessages");
    this.$slider= $('#loggerSlider');
    this.$types = $("#loggerTypes");
    
    this.$importBt = $("#logLoadButton").on('click', function () {
        window.app.ui.chat.logger.loadLog();
    });
    this.$importForm = $("#logLoadFile");
    
    this.$create = $("#loggerCreateJSON").on("click", function () {
        window.app.ui.chat.logger.createJSON();
    });
    
    this.allowedTypes = [];
    
    this.leftHandle = 0;
    this.rightHandle = 1000;
    
    this.makeSlider = function (min, max) {
        if (min > this.leftHandle) {
            this.leftHandle = min;
        }
        if (max < this.rightHandle) {
            this.rightHandle = max;
        }
        this.$slider.slider({
            range: true,
            min: min,
            max: max,
            values: [ this.leftHandle, this.rightHandle ],
            slide: function( event, ui ) {
                var logger = window.app.ui.chat.logger;
                logger.leftHandle = ui.values[0];
                logger.rightHandle = ui.values[1];
                logger.updateMessages();
            }
        });
    };
    
    this.updateMessages = function () {
        this.$messages.empty();
        var messages = window.app.chatapp.room.messages;
        var i = this.leftHandle;
        var v = 0;
        var maxExcerpt = 3;
        var message;
        while (i < messages.length && v < maxExcerpt) {
            if (this.letMessage(messages[i])) {
                message = messages[i];
                this.$messages.append($("<p />").text(this.messageToText(message)));
                v++;
            }
            i++;
        }
        
        this.$messages.append("<p>...</p><p>...</p>");
        
        var minI = i;
        
        i = this.rightHandle;
        var printMessages = [];
        while (i > minI && printMessages.length < maxExcerpt) {
            if (this.letMessage(messages[i])) {
                printMessages.unshift(messages[i]);
            }
            i--;
        }
        
        for (i = 0; i < printMessages.length; i++) {
            message = printMessages[i];
            this.$messages.append($("<p />").text(this.messageToText(message)));
        }
    };
    
    /**
     * 
     * @param {Message} message
     * @returns {undefined}
     */
    this.messageToText = function (message) {
        var text = message.module + " " + window.app.ui.language.getLingo("_LOGGERMSGBY_") + " " + message.getUser().getFullName()
             + ": ";
        
        var readableModules = ["story", "action", "countdown", "dice", "lingo", "offgame", "roleplay", "vote"];
        
        if (readableModules.indexOf(message.module) !== -1) {
            text += message.getMessage();
        } else {
            text += window.app.ui.language.getLingo("_LOGGERNOTTYPE_");
        }
        
        return text;
    };
    
    this.letMessage = function (message) {
        if (message === undefined || message === null) {
            return false;
        }
        if (message.destination !== null && message.destination !== undefined && message.destination !== 0) {
            return false;
        }
        if (this.allowedTypes.indexOf(message.module) === -1) {
            return false;
        }
        return true;
    };
    
    this.createFilters = function () {
        this.$types.empty();
        var messages = window.app.chatapp.room.messages;
        this.allowedTypes = [];
        var message;
        var $input;
        var $label;
        var inputs = 0;
        for (var i = 0; i < messages.length; i++) {
            message = messages[i];
            if (message === undefined || message === null) continue;
            if (this.allowedTypes.indexOf(message.module) === -1) {
                this.allowedTypes.push(message.module);
                // <input type="checkbox" id="loggerRoleplay" /><label for="loggerRoleplay">Roleplay</label>
                $label = "<label for='logger" + message.module + "'>" + message.module + "</label>";
                $input = $("<input checked id='logger" + message.module + "' type='checkbox' />").on('change', function () {
                    window.app.ui.chat.logger.updateFilters();
                }).attr("data-id", message.module);
                this.$types.append($input).append($label);
                inputs++;
                if (inputs === 4) {
                    inputs = 0;
                    this.$types.append("<br />");
                }
            }
        }
    };
    
    this.updateFilters = function () {
        this.allowedTypes = [];
        var $inputs = this.$types.find("input");
        for (var i = 0; i < $inputs.length; i++) {
            if ($inputs[i].checked) {
                this.allowedTypes.push($($inputs[i]).attr("data-id"));
            }
        }
        this.updateMessages();
    };
    
    this.init = function () {
        
    };
    
    this.callSelf = function () {
        this.$window.finish(true, true).fadeIn(500);
        
        var room = window.app.chatapp.room;
        this.rightHandle = window.app.chatapp.room.messages.length;
        this.makeSlider(0, room.messages.length);
        
        this.createFilters();
        this.updateMessages();
    };
    
    this.createJSON = function () {
        var object = window.app.chatapp.room.export();
        var messages = [];
        var message;
        for (var i = this.leftHandle; i < window.app.chatapp.room.messages.length && i < this.rightHandle; i++) {
            message = window.app.chatapp.room.messages[i];
            if (this.letMessage(message)) {
                messages.push(message.export());
            }
        }
        object.messages = messages;
        var blob = new Blob([JSON.stringify(object, null, 4)], {
            type: "text/plain;charset=utf-8;",
        });
        var d = new Date();
        var curr_date = d.getDate();
        if (curr_date < 10) {
            curr_date = "0" + curr_date;
        }
        var curr_month = d.getMonth() + 1; //Months are zero based
        if (curr_month < 10) {
            curr_month = "0" + curr_month;
        }
        var curr_year = d.getFullYear();
        saveAs(blob, curr_year + curr_month + curr_date + "-" + object.name.replace(/[ ]/g, "_") + ".txt");
    };
    
    this.updateRoom = function () {
        window.app.ui.blockLeft();
        
        var id = window.app.chatapp.room.id;
        
        var cbs = function (data) {
            window.app.ui.unblockLeft();
            window.app.chatapp.room.empty();
            window.app.chatapp.room.updateFromJSON({messages : data}, true);
            window.app.ui.chat.logger.callSelf();
        };
        
        var cbe = function () {
            window.app.ui.unblockLeft();
            alert("Error");
        };
        
        var ajax = new AjaxController();
        
        var data = {
            roomid : id,
            action : 'messages'
        };
        
        ajax.requestPage({
            url : 'Room',
            data : data,
            success: cbs,
            error: cbe
        });
    };
    
    this.closeSelf = function () {
        this.$window.finish().fadeOut(500);
    };
    
    this.loadLog = function () {
        var f = this.$importForm[0].files[0];
        
        if (!f) { return; }
        
        window.app.ui.blockLeft();
        
        var r = new FileReader();
        r.onload = function(e) {
            window.app.ui.unblockLeft();
            window.app.ui.chat.logger.openLog(e.target.result);
        };
        
        r.onerror = function () {
            window.app.ui.unblockLeft();
            alert("Error reading the file.");
        };
        
        r.readAsText(f);
    };
    
    this.openLog = function (json) {
        try {
            json = JSON.parse(json);
        } catch (e) {
            alert("Not a valid JSON file.");
        }
        window.app.ui.chat.cc.exit();
        window.app.chatapp.stop();
        window.app.chatapp.room = new Room();
        window.app.ui.chat.cc.room = window.app.chatapp.room;
        window.app.ui.chat.cc.pc.room = window.app.chatapp.room;
        window.app.chatapp.room.updateFromJSON(json);
        window.app.ui.chat.cc.cleanSelf();
        window.app.ui.chat.cc.ignoreTooMany = true;
        window.app.ui.chat.cc.printAllMessages();
        window.app.ui.callLeftWindow('chatWindow');
        window.app.ui.chat.hideUnnecessary();
    };
}