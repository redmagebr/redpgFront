/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Varchar ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;

    if (this.$visible.is('[data-default]')) {
        this.default = this.$visible.attr('data-default');
    } else {
        this.default = "";
    }
    
    this.value = this.default;

    if (this.$visible.is('[data-id]') && this.$visible.attr("data-id").length > 0) {
        this.id = this.$visible.attr('data-id');
    } else {
        this.id = 'Variable' + missingid;
    }
    
    if (this.$visible.is('[data-placeholder]')) {
        this.placeholder = this.$visible.attr('data-placeholder');
    } else {
        this.placeholder = null;
    }
    
    if (this.$visible.is('[data-editable]')) {
        this.editable = this.$visible.attr('data-editable') === '1';
    } else {
        this.editable = true;
    }

    this.update$ = function () {
        if (this.style.editing && this.editable) {
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
        if (value === null) {
            value = this.default;
        }
        if (value !== this.value) {
            this.value = value;
            this.update$();
            console.log("TRIGGERING");
            this.$visible.trigger('changedVariable', [this]);
            this.parent.$visible.trigger('changedVariable', [this]);
            if (!this.parent.isRoot) {
                this.style.get$().trigger('changedVariable', [this]);
            }
            console.log("TRIGGERED");
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