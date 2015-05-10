/**
 * 
 * @param {jQuery} $visible
 * @param {Style_00} style
 * @param {number} missingid
 * @param {Sheet} parent
 * @returns {Variable_Template}
 */
function Variable_Longtext ($visible, style, missingid, parent) {
    /** @type number */ this.id;
    this.$visible = $visible;
    this.style = style;
    this.parent = parent;

    if (this.$visible.is('[data-default]')) {
        this.default = this.$visible.attr('data-default');
    } else {
        this.default = "";
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
    
    if (this.$visible.is('[data-autoresize]')) {
        this.autoresize = this.$visible.attr('data-autoresize') === '1';
    } else {
        this.autoresize = false;
    }
    
    if (this.$visible.is('[data-paragraph]')) {
        this.paragraph = this.$visible.attr('data-paragraph') === '1';
    } else {
        this.paragraph = false;
    }
    
    if (this.$visible.is('[data-emptyparagraph]')) {
        this.emptyParagraph = this.$visible.attr('data-emptyparagraph') === '1';
    } else {
        this.emptyParagraph = true;
    }
    
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
    
    this.$input = $('<textarea spellcheck="false" />');
    
    if (this.placeholder !== null) {
        this.$input.attr("placeholder", this.placeholder);
    }
    
    this.$input.on('change', this.style.emulateBind(
        function () {
            this.variable.storeValue(this.$input.val());
        }, {$input : this.$input, variable : this}
    ));
    
    if (this.autoresize) {
        this.$input.css('overflow-y', 'hidden');
        this.$input.css('min-height', '0px');
        this.$input.on('keydown.resize keyup.resize click.resize', function () {
            this.style.height = 'auto';
            if (this.scrollHeight < 20) {
                this.style.height = '1em';
            } else { 
                this.style.height = this.scrollHeight + 'px';
            }
        });
        this.$input.trigger('keyup.resize', [false]);
    }
    
    this.hasInput = false;
    
    this.update$ = function () {
        this.$input.val(this.value);
        if (this.style.editing && this.editable) {
            if (!this.hasInput) {
                this.$visible.empty().append(this.$input);
                this.$input.trigger('keyup.resize', [false]);
                this.hasInput = true;
            }
        } else {
            this.$input.detach();
            if (!this.paragraph) {
                var html = $("<p />").text(this.value).html();
                html = html.replace(/\r\n|\r|\n/g,"<br />");
                this.$visible.html(html);
            } else {
                var $p;
                var lines = this.value.split(/\r\n|\r|\n/);
                this.$visible.empty();
                for (var i = 0; i < lines.length; i++) {
                    $p = $('<p />').text(lines[i].trim());
                    if ($p.text() === '') {
                        if (!this.emptyParagraph) {
                            continue;
                        }
                        $p.html('&nbsp;');
                    }
                    this.$visible.append($p);
                }
            }
            this.hasInput = false;
        }
    };

    this.storeValue = function (value) {
        if (value === null) {
            value = this.default;
        }
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