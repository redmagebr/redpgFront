function AvatarController () {
    this.$btup;
    this.$btdown;
    this.$container;
    
    this.$uw;
    this.$uwName;
    this.$uwNick;
    this.$uwAvatar;
    this.$uwPersonaP;
    this.$uwPersona;
    this.$uwWhisper;
    
    this.init = function () {
        this.$btup = $();
        this.$container = $('#avatarBox');
        this.$btup = $('#avatarUpButton');
        this.$btdown = $('#avatarDownButton');
        
        this.$uw = $('#avatarWindowWrapper');
        this.$uwName = $('#uWuserName');
        this.$uwNick = $('#uWuserNick');
        this.$uwAvatar = $('#uWuserAvatar');
        this.$uwPersonaP = $('#uWuserPersonaP');
        this.$uwPersona = $('#uWuserPersona');
        this.$uwWhisper = $('#uWuserWhisper');
        
        this.setBindings();
    };
    
    this.clear = function () {
        this.$container.empty();
    };
    
    this.setBindings = function () {
        this.$btdown.bind('click', function (){
            window.app.ui.chat.ac.animateDown();
        });
        
        this.$btup.bind('click', function (){
            window.app.ui.chat.ac.animateUp();
        });
        
        $('#uWuserClose').bind('click', function () {
            window.app.ui.chat.ac.$uw.fadeOut();
        });
        
        this.$uwWhisper.bind('click', function () {
            window.app.ui.chat.$chatinput.val('/whisper ' + $(this).attr('data-langp') + ', ');
            window.app.ui.chat.$chatinput.focus();
            window.app.ui.chat.ac.$uw.fadeOut();
        });
    };
    
    this.considerScrollers = function () {
        var scrollTop = this.$container.scrollTop();
        var height = this.$container.height();
        var scrollHeight = this.$container[0].scrollHeight;
        
        if (scrollTop + height < scrollHeight) {
            this.$btdown.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btdown.stop(true, true).addClass('deactivated', 200);
        }
        
        if (scrollTop > 0) {
            this.$btup.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btup.stop(true, true).addClass('deactivated', 200);
        }
    };
    
    this.animateDown = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.ac.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height();
                var scrollHeight = $this[0].scrollHeight;
                if (scrollTop + height <= scrollHeight) {
                    return scrollTop + height;
                } else {
                    return scrollTop;
                }
            } ()
        }, function () {
            window.app.ui.chat.ac.considerScrollers();
        });
    };
    
    this.animateUp = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.ac.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height();
                if (scrollTop - height >= 0) {
                    return scrollTop - height;
                } else {
                    return scrollTop;
                }
            } ()
        }, function () {
            window.app.ui.chat.ac.considerScrollers();
        });
    };
    
    this.handleResize = function () {
        this.considerScrollers();
    };
    
    
    /**
     * 
     * @param {jQuery} $user
     * @param {User} user
     * @returns {undefined}
     */
    this.update$ = function ($user, user, userState) {
        var callIgnore = [];
        
        if (user.avatarS === userState.avatar) {
            callIgnore.push('avatar');
        } else {    
            userState.avatar = user.avatarS;
        }
        
        var nick = user.nickname + '#' + user.nicknamesufix;
    
        if (user.personaS === userState.persona && nick === userState.nick) {
            callIgnore.push('persona');
        } else {
            userState.persona = user.personaS;
        }
        
        if (user.typing === userState.typing) {
            callIgnore.push('typing');
        } else {
            userState.typing = user.typing;
        }
        
        if (user.idle === userState.idle) {
            callIgnore.push('idle');
        } else {
            userState.idle = user.idle;
        }
        
        if (callIgnore.indexOf('persona') === -1) {
            if (user.personaS === null || user.personaS === '') {
                $user.children('span').text(user.nickname + '#' + user.nicknamesufix);
            } else {
                $user.children('span').text(user.personaS);
            }
        }
        
        if (callIgnore.indexOf('avatar') === -1) { 
            if (user.avatarS === null || user.avatarS === '') {
                $user.children('img').attr('src', "img/chat/iconAnon.jpg");
            } else {
                var url = user.avatar;
                if (url.indexOf('dropbox.com') !== -1) {
                    url = url.replace('dl=0', 'dl=1');
                    if (url.indexOf('dl=1') === -1) {
                        url = url + (url.indexOf('?') !== -1 ? '' : '?') + 'dl=1';
                    }
                }
                $user.children('img').attr('src', url);
            }
        }
        
        if (callIgnore.indexOf('typing') === -1 ) {
            var $typing = $user.children('a.typing');
            if (user.typing) {
                $typing.show();
            } else {
                $typing.hide();
            }
        }
        
        if (callIgnore.indexOf('idle') === -1 ) {
            var $idle = $user.children('a.idle');
            if (user.idle) {
                $idle.show();
            } else {
                $idle.hide();
            }
        }
        
        if (callIgnore.indexOf('focused') === -1) {
            if (user.focused) {
                $user.css('opacity', '1');
            } else {
                $user.css('opacity', '0.5');
            }
        }
    };
    
    /**
     * 
     * @param {User} user
     * @returns {undefined}
     */
    this.create$avatar = function (user) {
        var $html = $('<div class="avatarWrapper" />');
        var nick = user.nickname + '#' + user.nicknamesufix;
        var avatar = user.avatarS;
        
        $html.bind('click', window.app.emulateBind(
            function () {
                window.app.ui.chat.ac.showUserInfo(this.user);
            }, {user : user}
        ));
        
        
        if (user.personaS === null || user.personaS === '') {
            $html.append($('<span />').text(nick));
        } else {
            var $persona = $('<span />').text(user.personaS);
            $html.append($persona);
        }
        
        $html.attr('title', nick);
        
        var $typing = $('<a class="typing" />');
        if (user.typing) {
            $typing.show();
        } else {
            $typing.hide();
        }
        
        $html.append($typing);
        
        var $idle = $('<a class="idle" />');
        if (user.idle) {
            $idle.show();
        } else {
            $idle.hide();
        }
        
        $html.append($idle);
        
        if (avatar !== null && avatar !== '') {
            $html.append($('<img />').attr('src', avatar));
        } else {
            $html.append($('<img />').attr('src', "img/chat/iconAnon.jpg"));
        }
        
//        <div class="avatarWrapper">
//            <span>Reddo</span>
//            <img src="images/iconAnon.jpg"/>
//        </div>
        
        return $html;
    };
    
    this.append = function ($html) {
        this.$container.append($html);
        this.considerScrollers();
    };
    
    
    /**
     * 
     * @param {User} user
     * @returns {undefined}
     */
    this.showUserInfo = function (user) {
        if (user.avatarS !== null && user.avatarS !== '') {
            this.$uwAvatar.attr('src', user.avatarS);
        } else {
            this.$uwAvatar.attr('src', "img/chat/iconAnon.jpg");
        }
        var nick = user.nickname + '#' + user.nicknamesufix;
        var persona = user.personaS;
        this.$uwName.text(nick);
        this.$uwNick.text(nick);
        if (persona !== null && persona !== '') {
            this.$uwPersonaP.show();
            this.$uwPersona.text(persona);
        } else {
            this.$uwPersonaP.hide();
        }
        this.$uwWhisper.attr('data-langp', nick);
        window.app.ui.language.applyLanguageTo(this.$uwWhisper);
        this.$uw.fadeIn();
    };
}