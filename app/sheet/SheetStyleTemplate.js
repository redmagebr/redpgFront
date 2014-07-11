function SheetStyleTemplate (html) {
    this.html = html;
       
    this.css = "";
      
    this.$html = $('<div />').html(this.html);
    
    this.sheetHolder = new SheetList (this.$html, this);
    
    this.id = null;
    this.editable = false;
    
    this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
    };
    
    this.getVariable = function (id) {
        return this.sheetHolder.getVariable(id);
    };
    
    this.getValue = function (id) {
        return this.sheetHolder.getValue(id);
    };
    
    this.updateFromJSON = function (json) {
        this.id = json.id;
        this.editable = json.editable;
        this.sheetHolder.updateFromJSON(json.values);
    };
    
    this.getObject = function () {
        var object = this.sheetHolder.getObject();
        return object;
    };
    
    this.replaceSelf = function () {
        this.sheetHolder.replaceSelf();
    };
    
    this.get$html = function () {
        return this.sheetHolder.$visible;
    };
    
    this.safelyDestroy = function () {
        this.sheetHolder.safelyDestroy();
        this.$html.remove();
    };
}