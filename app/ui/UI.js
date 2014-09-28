/**
 * Controlador geral da interface com o usuário.
 * @class UI
 * @constructor
 * @requires Chat
 */
function UI () {
    /**
     * @type Chat
     */
    this.chat = new Chat();
    /**
     * @type Language
     */
    this.language = new Language();
    
    /**
     * 
     * @type LoginUI
     */
    this.loginui = new LoginUI();
    
    /**
     * @type ChangelogUI
     */
    this.changelogui = new ChangelogUI();
    
    
    this.soundui = new SoundUI();
    
    this.imageui = new ImageUI();
    
    this.configui = new ConfigUI();
    
    this.gameui = new GameUI();
    
    this.youtubeui = new YoutubeUI();
    
    this.sheetui = new SheetUI();
    
    this.navigator = new Navigator();
    
    this.addonui = new AddonUI();
    
    this.styleui = new StyleUI();
    
    this.pictureui = new PictureUI();
    
    
    this.simplefloater = new SimpleFloater();
    
    /**
     * Only call element once.
     */
    this.$loading;
    this.loadingCount = 1;
    this.$leftWindow;
    this.$rightWindow;
    this.$leftHandler;
    this.$rightHandler;
    this.$pictureContainer;
    this.$window;
    this.$leftBlocker;
    this.leftBlockCount = 0;
    this.$rightBlocker;
    this.rightBlockCount = 0;
    
    this.hasFocus = true;
    this.title = "RedPG";
    this.nonotifications = false;
    this.notificationLingo = "_NEWMESSAGES_";
    
    this.widthInterval;
    this.lastWidth;
    this.lastHeight = 0;
    this.lastWidth = 0;
    this.$singletonCss = $('<style type="text/css" />');
    this.$removeAvatarCss = $('<style type="text/css" />');
    
    this.lastLeft = '';
    this.lastRight = '';
    
    /**
     * Initializes User Interface. Applies bindings and such.
     * Also calls init on every child.
     * @returns {void}
     */
    this.init = function () {
        $('head').append(this.$singletonCss)
                 .append(this.$removeAvatarCss);
        
        if (jQuery.browser.mobile) {
            $('body').addClass('mobile');
            
            // Some mobile browsers DO NOT inform width changes because they are dirty little assholes
            this.widthInterval = setInterval(function () {
                if (window.app.ui.$window.width() !== window.app.ui.lastWidth) {
                    window.app.ui.handleResize();
                }
            }, 3000);
        }
        
        $(window).focus(function() {
            window.app.ui.hasFocus = true;
            window.app.ui.removeNotifications();
        })
        .blur(function() {
            window.app.ui.hasFocus = false;
        });
        
        this.$pictureContainer = $('#pictureContainer');
        this.$pictureContainer.css('visibility', 'hidden');
        this.$pictureContainer.css('opacity', 0);
        this.$loading = $('#loading');
        this.$leftWindow = $('#leftWindow');
        this.$rightWindow = $('#rightWindow');
        this.$leftHandler = $('#leftHandler');
        this.$rightHandler = $('#rightHandler');
        this.$window = $(window);
        this.hideLoading();
        this.applyBindings();
        this.configui.init();
        this.language.init();
        this.chat.init();
        this.changelogui.init();
        this.gameui.init();
        this.soundui.init();
        this.loginui.init();
        this.youtubeui.init();
        this.sheetui.init();
        this.navigator.init();
        this.handleResize();
        
        this.$leftBlocker = $('#leftBlock');
        this.$rightBlocker = $('#rightBlock');
        
        if (typeof localStorage.lastLogin !== 'undefined') {
            $('#loginInput').val(localStorage.lastLogin);
            $('#passwordInput').focus();
        } else {
            $('#loginInput').focus();
        }
        
        this.callLeftWindow('changelogWindow');
        this.callRightWindow('homeWindow');
    };
    
    this.unblockLeft = function () {
        if (--this.leftBlockCount === 0) {
            this.$leftBlocker.finish().fadeOut();
        }
    };
    
    this.blockLeft = function () {
        if (++this.leftBlockCount > 0) {
            this.$leftBlocker.show();
        }
    };
    
    this.unblockRight = function () {
        if (--this.rightBlockCount === 0) {
            this.$rightBlocker.finish().fadeOut();
        }
    };
    
    this.blockRight = function () {
        if (++this.rightBlockCount > 0) {
            this.$rightBlocker.show();
        }
    };
    
    this.hideLoading = function () {
        if (--this.loadingCount < 1) {
            this.$loading.stop(true, true).fadeOut(200);
        }
    };
    
    this.showLoading = function () {
        if (++this.loadingCount > 0) {
            this.$loading.stop(true, true).fadeIn(200);
        }
    };
    
    this.debugIndex = function () {
        $('div').each(function() {
            var $this = $(this);
            if ($this.css('z-index') && $this.css('z-index') !== 'auto') {
               console.log($this.attr('id') + ' - ' + $this.css('z-index'));
            }
        });
    };
    
    this.hideUI = function () {
        this.$leftHandler.css("visibility", "hidden");
        this.$rightHandler.css("visibility", "hidden");
        this.$leftWindow.css("visibility", "hidden");
        this.$rightWindow.css("visibility", "hidden");
        this.$pictureContainer.css("visibility", "hidden");
        this.$pictureContainer.css("opacity", 0);
    };
    
    this.showUI = function () {
        this.$leftHandler.css("visibility", "visible");
        this.$rightHandler.css("visibility", "visible");
        this.$leftWindow.css("visibility", "visible");
        this.$rightWindow.css("visibility", "visible");
    };
    
    
    /**
     * Handles UI resizes and updates UI to work with it.
     * Also calls upon handleResize of children.
     * @returns {void}
     */
    this.handleResize = function () {
        console.log('Handling resize');
        var height = window.app.ui.$window.height();
        if (height !== this.lastHeight) {
            this.lastHeight = height;
            height -= 50;
            this.$singletonCss.empty().append("div.styledWindow > div.singleton { height: " + parseInt(height) + "px; }");
            
            if (this.lastHeight < 500) {
                this.$removeAvatarCss.empty().append("#avatarContainer { display: none; } #areaChat { top: 10px; }");
            } else {
                this.$removeAvatarCss.empty();
            }
        }
        var width = window.app.ui.$window.width();
        if (width !== this.lastWidth) {
            this.lastWidth = width;
            this.checkWidth();
        }
        this.chat.handleResize();
        this.pictureui.handleResize();
    };
    
    /**
     * Checks current screen width and adds fullscreen tags to the windows if needed.
     * @returns {void}
     */
    this.checkWidth = function () {
        if (window.app.configdb.get('fullscreenmode', 'auto') === 'on' || this.lastWidth < 1240) {
            this.$leftWindow.addClass('fullScreen');
            this.$rightWindow.addClass('fullScreen');
            this.$leftHandler.addClass('fullScreen');
            this.$leftHandler.removeAttr('style');
            this.$rightHandler.addClass('fullScreen');
            this.$rightHandler.removeAttr('style');
            this.$pictureContainer.addClass('fullScreen');
            this.pictureui.fullscreen(true);
            this.$pictureContainer.css('width', '');
            this.$rightWindow.css('width', '');
            this.$leftWindow.css('right', '');
        } else {
            this.$leftWindow.removeClass('fullScreen');
            this.$rightWindow.removeClass('fullScreen');
            this.$leftHandler.removeClass('fullScreen');
            this.$rightHandler.removeClass('fullScreen');
            this.$pictureContainer.removeClass('fullScreen');
            this.pictureui.fullscreen(false);
            this.$leftHandler.css('left', '-100px');
            this.$rightHandler.css('right', '-100px');
            var available = this.lastWidth - 720;
            if (available <= 636) {
                this.$leftWindow.css('right', '720px');
                this.$rightWindow.css('width', '715px');
            } else {
                var avatarSize = 90;
                available -= 636;
                var right = 720;
                if (available > (avatarSize * 3)) {
                    right += available/2;
                } else if (available > (avatarSize * 2)) {
                    right += available/4;
                }
                right = parseInt (right);
                /* Right - Margin center - avatar buttons - margin left - margin right of window */
                var avatarRoom = this.lastWidth - right - 60 - 10 - 10 - 8;
                var avatarAmount = 1;
                while (avatarAmount * avatarSize <= avatarRoom) { avatarAmount++; }
                var giveBack = avatarRoom - (--avatarAmount * avatarSize);
                right += giveBack;
                this.$leftWindow.css('right', (right) + 'px');
                this.$rightWindow.css('width', (right - 5) + 'px');
                if (window.app.ui.chat.mc.getModule('stream') !== null || !window.app.ui.chat.mc.getModule('stream').isStream) {
                    this.$pictureContainer.css({"width" : (right - 10)});
                }
            }
        }
    };
    
    /**
     * Applies bindings to every general User Interface element.
     * Elements that fit better into children need to be bound by the appropriate class.
     * @returns {void}
     */
    this.applyBindings = function () {
        this.$pictureContainer.bind('click', function () {
            $(this).animate({
                'opacity' : 0
            }, 200, function () {
                $(this).css('visibility', 'hidden');
            });
        });
        
        /**
         * Left and Right handlers must move in and out as the mouse targets them.
         */
        this.$leftHandler.bind('mouseenter', function () {
            window.app.ui.$leftHandler.stop(true, false).animate({
                left: '0px'
            }, {
                duration: 100
            });
        });
        
        this.$leftHandler.bind('mouseleave', function () {
            if (!window.app.ui.$leftHandler.hasClass('fullScreen'))
            window.app.ui.$leftHandler.stop(true, false).animate({
                left: '-100px'
            }, {
                duration: 100
            });
        });
        
        this.$rightHandler.bind('mouseenter', function () {
            window.app.ui.$rightHandler.stop(true, false).animate({
                right: '0px'
            }, {
                duration: 100
            });
        });
        
        this.$rightHandler.bind('mouseleave', function () {
            if (!window.app.ui.$rightHandler.hasClass('fullScreen'))
            window.app.ui.$rightHandler.stop(true, false).animate({
                right: '-100px'
            }, {
                duration: 100
            });
        });
        
        /**
         * Keep track of window resizes.
         */
        $(window).on("resize", function () {
            window.app.ui.handleResize();
        });
    };
    
    this.hideRightWindows = function (cbs) {
        if (typeof cbs === 'undefined') cbs = function () {};
        
        this.$rightWindow.children('div.window').animate(
            {   
                left: '100%'
            }, 300, window.app.emulateBind(
                function () {
                    $(this).css('visibility', 'hidden');
                    this.cbs();
                }, {cbs : cbs})
        );

        this.lastRight = '';
    };
    
    this.isFullscreen = function () {
        return this.$leftWindow.hasClass('fullScreen');
    };
    
    /**
     * Hides every window on the left side that is not #windowid.
     * If #windowid is hidden, shows it.
     * @param {String} windowid div.window ID
     * @returns {void}
     */
    this.callLeftWindow = function (windowid, history) {
        if (history === undefined) history = true;
        if (windowid === this.lastLeft) return;
        if (history && windowid !== this.lastLeft) {
            this.lastLeft = windowid;
            this.addHistory(windowid);
        } else {
            this.lastLeft = windowid;
        }
        var $target = $('#'+windowid);
        this.$leftWindow.children('div.window:visible').not($target).trigger('beforeUnload.UI').stop(true, false).animate(
            {   
                right: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden').trigger('hidden.UI');
            }
        );

        $target.css('visibility', 'visible');
        
        $target.stop(true, false).animate(
            {   
                right: '0px'
            }, 300, function () {
                $(this).trigger('shown.UI');
            }
        );
        if (this.isFullscreen()) {
            this.hideRightWindows();
        }
    };
    
    this.closeLeftWindow = function () {
        this.$leftWindow.children('div.window:visible').stop(true, false).animate(
            {   
                right: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden').trigger('hidden.UI');
            }
        );

        this.lastLeft = '';
    };
    
    this.stopRightUnload = false;
    this.callRightWindow = function (windowid, history) {
        if (history === undefined) history = true;
        if (windowid === this.lastRight) return;
        if (history && windowid !== this.lastRight) {
            this.lastRight = windowid;
            this.addHistory();
        } else {
            this.lastRight = windowid;
        }
        var $target = $('#'+windowid);
        this.stopRightUnload = false;
        var $windows = this.$rightWindow.children('div.window:visible').not($target).trigger('beforeUnload.UI');
        if (this.stopRightUnload) {
            return;
        }
        $windows.stop(true, false).animate(
            {   
                left: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden').trigger('hidden.UI');
            }
        );

        $target.css('visibility', 'visible');
        
        $target.stop(true, false).animate(
            {   
                left: '0px'
            }, 300, function () {
                $(this).trigger('shown.UI');
            }
        );
    };
    
    this.closeRightWindow = function () {
        this.stopRightUnload = false;
        var $windows = this.$rightWindow.children('div.window');
        if (this.stopRightUnload) return;
        $windows.stop(true, false).animate(
            {   
                left: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden');
            }
        );
        this.lastRight = '';
    };
    
    this.updateConfig = function () {
        this.configui.updateConfig();
        
        window.app.ui.configui.$configlist.append("<p class='centered language' data-langhtml='_CONFIGFULLSCREEN_'></p>");
        
        var $options = $('<p class="centered" />');
        var $auto = $('<input id="configfullscreenmodeauto" type="radio" name="configfullscreenmode" value="auto" />');
        $auto.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.configdb.store('fullscreenmode', 'auto');
                window.app.updateConfig();
            }
        });
        if (window.app.configdb.get('fullscreenmode', 'auto') === 'auto') {
            $auto.prop('checked', true);
        }
        $options.append($auto);
        $options.append($('<label for="configfullscreenmodeauto" class="language" data-langhtml="_AUTOFULL_" />'));
        
        var $always = $('<input id="configfullscreenmodeon" type="radio" name="configfullscreenmode" value="on" />');
        $always.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.configdb.store('fullscreenmode', 'on');
                window.app.ui.callRightWindow(('justhideit'));
                window.app.updateConfig();
            }
        });
        if (window.app.configdb.get('fullscreenmode', 'auto') === 'on') {
            $always.prop('checked', true);
        }
        $options.append($always);
        $options.append($('<label for="configfullscreenmodeon" class="language" data-langhtml="_ONFULL_" />'));
        
        
        window.app.ui.configui.$configlist.append($options);
        
        window.app.ui.configui.$configlist.append($('<p class="explain language" data-langhtml="_CONFIGFULLSCREENEXPLAIN_" />'));
        
        this.handleResize();
        
        this.chat.updateConfig();
        this.language.updateConfig();
        this.gameui.updateConfig();
        this.soundui.updateConfig();
        this.youtubeui.updateConfig();
        this.sheetui.updateConfig();
        
        this.language.applyLanguageOn(this.configui.$configlist);
    };
    
    /**
     * Init UI once document is loaded. Fully loaded is overkill
     */
    $(document).ready(function () {
        window.app.ui.init();
    });
    
    $(window).load(function () {
        $('body').css('height', '100px');
        window.setTimeout(function () {
            $('body').css('height', '');
        }, 5);
    });
    
    this.notifyMessages = function () {
        if (this.nonotifications) {
            return false;
        }
        document.title = '(' + this.language.getLingo(this.notificationLingo) + ') ' + this.title;
    };
    
    this.removeNotifications = function () {
        document.title = this.title;
    };
    
    this.openHitbox = function () {
        var lastsrc = $('#hitboxChatiFrame').attr('src');
        if (lastsrc !== undefined && lastsrc !== null && lastsrc !== '') {
            this.callRightWindow('hitboxChat');
            return;
        }
        var channel = prompt("Channel:");
        var src = 'http://www.hitbox.tv/embedchat/' + channel;
        if (channel !== '' && channel !== null && src !== $('#hitboxChatiFrame').attr('src')) {
            $('#hitboxChatiFrame').attr(
                'src', 
                src
            );
        }
        this.callRightWindow('hitboxChat');
    };
    
    this.closeHitbox = function () {
        $('#hitboxChatiFrame').attr('src', '');
        this.closeRightWindow();
    };
    
    this.addHistory = function (id) {
        history.pushState({left : this.lastLeft, right: this.lastRight}, '', window.location);
    };
    
    window.onpopstate = function (e) {
        if (typeof e === 'object' && e.state !== undefined) {
            if (e.state.left !== undefined) {
                window.app.ui.callLeftWindow(e.state.left, false);
                window.app.ui.callRightWindow(e.state.right, false);
            } else if (e.state.sheetid !== undefined) {
                window.app.ui.sheetui.controller.openSheet(e.state.sheetid, undefined, undefined, undefined, undefined, false);
            }
        }
    };
}