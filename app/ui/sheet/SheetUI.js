function SheetUI() {
    this.$openBt;
    this.$error;
    this.$list;
    this.$formCreation;
    this.$formPermission;
    
    this.controller = new SheetController();
    
    this.creating = 0;
    this.currentFolder = -1;
    
    this.init = function () {
        this.$openBt = $('#callSheetsWindowBt');
        this.$error = $('#sheetListLoadError').hide();
        this.$list = $('#sheetListDiv').hide();
        this.$formCreation = $('#sheetCreationForm').hide();
        this.$formPermission = $('#sheetPermissionForm').hide();
        
        this.setBindings();
        
        this.controller.init();
    };
    
    this.setBindings = function () {
        this.$openBt.on('click', function () {
            window.app.ui.sheetui.callSelf();
        });
        
        $('#sheetCreationForm').on('submit', function () {
            window.app.ui.sheetui.sendCreation();
        });
        
        this.$formPermission.on('submit', function () {
            window.app.ui.sheetui.sendPrivileges();
        });
    };
    
    this.$createFolder = function (name) {
        var folder = {
            $p : $('<p class="folder" />'),
            $div : $('<div class="folder" />'),
            name : name
        };
        
        folder.$p.append("<a class='icon folderIcon'></a>");
        
        if (name === '') {
            folder.$p.append("<span class='language' data-langhtml='_SHEETSNOFOLDER_'></span>");
        } else {
            folder.$p.append($('<span />').text(name));
        }
        
        folder.$p.on('click', function () {
            $(this).toggleClass('open');
        });
        
        return folder;
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('sheetListWindow');
        window.app.ui.blockRight();
        this.$error.finish().fadeOut();
        this.$list.hide();
        this.$formCreation.hide();
        this.$formPermission.hide();

        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.finish().fadeIn();
        };
        
        var cbs = function (data) {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.finish().fadeOut();
            window.app.ui.sheetui.$list.show();
            window.app.ui.sheetui.controller.$viewer.trigger('loadedSheet');
            window.app.ui.sheetui.fillList(data);
        };

        window.app.sheetapp.callList(cbs, cbe);
    };
    
    this.fillList = function () {
        var $div;
        var $h1;
        var $p;
        var $del;
        var $fold;
        var $priv;
        var $safe;
        var $name;
        var gameList = window.app.gamedb.gamelist;
        var game = window.app.gamedb.getGame(10);
        var sheet = window.app.sheetdb.getSheet(10);
        var folders;
        var folderList;
        var k;
        this.$list.empty();
        for (var i = 0; i < gameList.length; i++) {
            game = window.app.gamedb.getGame(gameList[i]);
            $div = $('<div />');
            $h1 = $("<h2 onclick='$(this).parent().toggleClass(\"open\");' class='language' data-langtitle='_SHEETSGAMETITLE_' />").text(game.name);
            $div.append($h1);
            
            if (game.id === this.creating) {
                $div.addClass("open");
            }
            
            folders = {};
            folderList = [];
            
            for (var j = 0; j < game.sheets.length; j++) {
                sheet = window.app.sheetdb.getSheet(game.sheets[j]);
                $p = $('<p class="sheet" />');
                this.hoverize($p, sheet);
                $div.append($p);
                
                if (sheet.deletar || game.deleteSheet) {
                    $del = $("<a class='floatRight textButton language' data-langhtml='_SHEETSDELETE_' />");
                    $del.on('click', window.app.emulateBind(function () {
                        window.app.ui.sheetui.callDelete(this.id, this.name, this.gameid);
                    }, {id : sheet.id, name : sheet.name, gameid : game.id}));
                    $p.append($del);
                }
                
                if (sheet.promote || game.promote) {
                    $priv = $("<a class='floatRight textButton language' data-langhtml='_SHEETSPRIVILEGES_'>Permissoes</a>");
                    $priv.on('click', window.app.emulateBind(function () {
                        window.app.ui.sheetui.callPrivileges(this.id, this.name, this.gameid);
                    }, {id : sheet.id, name : sheet.name, gameid : game.id}));
                    $p.append($priv);
                }
                
                if (sheet.editable || game.editSheet) {
                    $fold = $('<a class="floatRight textButton language" data-langhtml="_SHEETSSETFOLDER_" />');
                    $fold.on("click", window.app.emulateBind(function () {
                        window.app.ui.sheetui.changeFolder(this.id, this.name, this.gameid);
                    }, {id : sheet.id, name : sheet.name, gameid : game.id}));
                    $p.append($fold);
                }
                
                if (sheet.segura) {
                    $safe = $("<a class='safeIcon icon language' data-langtitle='_SHEETSAFE_'></a>");
                } else {
                    $safe = $("<a class='unsafeIcon icon language' data-langtitle='_SHEETUNSAFE_'></a>");
                }
                $p.append($safe);
                
                $name = $("<a class='sheetName language' data-langtitle='_SHEETSNAMETITLE_' />").text(sheet.name);
                $name.on('click', window.app.emulateBind(function () {
                    window.app.ui.sheetui.creating = this.gameid;
                    window.app.ui.sheetui.openSheet(this.id, this.idstyle, this.gameid);
                }, {id : sheet.id, idstyle : sheet.system, gameid : game.id}));
                $p.append($name);
                
                if (folders[sheet.folder] === undefined) {
                    folders[sheet.folder] = this.$createFolder(sheet.folder);
                    folderList.push(sheet.folder);
                }
                folders[sheet.folder].$div.append($p);
            }
            
            if (game.sheets.length === 0) {
                $p = $('<p class="language" data-langhtml="_SHEETSNOSHEETS_" />');
                $div.append($p);
            } else {
                folderList.sort(function (a, b) {
                    a = a.toUpperCase();
                    b = b.toUpperCase();
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                });
                for (k = 0; k < folderList.length; k++) {
                    $div.append(folders[folderList[k]].$p);
                    $div.append(folders[folderList[k]].$div);
                    if (folders[folderList[k]].name === this.currentFolder) {
                        folders[folderList[k]].$p.addClass("open");
                    }
                }
            }
            
            if (game.createSheet) {
                $p = $("<p class='createP' />");
                $name = $("<a class='textLink language' data-langhtml='_SHEETSADD_' />");
                $p.append($name);
                
                $name.on('click', window.app.emulateBind(function () {
                    window.app.ui.sheetui.callCreation(this.id, this.gamename);
                }, {id : game.id, gamename : game.name}));

                $div.append($p);
            }
            
            this.$list.append($div);
        }
        if (gameList.length === 0) {
            $p = $("<p class='language' data-langhtml='_SHEETSNOGAMES_' />");
            this.$list.append($p);
        }
        
        window.app.ui.language.applyLanguageOn(this.$list);
        
        this.creating = 0;
    };
    
    this.changeFolder = function (sheetid, name, gameid) {
        var folder = window.prompt(window.app.ui.language.getLingoOn("_SHEETCHANGEFOLDER_", name));
        window.app.ui.blockRight();
        var cbs = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        this.creating = gameid;
        this.currentFolder = window.app.sheetdb.getSheet(sheetid).folder;
        
        window.app.sheetapp.sendFolder(sheetid, folder, cbs, cbe);
    };
    
    this.callDelete = function (sheetid, nome, gameid) {
        if (!confirm("Deletar " + nome + "? Certeza?")) {
            return false;
        }
        this.creating = gameid;
        window.app.ui.blockRight();
        
        var cbs = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        window.app.sheetapp.sendDelete(sheetid, cbs, cbe);
    };
    
    this.callPrivileges = function (sheetid, name, gameid) {
        window.app.ui.blockRight();
        this.$error.hide();
        this.$list.hide();
        
        this.creating = gameid;
        this.creatingsheet = sheetid;
        this.creatingname = name;
        
        var cbs = function (data) {
            window.app.ui.sheetui.fillPrivileges(data);
            window.app.ui.sheetui.$formPermission.show();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.sheetui.$error.show();
            window.app.ui.unblockRight();
        };
        
        window.app.sheetapp.callPermissions(sheetid, cbs, cbe);
    };
    
    this.fillPrivileges = function (data) {
        $('#sheetPermissionIdSheet').val(this.creatingsheet);
        $('#sheetPermissionsSheetName').text(this.creatingname);
        var $list = $('#sheetPermissionsList').empty();
        
        var $p;
        
        
        data.sort(function (a, b) {
            var nicka = a.nickname.toUpperCase() + '#' + a.nicknamesufix;
            var nickb = b.nickname.toUpperCase() + '#' + b.nicknamesufix;
            if (nicka < nickb) {
                return -1;
            }
            if (nicka > nickb) {
                return 1;
            }
            return 0;
        });
        
        for (var i = 0; i < data.length; i++) {
            $p = $('<p class="permission" />');
            $p.append(
                $('<input type="hidden" class="idAccount" value="' + data[i].userid + '" />')
            );
            $p.append(
                $('<span />').text(data[i].nickname + '#' + data[i].nicknamesufix)
            );
    
            $p.append(
                $('<label for="promperm' + data[i].userid + '" class="language" data-langtitle="_SHEETPERMISSIONPROMEXP_" data-langhtml="_SHEETPERMISSIONPROM_" />')
            );
    
            $p.append(
                $('<input id="promperm' + data[i].userid + '" class="promPerm language"  data-langtitle="_SHEETPERMISSIONPROMEXP_" type="checkbox" ' + (data[i].promote ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="delperm' + data[i].userid + '" class="language" data-langhtml="_SHEETPERMISSIONDELETE_" />')
            );
    
            $p.append(
                $('<input id="delperm' + data[i].userid + '" class="deletePerm" type="checkbox" ' + (data[i].deletar ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="editperm' + data[i].userid + '" class="language" data-langhtml="_SHEETPERMISSIONEDIT_" />')
            );
    
            $p.append(
                $('<input id="editperm' + data[i].userid + '" class="editPerm" type="checkbox" ' + (data[i].editar ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="viewperm' + data[i].userid + '" class="language" data-langhtml="_SHEETPERMISSIONVIEW_" />')
            );
    
            $p.append(
                $('<input id="viewperm' + data[i].userid + '" class="viewPerm" type="checkbox" ' + (data[i].visualizar ? 'checked' : '') + ' />')
            );
            
            $list.append($p);
        }
        
        window.app.ui.language.applyLanguageOn($list);
    };
    
    this.sendPrivileges = function () {
        window.app.ui.blockRight();
        
        var cbs = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.callSelf();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        var $permissions = this.$formPermission.find('p.permission');
        var $permission;
        
        var permissionArray = [];
        var permission;
        
        for (var i = 0; i < $permissions.length; i++) {
            $permission = $($permissions[i]);
            permission = {
                userid : $($permission.find('.idAccount')[0]).val(),
                deletar : $permission.find('.deletePerm')[0].checked,
                editar : $permission.find('.editPerm')[0].checked,
                visualizar : $permission.find('.viewPerm')[0].checked,
                promote : $permission.find('.promPerm')[0].checked
            };
            
            permissionArray.push(permission);
        }
        
        window.app.sheetapp.sendPrivileges (this.creatingsheet, permissionArray, cbs, cbe);
    };
    
    this.callCreation = function (gameid, gamename) {
        this.$list.hide();
        this.$formCreation.hide();
        this.$error.hide();
        this.$formPermission.hide();
        
        window.app.ui.blockRight();
        
        var cbs = window.app.emulateBind(function (data) {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.fillCreation(data, this.gameid, this.gamename);
            window.app.ui.sheetui.$formCreation.fadeIn();
        }, {gameid : gameid, gamename : gamename}
        );
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        window.app.sheetapp.callCreation(gameid, cbs, cbe);
    };
    
    this.fillCreation = function (data, gameid, gamename) {
        $('#sheetCreationGameName').text(gamename);
        this.creating = gameid;
        
        var $select = $('#sheetCreationGame').empty();
        var $option;
        var name;
        
        for (var i = 0; i < data.length; i++) {
            name = data[i].name;
            if (name.charAt(0) === '_' && window.app.ui.language.getLingo(name) !== name) {
                name = window.app.ui.language.getLingo(name);
            }
            $option = $('<option value="' + data[i].id + '" />').text(name);
            $select.append($option);
        }
    };
    
    this.sendCreation = function () {
        var sheetname = $('#sheetCreationName').val();
        var idstyle = parseInt($('#sheetCreationGame').val());
        var public = $('#sheetCreationPublic').prop('checked');
        
        window.app.ui.blockRight();
        
        var cbs = function () {
            window.app.ui.sheetui.callSelf();
            window.app.ui.unblockRight();
            $('#sheetCreationName').val('');
            $('#sheetCreationPublic').prop('checked', false);
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.show();
        };
        
        window.app.sheetapp.sendCreation (this.creating, sheetname, idstyle, public, cbs, cbe);
    };
    
    this.updateConfig = function () {
        
    };
    
    this.openSheet = function (sheetid, styleid, gameid) {
        this.controller.openSheet (sheetid, styleid, gameid);
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @param {Sheet_Instance} sheet
     * @returns {undefined}
     */
    this.hoverize = function ($dom, sheet) {
        $dom.on('mouseenter', window.app.emulateBind(function (e) {
            window.app.ui.addonui.$handle.text(sheet.name);
            var $ul = window.app.ui.addonui.$ul.empty();
            $ul.append(
                $('<li />').append('<strong>' + window.app.ui.language.getLingo("_SHEETHOVERCREATOR_") + ": </strong>"
                                 + sheet.criadorNick + '#' + sheet.criadorNickSufix)
            ).append(
                $('<li />').append('<strong>' + window.app.ui.language.getLingo("_SHEETHOVERSTYLE_") + ": </strong>"
                                 + sheet.styleName)
            ).append(
                $('<li />').append('<strong>' + window.app.ui.language.getLingo("_SHEETHOVERSTYLECREATOR_") + ": </strong>"
                                 + sheet.nickStyleCreator + '#' + sheet.nicksufixStyleCreator)
            );
            window.app.ui.addonui.$box.stop(true, false).fadeIn(100);
            window.app.ui.addonui.moveAddonBox(e);
        }, {sheet : sheet}))
        .on('mouseleave', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove', function(e) {
            window.app.ui.addonui.moveAddonBox(e);
        });
    };
}