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

    this.update$ = function () {
        if (this.value === null) this.setDefault();
        if (this.style.editing) {
            var $input = $('<select />');
            
            var $option;
            for (var i = 0; i < this.options.length; i++) {
                $option = $("<option />").attr('value', i).text(this.options[i]);
                if (i === this.value) {
                    $option.prop('selected', true);
                }
                $input.append($option);
            }
            

            $input.on('change', this.style.emulateBind(
                function () {
                    this.variable.storeValue(this.$input.val());
                    console.log(this.variable);
                    console.log(this.$input);
                }, {$input : $input, variable : this}
            ));

            this.$visible.empty().append($input);
        } else {
            this.$visible.text(this.options[this.value]);
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
        }
    };
    
    this.setDefault = function () {
        this.update(this.default);
    };

    this.update = function (value) {
        this.storeValue(value);
    };

    this.getObject = function () {
        return this.options[this.value];
    };
    
    this.seppuku = function () {
        this.$visible.remove();
        this.$visible = null;
        this.style = null;
        this.parent = null;
    };
}