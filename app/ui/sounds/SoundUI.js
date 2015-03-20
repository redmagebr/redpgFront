function SoundUI () {
    this.$bgmcheck;
    this.$dropbox;
    this.$soundList;
    this.$soundSelect;
    this.$soundSelectList;
    this.$soundSelectNone;
    this.$soundSelectNew;
    this.$soundInputNew;
    this.$linkradio;
    this.$fileradio;
    this.$fileList;
    this.$link;
    this.$foldererror;
    this.$corserror;
    
    
    this.init = function () {
        this.$bgmcheck = $('#soundsBGM');
        this.$soundList = $('#soundList').empty();
        this.$soundSelect = $('#folderSelect');
        this.$soundSelectList = $('#foldersOptions');
        this.$soundSelectNone = $('#folderSelectNone');
        this.$soundSelectNew = $('#newFolderOption');
        this.$soundInputNew = $('#folderCreate');
        this.$fileList = $('#soundFileList');
        this.$link = $('#soundFileLink');
        this.$linkform = $('#soundLinkForm');
        this.$fileform = $('#soundFileInput');
        this.$foldererror = $('#soundFolderError');
        this.$corserror = $('#tryCors');
        
        
        this.$linkradio = $('#soundsLinkMethod');
        this.$fileradio = $('#soundsFolderMethod');
        
        //this.updateConfig();
        this.setBindings();
        
        window.app.storage.registerStorage("sounds", this);
    };
    
    this.storageChanged = function () {
        this.printSounds();
    };
    
    this.storageValidation = function (value) {
        if (!Array.isArray(value)) return false;
        var folder;
        var sound;
        for (var i = 0; i < value.length; i++) {
            folder = value[i];
            if (typeof folder !== 'object') return false;
            if (typeof folder.index !== "number") return false;
            if (typeof folder.name !== 'string') return false;
            if (!Array.isArray(folder.sounds)) return false;
            if (Object.keys(folder).length !== 3) return false;
            
            for (var k = 0; k < folder.sounds.length; k++) {
                sound = folder.sounds[k];
                if (typeof sound !== 'object') return false;
                if (typeof sound.name !== 'string') return false;
                if (typeof sound.link !== 'string') return false;
                if (typeof sound.bgm !== 'boolean') return false;
                if (typeof sound.folderIndex !== 'number') return false;
                if (typeof sound.index !== 'number') return false;
                if (Object.keys(sound).length !== 5) return false;
            }
        }
        return true;
    };
    
    this.storageDefault = function () {
        return [];
    };
    
    this.isBGM = function () {
        return this.$bgmcheck.prop('checked');
    };
    
    this.setBindings = function () {
        $('#openSounds').bind('click', function () {
            window.app.ui.soundui.callSelf();
        });
        
        $('#soundSaveButton').bind('click', function() {
            window.app.ui.blockRight();
            var cbs = function () {
                window.app.ui.unblockRight();
            };
            var cbe = function () {
                alert("Não foi possível salvar sons.");
                window.app.ui.unblockRight();
            };
            
            window.app.storageapp.sendStorage("sounds", cbs, cbe);
        });
        
        this.$soundSelect.bind('change', function () {
            if (window.app.ui.soundui.$soundSelectNew.prop('selected')) {
                window.app.ui.soundui.$soundSelect.hide();
                window.app.ui.soundui.$soundInputNew.show().focus();
            }
        });
        
        $('#soundLinkForm').bind('submit', function () {
            window.app.ui.soundui.fetchLink();
        });
        
        $('#soundFileListSubmit').bind('click', function () {
            window.app.ui.soundui.fetchFiles();
        });
        
        $('#soundLinkDropbox').bind('submit', function () {
            //window.app.ui.soundui.processLink(window.app.ui.soundui.$dropbox.val(), true);
            window.app.ui.soundui.$iframe = $('<iframe />').attr('src', window.app.ui.soundui.$dropbox.val()).bind('load', function () {
                console.log(window.app.ui.soundui.$iframe.contents().find('a.thumb-link'));
                window.app.ui.soundui.$iframe.remove();
                window.app.ui.soundui.$iframe = null;
            }).bind('error', function () {
                alert("error loading");
            }).hide().appendTo('body');;
        });
        
        this.$linkradio.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.ui.soundui.$linkform.show();
                window.app.ui.soundui.$fileform.hide();
            }
        });
        
        this.$fileradio.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.ui.soundui.$linkform.hide();
                window.app.ui.soundui.$fileform.show();
            }
        });
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('soundWindow');
        window.app.ui.soundui.$soundSelect.show();
        window.app.ui.soundui.$soundInputNew.hide();
        window.app.ui.soundui.$linkradio.prop('checked', false);
        window.app.ui.soundui.$fileradio.prop('checked', true);
        window.app.ui.soundui.$linkform.hide();
        window.app.ui.soundui.$fileform.show();
        window.app.ui.soundui.$corserror.hide();
        window.app.ui.soundui.$foldererror.hide();
        
        var oldSounds =  window.app.configdb.get('soundList', null);
        if (oldSounds !== null) {
            if (confirm("Você possui sons na configuração antiga. Gostaria de repassá-los ao modelo novo?")) {
                window.app.storage.store("sounds", oldSounds);
                this.printSounds();
                
                window.app.ui.blockRight();
                
                var cbs = function () {
                    window.app.ui.unblockRight();
                    window.app.configdb.store("soundList", null);
                    window.app.ui.configui.saveConfig();
                    window.app.ui.callLeftWindow("configWindow");
                };
                var cbe = function () {
                    window.app.ui.unblockRight();
                    alert("Não foi possível salvar os sons.");
                };
                
                window.app.storageapp.sendStorage("sounds", cbs, cbe);
                return false;
            }
        }
        
        window.app.ui.blockRight();
        var cbs = function () {
            window.app.ui.unblockRight();
            window.app.ui.soundui.printSounds();
        };
        var cbe = function () {
            alert ("Erro abrindo sons.");
        };
        window.app.storageapp.updateStorage("sounds", cbs, cbe);
    };
    
    this.moveUp = function (index, $this) {
        if (index < 0 || (index - 1) < 0 || index >= window.app.storage.get("sounds").length) {
            return false;
        }
        
        var a = window.app.storage.get("sounds")[index];
        var b = window.app.storage.get("sounds")[index - 1];
        window.app.storage.get("sounds")[index - 1] = a;
        window.app.storage.get("sounds")[index] = b;
        
        $this.after($this.prev());
        this.updateIndexes();
    };
    
    this.moveDown = function (index, $this) {
        if (index < 0 || (index + 1) >= window.app.storage.get("sounds").length) {
            return false;
        }
        
        var a = window.app.storage.get("sounds")[index];
        var b = window.app.storage.get("sounds")[index + 1];
        window.app.storage.get("sounds")[index + 1] = a;
        window.app.storage.get("sounds")[index] = b;
        
        this.printSounds();
        
        $this.before($this.next());
        this.updateIndexes();
    };
    
    this.deleteFolder = function (index, $this) {
        $this.remove();
        window.app.storage.get("sounds").splice(index, 1);
        this.updateIndexes();
    };
    
    this.deleteSound = function (sound, $div) {
        $div.remove();
        window.app.storage.get("sounds")[sound.folderIndex].sounds.splice(sound.index, 1);
        this.updateIndexes();
    };
    
    this.updateIndexes = function () {
        var folder;
        var sound;
        for (var i = 0; i < window.app.storage.get("sounds").length; i++) {
            folder = window.app.storage.get("sounds")[i];
            folder.index = i;
            for (var k = 0; k < folder.length; k++) {
                sound = folder[k];
                sound.index = k;
                sound.folderIndex = i;
            }
        }
    };
    
    this.create$sound = function (sound) {
//        {
//            index : position in list,
//            folderIndex : folder position on masterlist,
//            bgm : true/false,
//            name : sound name,
//            link : link to file
//        }
        var $html = $('<p />');
        
        var playFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.play(this.sound);
            }, {sound : sound}
        );

        var shareFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.share(this.sound);
            }, {sound : sound}
        );

        var deleteFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.deleteSound(this.sound, this.$div);
            }, {sound : sound, $div : $html}
        );
        
        $html.append(
            $("<a class='button textLink language' data-langhtml='_PLAYMUSIC_' />").bind('click', playFunc)
        );

        $html.append(' - ');
        
        $html.append(
            $("<a class='button textLink language' data-langhtml='_SHAREMUSIC_' />").bind('click', shareFunc)
        );
        
        $html.append(
            $("<a class='button textLink language floatRight' data-langhtml='_DELETEMUSIC_' />").bind('click', deleteFunc)
        );

        $html.append(' - ');

        $html.append($('<span class="selectable" />').text(sound.name));
        
        return $html;
    };
    
    this.create$folder = function (folder) {
        var $html = $('<div class="folder" />');
        var $title = $('<div class="folderTitle" />');
        
        var onClick = function () {
            $(this).parent().toggleClass('toggled');
        };

        var moveUp = window.app.emulateBind(
            function () {
                window.app.ui.soundui.moveUp(this.folder.index, this.$div);
            }, {folder : folder, $div : $html}
        );

        var moveDown = window.app.emulateBind(
            function () {
                window.app.ui.soundui.moveDown(this.folder.index, this.$div);
            }, {folder : folder, $div : $html}
        );

        var deleteFunc = window.app.emulateBind(
            function () {
                window.app.ui.soundui.deleteFolder(this.folder.index, this.$div);
            }, {folder : folder, $div : $html}
        );
        
        $title.append(
            $('<a class="left melded openIcon language" data-langtitle="_SOUNDSOPEN_" />').bind('click', onClick)
        );

        $title.append(
            $('<a class="right button upIcon language" data-langtitle="_SOUNDSMOVEUP_" />').bind('click', moveUp)
        );

        $title.append(
            $('<a class="right button downIcon language" data-langtitle="_SOUNDSMOVEDOWN_" />').bind('click', moveDown)
        );

        $title.append(
            $('<a class="right button delIcon language" data-langtitle="_SOUNDSDELETE_" />').bind('click', deleteFunc)
        );

        $title.append(
            $('<p class="language" data-langtitle="_SOUNDSOPEN_" />').text(folder.name).bind('click', onClick)
        );
        
        $html.append($title);
        
        var $sl = $('<div class="folderSounds" />');
        folder.sounds.sort(function (a, b) {
            var na = a.name.toUpperCase();
            var nb = b.name.toUpperCase();
            if (na < nb) {
                return -1;
            }
            if (na > nb) {
                return 1;
            }
            return 0;
        });
        for (var i = 0; i < folder.sounds.length; i++) {
            folder.sounds[i].index = i;
            folder.sounds[i].folderIndex = folder.index;
            $sl.append(this.create$sound(folder.sounds[i]));
        }
        $html.append($sl);
        
        return $html;
    };
    
    this.printSounds = function () {
        this.$soundList.empty();
        this.$soundInputNew.val('').hide();
        this.$soundSelectList.empty();
        this.$soundSelect.show().find('option').prop('selected', false);
        this.$soundSelectNone.prop('selected', true);
        for (var i = 0; i < window.app.storage.get("sounds").length; i++) {
            window.app.storage.get("sounds")[i].index = i;
            this.$soundList.append(this.create$folder(window.app.storage.get("sounds")[i]));
            this.$soundSelectList.append(
                $('<option />').text(window.app.storage.get("sounds")[i].name).val(window.app.storage.get("sounds")[i].name)
            );
        }
        window.app.ui.language.applyLanguageOn(this.$soundList);
    };
    
    this.play = function (sound) {
        if (sound.bgm) {
            window.app.ui.chat.audioc.play(sound.link);
        } else {
            window.app.ui.chat.audioc.playse(sound.link);
        }
    };
    
    this.share = function (sound) {
        if (window.app.ui.chat.cc.room === null) {
            window.app.ui.chat.cc.callSelf(false);
            return;
        }
        
        var message = new Message();
        message.setOrigin(window.app.loginapp.user.id);
        if (sound.bgm) {
            message.module = 'bgmplay';
        } else {
            message.module = 'seplay';
        }
        message.setMessage(sound.link);
        message.setSpecial('name', sound.name);
        
        window.app.chatapp.fixPrintAndSend(message, true);
    };
    
    this.fetchLink = function () {
        window.app.ui.soundui.$corserror.hide();
        window.app.ui.soundui.$foldererror.hide();
        var cbs = function (data) {
            window.app.ui.unblockRight();
            window.app.ui.soundui.processLink(data, false);
            window.app.ui.soundui.$link.val('');
        };
        
        var cbe = function (data) {
            if (data.status === 0) {
                window.app.ui.soundui.$corserror.show();
            }
            window.app.ui.unblockRight();
        };
        
        var link = this.$link.val();
        
        var ajax = new AjaxController();
        
        window.app.ui.blockRight();
        
        ajax.requestPage({
            url : link,
            success : cbs,
            error: cbe
        });
    };
    
    this.processLink = function (data) {
        var link = this.$link.val();
        var dropbox = link.indexOf('dropbox.com') !== -1;
        if (!dropbox) {
            if (link.charAt(link.length - 1) !== '/') {
                link = link + '/';
            }
        } else {
            var link = '';
        }
        if (!dropbox) {
            var files = $(data).find('a');
        } else {
            var files = $(data).find('a.thumb-link');
        }
        var $file;
        var names = [];
        var split;
        for (var i = 0; i < files.length; i++) {
            $file = $(files[i]);
            if (typeof $file.attr('href') === 'undefined' || $file.attr('href') === null || $file.attr('href') === '../' && $file.attr('href') === '/') continue;
            split = [$file.attr('href').substr(0, $file.attr('href').lastIndexOf('.')), $file.attr('href').substr($file.attr('href').lastIndexOf('.') + 1)];
            if (split.length === 2) {
                split[1] = split[1].replace("?dl=0", "").replace("?dl=1", "");
            }
            if (split.length !== 2 || (['SPC', 'MP3', 'MP4', 'M4A', 'AAC', 'OGG', 'WAV', 'WAVE', 'OPUS']).indexOf(split[1].toUpperCase()) === -1) {
                continue;
            }
            if (names.indexOf(split) === -1) names.push(split);
        }
        
        var cleanNames = [];
        var cleanName;
        for (var i = 0; i < names.length; i++) {
            split = names[i];
            cleanName = {
                fileName : split[0],
                fileExt : split[1]
            };
            
            if (cleanName.fileName.indexOf('://') !== -1) {
                cleanName.name = cleanName.fileName.replace(/^.*[\\\/]/, '');
                if (dropbox) {
                    cleanName.fileExt = cleanName.fileExt + '?dl=1';
                }
            } else {
                cleanName.name = split[0];
                cleanName.fileName = link + cleanName.fileName;
            }
            cleanNames.push(cleanName);
        }
        
        var folderName = this.$soundSelect.val();
        if (folderName === '-1' || folderName === '' || folderName === null) {
            folderName = this.$soundInputNew.val();
            if (folderName === '' || folderName === null) {
                this.$foldererror.show();
                return false;
            }
        }
        var folder = null;
        for (i = 0; i < window.app.storage.get("sounds").length; i++) {
            if (window.app.storage.get("sounds")[i].name.toUpperCase() === folderName.toUpperCase()) {
                folder = window.app.storage.get("sounds")[i];
            }
        }
        if (folder === null) {
            folder = {
                name : folderName,
                sounds : []
            };
            window.app.storage.get("sounds").push(folder);
        }
        
        var sounds = folder.sounds;
        for (i = 0; i < cleanNames.length; i++) {
            sounds.push({
                name : decodeURIComponent(cleanNames[i].name),
                link : cleanNames[i].fileName + '.' + cleanNames[i].fileExt,
                bgm : this.isBGM()
            });
        }
        this.updateIndexes();
        this.printSounds();
    };
    
    this.fetchFiles = function () {
        this.$foldererror.hide();
        var files = this.$fileList.prop('files');
        var names = $.map(files, function(val) { return val.name; });
        var cleanNames = [];
        var cleanName;
        var split;
        for (var i = 0; i < names.length; i++) {
            split = [names[i].substr(0, names[i].lastIndexOf('.')), names[i].substr(names[i].lastIndexOf('.') + 1)];
            if (split.length !== 2) {
                continue;
            }
            cleanName = {
                fileName : split[0],
                fileExt : split[1]
            };
            cleanNames.push(cleanName);
        }
        
        var folderName = this.$soundSelect.val();
        if (folderName === '-1' || folderName === '' || folderName === null) {
            folderName = this.$soundInputNew.val();
            if (folderName === '' || folderName === null) {
                this.$foldererror.show();
                return false;
            }
        }
        var folder = null;
        for (i = 0; i < window.app.storage.get("sounds").length; i++) {
            if (window.app.storage.get("sounds")[i].name.toUpperCase() === folderName.toUpperCase()) {
                folder = window.app.storage.get("sounds")[i];
            }
        }
        if (folder === null) {
            folder = {
                name : folderName,
                sounds : []
            };
            window.app.storage.get("sounds").push(folder);
        }
        
        var sounds = folder.sounds;
        for (i = 0; i < cleanNames.length; i++) {
            sounds.push({
                name : cleanNames[i].fileName,
                link : cleanNames[i].fileName + '.' + cleanNames[i].fileExt,
                bgm : this.isBGM()
            });
        }
        this.updateIndexes();
        this.printSounds();
    };
}