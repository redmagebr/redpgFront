/**
 * 
 * @param {jQuery} $list
 * @param {Style_00} style
 * @param {boolean} baseSheet
 * @returns {undefined}
 */
function Sheet ($list, style, baseSheet) {
    this.$visible = $list;
    this.style = style;
    this.isRoot = baseSheet;
    
    this.fields = {};
    
    this.listCount = 0;
    this.varCount = 0;
    
    this.getObject = function () {
        var obj = {};
        for (var idx in this.fields) {
            obj[idx] = this.fields[idx].getObject();
            if (obj[idx] === null) {
                delete obj[idx];
            }
        }
        return obj;
    };
    
    this.process = function () {
        var i;
        var search;
        var $found;
        var list;
        var variable;
        
        search = this.$visible.find('.sheetList');
        for (i = 0; i < search.length; i++) {
            $found = $(search[i]);
            if ($found.parents('.sheetList').length > 0) {
                // This list is inside another list, skip it
                continue;
            }
            list = new Sheet_List($found, this.style, this.listCount++, this);
            this.fields[list.id] = list;
        }
        
        
        search = this.$visible.find('.addRow');
        var listName;
        for (i = 0; i < search.length; i++) {
            $found = $(search[i]);
            if (!this.style.editing) {
                $found.hide();
            } else {
                $found.show();
            }
            if (!$found.is('[data-for]')) continue;
            listName = $found.attr('data-for');
            console.log("Found for " + listName);
            if (typeof this.fields[listName] !== 'undefined') {
                console.log("Entering");
                $found.on('click', this.style.emulateBind(
                    function () {
                        console.log(this.list);
                        this.list.addRow();
                    }, {list : this.fields[listName]}
                ));
            }
        }
        
        var varC;
        search = this.$visible.find('.sheetVariable');
        for (i = 0; i < search.length; i++) {
            $found = $(search[i]);
            if ($found.is('[data-type]') && typeof this.style.variableTypes[$found.attr('data-type')] !== 'undefined') {
                varC = this.style.variableTypes[$found.attr('data-type')];
            } else {
                varC = this.style.variableTypes['text'];
            }
            variable = new varC ($found, this.style, this.varCount++, this);
            this.fields[variable.id] = variable;
        }
        
        for (i = 0; i < this.fields.length; i++) {
            console.log("Updating " + this.fields[i].id + ' - go go go');
            this.fields[i].update$();
        }
    };
    
    this.setDefault = function () {
        for (var i in this.fields) {
            this.fields[i].setDefault();
        }
    };
    
    this.update = function (obj) {
        for (var i in obj) {
            if (typeof this.fields[i] !== 'undefined') {
                this.fields[i].update(obj[i]);
            }
        }
    };
    
    this.update$ = function () {
        for (var i in this.fields) {
            this.fields[i].update$();
        }
        
        
        if (this.style.editing) {
            this.$visible.find('.addRow').show();
            this.$visible.find('.editOnly').show();
            this.$visible.find('.viewOnly').hide();
        } else {
            this.$visible.find('.addRow').hide();
            this.$visible.find('.editOnly').hide();
            this.$visible.find('.viewOnly').show();
        }
        
        if (!this.style.sheet.editable) {
            this.$visible.find('.editableOnly').hide();
        } else {
            this.$visible.find('.editableOnly').show();
        }
        
        
        this.$visible.trigger('updated$', [this]);
    };
    
    this.get$ = function () {
        return this.$visible;
    };
    
    this.seppuku = function () {
        this.$visible.remove();
        this.$visible = null;
        this.style = null;
        for (var i in this.fields) {
            this.fields[i].seppuku();
        }
        this.fields = null;
    };
}