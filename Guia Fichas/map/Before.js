/** 
 * Zooming 
 */
this.mapFactor = 1;

/**
 * Change Factor
 */
this.changeFactor = function (mod) {
    this.mapFactor += ((0.2 * this.mapFactor) * mod);
    var nWidth = this.$mapImg[0].naturalWidth;
    var nHeight = this.$mapImg[0].naturalHeight;
    var mWidth = this.$mapDiv.width();
    var mHeight = this.$mapDiv.height();
    var fWidth = (mWidth - 6) / nWidth;
    var fHeight = (mHeight - 6) / nHeight;
    var factor = fWidth > fHeight ? fWidth : fHeight;
    
    if (this.mapFactor < factor) {
        this.mapFactor = factor;
    }
    
    this.updateMap(true);
};

/**
 * Actual Function
 */
this.updateMap = function (ready) {
    // Map is only visible when editing
    if (this.editing) {
        if (this.$mapCanvas !== null) {
            this.$mapCanvas.remove();
            this.$mapCanvas = null;
        }
        return;
    }
    
    // Create background image
    if (!ready) {
        var imageUrl = this.mainSheet.getField("Map").getObject()[0];
        if (imageUrl === null) {
            this.$mapDiv.hide();
            return;
        } else {
            this.$mapDiv.unhide();
        }
        if (this.$mapImg === null || imageUrl !== this.$mapImg.attr('src')) {
            if (this.$mapImg !== null) {
                this.$mapImg.remove();
            }
            imageUrl = window.app.imageapp.prepareUrl(imageUrl);
            this.$mapImg = $('<img id="mapBackground" />').attr('src', imageUrl).on('error', function () {
                $(this).off('error').attr('src', 'img/404.png');
            }).on('load', this.emulateBind(function () {
                this.style.changeFactor(0);
            }, {style : this}));

            this.$mapDiv.append(this.$mapImg);
        }   
    }
    
    // Create canvas
    if (this.$mapCanvas !== null) {
        this.$mapCanvas.remove();
    }
    var oWidth = this.$mapImg[0].naturalWidth;
    var oHeight = this.$mapImg[0].naturalHeight;
    
    this.$mapCanvas = $('<canvas id="mapCanvas" width="' + oWidth + '" height="' + oHeight + '"/>').on('mousemove', this.emulateBind(function (e) {
        this.style.mapDrag(e.pageX, e.pageY, false);
    }, {style : this})).on('mousedown', this.emulateBind(function (e) {
        this.style.mapDrag(e.pageX, e.pageY, true);
    }, {style : this})).on('mouseup mouseout', this.emulateBind(function (e) {
        this.style.mapDrag(null, null);
    }, {style : this})).on('mousewheel', this.emulateBind(function (e) {
        e.stopPropagation();
        var up = e.originalEvent.wheelDelta >= 0;
        var factor = up ? 1 : -1;
        this.style.changeFactor(factor * 0.25);
    }, {style : this}));
    
    var height = oHeight * this.mapFactor;
    var width = oWidth * this.mapFactor;
    
    this.$mapImg.css({
        height: height,
        width: width
    });
    
    this.$mapCanvas.css({
        height: height,
        width: width
    });
    
    this.$mapDiv.append(this.$mapCanvas);
    this.mapContext = this.$mapCanvas[0].getContext('2d');
    this.mapContext.beginPath();
    this.mapContext.lineWidth = 1;
    var ax = this.mainSheet.getField("MapX").getObject();
    var ay = this.mainSheet.getField("MapY").getObject();
    if (ax < 1) ax = 1;
    if (ay < 1) ay = 1;
    var y = 0;
    var x = 0;
    var sy = oHeight / ay;
    this.mapSy = sy;
    var sx = oWidth / ax;
    this.mapSx = sx;
    if (sy < 1 || sx < 1) {
        return;
    }
    while (y <= oHeight) {
        this.mapContext.moveTo(0, y);
        this.mapContext.lineTo(oWidth, y);
        y += sy;
    }
    while (x <= oWidth) {
        this.mapContext.moveTo(x, 0);
        this.mapContext.lineTo(x, oHeight);
        x += sx;
    }
    this.mapContext.stroke();
    this.mapContext.closePath();
    
    this.$mapDiv.children('div.token').remove();
    
    var curTurn = window.app.ui.chat.tracker.getCurrentTurn();
    var curTarget = window.app.ui.chat.tracker.getTarget();
    
    var $token;
    var $img;
    var token;
    var tokens = this.mainSheet.getField("Tokens").getObject();
    var url;
    var nome;
    for (var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        url = token['Token'][0];
        nome = token['Sheet'][1];
        if (token['Y'] >= ay) {
            token['Y'] = ay - 1;
        } else if (token['Y'] < 0) {
            token['Y'] = 0;
        }
        if (token['X'] >= ax) {
            token['X'] = ax - 1;
        } else if (token['X'] < 0) {
            token['X'] = 0;
        }
        if (nome === null) nome = '';
        nome = nome.trim();
        if (url === null) url = 'img/404.png';
        $img = $('<img class="token" />').attr('data-angle', token['Angle']);
        $token = $("<div class='token' />").append(
                $img
        );

        this.setTokenInitially($token, token['TokenSize']);
        
        $token.on('updateBorder', this.emulateBind(function () {
            var curTurn = window.app.ui.chat.tracker.getCurrentTurn();
            var curTarget = window.app.ui.chat.tracker.getTarget();
            var nome = this.nome;
            if (this.id === curTurn) {
                this.$token.addClass('turn');
                if (nome !== '') nome += ' - ';
                nome += window.app.ui.language.getLingo("_MAPCURRENTTURN_");
            } else {
                this.$token.removeClass('turn');
            }
            if (this.id === curTarget) {
                this.$token.addClass('target');
                if (nome !== '') nome += ' - ';
                nome += window.app.ui.language.getLingo("_MAPTARGET_");
            } else {
                this.$token.removeClass('target');
            }
            
            this.$token.attr('title', nome);
            if (this.$token.is(':visible')) {
                window.setTimeout(window.app.emulateBind(function () {
                    this.$token.trigger('updateBorder');
                }, {$token : this.$token}), 1000);
            } else {
                this.$token.off('updateBorder');
            }
        }, {$token : $img, nome : nome, id : token['Sheet'][0]}));
        
        $img.attr('src', window.app.imageapp.prepareUrl(url)).on('load', this.emulateBind(function () {
            this.style.setToken(this.$token, this.tokenSize + 1);
        }, {style : this, $token : $token, tokenSize : token['TokenSize']})).css('-webkit-transform', 'rotate(' + token['Angle'] + 'deg)');
        
        $token.draggable({
            containment : '#mapMap',
            stop : this.emulateBind(function () {
                this.style.moveToken(this.$token, this.token);
            }, {style : this, $token : $token, token : i})
        }).css({
            top : token['Y'] * this.mapSy * this.mapFactor,
            left : token['X'] * this.mapSx * this.mapFactor,
            height: 1,
            width: 1
        }).attr('title', nome).on('error', function () {
            $(this).off('error').attr('src', 'img/404.png');
        }).css('position', '').on('mousewheel', this.emulateBind(function (e) {
            e.preventDefault();
            e.stopPropagation();
            var up = e.originalEvent.wheelDelta >= 0;
            this.style.rotateToken(this.$token, this.index, up);
        }, {$token : $token, style : this, index : i}));
        
    
        
        
        this.$mapDiv.append($token);
        $token.trigger('updateBorder');
    }
};

this.rotateTimeout = null;
this.rotateToken = function ($this, index, up) {
    var $img = $this.find("img");
    var factor = up ? -1 : 1;
    var angle = parseInt($img.attr('data-angle')) + (45 * factor);
    while (angle < -360) angle += 360;
    while (angle > 360) angle -= 360;
    if (angle < 0) angle = 360 - angle;
    
    if (this.rotateTimeout !== null) {
        window.clearTimeout(this.rotateTimeout);
    }
    
    this.rotateTimeout = window.setTimeout(this.emulateBind(function () {
        this.style.rotateTimeout = null;
        if (this.style.sheet.editable) {
            this.style.mainSheet.getField('Tokens').list[index].getField('Angle').storeValue(this.angle);
            window.app.ui.sheetui.controller.saveSheet();
        } else {
            this.askForRotate(index, this.angle);
            this.style.updateMap(true);
        }
    }, {style : this, angle : angle}), 800);
    
    $img.css('-webkit-transform', 'rotate(' + angle + 'deg)').attr('data-angle', angle);
};

this.setTokenInitially = function ($token, size) {
    var mWidth = this.mapSx * size * this.mapFactor;
    var mHeight = this.mapSy * size * this.mapFactor;
    $token.css({
        height : mHeight + "px",
        width: mWidth + "px"
    });
};

this.setToken = function ($token, size) {
    if (size === null || size === undefined) size = 1;
    if (size < 1) {
        size = 1;
    } else if (size > 4) {
        size = 4;
    }
    size = parseInt(size);
    var $img = $token.find("img");
    var oWidth = $img[0].naturalWidth;
    var oHeight = $img[0].naturalHeight;
    
    var mWidth = this.mapSx * size * this.mapFactor;
    var mHeight = this.mapSy * size * this.mapFactor;
    
    var fWidth = (mWidth) / oWidth;
    var fHeight = (mHeight) / oHeight;
    
    var factor = fWidth < fHeight ? fWidth : fHeight;
    
    var width = oWidth * factor;
    var width = Math.round(width);
    var mLeft = (mWidth - width) /2;
    var height = oHeight * factor;
    height = Math.round(height);
    var mTop = (mHeight - height) /2;
    
    $token.css({
        height : height + "px",
        width: width + "px",
        'padding-top' : mTop + "px",
        'padding-left' : mLeft + "px",
        'padding-bottom' : mTop + "px",
        'padding-right' : mLeft + "px"
    });
    
    $token.find("img").css({
        height : height + "px",
        width: width + "px"
    });
};

this.moveToken = function ($token, index) {
    var tokenX = parseInt($token.css('left'));
    var tokenY = parseInt($token.css('top'));
    tokenX = Math.round((tokenX) / (this.mapSx * this.mapFactor));
    tokenY = Math.round((tokenY) / (this.mapSy * this.mapFactor));
    
    if (this.sheet.editable) {
        this.mainSheet.getField('Tokens').list[index].getField('X').storeValue(tokenX);
        this.mainSheet.getField('Tokens').list[index].getField('Y').storeValue(tokenY);
        $token.css({
            "left": tokenX * (this.mapSx * this.mapFactor),
            "top": tokenY * (this.mapSy * this.mapFactor)
        });
        window.app.ui.sheetui.controller.saveSheet();
    } else {
        this.askForMove(index, tokenX, tokenY);
        this.updateMap(true);
    }
};

this.mapDrag = function (relX, relY, start) {
    if (start) {
        this.lastX = relX;
        this.lastY = relY;
        return;
    } else if (this.lastX === undefined) {
        return;
    }
    
    if (relX === null) {
        delete this.lastX;
        delete this.lastY;
        return;
    }
    
    this.$mapDiv[0].scrollLeft -= (relX - this.lastX);
    this.$mapDiv[0].scrollTop -= (relY - this.lastY);
    
    this.lastX = relX;
    this.lastY = relY;
};

this.askForMove = function (index, newX, newY) {
    var nome = this.mainSheet.getField("Tokens").list[index].getField("Sheet").getObject()[1];
    var msg = new Message();
    msg.module = 'offgame';
    msg.setMessage(nome);
    msg.setSpecial("id", this.sheet.id);
    msg.setSpecial("x", newX);
    msg.setSpecial("y", newY);
    window.app.chatapp.fixPrintAndSend(msg, true);
};

this.askForRotate = function (index, newAngle) {
    var msg = new Message();
    msg.module = 'mapmv';
    msg.setMessage(index + ";" + newAngle);
    window.app.chatapp.fixPrintAndSend(msg, true);
};