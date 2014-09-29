function Style (sheet, styleInstance) {
    this.sheet = sheet;
    this.style = styleInstance;
    
    this.$css = $('<style type="text/css" />').html(this.style.css);
    this.$html = $('<div id="sheetDiv" />').html(this.style.html);
    
    window.app.ui.language.applyLanguageOn(this.$html);
    
    this.mainSheet = new Sheet(this.$html, this, true);
    
    this.nameField;
    
    this.variableTypes = {
        'text' : window.Variable_Varchar,
        'number' : window.Variable_Number,
        'integer' : window.Variable_Integer,
        'longtext' : window.Variable_Longtext,
        'picture' : window.Variable_Picture,
        'select' : window.Variable_Select,
        'boolean' : window.Variable_Boolean,
        'image' : window.Variable_Image,
        'sheet' : window.Variable_Sheet
    };
    
    this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
    };
    
    this.switchInstance = function (sheet) {
        this.sheet = sheet;
        this.setValues();
        this.setNpcPlayer();
    };
    
    this.setValues = function () {
        this.mainSheet.setDefault();
        this.mainSheet.update(this.sheet.values);
        this.nameField.update();
        this.mainSheet.update$();
        this.mainSheet.$visible.trigger("loaded");
    };
    
    this.beforeProcess = function (sheet, instance, style) {
        try {
            eval(this.style.beforeProcess);
        } catch (err) {
            console.log("Before process error for " + this.style.name + ": ");
            console.log(err);
            var errmsg = window.app.ui.language.getLingoOn("_STYLEBEFOREERROR_", this.style.name);
            alert(errmsg + ":\n" + err.message);
        }
    };
    
    this.afterProcess = function (sheet, instance, style) {
        try {
            eval(this.style.afterProcess);
        } catch (err) {loaded
            console.log("After process error for " + this.style.name + ": ");
            console.log(err);
            var errmsg = window.app.ui.language.getLingoOn("_STYLEAFTERERROR_", this.style.name);
            alert(errmsg + ":\n" + err.message);
        }
    };
    
    this.process = function () {
        this.beforeProcess(this.mainSheet, this.sheet, this);
        
        this.mainSheet.process();
        this.mainSheet.setDefault();
        
        var $nameField = this.mainSheet.$visible.find('.sheetName');
        if ($nameField.length > 0) {
            this.nameField = new Variable_Name($($nameField[0]), this, 0, this.mainSheet);
        } else {
            this.nameField = new Variable_Name($('<p class="sheetName" />'), this, 0, this.mainSheet);
        }
        this.nameField.setDefault();
        
        var setChanged = this.emulateBind(
            function () {
                this.style.sheet.changed = true;
                this.style.mainSheet.$visible.trigger('hasChanged', [this.style.sheet]);
            }, {style : this}
        );

        var playerField = this.mainSheet.getField('Player');
        if (playerField !== null) {
            console.log("Player field is not null");
            playerField.$visible.on('changedVariable', this.emulateBind(function () {
                console.log("Player field was changed");
                console.log(this.variable.getObject());
                console.log(this.style);
                console.log(this.variable);
                this.style.setNpcPlayer(this.variable.getObject() === 'NPC');
            }, {style : this, variable : playerField}));
        } else {
            console.log("Player field was null?");
        }
        this.setNpcPlayer();

        this.mainSheet.$visible.on('changedVariable', setChanged);
        this.mainSheet.$visible.on('changedRows', setChanged);
        
        this.afterProcess(this.mainSheet, this.sheet, this);
    };
    
    this.toggleEdit = function () {
        if (!this.sheet.editable) {
            this.editing = false;
        } else {
            this.editing = !this.editing;
        }
        this.mainSheet.update$();
        this.nameField.update$();
        if (this.editing) {
            this.mainSheet.$visible.trigger("editing");
        } else {
            this.mainSheet.$visible.trigger("viewing");
        }
    };
    
    this.getField = function (id) {
        if (typeof this.mainSheet.fields[id] === 'undefined') {
            return null;
        }
        return this.mainSheet.fields[id];
    };
    
    this.get$ = function () {
        return this.$html;
    };
    
    this.get$css = function () {
        return this.$css;
    };
    
    this.getObject = function () {
        return this.mainSheet.getObject();
    };
    
    this.seppuku = function () {
        this.$html.remove();
        this.$html = null;
        this.$css.remove();
        this.$css = null;
        this.mainSheet.seppuku();
        this.mainSheet = null;
    };
    
    this.setNpcPlayer = function (npc) {
        console.log("Setting npc player");
        console.log(npc);
        if (this.sheet.values !== undefined && typeof npc === undefined) {
            if (this.sheet.values['Player'] !== undefined) {
                npc = this.sheet.values['Player'] === 'NPC';
            }
        }
        if (npc === undefined) npc = false;
        
        console.log(npc);
        if (!npc) {
            this.$html.addClass('character').removeClass('nonplayer');
        } else {
            this.$html.addClass('nonplayer').removeClass('character');
        }
    };
}