/**
 * 
 * @param {jQuery} $visible
 * @param {Style} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Sheet ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;
    this.value = [null, null]; // id , link , name
   
    if (this.$visible.is('[data-id]') && this.$visible.attr("data-id").length > 0) {
        this.id = this.$visible.attr('data-id');
    } else {
        this.id = 'Variable' + missingid;
    }
    
    if (this.$visible.is('[data-empty]') && this.$visible.attr("data-empty").length > 0) {
        this.empty = this.$visible.attr('data-empty');
    } else {
        this.empty = null;
    }
   
    this.update$ = function () {
        if (this.style.editing) {
            var $select = $('<select />');
            
            var image;
            var $option;
            if (this.value[0] !== null && this.value[1] !== null) {
                $option = $('<option selected />').val(this.value[0]).text(this.value[1]);
            } else {
                $option = $('<option selected disabled class="language" data-langhtml="_SHEETCOMMONSPICKSHEET_" />').text(window.app.ui.language.getLingo("_SHEETCOMMONSPICKSHEET_"));
            }
            $select.append($option);
            
            var sheet;
            var sheets = [];
            for (var id in window.app.sheetdb.sheets) {
                sheet = window.app.sheetdb.sheets[id];
                if (parseInt(sheet.gameid) === parseInt(this.style.sheet.gameid)) {
                    sheets.push(sheet);
                }
            }
            sheets.sort(function (a,b) {
                var na = a.name.toUpperCase();
                var nb = b.name.toUpperCase();
                if (na < nb) return -1;
                if (na > nb) return 1;
                return 0;
            });
            
            for (var i = 0; i < sheets.length; i++) {
                sheet = sheets[i];
                $option = $('<option />').val(sheet.id).text(sheet.name);
                $select.append($option);
            }
            
            if (i === 0) {
                $option = $('<option class="language" data-langhtml="_SHEETSLOADSHEETS_" disabled />').text(window.app.ui.language.getLingo("_SHEETSLOADSHEETS_"));
                $select.append($option);
            }
            
            $select.on('change', this.style.emulateBind(function () {
                this.variable.storeSheet(this.$this.val(), this.$this.find(':selected').text());
            }, {variable : this , $this : $select}));
            
            this.$visible.empty().append($select);
        } else {
            if (this.value[0] !== null && this.value[1] !== null) {
                this.$visible.empty().append(this.value[1]);
            } else {
                this.$visible.text(this.empty);
            }
        }
    };
    
    this.storeSheet = function (url, name) {
        this.storeValue([url, name]);
    };
   
    this.storeValue = function (value) {
        if (value === undefined || value === null || !value instanceof Array || value.length !== 2 || value[0] === null || value[0] === undefined || value[1] === undefined || value[1] === null) {
            return;
        }
        value[0] = parseInt(value[0]);
        if (value[0] !== this.value[0] || value[1] !== this.value[1]) {
            this.value = value;
            this.update$();
            this.$visible.trigger('changedVariable', [this, this.$visible]);
            this.parent.$visible.trigger('changedVariable', [this, this.$visible]);
            if (!this.parent.isRoot) {
                this.style.get$().trigger('changedVariable', [this, this.$visible]);
            }
        }
    };
   
    this.setDefault = function () {
        this.update(this.default);
    };
   
   this.update = function (value) {
       this.storeValue(value);
   };
   
   this.getObject = function () {
       return this.value;
   };
   
   this.seppuku = function () {
        this.$visible.remove();
        this.$visible = null;
        this.style = null;
        this.parent = null;
    };
}