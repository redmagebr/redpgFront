// This won't work :(
/**
 * 
 * @param {jQuery} $list
 * @param {Style_00} style
 * @param {boolean} baseSheet
 * @returns {undefined}
 */
function PreSheet ($list, style, baseSheet) {
    this.sheet = new Sheet($list, style, baseSheet);
    this.sheet.process();
    
    var preId = 0;
    var field;
    this.orderedFields = [];
    
    for (var i in this.sheet.fields) {
        field = this.sheet.fields[i];
        if (field.$visible.attr('id') !== undefined) {
            field.$visible.attr("data-oldid", field.$visible.attr("id"));
        }
        field.$visible.attr("id", "Field"+preId);
        
        this.orderedFields.push(i);
    }
    
    this.clonedObjects = [];
    this.clone = function (obj) {
        var clone = {};
        var shallowCopy = ['style', 'parent', 'sheetFactory'];
        for(var i in obj) {
            if(typeof(obj[i])==="object" && obj[i] !== null && shallowCopy.indexOf(i) === -1) {
                if (obj[i] instanceof jQuery) {
                    clone[i] = obj[i];
                } else {
                    clone[i] = this.clone(obj[i]);
                }
            } else {
                clone[i] = obj[i];
            }
        }
        return clone;
    };
    
    this.newSheet = function() {
        var nSheet = this.clone(this.sheet);
        
        nSheet.$visible = nSheet.$visible.clone();
        
        for (var i = 0; i< this.orderedFields.length; i++) {
            var id = this.orderedFields[i];
            nSheet.fields[id].$visible = nSheet.$visible.find("#Field" + i);
            var $visible = nSheet.fields[id].$visible;
            $visible.removeAttr('id');
            if ($visible.attr('data-oldid') !== undefined) {
                $visible.attr('id', $visible.attr('data-oldid'));
                $visible.removeAttr('data-oldid');
            }
        }
        
        return nSheet;
    };
}