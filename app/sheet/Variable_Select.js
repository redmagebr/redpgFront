/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Select ($visible, style, missingid, parent) {
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
        this.default = parseInt(this.default);
    }
    
    this.value = null;

    if (this.$visible.is('[data-id]') && this.$visible.attr("data-id").length > 0) {
        this.id = this.$visible.attr('data-id');
    } else {
        this.id = 'Variable' + missingid;
    }
    
    if (this.$visible.is('[data-options]')) {
        this.options = this.$visible.attr('data-options').split(';');
    } else {
        this.options = ['Undefined'];
    }

    this.changedCallbacks = [];
    
    this.onChange = function (v) {
        if (typeof v === 'function') {
            this.changedCallbacks.push(v);
        } else {
            for (var i = 0; i < this.changedCallbacks.length; i++) {
                this.changedCallbacks[i](v);
            }
        }
    };
    
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
    
    this.$input = $('<select />');
    var $option;
    for (var i = 0; i < this.options.length; i++) {
        $option = $("<option />").attr('value', i).text(this.options[i]);
        if (i === this.value) {
            $option.prop('selected', true);
        }
        this.$input.append($option);
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
        if (this.value === null) this.setDefault();
        this.$input.val(this.value);
        if (this.style.editing) {
            if (!this.hasInput) {
                this.$visible.empty().append(this.$input);
                this.hasInput = true;
            }
        } else {
            this.$input.detach();
            this.$visible.text(this.options[this.value]);
            this.hasInput = false;
        }
    };

    this.storeValue = function (value) {
        if (value !== null && !isNaN(value, 10)) {
            value = parseInt(value);
        }
        if (typeof this.options[value] === 'undefined') {
            value = this.value;
        }
        if (value !== this.value) {
            this.value = value;
            this.$visible.trigger('changedVariable', [this]);
            this.parent.$visible.trigger('changedVariable', [this]);
            if (!this.parent.isRoot) {
                this.style.get$().trigger('changedVariable', [this]);
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
    
    this.getOption = function () {
        return this.options[this.value];
    };
    
    this.seppuku = function () {
        this.$visible.remove();
        this.$visible = null;
        this.style = null;
        this.parent = null;
    };
}