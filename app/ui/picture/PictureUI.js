function PictureUI () {
    this.$window = $('#pictureWindow').hide();
    this.$element = $('#pictureElement').hide();
    this.$loading = $('#pictureLoading');
    this.$currentSize = $('<a class="paintIconSmall language button" data-langtitle="_DRAWINGSIZE_" />').on('click', function () {
        window.app.ui.pictureui.changeSize();
    });
    this.$currentColor = $('<a class="language button" data-langtitle="_DRAWINGCOLOR_" style="background-color: #CC0000" />').append('<a></a>');
    this.$eraser = $('<a class="language button paintIconEraser" data-langtitle="_DRAWINGERASER_" />').on('click', function () {
        window.app.ui.pictureui.color = "none";
        window.app.ui.pictureui.size = 10;
        window.app.ui.pictureui.$currentColor.css('background-color', 'transparent');
    });
    
    
    this.$clear = $('<a class="paintIconClear language button" data-langtitle="_DRAWINGCLEAR_" style="background-color: #ffffff" />').on('click', function () {
        window.app.ui.pictureui.sendClear();
    });
    
    this.$lock = $('<a class="paintIconLock language button" data-langtitle="_DRAWINGLOCK_" />').on('click', function () {
        window.app.ui.pictureui.locked = !window.app.ui.pictureui.locked;
        if (window.app.ui.pictureui.locked) {
            $(this).addClass('toggled');
        } else {
            $(this).removeClass('toggled');
        }
    });
    
    this.$paintingTools = $('#picturePaint').append(this.$currentSize).append(this.$currentColor)
            .append(this.$clear).append(this.$eraser);
    
    this.locked = false;
    
    this.color = '#CC0000';
    this.size = 1;
    
    this.drawings = {};
    this.myArt = {};
    
    this.$canvas = null;
    
    this.touchTimeout = null;
    
    this.$currentColor.colpick({
        flat: true,
	layout:'hex',
	submit:1,
        color : 'CC0000',
        onSubmit : function (hsb, hex, rgb, el, bySetColor) {
            $(el).css('background-color', '#' + hex).children('div').stop(true,false).fadeOut(200);
            window.app.ui.pictureui.color = '#' + hex;
        }
    }).children('div').hide();
            
    this.$currentColor.children('a').on('click', function () {
        $(this).parent().children('div').stop(true, false).fadeIn(200);
    });
    
    this.link404 = 'img/404.png';
    
    this.$close = $('#pictureWindowClose').on('click', function () {
        window.app.ui.pictureui.close();
    });
    
    this.$element.on('load', function () {
        window.app.ui.pictureui.updatePicture();
    });
    
    this.stream = false;
    
    this.handleResize = function () {
        if (window.app.ui.chat.mc.getModule('stream') === null || !window.app.ui.chat.mc.getModule('stream').isStream) {
            this.$window.css({"width" : window.app.ui.$rightWindow.width()});
        } else {
            this.$window.css('width', '');
        }
        this.updatePicture();
    };
    
    this.fullscreen = function (full) {
        var right = full ? 100 : 10;
        if (window.app.ui.chat.mc.getModule('stream') === null || !window.app.ui.chat.mc.getModule('stream').isStream) {
            this.$window.css('right', right + 'px');
        } else {
            this.$window.css('right', '');
        }
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
        
        this.$element.off('error').on('error', function () {
            window.app.ui.pictureui.invalidPicture();
        }).attr('src', url).css({
            width: 0, height: 0
        });
        this.$window.stop(true,false).fadeIn(200);
        this.$loading.stop(true,true).show();
        this.$paintingTools.stop(true, false).hide();
        if (window.app.ui.pictureui.$canvas !== null) {
            window.app.ui.pictureui.$canvas.remove();
            window.app.ui.pictureui.$canvas = null;
        }
    };
    
    this.updatePicture = function () {
        if (this.$element.attr('src') === undefined) return;
        this.$element.css('width', '').css('height', '');
        this.$loading.stop(true,false).fadeOut(200);
        var oHeight = this.$element[0].naturalHeight;
        var oWidth = this.$element[0].naturalWidth;
        // Anti loop
        if (oHeight === 0 || oWidth === 0) return;
        var margin = this.stream ? 0 : 40;
        var maxHeight = this.$window.height() - margin;
        var maxWidth = this.$window.width() - margin;
        var factorW = maxWidth / oWidth;
        var factorH = maxHeight / oHeight;
        if (this.stream) {
            var factor = factorW < factorH ? factorH : factorW;
        } else {
            var factor = factorW < factorH ? factorW : factorH;
        }
        var top = (this.$window.height() - (oHeight * factor))/2;
        if (!this.stream && top < 30 && this.$element.attr('src') !== this.link404) {
            top = 30;
        }
        var left = (this.$window.width() - (oWidth * factor))/2;
        this.$element.css({
            width: oWidth * factor,
            height: oHeight * factor,
            top: top,
            left: left
        });
        this.$element.show();
        
        this.src = this.$element.attr('src');
        
        if (this.$element.attr('src') !== this.link404) {
            this.showPainting();
            this.updateCanvas(true);
        }
    };
    
    this.addDrawings = function (src, array) {
        if (this.drawings[src] === undefined) this.drawings[src] = [];
        this.drawings[src] = this.drawings[src].concat(array);
        if (src === this.src) {
            this.updateCanvas();
        }
    };
    
    this.clearDrawings = function (src) {
        this.drawings[src] = [];
        if (src === this.src) {
            this.updateCanvas();
        }
    };
    
    this.sendClear = function () {
        if (window.app.chatapp.room === null) {
            this.drawings[this.src] = [];
            this.updateCanvas();
            return;
        }
        var message = new Message();
        message.module = 'pica';
        message.setSpecial('clear', true);
        message.msg = this.src;
        window.app.chatapp.fixPrintAndSend(message, false);
    };
    
    this.showPainting = function () {
        this.$paintingTools.stop(true,false).unhide();
    };
    
    this.updateCanvas = function (updateValues) {
        if (this.$canvas === null) {
            updateValues = true;
            var oWidth = this.$element[0].naturalWidth;
            var oHeight = this.$element[0].naturalHeight;
            this.$canvas = $('<canvas id="pictureCanvas" width="' + oWidth + '" height="' + oHeight + '" />');
            this.$window.append(this.$canvas);
            this.canvasContext = this.$canvas[0].getContext('2d');
            this.$canvas.on('mousedown', function (e) {
                window.app.ui.pictureui.mousedown(e);
                $(window).on('mouseup.canvasDrawing', function (e) {
                    $(this).off('mouseup.canvasDrawing');
                    window.app.ui.pictureui.mouseup(e);
                });
            }).on('mousemove', function (e) {
                window.app.ui.pictureui.mousemove(e);
            }).on('mouseup', function (e) {
                window.app.ui.pictureui.mouseup(e);
                $(window).off('mouseup.canvasDrawing');
            }).on('touchstart', function (e) {
                window.app.ui.pictureui.touchstart(e);
            }).on('touchmove', function (e) {
                window.app.ui.pictureui.touchmove(e);
            }).on('touchend touchcancel', function (e) {
                window.app.ui.pictureui.touchcancel(e);
            });
            this.oWidth = oWidth;
            this.oHeight = oHeight;
        }
        if (updateValues) {
            this.$canvas.css({
                top : this.$element.css('top'),
                left : this.$element.css('left'),
                height : this.$element.css('height'),
                width : this.$element.css('width')
            });
            this.width = this.$canvas.width();
            this.height = this.$canvas.height();
            this.offset = this.$canvas.offset();
        }
        
        if (this.drawings[this.src] === undefined) this.drawings[this.src] = [];
        
        this.canvasContext.clearRect(0,0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        
        if (this.src.toUpperCase().indexOf('.GIF') === -1) {
            this.canvasContext.drawImage(this.$element[0],0,0);
        }
        this.canvasContext.beginPath();
        
        if (this.drawings[this.src] !== undefined) {
            this.drawArray(this.drawings[this.src]);
        }
        if (this.myArt[this.src] !== undefined) {
            this.drawArray(this.myArt[this.src]);
        }
        
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    };
    
    this.drawArray = function (drawings) {
        for (var i = 0; i < drawings.length; i++) {
            var drawing = drawings[i];
            if (drawing.length >= 4) {
                if (drawing.length === 4 || drawing[4] === 1) {
                    this.canvasContext.stroke();
                    this.canvasContext.closePath();
                    this.canvasContext.beginPath();
                    this.canvasContext.lineWidth = 2;
                    this.canvasContext.lineCap = "round";
                    this.canvasContext.moveTo(drawing[0], drawing[1]);
                }
                
                if (!isNaN(drawing[2], 10)) {
                    this.canvasContext.lineWidth = parseInt(drawing[2]);
                }
                
                if (drawing[3].indexOf('#') !== -1) {
                    this.canvasContext.globalCompositeOperation="source-over";
                    this.canvasContext.strokeStyle = drawing[3];
                } else {
                    this.canvasContext.globalCompositeOperation="destination-out";
                }
                if (drawing.length === 3 || drawing[3] === 1) {
                    continue;
                }
            }
            this.canvasContext.lineTo(drawing[0], drawing[1]);
            this.canvasContext.moveTo(drawing[0], drawing[1]);
        }
    };
    
    this.touchtomouse = function (e) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        return touch;
    };
    
    this.touchstart = function (e) {
        e.preventDefault();
        this.mousedown(this.touchtomouse(e));
    };
    
    this.touchmove = function (e) {
        e.preventDefault();
        if (this.touchTimeout !== null) {
            window.clearTimeout(this.touchTimeout);
        }
        this.touchTimeout = window.setTimeout(200, function () {
            window.app.ui.pictureui.touchTimeout = null;
            window.app.ui.pictureui.mouseup();
        });
        this.mousemove(this.touchtomouse(e));
    };
    
    this.touchcancel = function (e) {
        e.preventDefault();
        this.mouseup();
    };
    
    /**
     * 
     * @param {MouseEvent} e
     * @returns {undefined}
     */
    this.mousedown = function (e) {
        this.painting = true;
        this.myArt[this.src] = [];
        if (this.locked) {
            if (!window.app.chatapp.room.getMe().isStoryteller()) {
                this.painting = false;
            }
        }
        this.mousemove(e, 1);
    };
    
    /**
     * 
     * @param {MouseEvent} e
     * @returns {undefined}
     */
    this.mouseup = function () {
        this.painting = false;
        if (this.touchTimeout !== null) {
            window.clearTimeout(this.touchTimeout);
            this.touchTimeout = null;
        }
        // send art through chat
        if (this.myArt[this.src].length === 0) return;
        this.drawings[this.src] = this.drawings[this.src].concat(this.myArt[this.src]);
        var message = new Message();
        message.module = 'pica';
        message.setSpecial('art', this.myArt[this.src]);
        message.msg = this.src;
        window.app.chatapp.fixPrintAndSend(message, true);
        this.myArt[this.src] = [];
    };
    
    /**
     * 
     * @param {MouseEvent} e
     * @returns {undefined}
     */
    this.mousemove = function (e, newOne) {
        if (newOne === undefined) newOne = 0;
        if (this.painting) {
            var relX = e.pageX - this.offset.left;
            var relY = e.pageY - this.offset.top;
            var finalX = parseInt((relX/this.width) * this.oWidth);
            var finalY = parseInt((relY/this.height) * this.oHeight);
            var array = [];
            
            array.push(finalX);
            array.push(finalY);
            if (newOne) {
                array.push(this.size);
                array.push(this.color);
            }
            
            this.myArt[this.src].push(array);
            this.updateCanvas();
        }
    };
    
    this.close = function () {
        this.$window.stop(true,false).fadeOut(200, function () {
            if (!window.app.ui.pictureui.$window.is(':visible')) {
                window.app.ui.pictureui.$element.removeAttr('src');
            }
            if (window.app.ui.pictureui.$canvas !== null) {
                window.app.ui.pictureui.$canvas.remove();
                window.app.ui.pictureui.$canvas = null;
            }
        });
    };
    
    this.invalidPicture = function () {
        this.$element.css('width', '').css('height', '');
        this.$element.attr('src', this.link404);
        this.$element.off('error');
    };
    
    this.streaming = function (streaming) {
        this.stream = streaming;
        if (streaming) {
            this.$window.css('width', '');
            this.$window.css('right', '');
        }
        this.handleResize();
        this.updatePicture();
    };
    
    this.changeSize = function () {
        this.$currentSize.removeClass("paintIconSmall paintIconMedium paintIconLarge");
        if (this.size === 1) {
            this.size = 3;
            this.$currentSize.addClass("paintIconMedium");
        } else if (this.size === 3) {
            this.size = 6;
            this.$currentSize.addClass("paintIconLarge");
        } else {
            this.size = 1;
            this.$currentSize.addClass("paintIconSmall");
        }
    };
}