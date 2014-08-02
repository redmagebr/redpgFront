/**
 * Parts that are customizable:
 *    this.html;
 *    this.css;
 *    add code BEFORE PROCESS;
 *    add code AFTER PROCESS;
 * @param {Sheet_Instance} sheet
 * @class Style
 * @constructor
 */
function Style_00 (sheet) {
    
    this.sheet = sheet;
    
    this.changed = false;
    
    this.editing = false;
    
    this.html = "Força: <span class='sheetVariable' data-type='number' data-id='Força' data-default='10'></span>" +
            "<div id='periciaSum'>0</div>" +
            "<div class='sheetList' data-id='Pericias' data-minLength='100'>" +
                "<p>" + 
                    "<span class='sheetVariable' data-type='text' data-id='Pericia' data-placeholder='Nome da pericia'></span> - " +
                    "<span class='sheetVariable' data-type='integer' data-id='Valor' data-default='10'></span>" +
                    "<span class='sheetVariable' data-type='number' data-id='Valor2' data-default='10.5'></span>" +
                    "<a class='deleteRow'>X</a>" +
                    "<a class='addRow' data-for='subPericias'> + </a>" +
                    "<span class='sheetList' data-id='subPericias' data-minLength='0'>" +
                        "<span><br/>" + 
                            ">>><b class='sheetVariable' data-type='text' data-id='Pericia' data-default='Sub'></b>" +
                            "<a class='deleteRow'>X</a>" +
                        "</span>" +
                    "</span>" +
                "</p>" +
            "</div>" +
            "<a class='addRow' data-for='Pericias'>Mais pericias! Denovo denovo! Dinkie Winkie!</a>";
    
    this.css = "";
    
    this.$css = $('<style type="text/css" />').html(this.css);
    
    this.$html = $('<div id="sheetDiv" />').html(this.html);
    
    this.mainSheet = new Sheet(this.$html, this, true);
    
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
    
    this.setValues = function () {
        this.mainSheet.update(this.sheet.values);
        this.mainSheet.update$();
    };
    
    this.beforeProcess = function (sheet, instance, style) {
        // Run Before Process
    };
    
    this.afterProcess = function (sheet, instance, style) {
        var sumpericias = this.emulateBind(
            function () {
                var sum = 0;
                var pericias = this.pericias.list;
                for (var i = 0; i < pericias.length; i++) {
                    sum += pericias[i].fields['Valor'].value;
                }
                this.$sum.text(sum);
            }, {$sum : this.$html.find('#periciaSum'), pericias : this.mainSheet.fields['Pericias']}
        );

        this.mainSheet.fields['Pericias'].$visible.on('changedVariable', sumpericias);
        this.mainSheet.fields['Pericias'].$visible.on('changedRows', sumpericias);
        this.$html.on('updated$', sumpericias);
        sumpericias();
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
                this.style.changed = true;
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