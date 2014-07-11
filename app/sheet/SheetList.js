function SheetList ($html, baseSheet) {
    this.$original = $html.clone();
    this.$html = [];
    this.fields = [];
    this.base = baseSheet;
    
    /**
     * Personal Values
     */
    if (this.$original.prop('tagName') !== 'LIST') {
        this.islist = false;
        this.id = this.base.id;
        this.min = 1;
        this.$visible = $('<div />');
        this.$visible.addClass('sheetContainer').attr('data-id', this.id);
        this.$target = null;
    } else {
        this.islist = true;
        this.id = this.$original.attr('id');
        
        if (this.$original.is('[min-length]') && !isNaN(this.$original.attr('min-length'))) {
            this.min = parseInt(this.$original.attr('min-length'));
        } else {
            this.min = 0;
        }
        
        
        if (this.$original.is('[tag-outer]')) {
            this.$visible = $('<'
                               + this.$original.attr('tag-outer')
                               + ' />');
        } else {
            this.$visible = $('<div />');
        }
        
        var oldoriginal = this.$original;
        if (this.$original.is('[tag-replacement]')) {
            this.$original = $('<'
                               + this.$original.attr('tag-replacement')
                               + ' />').html(this.$original.html());
        } else {
            this.$original = $('<div />').html(this.$original.html());
        }
        oldoriginal.remove();
    }
    
    
    // Place empty visible object
    var oldhtml = $html;
    $html.replaceWith(this.$visible);
    oldhtml.remove();
    
    // $visible is now an empty div or whatever it had to be.
    
    this.createRow = function () {
        var $newRow = this.$original.clone();
        this.$html.push($newRow);
        this.process($newRow);
        this.$visible.append($newRow);
    };
    
    this.destroyRow = function (index) {
        if (typeof this.$html[index] !== 'undefined') {
            this.$html[index].remove();
            this.fields.splice(index);
            this.$html.splice(index);
            if (this.fields.length < this.min) {
                this.createRow();
            }
        }
    };
    
    this.searchAndDestroyRow = function ($row) {
        var index = this.$html.indexOf($row);
        if (index !== -1) {
            this.destroyRow(index);
        }
    };
    
    this.updateFromJSON = function (json) {
        
        while (json.length > this.fields.length) {
            this.createRow();
        }
        while (json.length < this.fields.length) {
            this.destroyRow(this.fields.length - 1);
        }
        while (this.fields.length < this.min) {
            this.createRow();
        }
        var fieldIndex;
        for (var i = 0; i < json.length; i++) {
            for (fieldIndex in json[i]) {
                this.fields[i][fieldIndex].updateFromJSON(json[i][fieldIndex]);
            }
        }
    };
    
    this.getVariable = function (id) {
        // getValue assumes this is the very first list and that it isn't a real list.
        if (typeof this.fields[0][id] !== 'SheetVariable') {
            return null;
        } else {
            return this.fields[0][id];
        }
    };
    
    this.getList = function (id) {
        // getValue assumes this is the very first list and that it isn't a real list.
        if (typeof this.fields[0][id] !== 'SheetList') {
            return null;
        } else {
            return this.fields[0][id];
        }
    };
    
    this.getObject = function () {
        var me = [];
        var obj;
        var index;
        for (var i = 0; i < this.fields.length; i++) {
            obj = {};
            for (index in this.fields[i]) {
                obj[index] = this.fields[i][index].getObject();
            }
            me.push(obj);
        }
        return me;
    };
    
    this.process = function ($newRow) {
        var fields = {};
        var field;
        var search;
        var $found;
        var i;
        
        search = $newRow.find('list');
        for (i = 0; i < search.length; i++) {
            $found = $(search[i]);
            if ($found.parents('list').length <= 1) {
                // 0 parents only happens when list is inside the sheet.
                // 1 parent will happen when list is inside this list
                field = new SheetList($found, this.base);
                field.updateFromJSON([]);
                fields[field.id] = field;
            }
            // 2+ parents happen when the list is inside a list that is inside the list
            // have to go deeper...
        }
        
        
        
        search = $newRow.find('variable');
        for (i = 0; i < search.length; i++) {
            $found = $(search[i]);
            field = new SheetVariable($found, this.base);
            fields[field.id] = field;
        }
        
        
        /*
        console.log(this.base);
        
        $newRow.find('.deleteRowButton').on('click', this.base.emulateBind(function () {
            
        }, {
            list : this,
            $row : $newRow
        }));
        */
        
        
        this.fields.push(fields);
    };
    
    this.replaceSelf = function () {
        var index;
        for (var i in this.fields) {
            for (index in this.fields[i]) {
                this.fields[i][index].replaceSelf();
            }
        }
    };
    
    this.init = function () {
        while (this.fields.length < this.min) {
            this.createRow();
        }
        var index;
        for (var i = 0; i < this.fields.length; i++) {
            for (index in this.fields[i]) {
                if (typeof this.fields[i][index] === 'SheetList') {
                    this.fields[i][index].init();
                }
            }
        }
    };
    
    this.safelyDestroy = function () {
        var index;
        for (var i = 0; i < this.fields.length; i++) {
            for (index in this.fields[i]) {
                this.fields[i][index].safelyDestroy();
            }
            this.$html[i].remove();
        }
        this.$original.remove();
        this.$visible.remove();
    };
}