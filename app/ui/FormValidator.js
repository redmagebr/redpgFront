/**
 * Creates a validator around $form.
 * Meant to be created and thrown away when no longer needed.
 * 
 * Inputs that require validation need to contain the class "validate".
 * Attribute data-validationtype sets the kind of validation it uses.
 * Valid types:
 * "shortname" : A-Za-z0-9, maximum of 10 characters, minimum of 3.
 * "login" : a-z0-9, doesn't start with numbers, maximum of 10 characters, minimum of 3.
 * "name" : A-Za-z0-9, Space and portuguese characters, maximum of 30 characters.
 * "longname" : same as name, but goes to 200 characters.
 * "notnull" : anything that isn't blank.
 * 
 * @param {jQuery} $form
 * @constructor
 * @returns {FormValidator}
 */
function FormValidator ($form) {
    this.$errors = [];
    this.validated = true;
    this.validator = new Validator();
    
    this.validate = function (object) {
        var $object = $(object);
        var val = $object.val();
        var valtype = $object.attr('data-validationtype');
        if (!this.validator.validate(val, valtype)) {
            this.$errors.push($object);
            this.validated = false;
        }
        console.log(val + ' - ' + valtype);
    };
    
    var $list = $form.find('.validate');
    
    for (var i = 0; i < $list.length; i++) {
        this.validate($list[i]);
    }
}