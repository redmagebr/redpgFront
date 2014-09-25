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
    
    this.lastFolder = null;
    
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
        if (this.$imageLink[0].checked) {
            var imagem = window.app.imagedb.createLink();
            imagem.name = this.$linkName.val().trim();
            imagem.url = this.$linkLink.val().trim();
            imagem.folder = this.$linkFolder.val().trim();
            
            window.app.imagedb.addImage(imagem);
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
            this.$linkName.val('').focus();
            this.$linkLink.val('');
        } else {
            alert("Not implemented");
        }
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('imageWindow');
        window.app.imagedb.empty();
        
        this.loaded = 0;
        
        var cbs = function () {
            window.app.ui.imageui.fillLists();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            alert("Error");
        };
        
        window.app.ui.blockRight();
        window.app.ui.blockRight();
        
        window.app.imageapp.updateDB(cbs, cbe);
        window.app.imagedb.updateStorage(cbs, cbe);
    };
    
    /**
     * 
     * @param {Image|Image_Link} image
     * @returns {undefined}
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
        
        if (image.id !== null) {
            // Deletar
            var $delete = $('<a class="uiconDelete floatRight button language" data-langtitle="_IMAGESDELETE_" />').on('click', window.app.emulateBind(function () {
                window.app.ui.imageui.deleteImage(this.id);
            }, {id : image.id}));
            $image.append($delete);
            
            // Folder
            var $folder = $('<a class="uiconFolder floatRight button language" data-langtitle="_IMAGESFOLDER_" />').on('click', window.app.emulateBind(function () {
                window.app.ui.imageui.editFolder(this.id, window.prompt(window.app.ui.language.getLingo("_IMAGESFOLDERPROMPT_" + ":")));
            }, {id : image.id}));
            $image.append($folder);
        }
        
        return $image;
    };
    
    this.editFolder = function (id, folder) {
        if (id < 0) {
            window.app.imagedb.getImage(id).folder = folder;
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
        } else {
            // not implemented
        }
    };
    
    this.deleteImage = function (id) {
        if (id < 0) {
            var image = window.app.imagedb.getImage(id);
            this.lastFolder = image.folder;
            window.app.imagedb.deleteImage(id);
            window.app.imagedb.saveToStorage();
            this.fillLists(true);
        } else {
            alert ("Not implemented");
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
    
    this.fillLists = function (force) {
        if (++this.loaded !== 2 && force !== true) return;
        this.$linkList.empty();
        this.$imageList.empty();
        
        var $foldersLink = {};
        var $foldersUpload = {};
        
        var images = window.app.imagedb.imagesOrdered;
        var $folderLink;
        var $image;
        var folder;
        for (var i = 0; i < images.length; i++) {
            $image = this.$createImage(images[i]);
            folder = images[i].folder;
            if (folder === '') folder = window.app.ui.language.getLingo('_IMAGESNOFOLDER_');
            if (images[i].id < 0) {
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
            } else {
                if ($foldersUpload[images[i].folder] === undefined) {
                    $folderLink = $("<p class='folder' />").text(folder).append($("<a />").addClass('uiconFolderButton'));
                    if (folder === this.lastFolder) {
                        $folderLink.addClass('toggled');
                    }
                    $foldersUpload[images[i].folder] = $('<div />');
                    this.$imageList.append($folderLink).append($foldersUpload[images[i].folder]);
                }
                $foldersUpload[images[i].folder].append($image);
            }
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
}