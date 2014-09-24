/**
 * 
 * @param {jQuery} $visible
 * @param {Style} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Template ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;
    this.value = null; // Should be the default value for the variable
   
    if (this.$visible.is('[data-id]') && this.$visible.attr("data-id").length > 0) {
        this.id = this.$visible.attr('data-id');
    } else {
        this.id = 'Variable' + missingid;
    }
   
    this.update$ = function () {
        // if this is editable, consider this.style.editing;
        if (this.style.editing) {
            var $input = $('<input type="text" />').val(this.value).on('change', this.style.emulateBind(function () {
                this.variable.storeValue(this.$this.val());
            }, {variable : this, $this : $input}));
            this.$visible.empty().append($input);
        } else {
            this.$visible.text(this.value);
        }
       // if making an input field, consider binding storeValue on change!
    };
   
    this.storeValue = function (value) {
        // Check if value is valid.
        // Consider converting the value in case it isn't, as in String -> Int
        // It's acceptable to not store an invalid value.
        // It might be even better to store the default value when there's an attempt to store an invalid value.
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