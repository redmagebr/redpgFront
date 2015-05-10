/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Integer ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;

    if (this.$visible.is('[data-default]')) {
        this.default = this.$visible.attr('data-default');
    } else {
        this.default = "0";
    }
    
    if (isNaN(this.default, 10)) {
        this.default = 0;
    } else {
        this.default = parseInt(this.default);
    }
    
    this.value = null;

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
    
    if (this.$visible.is('[data-max]')) {
        this.max = this.$visible.attr('data-max');
        if (isNaN(this.max, 10)) {
            this.max = null;
        } else {
            this.max = parseInt(this.max);
        }
    } else {
        this.max = null;
    }
    
    if (this.$visible.is('[data-min]')) {
        this.min = this.$visible.attr('data-min');
        if (isNaN(this.max, 10)) {
            this.min = null;
        } else {
            this.min = parseInt(this.min);
        }
    } else {
        this.min = null;
    }
    
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
    
    this.$input = $('<input type="text" />');
    
    if (this.placeholder !== null) {
        this.$input.attr("placeholder", this.placeholder);
    }
    
    this.$input.on('change', this.style.emulateBind(
        function () {
            this.variable.storeValue(this.$input.val());
            console.log(this.variable);
            console.log(this.$input);
        }, {$input : this.$input, variable : this}
    ));
    
    this.hasInput = false;
    
    this.update$ = function () {
        if (this.value === null) this.update(this.default);
        this.$input.val(this.value);
        if (this.style.editing) {
            if (!this.hasInput) {
                this.$visible.empty().append(this.$input);
                this.hasInput = true;
            }
        } else {
            this.$input.detach();
            this.$visible.text(this.value);
            this.hasInput = false;
        }
    };

    this.storeValue = function (value) {
        if (value === null || isNaN(value, 10)) {
            value = this.value;
        } else {
            value = parseInt(value,10);
        }
        if (this.min !== null & this.min > value) {
            value = this.min;
        }
        if (this.max !== null & this.max < value) {
            value = this.max;
        }
        if (value !== this.value) {
            this.value = value;
            this.$visible.trigger('changedVariable', [this, this.$visible]);
            this.parent.$visible.trigger('changedVariable', [this, this.$visible]);
            if (!this.parent.isRoot) {
                this.style.get$().trigger('changedVariable', [this, this.$visible]);
            }
            this.update$();
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