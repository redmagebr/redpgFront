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
    this.$singletonCss = $('<style type="text/css" />');
    
    /**
     * Initializes User Interface. Applies bindings and such.
     * Also calls init on every child.
     * @returns {void}
     */
    this.init = function () {
        $('head').append(this.$singletonCss);
        
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
        this.imageui.init();
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
        this.checkWidth(); 
       this.chat.handleResize();
       var height = window.app.ui.$window.height();
       if (height !== this.lastHeight) {
           this.lastHeight = height;
           height -= 50;
           this.$singletonCss.empty().append("div.styledWindow > div.singleton { height: " + height + "px; }");
       }
    };
    
    /**
     * Checks current screen width and adds fullscreen tags to the windows if needed.
     * @returns {void}
     */
    this.checkWidth = function () {
        this.lastWidth = this.$window.width();
        if (window.app.configdb.get('fullscreenmode', 'auto') === 'on' || this.lastWidth < 1240) {
            this.$leftWindow.addClass('fullScreen');
            this.$rightWindow.addClass('fullScreen');
            this.$leftHandler.addClass('fullScreen');
            this.$leftHandler.removeAttr('style');
            this.$rightHandler.addClass('fullScreen');
            this.$rightHandler.removeAttr('style');
            this.$pictureContainer.addClass('fullScreen');
            this.$rightWindow.css('width', '');
            this.$leftWindow.css('right', '');
        } else {
            this.$leftWindow.removeClass('fullScreen');
            this.$rightWindow.removeClass('fullScreen');
            this.$leftHandler.removeClass('fullScreen');
            this.$rightHandler.removeClass('fullScreen');
            this.$pictureContainer.removeClass('fullScreen');
            this.$leftHandler.css('left', '-100px');
            this.$rightHandler.css('right', '-100px');
            var available = this.lastWidth - 750;
            if (available <= 600) {
                this.$leftWindow.css('right', '750px');
                this.$rightWindow.css('width', '730px');
            } else {
                available -= 600;
                var right = 730 + (available / 2);
                right = parseInt (right);
                this.$leftWindow.css('right', (right + 20) + 'px');
                this.$rightWindow.css('width', right + 'px');
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
         * "Hide every window" buttons.
         */
        $('#hideLeftWindowsBt').bind('click', function () {
            $('#leftWindow div.window').addClass('hidden', 100);
        });
        
        $('#hideRightWindowsBt').bind('click', function () {
            window.app.ui.hideRightWindows();
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
    this.callLeftWindow = function (windowid) {
        var $target = $('#'+windowid);
        this.$leftWindow.children('div.window').not($target).animate(
            {   
                right: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden');
            }
        );

        $target.css('visibility', 'visible');
        
        $target.animate(
            {   
                right: '0px'
            }, 300
        );
        if (this.isFullscreen()) {
            this.hideRightWindows();
        }
    };
    
    this.closeLeftWindow = function () {
        this.$leftWindow.children('div.window').animate(
            {   
                right: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden');
            }
        );
    };
    
    
    this.callRightWindow = function (windowid) {
        var $target = $('#'+windowid);
        this.$rightWindow.children('div.window').not($target).animate(
            {   
                left: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden');
            }
        );

        $target.css('visibility', 'visible');
        
        $target.animate(
            {   
                left: '0px'
            }, 300
        );
    };
    
    this.closeRightWindow = function () {
        this.$rightWindow.children('div.window').animate(
            {   
                left: '100%'
            }, 300, function () {
                $(this).css('visibility', 'hidden');
            }
        );
    };
    
    
    this.showPicture = function (url) {
        //url = decodeURIComponent(url);
        try {
            url = decodeURIComponent(url);
        } catch (e) {
            
        }
        if (url.indexOf('dropbox.com') !== -1 && url.indexOf('?dl=1') === -1) {
            url = url + '?dl=1';
        }
        var $pic = $('<div id="pictureShow" />').append($('<img />').attr('src', url));
        console.log($pic);
        this.$pictureContainer.empty().append($pic);
        $pic.imgLiquid({fill:false});
        this.$pictureContainer.css('visibility', 'visible');
        this.$pictureContainer.animate({
            'opacity' : 1
        }, 200);
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
        if ($('#hitboxChatiFrame').attr('src') !== null && !$('#hitboxChatiFrame').is(':visible')) {
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
}