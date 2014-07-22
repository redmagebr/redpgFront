/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
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
   
    this.id = 'Variable' + missingid; // if the variable has an id field, use it instead for posterity
   
    this.update$ = function () {
       // if this is editable, consider this.style.editing;
       this.$visible.text(this.value);
       // if making an input field, consider binding storeValue on change!
    };
   
    this.storeValue = function (value) {
        // Check if value is valid.
        // Consider converting the value in case it isn't, as in String -> Int
        // It's acceptable to not store an invalid value.
        // It's even better to store the default value when an invalid value is attempted.
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