/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingId
 * @param {Sheet} parent
 */
function Sheet_List ($visible, style, missingId, parent) {
    
    this.style = style;
    this.parent = parent;
    this.list = [];
    this.$list = [];
    /** @type jQuery */ this.$visible = $visible;
    
    this.default = this.$visible.is('[data-default]') ? JSON.parse(this.$visible.attr('data-default')) : [];
    
    if (!(this.default instanceof Array)) {
        this.default = [];
    }
    
    this.minLength = this.$visible.is('[data-minLength]') ? this.$visible.attr('data-minLength') : '0';
    if (isNaN(this.minLength)) {
        this.minLength = 0;
    } else {
        this.minLength = parseInt(this.minLength);
    }
    this.maxLength = this.$visible.is('[data-maxLength]') ? this.$visible.attr('data-maxLength') : '1000';
    if (isNaN(this.maxLength)) {
        this.maxLength = 1000;
    } else {
        this.maxLength = parseInt(this.maxLength);
    }
    
    this.id = this.$visible.is('[data-id]') ? this.$visible.attr('data-id') : 'List' + missingId;
    
    this.$html = $(this.$visible.html());
    this.$visible.empty();
    
    this.pool = [];
    
    console.log(this.id + ' - created - minrows : ' + this.minLength);
    
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
    
    this.$visible.on('changedVariable', this.style.emulateBind(function () {
        this.style.addChanged(this.variable);
    }, {style : this.style, variable : this}));
    
    this.addRow = function (initialState) {
        initialState = initialState === undefined ? {} : initialState;
        console.log(this.id + ' - adding row');
        if (this.maxLength < this.list.length + 1) {
            return false;
        }
        
        if (this.pool.length > 0) {
            var newRow = this.pool.pop();
            var $newRow = newRow.$visible;
            newRow.update(initialState);
        } else {
            var $newRow = this.$html.clone();
            var newRow = new Sheet ($newRow, this.style, false, this.parent);
            newRow.process();
            newRow.update(initialState);
        }
        var index = this.list.push(newRow);
        this.$list.push($newRow);
        var $deletes = $newRow.find('.deleteRow');
        console.log($deletes);
        $deletes.on('click', this.style.emulateBind(
            function () {
                this.list.deleteRow(this.row);
                console.log("CLICKED");
            }, {list : this, row : newRow}
        ));
//        if (this.style.editing) {
//            $deletes.show();
//        } else {
//            $deletes.hide();
//        }

        newRow.$visible.on('changedVariable', this.style.emulateBind(function () {
            this.style.addChanged(this.variable);
        }, {style : this.style, variable : newRow}));
        
        newRow.update$();
        this.$visible.append($newRow);
        
        
        
        console.log(this.id + ' changed rows');
        
        this.$visible.trigger('newRow', [newRow]);
        this.$visible.trigger('changedRows', [newRow]);
        this.parent.$visible.trigger('changedRows', [newRow]);
        this.style.$html.trigger('changedRows', [newRow]);
        
        this.style.addChanged(this);
        
        return true;
    };
    
    this.deleteRow = function (row) {
        var index = this.list.indexOf(row);
        if (index === -1) return false;
        this.removeRow(index);
    };
    
    this.removeRow = function (index) {
        var oldRow;
        var $oldRow;
        if (index >= 0 && index < this.list.length) {
            oldRow = this.list[index];
            $oldRow = this.$list[index];
            this.list.splice(index, 1);
            this.$list.splice(index, 1);
        }
        
        $oldRow.detach();
        $oldRow.off();
        this.pool.push(oldRow);
        
        
        this.$visible.trigger('removedRow', [oldRow]);
        this.$visible.trigger('changedRows', [oldRow]);
        this.parent.$visible.trigger('changedRows', [oldRow]);
        this.style.$html.trigger('changedRows', [oldRow]);
        this.style.addChanged(this);
    };
    
    this.getObject = function () {
        var obj = [];
        for (var i = 0; i < this.list.length; i++) {
            obj.push(this.list[i].getObject());
        }
        return obj;
    };
    
    this.getNewRow = function () {
        this.addRow();
        return this.list[this.list.length - 1];
    };
    
    this.update = function (obj) {
        if (obj === null) obj = this.default;
        while (this.list.length > obj.length) {
            this.removeRow(0);
        }
//        while (this.list.length < obj.length) {
//            this.addRow();
//        }
        for (var i = 0; i < obj.length; i++) {
            if (i >= this.list.length) {
                this.addRow(obj[i]);
            } else {
                this.list[i].update(obj[i]);
            }
            this.list[i].update(obj[i]);
        }
        
        this.update$();
    };
    
    this.update$ = function () {
        console.log(this.id + ' - updating $ - ' + this.minLength);
        while (this.list.length > this.maxLength) {
            this.removeRow(this.list.length - 1);
        }
        while (this.list.length < this.minLength) {
            this.addRow();
        }
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].update$();
        }
        
        if (this.style.editing) {
            this.$visible.find('.deleteRow').unhide();
        } else {
            this.$visible.find('.deleteRow').hide();
        }
        
        if (typeof this.style.nameField !== 'undefined') this.style.nameField.update$();
    };
    
    this.seppuku = function () {
        this.$html.remove();
        this.$visible.remove();
        this.$html = null;
        this.$visible = null;
        
        for (var i = 0; i < this.$list.length; i++) {
            this.list[i].seppuku();
            this.$list[i].remove();
        }
        this.$list = null;
        this.list = null;
        
        this.style = null;
        this.parent = null;
    };
    
    this.setDefault = function () {
        this.update(this.default);
    };
}