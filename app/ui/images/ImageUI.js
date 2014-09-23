function ImageUI () {
    
    $('#openImagesBt').bind('click', function () {
        window.app.ui.imageui.callSelf();
    });
    
    $('#imageUpload').on('submit', function (e) {
        e.preventDefault();
        window.app.ui.imageui.submitUpload();
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
            
            window.app.imagedb.addImage(imagem);
            window.app.imageapp.saveToLocal();
            this.fillLists();
            this.$linkName.val('').focus();
            this.$linkLink.val('');
        } else {
            alert("Not implemented");
        }
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('imageWindow');
        window.app.imagedb.empty();
        
        var cbs = function () {
            window.app.imageapp.updateFromLocal();
            window.app.ui.imageui.fillLists();
            window.app.ui.unblockRight();
        };
        
        var cbe = function () {
            window.app.ui.unblockRight();
            alert("Error");
        };
        
        window.app.ui.blockRight();
        
        window.app.imageapp.updateDB(cbs, cbe);
    };
    
    /**
     * 
     * @param {Image|Image_Link} image
     * @returns {undefined}
     */
    this.$createImage = function (image) {
        var $image = $("<p class='image' />").text(image.name);
        
        // Visualizar
        var $view = $('<a class="iconOpen floatLeft button language" data-langtitle="_IMAGESOPEN_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.showPicture(this.url);
        }, {url : image.getUrl()}));
        $image.append($view);
        
        // Compartilhar
        var $share = $('<a class="uiconShare floatLeft button language" data-langtitle="_IMAGESSHARE_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.shareImage(this.id);
        }, {id : image.id}));
        $image.append($share);
        
        // Persona
        var $persona = $('<a class="uiconPerson floatLeft button language" data-langtitle="_IMAGESPERSONA_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.personaImage(this.id);
        }, {id : image.id}));
        $image.append($persona);
        
        // Deletar
        var $delete = $('<a class="uiconDelete floatRight button language" data-langtitle="_IMAGESDELETE_" />').on('click', window.app.emulateBind(function () {
            window.app.ui.imageui.deleteImage(this.id);
        }, {id : image.id}));
        $image.append($delete);
        
        return $image;
    };
    
    this.deleteImage = function (id) {
        if (id < 0) {
            window.app.imagedb.deleteImage(id);
            window.app.imageapp.saveToLocal();
            this.fillLists();
        } else {
            alert ("Not implemented");
        }
    };
    
    this.fillLists = function () {
        this.$linkList.empty();
        this.$imageList.empty();
        
        var images = window.app.imagedb.imagesOrdered;
        var $image;
        for (var i = 0; i < images.length; i++) {
            $image = this.$createImage(images[i]);
            if (images[i].id < 0) {
                this.$linkList.append($image);
            } else {
                this.$imageList.append($image);
            }
        }
        
        window.app.ui.language.applyLanguageOn(this.$linkList);
        window.app.ui.language.applyLanguageOn(this.$imageList);
    };
    
    this.shareImage = function (id) {
        var image = window.app.imagedb.getImage(id);
        if (image === null) alert("Invalid image");
        
        var message = new Message();
        message.module = 'image';
        message.msg = image.getUrl();
        message.setSpecial('name', image.name.replace(/ *\([^)]*\) */, '').trim());
        window.app.chatapp.fixPrintAndSend(message, true);
    };
    
    this.personaImage = function (id) {
        var image = window.app.imagedb.getImage(id);
        if (image === null) alert("Invalid image");
        
        window.app.ui.chat.pc.addPersona(image.getName().replace(/ *\([^)]*\) */, '').trim(), image.getUrl(), false);
    };
}