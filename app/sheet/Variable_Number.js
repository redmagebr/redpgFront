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
        }, {$input : this.$input, variable : this}
    ));
    
    this.hasInput = false;
    
    this.update$ = function () {
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
        if (typeof value === 'string') {
            value = value.replace(/,/g, '.');
        }
        if (value === null || !(!isNaN(parseFloat(value)) && isFinite(value))) {
            value = this.value;
        } else {
            value = parseFloat(value);
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