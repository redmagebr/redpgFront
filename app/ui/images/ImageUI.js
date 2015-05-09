function ImageUI () {
    
    $('#openImagesBt').bind('click', function () {
        window.app.ui.imageui.callSelf();
    });
    
    $('#imageUpload').on('submit', function (e) {
        e.preventDefault();
        window.app.ui.imageui.submitUpload();
    });
    
    this.$imageLinkSave = $('#imageLinkSave').on('click', function () {
        window.app.ui.imageui.saveStorage();
    });
    
    this.$imageFileList = $("#imageFileList");
    
    this.$corsError = $('#imageCorsError').hide();
    
    this.$imageList = $('#imageList');
    this.$linkList = $('#imageLinkList');
    
    this.$imageUpload = $('#imageRadioUpload').on('change', function () {
        window.app.ui.imageui.updateForm();
    });
    
    this.$imageLink = $('#imageRadioLink').on('change', function () {
        window.app.ui.imageui.updateForm();
    });
    
    this.$linkForm = $('#imagesLink').unhide();
    this.$uploadForm = $('#imagesUpload').hide();
    
    this.$linkName = $('#imagesLinkName');
    this.$linkLink = $('#imagesLinkLink');
    this.$linkFolder = $('#imagesLinkFolder');
    this.$linkisList = $('#imagesLinkList');
    
    this.lastFolder = null;
    
    this.$storageUsed = $("#imagesStorageUsed");
    this.$storageText = {
        left : $("#imagesStorageLeft"),
        right : $("#imagesStorageRight")
    };
    
    this.updateForm = function () {
        if (this.$imageLink[0].checked) {
            this.$linkForm.unhide();
            this.$uploadForm.hide();
        } else {
            this.$linkForm.hide();
            this.$uploadForm.unhide();
        }
    };
    
    this.submitUpload = function () {
        this.$corsError.hide();
        if (this.$imageLink[0].checked) {
            if (this.$linkisList[0].checked) {
                var ajax = new ImageAjax();
                var cbs = function () {
                    window.app.ui.unblockRight();
                    window.app.ui.imageui.$linkLink.val('');
                    window.app.ui.imageui.$corsError.hide();
                    window.app.ui.imageui.fillLists(true);
                    window.app.ui.imageui.$linkName.val('').focus();
                };
                var cbe = function () {
                    window.app.ui.unblockRight();
                    window.app.ui.imageui.$corsError.unhide();
                };
                
                window.app.ui.blockRight();
                ajax.grabLinks(this.$linkLink.val().trim(), this.$linkFolder.val().trim(), cbs, cbe);
                return;
            }
            var imagem = window.app.imagedb.createLink();
            imagem.name = this.$linkName.val().trim();
            imagem.url = this.$linkLink.val().trim();
            imagem.url = window.app.imageapp.prepareUrl(imagem.url);
            imagem.folder = this.$linkFolder.val().trim();
            
            if (imagem.name === '' || imagem.url === '') return false;
            
            window.app.imagedb.addImage(imagem);
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
            this.$linkName.val('').focus();
            this.$linkLink.val('');
        } else {
            var cbs = function () {
                window.app.ui.unblockRight();
                window.app.ui.imageui.callSelf();
            };
            var cbe = function (data) {
                alert(JSON.stringify(data));
                window.app.ui.unblockRight();
            };
            var data = new FormData();
            for (var i = 0; i < this.$imageFileList[0].files.length; i++) {
                data.append('file' + i, this.$imageFileList[0].files[i]);
            }
            
            window.app.ui.blockRight();
            window.app.imageapp.uploadImage(data, cbs, cbe);
        }
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('imageWindow');
        window.app.imagedb.empty();
        
        this.loaded = 0;
        
        var cbs = function (data) {
            window.app.ui.imageui.fillLists();
            window.app.ui.unblockRight();
            window.app.ui.imageui.setupSpaceBar(data['space']);
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            alert("Error");
        };
        
        window.app.ui.blockRight();
        
        window.app.imageapp.updateDB(cbs, cbe);
        //window.app.imagedb.updateStorage(cbs, cbe);
    };
    
    /**
     * 
     * @param {Image|Image_Link} image
     * @returns {undefined}https://www.dropbox.com/sh/po2ei0qatw6y0ds/AACGl-Cmdh4UCSGWnZu5p5PSa?dl=0
     */
    this.$createImage = function (image) {
        var $image = $("<p class='image' />").text(image.name);
        
        // Visualizar
        var $view = $('<a class="uiconView floatLeft button language" data-langtitle="_IMAGESOPEN_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.pictureui.open(this.url);
        }, {url : image.getUrl()}));
        $image.append($view);
        
        // Compartilhar
        var $share = $('<a class="uiconShare floatLeft button language" data-langtitle="_IMAGESSHARE_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.shareImage(this.image);
        }, {image : image}));
        $image.append($share);
        
        // Persona
        var $persona = $('<a class="uiconPerson floatLeft button language" data-langtitle="_IMAGESPERSONA_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.personaImage(this.image);
        }, {image : image}));
        $image.append($persona);
        
        // Deletar
        var $delete = $('<a class="uiconDelete floatRight button language" data-langtitle="_IMAGESDELETE_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.deleteImage(this.id);
        }, {id : image.getId()}));
        $image.append($delete);

        // Folder
        var $folder = $('<a class="uiconFolder floatRight button language" data-langtitle="_IMAGESFOLDER_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.editFolder(this.id, window.prompt(window.app.ui.language.getLingo("_IMAGESFOLDERPROMPT_") + ":"));
        }, {id : image.getId()}));
        $image.append($folder);

        if (!image.isLink()) {
            // Cloud
            $image.append($('<a class="uiconCloud floatRight button language" data-langtitle="_IMAGESCLOUD_" />'));
        }
        
        return $image;
    };
    
    this.editFolder = function (id, folder) {
        this.lastFolder = window.app.imagedb.getImage(id).folder;
        if (id < 0) {
            window.app.imagedb.getImage(id).folder = folder;
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
        } else {
            var data = {
                uuid : id,
                folder : folder,
                name : window.app.imagedb.getImage(id).name
            };
            window.app.ui.blockRight();
            var cbs = function () {
                window.app.ui.unblockRight();
                window.app.ui.imageui.callSelf();
            };
            var cbe = function () {
                alert("ERROR");
                window.app.ui.unblockRight();
            };
            window.app.imageapp.updateImage (data, cbs, cbe);
        }
    };
    
    this.deleteImage = function (id) {
        var image = window.app.imagedb.getImage(id);
        this.lastFolder = image.folder;
        if (id < 0) {
            window.app.imagedb.deleteImage(id);
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
        } else {
            window.app.ui.blockRight();
            var cbs = function () {
                window.app.ui.unblockRight();
                window.app.ui.imageui.callSelf();
            };
            var cbe = function () {
                alert("Error");
                window.app.ui.unblockRight();
            };
            window.app.imageapp.deleteImage(id, cbs, cbe);
        }
    };
    
    this.saveStorage = function () {
        var cbs = function () {
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            alert("Error");
        };
        
        window.app.ui.blockRight();
        
        window.app.imagedb.saveStorage(cbs, cbe);
    };
    
    this.lastImages = "";
    this.fillLists = function () {
        var $foldersLink = {};
        var $foldersUpload = {};
        
        var images = window.app.imagedb.imagesOrdered;
        var imagesJson = JSON.stringify(images);
        if (imagesJson === this.lastImages) return false;
        
        this.lastImages = imagesJson;
        this.$linkList.empty();
        this.$imageList.empty();
        var $folderLink;
        var $image;
        var folder;
        for (var i = 0; i < images.length; i++) {
            $image = this.$createImage(images[i]);
            folder = images[i].folder;
            if (folder === '') folder = window.app.ui.language.getLingo('_IMAGESNOFOLDER_');
            if (this.lastFolder === '') this.lastFolder = window.app.ui.language.getLingo('_IMAGESNOFOLDER_');
            if ($foldersLink[images[i].folder] === undefined) {
                $folderLink = $("<p class='folder' />").text(folder).on('click', function () {
                    $(this).toggleClass('toggled');
                }).append($("<a />").addClass('uiconFolderButton'));
                if (folder === this.lastFolder) {
                    $folderLink.addClass('toggled');
                }
                $foldersLink[images[i].folder] = $('<div />');
                this.$linkList.append($folderLink).append($foldersLink[images[i].folder]);
            }
            $foldersLink[images[i].folder].append($image);
        }
        
        window.app.ui.language.applyLanguageOn(this.$linkList);
        window.app.ui.language.applyLanguageOn(this.$imageList);
    };
    
    this.shareImage = function (image) {
        var message = new Message();
        message.module = 'image';
        message.msg = image.getUrl();
        message.setSpecial('name', image.name.replace(/ *\([^)]*\) */, '').trim());
        window.app.chatapp.fixPrintAndSend(message, true);
    };
    
    this.personaImage = function (image) {
        window.app.ui.chat.pc.addPersona(image.getName().replace(/ *\([^)]*\) */, '').trim(), image.getUrl(), false);
    };
    
    this.setupSpaceBar = function (json) {
        //{"TotalSpace":10240,"UsedSpace":1024,"FreeSpace":5242880}
        var used = json.UsedSpace / (1024 * 1024);
        used = +(used.toFixed(2));
        var total = ((json.TotalSpace + json.FreeSpace) / (1024 * 1024));
        total = +(total.toFixed(2));
        this.$storageText.left.text(used + " MB");
        this.$storageText.right.text(total + " MB");
        if (total > 0) {
            this.$storageUsed.css("width", (used * 100 / total) + "%");
        } else {
            this.$storageUsed.css("width", "100%");
        }
    };
}