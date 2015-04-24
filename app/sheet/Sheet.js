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
    
    this.changedCallbacks = [];
    
    this.onChange = function (v) {
        if (typeof v === 'function') {
            this.changedCallbacks.push(v);
        } else {
            for (var i = 0; i < this.changedCallbacks.length; i++) {
                this.changedCallbacks[i](v, this);
            }
        }
    };
    
    /**
     * Gets the Sheet Element for id.
     * @param {string} id
     * @returns {Variable_Template|Sheet_List}
     */
    this.getField = function (id) {
        if (this.fields[id] === undefined) {
            return null;
        }
        return this.fields[id];
    };
    
    /**
     * Returns an Object representing the whole sheet
     * @returns {Object}
     */
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
    
    /**
     * Processes the HTML to find every sheet element.
     * @returns {undefined}
     */
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
                $found.unhide();
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
            variable.$visible.on('changedVariable', this.style.emulateBind(function () {
                this.style.addChanged(this.variable);
            }, {style : this.style, variable : variable}));
            this.fields[variable.id] = variable;
        }
        
        this.update$();
        
//        for (i = 0; i < this.fields.length; i++) {
//            console.log("Updating " + this.fields[i].id + ' - go go go');
//            this.fields[i].update$();
//        }
    };
    
    /**
     * Sets every field to its default values
     * @returns {undefined}
     */
    this.setDefault = function () {
        for (var i in this.fields) {
            this.fields[i].setDefault();
        }
    };
    
    /**
     * Updates sheet from JSON
     * @param {JSON} obj
     * @returns {undefined}
     */
    this.update = function (obj) {
        for (var i in obj) {
            if (typeof this.fields[i] !== 'undefined') {
                this.fields[i].update(obj[i]);
            }
        }
    };
    
    /**
     * Updates every $dom element
     * @returns {undefined}
     */
    this.update$ = function () {
        for (var i in this.fields) {
            this.fields[i].update$();
        }
        
        
        if (this.style.editing) {
            this.$visible.find('.addRow').unhide();
            this.$visible.find('.editOnly').unhide();
            this.$visible.find('.viewOnly').hide();
        } else {
            this.$visible.find('.addRow').hide();
            this.$visible.find('.editOnly').hide();
            this.$visible.find('.viewOnly').unhide();
        }
        
        if (!this.style.sheet.editable) {
            this.$visible.find('.editableOnly').hide();
        } else {
            this.$visible.find('.editableOnly').unhide();
        }
        
        
        this.$visible.trigger('updated$', [this]);
    };
    
    /**
     * Gets the $dom for the whole sheet.
     * @returns {jQuery}
     */
    this.get$ = function () {
        return this.$visible;
    };
    
    /**
     * Destroys the whole sheet
     * @returns {undefined}
     */
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