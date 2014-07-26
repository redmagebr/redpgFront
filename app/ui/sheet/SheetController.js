function SheetController () {
    this.$listed = {};
    this.currentInstance = 0;
    this.currentStyle = 0;
    this.styles = {};
    this.$list;
    this.$import;
    this.$export;
    
    
    this.$html = $('<div />');
    this.$css = $('<style />');
    
    this.init = function () {
        this.$list = $('#sheetList').empty();
        this.$import = $('#sheetImportJSON');
        this.$export = $('#sheetExportJSON');
        
        $('#sheetSaveSuccess').hide();
        $('#sheetSaveError').hide();
        
        $('#sheetImportForm').hide();
        $('#sheetExportForm').hide();
        
        
        window.Style = {};
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#callSheetWindowBt').on('click', function () {
            window.app.ui.sheetui.controller.callSelf();
        });
        
        $('#saveButton').on('click', function () {
            window.app.ui.sheetui.controller.saveSheet();
        });
        
        $('#editButton').on('click', function () {
            window.app.ui.sheetui.controller.toggleEdit();
        });
        
        $('#importButton').on('click', function () {
            window.app.ui.sheetui.controller.openImport();
        });
        
        $('#exportButton').on('click', function () {
            window.app.ui.sheetui.controller.exportSheet();
        });
        
        $('#sheetImportForm').on('submit', function () {
            window.app.ui.sheetui.controller.importValues();
        });
        
        $('#reloadButton').on('click', function () {
            window.app.ui.sheetui.controller.reload(true, false);
        });
        
        $('#fullReloadButton').on('click', function () {
            window.app.ui.sheetui.controller.reload(true, true);
        });
    };
    
    this.toggleEdit = function () {
        this.styles[this.currentStyle].toggleEdit();
    };
    
    this.callSelf = function () {
        if (typeof this.$listed[this.currentInstance] === 'undefined') {
            window.app.ui.sheetui.callSelf();
        } else {
            window.app.ui.callRightWindow('sheetWindow');
        }
    };
    
    this.openSheet = function (sheetid, styleid) {
        if (sheetid === this.currentInstance) {
            window.app.ui.callRightWindow('sheetWindow');
            return;
        }
        
        if (typeof window.Style[styleid] === 'undefined') {
            window.app.ui.blockRight();
            var cbs = window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid);
                window.app.ui.unblockRight();
            }, {sheetid : sheetid, styleid : styleid});
            
            var cbe = function () {
                window.app.ui.unblockRight();
                window.app.ui.callRightWindow('sheetListWindow');
                window.app.ui.sheetui.$error.show();
            };
            
            window.app.sheetapp.loadStyle(styleid, cbs, cbe);
            return;
        }
        
        if (window.app.sheetdb.getSheet(sheetid) === null) {
            window.app.ui.blockRight();
            var cbs = window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid);
                window.app.ui.unblockRight();
            }, {sheetid : sheetid, styleid : styleid});
            
            var cbe = function () {
                window.app.ui.unblockRight();
                window.app.ui.callRightWindow('sheetListWindow');
                window.app.ui.sheetui.$error.show();
            };
            
            window.app.sheetapp.loadSheet(sheetid, cbs, cbe);
            return;
        }
        
        if (typeof this.$listed[sheetid] === 'undefined') {
            this.$listed[sheetid] = $('<a class="toggled" />');
            
            this.$listed[sheetid].on('click', window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid);
            }, {sheetid : sheetid, styleid : styleid}));
            
            this.$list.append(this.$listed[sheetid]);
        } else {
            this.$listed[sheetid].addClass('toggled');
        }
        
        if (typeof this.$listed[this.currentInstance] !== 'undefined') {
            this.$listed[this.currentInstance].removeClass('toggled');
        }
        
        var oldInstance = this.currentInstance;
        this.currentInstance = sheetid;
        this.updateCurrentButton();
        
        if (typeof this.styles[styleid] === 'undefined') {
            this.styles[styleid] = new window.Style[styleid](window.app.sheetdb.getSheet(sheetid));
            this.styles[styleid].process();
            this.styles[styleid].setValues();
            
            if (typeof this.styles[styleid].nameField !== 'undefined') {
                this.styles[styleid].nameField.$visible.on('changedVariable', function () {
                    window.app.ui.sheetui.controller.updateCurrentButton();
                });
            }
            
            if (typeof this.styles[styleid].mainSheet.fields['Jogador'] !== 'undefined') {
                this.styles[styleid].mainSheet.fields['Jogador'].$visible.on('changedVariable', function () {
                    window.app.ui.sheetui.controller.updateCurrentButton();
                });
            }
        } else {
            if (window.app.sheetdb.getSheet(oldInstance) !== null) {
                window.app.sheetdb.getSheet(oldInstance).values = this.styles[styleid].getObject();
            }
            this.styles[styleid].switchInstance(window.app.sheetdb.getSheet(sheetid));
        }
        
        if (this.currentStyle !== styleid) {
            this.$html.remove();
            this.$css.remove();
            
            this.$html = this.styles[styleid].get$();
            this.$css = this.styles[styleid].get$css();
            $('head').append(this.$css);
            $('#sheetViewer').empty().append(this.$html);
            this.currentStyle = styleid;
        } else {
            this.currentStyle = styleid;
        }
        
        window.app.ui.callRightWindow('sheetWindow');
        
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        
        if (sheet.editable) {
            $('#saveButton').show();
            $('#editButton').show();
            $('#importButton').show();
        } else {
            $('#saveButton').hide();
            $('#editButton').hide();
            $('#importButton').hide();
        }
    };
    
    this.updateCurrentButton = function () {
        this.$listed[this.currentInstance].removeClass('character nonplayer');
        
        if (typeof this.styles[this.currentStyle] !== 'undefined') {
            var style = this.styles[this.currentStyle];
            if (typeof style.mainSheet.fields['Jogador'] !== 'undefined') {
                var jogador = style.mainSheet.fields['Jogador'].getObject();
            }
        } else {
            var sheet = window.app.sheetdb.getSheet(this.currentInstance);
            if (typeof sheet.values['Jogador'] !== 'undefined') {
                var jogador = sheet.values['Jogador'];
            }
        }
        
        
        
        
        if ( jogador === 'NPC') {
            this.$listed[this.currentInstance].addClass('nonplayer');
        } else {
            this.$listed[this.currentInstance].addClass('character');
        }
        
        var name = window.app.sheetdb.getSheet(this.currentInstance).name;
        if (name.length > 10) {
            name = name.split(' ');
            if (name[0].length > 3) {
                name = name[0];
            } else {
                name = name[0] + name[1];
            }
            if (name.length > 10) {
                name = name.substring(0, 6) + '...';
            }
        }
        
        this.$listed[this.currentInstance].text(name);
    };
    
    this.closeSheet = function () {
        this.$listed[this.currentInstance].remove();
        delete this.$listed[this.currentInstance];
        
        this.$css.remove();
        this.$html.remove();
        this.$css = $('<style />');
        this.$html = $('<div />');
        
        this.currentStyle = 0;
        this.currentInstance = 0;
    };
    
    this.importValues = function () {
        try {
            var values = JSON.parse(this.$import.val());
        } catch (e) {
            $('#sheetImportError').show();
            return;
        }
        
        if (typeof values !== 'object') {
            $('#sheetImportError').show();
            return;
        }
        
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        sheet.values = values;
        
        var style = this.styles[this.currentStyle];
        style.setValues();
        
        $('#sheetImportForm').fadeOut();
    };
    
    this.openImport = function () {
        $('#sheetExportForm').finish().fadeOut();
        var $form = $('#sheetImportForm');
        if ($form.is(':visible')) {
            $form.finish().fadeOut();
            return;
        }
        
        $('#sheetImportError').hide();
        this.$import.val('');
        
        $form.finish().fadeIn();
    };
    
    this.exportSheet = function () {
        $('#sheetImportForm').finish().fadeOut();
        var $form = $('#sheetExportForm');
        if ($form.is(':visible')) {
            $form.finish().fadeOut();
            return;
        }
        
        var style = this.styles[this.currentStyle];
        
        this.$export.val(
            JSON.stringify(style.getObject())
        );
        
        $form.finish().fadeIn();
    };
    
    this.saveSheet = function () {
        window.app.ui.blockRight();
        
        var cbs = function () {
            $('#sheetSaveSuccess').finish().fadeIn().delay(1500).fadeOut();
            $('#sheetSaveError').finish().hide();
            window.app.ui.unblockRight();
        };
        var cbe = function () {
            $('#sheetSaveSuccess').finish().hide();
            $('#sheetSaveError').finish().fadeIn().delay(1500).fadeOut();
            window.app.ui.unblockRight();
        };
        
        var style = this.styles[this.currentStyle];
        
        var values = style.getObject();
        
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        
        var name = sheet.name;
        
        window.app.sheetapp.sendSheet(this.currentInstance, name, values, cbs, cbe);
    };
    
    this.reload = function (sheet, style) {
        var oldStyle = this.currentStyle;
        var oldInstance = this.currentInstance;
        if (style) {
            var sheet = window.app.sheetdb.getSheet(this.currentInstance);
            var style = this.styles[this.currentStyle];
            sheet.values = style.getObject();
            this.$css.remove();
            this.$html.remove();
            this.$css = $('<style />');
            this.$html = $('<div />');
            style.seppuku();
            delete this.styles[this.currentStyle];
            delete window.Style[this.currentStyle];
            
            this.currentStyle = 0;
        }
        
        if (sheet) {
            if (typeof this.$listed[sheet] !== 'undefined') {
                this.$listed[this.currentInstance].remove();
                delete this.$listed[sheet];
            }
            window.app.sheetdb.deleteSheet(this.currentInstance);
            this.currentInstance = 0;
        }
        
        this.openSheet(oldInstance, oldStyle);
    };
}