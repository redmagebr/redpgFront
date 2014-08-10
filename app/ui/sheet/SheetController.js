function SheetController () {
    this.$listed = {};
    this.currentInstance = 0;
    this.currentStyle = 0;
    this.styles = {};
    this.$list;
    this.$import;
    this.$export;
    this.autoUpdate = false;
    this.opening = false;
    
    
    this.$cleanhtml = $('<div />');
    this.$cleancss = $('<style />');
    this.$html = this.$cleanhtml;
    this.$css = this.$cleancss;
    
    this.init = function () {
        this.$list = $('#sheetList').empty();
        this.$import = $('#sheetImportJSON');
        this.$export = $('#sheetExportJSON');
        this.$importForm = $('#sheetImportForm');
        this.$exportForm = $('#sheetExportForm');
        
        this.$viewer = $('#sheetViewer');
        
        $('#sheetSaveSuccess').hide();
        $('#sheetSaveError').hide();
        
        $('#sheetImportForm').hide();
        $('#sheetExportForm').hide();
        
        
        this.$closeButton = $('#closeButton');
        this.$importButton = $('#importButton');
        this.$saveButton = $('#saveButton');
        this.$editButton = $('#editButton');
        this.$exportButton = $('#exportButton');
        this.$automaticButton = $('#automaticButton');
        this.$reloadButton = $('#reloadButton');
        this.$fullReloadButton = $('#fullReloadButton');
        
        
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
        
        $('#closeButton').on('click', function () {
            window.app.ui.sheetui.controller.closeSheet();
        });
        
        $('#sheetImportForm').on('submit', function () {
            window.app.ui.sheetui.controller.importValues();
        });
        
        $('#reloadButton').on('click', function () {
            window.app.ui.sheetui.controller.reload(true, false);
        });
        
        $('#automaticButton').on('click', function () {
            window.app.ui.sheetui.controller.toggleAuto();
        });
        
        $('#fullReloadButton').on('click', function () {
            window.app.ui.sheetui.controller.reload(true, true);
        });
    };
    
    this.toggleEdit = function () {
        this.styles[this.currentStyle].toggleEdit();
        this.considerEditing();
    };
    
    this.considerEditing = function () {
        if (this.styles[this.currentStyle].editing) {
            this.$editButton.addClass('toggled');
        } else {
            this.$editButton.removeClass('toggled');
        }
    };
    
    this.callSelf = function () {
        if (typeof this.$listed[this.currentInstance] === 'undefined') {
            window.app.ui.sheetui.callSelf();
        } else {
            window.app.ui.callRightWindow('sheetWindow');
        }
    };
    
    this.openSheet = function (sheetid, styleid, gameid, important) {
        if (typeof important === 'undefined') important = true;
        if (sheetid === this.currentInstance) {
            window.app.ui.callRightWindow('sheetWindow');
            return;
        }
        
        if (window.app.sheetdb.getSheet(sheetid) === null) {
            window.app.ui.blockRight();
            var cbs = window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid, this.gameid, false);
                window.app.ui.unblockRight();
                window.app.ui.sheetui.controller.$viewer.trigger('loadedSheet', [this.sheetid]);
            }, {sheetid : sheetid, styleid : styleid, gameid : gameid});
            
            var cbe = function () {
                window.app.ui.unblockRight();
                window.app.ui.callRightWindow('sheetListWindow');
                window.app.ui.sheetui.$error.show();
            };
            
            window.app.sheetapp.loadSheet(sheetid, cbs, cbe);
        } else {
            styleid = window.app.sheetdb.getSheet(sheetid).system;
            gameid = window.app.sheetdb.getSheet(sheetid).gameid;
        }
        
        if (typeof window.Style[styleid] === 'undefined' && important) {
            window.app.ui.blockRight();
            var cbs = window.app.emulateBind(function () {
                window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid, this.gameid, false);
                window.app.ui.sheetui.controller.$viewer.trigger('loadedStyle', [this.styleid]);
                window.app.ui.unblockRight();
            }, {sheetid : sheetid, styleid : styleid, gameid : gameid});
            
            var cbe = function () {
                window.app.ui.unblockRight();
                window.app.ui.callRightWindow('sheetListWindow');
                window.app.ui.sheetui.$error.show();
            };
            
            window.app.sheetapp.loadStyle(styleid, cbs, cbe);
            return;
        }
        
        if (window.app.sheetdb.getSheet(sheetid) === null || typeof window.Style[styleid] === 'undefined') {
            return;
        }
        
        this.$importForm.hide();
        this.$exportForm.hide();
        this.$importButton.removeClass('toggled');
        this.$exportButton.removeClass('toggled');
        
        this.opening = true;
        
        var oldChanged = window.app.sheetdb.getSheet(sheetid).changed;
        
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
            
            this.styles[styleid].mainSheet.$visible.on('hasChanged', function () {
                window.app.ui.sheetui.controller.considerChanged();
            });
        } else {
            if (window.app.sheetdb.getSheet(oldInstance) !== null) {
                window.app.sheetdb.getSheet(oldInstance).values = this.styles[this.currentStyle].getObject();
            }
            this.styles[styleid].switchInstance(window.app.sheetdb.getSheet(sheetid));
        }
        
        if (this.currentStyle !== styleid) {
            this.$css.detach();
            this.$html.detach();
            this.$html = this.styles[styleid].get$();
            this.$css = this.styles[styleid].get$css();
            this.$viewer.empty().append(this.$html);
            $('head').append(this.$css);
            this.currentStyle = styleid;
        } else {
            this.currentStyle = styleid;
        }
        
        window.app.ui.callRightWindow('sheetWindow');
        
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        
        sheet.gameid = gameid;
        
        sheet.changed = oldChanged;
        
        if (sheet.editable) {
            this.$saveButton.show();
            this.$editButton.show();
            this.$importButton.show();
        } else {
            this.$saveButton.hide();
            this.$editButton.hide();
            this.$importButton.hide();
            if (this.styles[this.currentStyle].editing) {
                this.toggleEdit();
            }
        }
        this.opening = false;
        
        this.$reloadButton.show();
        this.$fullReloadButton.show();
        this.$automaticButton.show();
        this.$closeButton.show();
        this.$exportButton.show();
        this.considerChanged();
        this.considerEditing();
        this.updateCurrentButton();
    };
    
    this.considerChanged = function () {
        if (this.opening) {
            return;
        }
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        if (sheet.changed) {
            this.$saveButton.addClass('toggled');
        } else {
            this.$saveButton.removeClass('toggled');
        }
    };
    
    this.updateCurrentButton = function () {
        if (this.opening) {
            return;
        }
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
        
        this.$css.detach();
        this.$html.detach();
        
        window.app.sheetdb.deleteSheet(this.currentInstance);
        
        this.currentStyle = 0;
        this.currentInstance = 0;
        
        this.$reloadButton.hide();
        this.$fullReloadButton.hide();
        this.$automaticButton.hide();
        this.$closeButton.hide();
        this.$exportButton.hide();
        this.$editButton.hide();
        this.$importButton.hide();
        this.$saveButton.hide();
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
            this.$importButton.removeClass('toggled');
            return;
        }
        
        $('#sheetImportError').hide();
        this.$import.val('');
        
        $form.finish().fadeIn();
        this.$importButton.addClass('toggled');
        this.$exportButton.removeClass('toggled');
    };
    
    this.exportSheet = function () {
        $('#sheetImportForm').finish().fadeOut();
        this.$importButton.removeClass('toggled');
        var $form = $('#sheetExportForm');
        if ($form.is(':visible')) {
            $form.finish().fadeOut();
            this.$exportButton.removeClass('toggled');
            return;
        }
        
        var style = this.styles[this.currentStyle];
        
        this.$export.val(
            JSON.stringify(style.getObject())
        );
        
        $form.finish().fadeIn();
        this.$exportButton.addClass('toggled');
    };
    
    this.saveSheet = function () {
        window.app.ui.blockRight();
        
        var cbs = function () {
            $('#sheetSaveSuccess').finish().fadeIn().delay(1500).fadeOut();
            $('#sheetSaveError').finish().hide();
            window.app.ui.unblockRight();
            window.app.ui.sheetui.controller.considerWarning();
            var sheet = window.app.sheetdb.getSheet(window.app.ui.sheetui.controller.currentInstance);
            sheet.changed = false;
            window.app.ui.sheetui.controller.considerChanged();
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
            this.$css.detach();
            this.$html.detach();
            this.$css = this.$cleancss;
            this.$html = this.$cleanhtml;
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
    
    this.updateSpecificSheet = function (sheetid) {
        if (sheetid === this.currentInstance) {
            this.reload(true, false);
            return;
        }
        var sheet = window.app.sheetdb.getSheet(sheetid);
        if (sheet === null) {
            return;
        }
        window.app.ui.blockRight();
        var cbs = window.app.emulateBind(function () {
            window.app.ui.sheetui.controller.openSheet(this.sheetid, this.styleid);
            window.app.ui.unblockRight();
        }, {sheetid : sheetid, styleid : sheet.system});

        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.callRightWindow('sheetListWindow');
            window.app.ui.sheetui.$error.show();
        };

        window.app.sheetapp.loadSheet(sheetid, cbs, cbe);
    };
    
    this.toggleAuto = function (auto) {
        if (typeof auto === 'undefined') {
            var auto = !this.autoUpdate;
        }
        
        if (auto) {
            $('#automaticButton').addClass('toggled');
            this.autoUpdate = true;
        } else {
            this.autoUpdate = false;
            $('#automaticButton').removeClass('toggled');
        }
    };
    
    this.considerWarning = function () {
        if (window.app.ui.chat.cc.room === null) {
            return false;
        }
        var room = window.app.ui.chat.cc.room;
        var sheet = window.app.sheetdb.getSheet(this.currentInstance);
        if (room.gameid !== sheet.gameid) {
            return false;
        }
        
        var message = new Message();
        message.setOrigin(window.app.loginapp.user.id);
        message.roomid = window.app.ui.chat.cc.room.id;
        message.module = "sheetup";
        message.setSpecial("sheetid", this.currentInstance);
        
        window.app.ui.chat.cc.room.addLocal(message);
        window.app.chatapp.sendMessage(message);
    };
}