/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Boolean ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;

    if (this.$visible.is('[data-default]')) {
        this.default = this.$visible.attr('data-default') === "1";
    } else {
        this.default = false;
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
    
    if (this.$visible.is('[data-label]')) {
        this.label = this.$visible.attr('data-label') === '1';
        this.labelhtml = this.$visible.attr('data-labelhtml');
    } else {
        this.label = false;
    }

    this.update$ = function () {
        var $input = $('<input type="checkbox" ' + (this.value ? 'checked' : '') + ' />');

        if (!this.style.editing || !this.editable) {
            $input[0].disabled = 'disabled';
        }

        $input.on('change', this.style.emulateBind(
            function () {
                this.variable.storeValue(this.$input[0].checked);
            }, {$input : $input, variable : this}
        ));

        if (this.label) {
            var $label = $('<label />').text(this.labelhtml).prepend($input);
            this.$visible.empty().append($label);
        } else {
            this.$visible.empty().append($input);
        }
    };

    this.storeValue = function (value) {
        if (value !== false && value !== true) {
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