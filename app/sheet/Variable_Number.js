/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Number ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;

    if (this.$visible.is('[data-default]')) {
        this.default = this.$visible.attr('data-default');
    } else {
        this.default = "0";
    }
    
    if (isNaN(this.default)) {
        this.default = 0;
    } else {
        this.default = parseFloat(this.default);
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
        if (value === null || isNaN(value, 10)) {
            value = this.value;
        } else {
            value = parseFloat(value, 10);
        }
        if (value !== this.value) {
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