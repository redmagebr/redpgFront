function ImageUI () {
    
    
    this.init = function () {
        
        
        this.updateConfig();
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#openImages').bind('click', function () {
            window.app.ui.imageui.callSelf();
        });
        
        $('#imageSaveButton').bind('click', function() {
            window.app.ui.configui.saveConfig();
            window.app.ui.callLeftWindow("configWindow");
        });
        
        
    };
    
    this.callSelf = function () {
//        this.printSounds();
//        window.app.ui.callRightWindow('soundWindow');
//        window.app.ui.soundui.$soundSelect.show();
//        window.app.ui.soundui.$soundInputNew.hide();
//        window.app.ui.soundui.$linkradio.prop('checked', false);
//        window.app.ui.soundui.$fileradio.prop('checked', true);
//        window.app.ui.soundui.$linkform.hide();
//        window.app.ui.soundui.$fileform.show();
//        window.app.ui.soundui.$corserror.hide();
//        window.app.ui.soundui.$foldererror.hide();

        window.app.ui.callRightWindow('imageWindow');
    };
    
    this.moveUp = function (index, $this) {
        if (index < 0 || (index - 1) < 0 || index >= this.soundList.length) {
            return false;
        }
        
        var a = this.soundList[index];
        var b = this.soundList[index - 1];
        this.soundList[index - 1] = a;
        this.soundList[index] = b;
        
        $this.after($this.prev());
        this.updateIndexes();
    };
    
    this.moveDown = function (index, $this) {
        if (index < 0 || (index + 1) >= this.soundList.length) {
            return false;
        }
        
        var a = this.soundList[index];
        var b = this.soundList[index + 1];
        this.soundList[index + 1] = a;
        this.soundList[index] = b;
        
        this.printSounds();
        
        $this.before($this.next());
        this.updateIndexes();
    };
    
    this.deleteFolder = function (index, $this) {
        $this.remove();
        this.soundList.splice(index, 1);
        this.updateIndexes();
    };
    
    this.deleteSound = function (sound, $div) {
        $div.remove();
        this.soundList[sound.folderIndex].sounds.splice(sound.index, 1);
        this.updateIndexes();
    };
    
    this.updateIndexes = function () {
        var folder;
        var sound;
        for (var i = 0; i < this.soundList.length; i++) {
            folder = this.soundList[i];
            folder.index = i;
            for (var k = 0; k < folder.length; k++) {
                sound = folder[k];
                sound.index = k;
                sound.folderIndex = i;
            }
        }
    };
  
    this.share = function (sound) {
        if (window.app.ui.chat.cc.room === null) {
            window.app.ui.chat.cc.callSelf(false);
            return;
        }
        
        var message = new Message();
        message.setOrigin(window.app.loginapp.user.id);
        message.roomid = window.app.ui.chat.cc.room.id;
        if (sound.bgm) {
            message.module = 'bgmplay';
        } else {
            message.module = 'seplay';
        }
        message.setMessage(sound.link);
        message.setSpecial('name', sound.name);
        window.app.ui.chat.cc.room.addLocal(message);
        window.app.chatapp.sendMessage(message);
        var mod = window.app.ui.chat.mc.getModule(message.module);
        var $html = mod.get$(message);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
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
            if (split.length !== 2 || (['SPC', 'MP3', 'MP4', 'M4A', 'AAC', 'OGG', 'WAV', 'WAVE']).indexOf(split[1].toUpperCase()) === -1) {
                continue;
            }
            names.push(split);
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
        for (i = 0; i < this.soundList.length; i++) {
            if (this.soundList[i].name.toUpperCase() === folderName.toUpperCase()) {
                folder = this.soundList[i];
            }
        }
        if (folder === null) {
            folder = {
                name : folderName,
                sounds : []
            };
            this.soundList.push(folder);
        }
        
        var sounds = folder.sounds;
        for (i = 0; i < cleanNames.length; i++) {
            sounds.push({
                name : decodeURIComponent(cleanNames[i].name),
                link : cleanNames[i].fileName + '.' + cleanNames[i].fileExt,
                bgm : true
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
        for (i = 0; i < this.soundList.length; i++) {
            if (this.soundList[i].name.toUpperCase() === folderName.toUpperCase()) {
                folder = this.soundList[i];
            }
        }
        if (folder === null) {
            folder = {
                name : folderName,
                sounds : []
            };
            this.soundList.push(folder);
        }
        
        var sounds = folder.sounds;
        for (i = 0; i < cleanNames.length; i++) {
            sounds.push({
                name : cleanNames[i].fileName,
                link : cleanNames[i].fileName + '.' + cleanNames[i].fileExt,
                bgm : true
            });
        }
        this.updateIndexes();
        this.printSounds();
    };
    
    this.updateConfig = function () {
        this.imageList = window.app.configdb.get('imageList',
            [
//                {index: 0, name: '0', sounds : [{name : 'teste', link : 'http://redpg.com.br/aponi.spc', bgm : true}]},
//                {index: 1, name: '1', sounds : []},
//                {index: 2, name: 'Jo', sounds : []},
//                {index: 3, name: ':)', sounds : []}
            ]
        );
    };
}