function SheetVariable ($object, baseSheet) {
    
    this.$object = $object.clone();
    this.$visible = $object;
    this.id = $object.attr('id');
    this.showOnly = $object.is('[showonly]');
    this.base = baseSheet;
    
    this.dataType = $object.is('[datatype]') ? $object.attr('datatype') : 'string';
    this.defaultPerType = {
        'string' : '',
        'integer' : 0,
        'real' : 0
    };
    this.default = $object.is('[default]') ? $object.attr('default') : this.defaultPerType[this.dataType];
    this.value = null;
    
    this.getValue = function () {
        return this.value;
    };
    
    this.getObject = function () {
        return this.getValue();
    };
    
    this.updateFromJSON = function (json) {
        this.storeValue(json);
    };
    
    this.storeValue = function (value) {
        if (typeof value === this.dataType) {
            this.value = value;
        } else {
            if (this.dataType === 'string') {
                if (typeof value.toString === 'function') {
                    this.storeValue(value.toString());
                } else {
                    this.storeValue(this.default);
                }
            } else if (this.dataType === 'integer') {
                if (!isNaN(value)) {
                    this.storeValue (parseInt(value));
                } else {
                    this.storeValue(this.default);
                }
            } else if (this.dataType === 'real') {
                if (!isNaN(value)) {
                    this.storeValue (parseFloat(value));
                } else {
                    this.storeValue(this.default);
                }
            }
        }
    };
    
    this.replaceSelf = function () {
        if (this.value === null) {
            this.storeValue(this.default);
        }
        /*var $clickable = $('<span />').text(this.getValue());
        $clickable.bind('click', function () {
            alert('1');
        });*/
        var $newVisible = $('<span />').text(this.getValue());
        var showmethegoodstuff = function () {
            console.log(this.base.getObject());
        };
        showmethegoodstuff = this.base.emulateBind(showmethegoodstuff, {base : this.base});
        $newVisible.bind('click', showmethegoodstuff);
        this.$visible.replaceWith($newVisible);
        this.$visible.remove();
        this.$visible = $newVisible;
    };
    
    this.safelyDestroy = function () {
        this.$visible.remove();
        this.$object.remove();
    };
    
}