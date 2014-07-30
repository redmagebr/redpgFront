function SheetUI() {
    this.$openBt;
    this.$error;
    this.$list;
    this.$formCreation;
    this.$formPermission;
    
    this.controller = new SheetController();
    
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
            window.app.ui.sheetui.fillList(data);
            window.app.ui.unblockRight();
            window.app.ui.sheetui.$error.finish().fadeOut();
            window.app.ui.sheetui.$list.show();
        };

        window.app.sheetapp.callList(cbs, cbe);
    };
    
    this.fillList = function (data) {
        //this.$list.text(JSON.stringify(data[0]));
        this.$list.empty();
        
        var $div;
        var $h1;
        var $p;
        var $del;
        var $priv;
        var $safe;
        var $name;
        data.sort(function (a, b) {
            if (a.nome < b.nome) {
                return -1;
            }
            if (a.nome > b.nome) {
                return 1;
            }
            return 0;
        });
        for (var i = 0; i < data.length; i++) {
            $div = $('<div />');
            $h1 = $("<h1 onclick='$(this).parent().toggleClass(\"open\");' class='language' data-langtitle='_SHEETSGAMETITLE_' />").text(data[i]["nome"]);
            $div.append($h1);
            
            if (data[i].id === this.creating) {
                $div.addClass("open");
            }
            
            data[i].sheets.sort(function (a, b) {
                if (a.nome < b.nome) {
                    return -1;
                }
                if (a.nome > b.nome) {
                    return 1;
                }
                return 0;
            });
            
            for (var j = 0; j < data[i].sheets.length; j++) {
                $p = $('<p />');
                $div.append($p);
                
                if (data[i].sheets[j]['deletar']) {
                    $del = $("<a class='floatRight textButton language' data-langhtml='_SHEETSDELETE_'>Deletar</a>");
                    $del.on('click', window.app.emulateBind(function () {
                        window.app.ui.sheetui.callDelete(this.id, this.nome, this.gameid);
                    }, {id : data[i].sheets[j]['id'], nome : data[i].sheets[j]['nome'], gameid : data[i].id}));
                    $p.append($del);
                }
                
                if (data[i].sheets[j]['editar']) {
                    $priv = $("<a class='floatRight textButton language' data-langhtml='_SHEETSPRIVILEGES_'>Permissoes</a>");
                    $priv.on('click', window.app.emulateBind(function () {
                        window.app.ui.sheetui.callPrivileges(this.id, this.name, this.gameid);
                    }, {id : data[i].sheets[j]['id'], name : data[i].sheets[j]['nome'], gameid : data[i].id}));
                    $p.append($priv);
                }
                
                if (data[i].sheets[j].segura) {
                    $safe = $("<a class='safeIcon language' data-langtitle='_SHEETSAFE_'></a>");
                } else {
                    $safe = $("<a class='unsafeIcon language' data-langtitle='_SHEETUNSAFE_'></a>");
                }
                $p.append($safe);
                
                $name = $("<a class='sheetName language' data-langtitle='_SHEETSNAMETITLE_' />").text(data[i].sheets[j]["nome"]);
                $name.on('click', window.app.emulateBind(function () {
                    window.app.ui.sheetui.openSheet(this.id, this.idstyle, this.gameid);
                }, {id : data[i].sheets[j]['id'], idstyle : data[i].sheets[j]['idstyle'], gameid : data[i].id}));
                $p.append($name);
            }
            
            if (data[i].sheets.length === 0) {
                $p = $('<p class="language" data-langhtml="_SHEETSNOSHEETS_" />');
                $div.append($p);
            }
            
            if (data[i].sheetCreator) {
                $p = $("<p />");
                $name = $("<a class='sheetName language' data-langhtml='_SHEETSADD_' />");
                $p.append($name);
                
                $name.on('click', window.app.emulateBind(function () {
                    window.app.ui.sheetui.callCreation(this.id, this.gamename);
                }, {id : data[i].id, gamename : data[i]["nome"]}));

                $div.append($p);
            }
            
            this.$list.append($div);
        }
        if (data.length === 0) {
            $p = $("<p class='language' data-langhtml='_SHEETSNOGAMES_' />");
            this.$list.append($p);
        }
        
        window.app.ui.language.applyLanguageOn(this.$list);
        
        this.creating = 0;
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
            if (a.nickuser < b.nickuser) {
                return -1;
            }
            if (a.nickuser > b.nickuser) {
                return 1;
            }
            if (a.nicksufixuser < b.nicksufixuser) {
                return -1;
            }
            if (a.nicksufixuser > b.nicksufixuser) {
                return 1;
            }
        });
        
        for (var i = 0; i < data.length; i++) {
            $p = $('<p class="permission" />');
            $p.append(
                $('<input type="hidden" class="idAccount" value="' + data[i].iduser + '" />')
            );
            $p.append(
                $('<span />').text(data[i].nickuser + '#' + data[i].nicksufixuser)
            );
    
            $p.append(
                $('<label for="delperm' + data[i].iduser + '" class="language" data-langhtml="_SHEETPERMISSIONDELETE_" />')
            );
    
            $p.append(
                $('<input id="delperm' + data[i].iduser + '" class="deletePerm" type="checkbox" ' + (data[i].delete ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="editperm' + data[i].iduser + '" class="language" data-langhtml="_SHEETPERMISSIONEDIT_" />')
            );
    
            $p.append(
                $('<input id="editperm' + data[i].iduser + '" class="editPerm" type="checkbox" ' + (data[i].edit ? 'checked' : '') + ' />')
            );
    
            $p.append(
                $('<label for="viewperm' + data[i].iduser + '" class="language" data-langhtml="_SHEETPERMISSIONVIEW_" />')
            );
    
            $p.append(
                $('<input id="viewperm' + data[i].iduser + '" class="viewPerm" type="checkbox" ' + (data[i].view ? 'checked' : '') + ' />')
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
                visualizar : $permission.find('.viewPerm')[0].checked
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
}