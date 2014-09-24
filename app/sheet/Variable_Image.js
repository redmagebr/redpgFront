/**
 * 
 * @param {jQuery} $visible
 * @param {Style} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Image ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;
    this.value = [null, null]; // id , link , name
   
    if (this.$visible.is('[data-id]') && this.$visible.attr("data-id").length > 0) {
        this.id = this.$visible.attr('data-id');
    } else {
        this.id = 'Variable' + missingid;
    }
    
    if (this.$visible.is('[data-empty]') && this.$visible.attr("data-empty").length > 0) {
        this.empty = this.$visible.attr('data-empty');
    } else {
        this.empty = null;
    }
   
    this.update$ = function () {
        if (this.style.editing) {
            var $select = $('<select />');
            
            var image;
            var $option;
            if (this.value[0] !== null && this.value[1] !== null) {
                $option = $('<option selected />').val(this.value[0]).text(this.value[1]);
            } else {
                $option = $('<option selected disabled class="language" data-langhtml="_SHEETCOMMONSPICKIMAGE_" />').text(window.app.ui.language.getLingo("_SHEETCOMMONSPICKIMAGE_"));
            }
            $select.append($option);
            for (var i = 0; i < window.app.imagedb.imagesOrdered.length; i++) {
                image = window.app.imagedb.imagesOrdered[i];
                $option = $('<option />').val(image.getUrl()).text(image.getName());
                $select.append($option);
            }
            
            if (i === 0) {
                $option = $('<option class="language" data-langhtml="_SHEETSLOADIMAGES_" disabled />').text(window.app.ui.language.getLingo("_SHEETSLOADIMAGES_"));
                $select.append($option);
            }
            
            $select.on('change', this.style.emulateBind(function () {
                this.variable.storeImage(this.$this.val(), this.$this.find(':selected').text());
            }, {variable : this , $this : $select}));
            
            this.$visible.empty().append($select);
        } else {
            if (this.value[0] !== null && this.value[1] !== null) {
                var image = new Image_Link();
                image.name = this.value[1];
                image.url = this.value[0];
                var $image = window.app.ui.imageui.$createImage(image);
                
                $image.css({
                    'line-height': '30px'
                });
                
                $image.find('.button').css({
                    width: '30px',
                    height: '30px',
                    'margin-right': '6px',
                    display: 'inline-block',
                    float: 'left'
                });
                window.app.ui.language.applyLanguageOn($image);
                this.$visible.empty().append($image);
            } else {
                this.$visible.text(this.empty);
            }
        }
    };
    
    this.storeImage = function (url, name) {
        this.storeValue([url, name]);
    };
   
    this.storeValue = function (value) {
        if (value === undefined || value === null || !value instanceof Array || value.length !== 2 || value[0] === null || value[0] === undefined || value[1] === undefined || value[1] === null) {
            return;
        }
        if (value[0] !== this.value[0] || value[1] !== this.value[1]) {
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