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
        'select' : window.Variable_Select
    };
    
    this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
    };
    
    this.switchInstance = function (sheet) {
        this.sheet = sheet;
        this.setValues();
    };
    
    this.setValues = function () {
        this.mainSheet.setDefault();
        this.mainSheet.update(this.sheet.values);
        this.nameField.update();
        this.mainSheet.update$();
    };
    
    this.beforeProcess = function (sheet, instance, style) {
        eval(this.style.beforeProcess);
    };
    
    this.afterProcess = function (sheet, instance, style) {
        eval(this.style.afterProcess);
    };
    
    this.process = function () {
        this.beforeProcess(this.mainSheet, this.sheet, this);
        
        this.mainSheet.process();
        this.mainSheet.setDefault();
        
        var $nameField = this.mainSheet.$visible.find('.sheetName');
        if ($nameField.length > 0) {
            this.nameField = new Variable_Name($($nameField[0]), this, 0, this.mainSheet);
            this.nameField.setDefault();
        }
        
        var setChanged = this.emulateBind(
            function () {
                this.style.sheet.changed = true;
                this.style.mainSheet.$visible.trigger('hasChanged', [this.style.sheet]);
            }, {style : this}
        );

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
}