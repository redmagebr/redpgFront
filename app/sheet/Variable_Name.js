/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Name ($visible, style, missingid, parent) {
    this.id = "SheetName";
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;

    /** Replace with Lingo **/
    this.default = "Undefined";
    this.placeholder = "Nome do personagem";
    
    this.value = this.default;
    
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
    
    this.update$ = function () {
        if (this.style.editing) {
            var $input = $('<input type="text" />');
            $input.val(this.value);
            
            if (this.placeholder !== null) {
                $input.attr("placeholder", this.placeholder);
            }

            $input.on('change', this.style.emulateBind(
                function () {
                    this.variable.storeValue(this.$input.val());
                }, {$input : $input, variable : this}
            ));

            this.$visible.empty().append($input);
        } else {
            this.$visible.text(this.value);
        }
    };

    this.storeValue = function (value) {
        var valid = new Validator();
        if (value === null || !valid.validate(value, 'name')) {
            value = this.default;
        }
        if (value !== this.value) {
            this.value = value;
            this.style.sheet.name = value;
            this.update$();
            this.$visible.trigger('changedVariable', [this, this.$visible]);
            this.parent.$visible.trigger('changedVariable', [this, this.$visible]);
            if (!this.parent.isRoot) {
                this.style.get$().trigger('changedVariable', [this, this.$visible]);
            }
        }
    };
    
    this.setDefault = function () {
        this.update();
    };

    this.update = function () {
        this.storeValue(this.style.sheet.name);
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