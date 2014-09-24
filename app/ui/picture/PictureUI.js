function PictureUI () {
    this.$window = $('#pictureWindow').on('click', function () {
        window.app.ui.pictureui.close();
    }).hide();
    this.$element = $('#pictureElement').hide();
    this.$loading = $('#pictureLoading');
    
    this.$element.on('load', function () {
        window.app.ui.pictureui.updatePicture();
    }).on('error', function () {
        window.app.ui.pictureui.invalidPicture();
    });
    
    this.stream = false;
    
    this.handleResize = function () {
        if (window.app.ui.chat.mc.getModule('stream') !== null || !window.app.ui.chat.mc.getModule('stream').isStream) {
            this.$window.css({"width" : window.app.ui.$rightWindow.width()});
        }
        this.updatePicture();
    };
    
    this.fullscreen = function (full) {
        var right = full ? 100 : 10;
        this.$window.css('right', right + 'px');
        this.updatePicture();
    };
    
    this.open = function (url) {
        try {
            url = decodeURIComponent(url);
        } catch (e) {
            
        }
        if (url.indexOf('dropbox.com') !== -1) {
            url = url.replace('dl=0', 'dl=1');
            if (url.indexOf('dl=1') === -1) {
                url = url + (url.indexOf('?') !== -1 ? '' : '?') + 'dl=1';
            }
        }
        
        this.$element.attr('src', url).css({
            width: 0, height: 0
        });
        this.$window.stop(true,false).fadeIn(200);
        this.$loading.stop(true,true).show();
    };
    
    this.updatePicture = function () {
        if (this.$element.attr('src') === undefined) return;
        this.$element.css('width', '').css('height', '');
        this.$loading.stop(true,false).fadeOut(200);
        var oHeight = this.$element.height();
        var oWidth = this.$element.width();
        // Anti loop
        if (oHeight === 0 || oWidth === 0) return;
        var margin = this.stream ? 0 : 40;
        var maxHeight = this.$window.height() - margin;
        var maxWidth = this.$window.width() - margin;
        var factorW = maxWidth / oWidth;
        var factorH = maxHeight / oHeight;
        var factor = factorW < factorH ? factorW : factorH;
        var top = (this.$window.height() - (oHeight * factor))/2;
        var left = (this.$window.width() - (oWidth * factor))/2;
        this.$element.css({
            width: oWidth * factor,
            height: oHeight * factor,
            top: top,
            left: left
        });
        this.$element.show();
    };
    
    this.close = function () {
        this.$window.stop(true,false).fadeOut(200, function () {
            if (!window.app.ui.pictureui.$window.is(':visible')) {
                window.app.ui.pictureui.$element.removeAttr('src');
            }
        });
    };
    
    this.invalidPicture = function () {
        this.$element.css('width', '').css('height', '');
        this.$element.attr('src', 'img/404.png');
    };
    
    this.streaming = function (streaming) {
        if (streaming) {
            this.$window.css('width', '');
        }
        this.stream = streaming;
        this.updatePicture();
    };
}