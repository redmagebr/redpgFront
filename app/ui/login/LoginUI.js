function LoginUI () {
    this.$logininput;
    this.$loginpasswordinput;
    this.$loginwindow;
    this.$loginformwindow;
    this.$loginformform;
    this.$loginerrorinvalid;
    this.$loginerrorconnection;
    this.$logininactiveerror;
    this.$timeouterror;
    this.$confirmsuccess;
    this.$confirmerror;
    this.$createwindow;
    this.$cainputname;
    this.$cainputnick;
    this.$cainputemail;
    this.$cainputpass;
    this.$cainputpass2;
    this.$cainputage;
    this.$caconnerror;
    this.$canickerror;
    this.$caemailerror;
    
    this.open = false;
    
    this.init = function () {
        this.$logininput = $('#loginInput');
        this.$loginpasswordinput = $('#passwordInput');
        this.$loginwindow = $('#loginWindow');
        this.$loginformwindow = $('#loginFormWindow');
        this.$createwindow = $('#loginCreateAccountWindow');
        this.$loginformform = $('#loginFormForm');
        //this.$createwindow.find('span').hide();
        
        this.$cainputname = $('#caInputName');
        this.$cainputnick = $('#caInputNick');
        this.$cainputemail = $('#caInputEmail');
        this.$cainputpass = $('#caInputPassword');
        this.$cainputpass2 = $('#caInputPassword2');
        this.$cainputage = $('#caInputAge');
        this.$caconnerror = $('#caConnError');
        this.$canickerror = $('#caNicknameError');
        this.$caemailerror = $('#caEmailError');
        
        $('#loginFlags').html(window.app.ui.language.createFlags());
        
        this.$loginerrorinvalid = $('#loginInvalidError');
        this.$loginerrorconnection = $('#loginConnectionError');
        this.$logininactiveerror = $('#loginInactiveError');
        this.$confirmsuccess = $('#loginConfirmationSuccess');
        this.$confirmerror = $('#loginConfirmationFailure');
        this.$timeouterror = $('#loginTimeoutError');
        
        
        this.$loginformwindow.find('p.error').hide();
        this.$loginwindow.find('.window').hide();
        this.callWindow('loginFormWindow');
        
        this.setBindings();
        this.considerConfirm();
        
        // If we have cookies, try to restore session first.
        if (window.app.loginapp.hasJsessid()) {
            this.restoreSession();
        }
        
        // On logged out
        
        window.app.loginapp.onLoggedout = window.app.emulateBind(
            function () {
                this.$loginwindow.show();
                this.ui.callWindow('loginFormWindow');
                window.app.ui.hideUI();
            }, {$loginwindow : this.$loginwindow, ui : this}
        );
    };
    
    this.considerConfirm = function () {
        this.$confirmerror.hide();
        this.$confirmsuccess.hide();
        if (window.location.search === '?confirm') {
            window.app.ui.showLoading();
            var uuid = window.location.hash.substr(1);
            var cbs = window.app.emulateBind(function () {
                this.$msg.show();
                window.app.ui.hideLoading();
            }, {$msg : this.$confirmsuccess});
            
            var cbe = window.app.emulateBind(function () {
                this.$msg.show();
                window.app.ui.hideLoading();
            }, {$msg : this.$confirmerror});
            
            window.app.loginapp.confirm(uuid, cbs, cbe);
        }
    };
    
    this.callWindow = function (id, cb) {
        /*
        var callback = function () {
            $('#' + this.id).fadeIn(200, this.cb);
        };
        if (typeof cb === 'undefined') {
            var cb = function () {};
        }
        callback = callback.bind({'id':id, 'cb':cb});
        this.$loginwindow.find('.window:not(#'+id+')').fadeOut(200, callback);
        */
        window.app.ui.hideUI();
        this.$loginwindow.find('.window:not(#'+id+')').hide();
        $('#' + id).show();
        if (typeof cb !== 'undefined')
            cb();
        
        this.open = true;
    };
    
    this.setBindings = function () {
        $(document).on('submit','#loginFormForm', function() {
            window.app.ui.loginui.processLogin();
        });
        
        $('#newAccountButton').bind('click', function() {
            window.app.ui.loginui.openCreation();
        });
        
        $('#createAccountButton').bind('click', function () {
            window.app.ui.loginui.createAccount();
        });
        
        $('#loginConfirmationFailureButton').bind('click', function () {
            window.app.ui.loginui.considerConfirm();
        });
        
        this.$caemailerror.bind('click', function () {
            alert("Não implementado");
        });
        
        $('#emailConfirmationReturnLink').bind('click', function () {
            window.app.ui.loginui.callWindow('loginFormWindow');
        });
        
        $('#logoutBt').bind('click', function () {
            if (confirm(window.app.ui.language.getLingo("_CONFIRMLOGOUT_"))) {
                window.app.ui.loginui.logout();
            }
        });
    };
    
    this.createAccount = function () {
        this.$caconnerror.hide();
        this.$caemailerror.hide();
        this.$canickerror.hide();
        this.$createwindow.find('input').each(function() {
            $(this).removeClass('error');
        });
        
        var validation = new FormValidator($('#loginCreateAccountForm'));
        var valid = validation.validated;
        
        for (var i in validation.$errors) {
            validation.$errors[i].addClass('error');
        }
        
        if (!this.$cainputage.is(':checked')) {
            this.$cainputage.addClass('error');
            valid = false;
        }
        if (this.$cainputpass.val() !== this.$cainputpass2.val()) {
            this.$cainputpass2.addClass('error');
            valid = false;
        }
        if (valid) {
            window.app.ui.showLoading();
            
            var form = {
                name : this.$cainputname.val(),
                nickname : this.$cainputnick.val(),
                email : this.$cainputemail.val(),
                password : this.$cainputpass.val()
            };
            
            var cbs = function (data) {
                window.app.ui.loginui.callWindow('emailConfirmation', function () {
                    window.app.ui.hideLoading();
                });
                console.log(data);
            };
            
            var cbe = function (data) {
                console.log(data);
                if (data.status === 409) {
                    window.app.ui.loginui.$caemailerror.show();
                } else if (data.status === 420) {
                    window.app.ui.loginui.$canickerror.show();
                } else {
                    window.app.ui.loginui.$caconnerror.show();
                }
                window.app.ui.hideLoading();
                console.log(data);
            };
            
            window.app.loginapp.createAccount(form, cbs, cbe);
        }
    };
    
    this.openCreation = function () {
        this.$caconnerror.hide();
        this.$caemailerror.hide();
        this.$canickerror.hide();
        this.callWindow('loginCreateAccountWindow', function () {
            window.app.ui.loginui.$cainputname.focus();
        });
    };
    
    this.restoreSession = function () {
        window.app.ui.showLoading();
        
        
        var cbs = window.app.emulateBind(function () {
            window.app.ui.showUI();
            this.$loginwindow.fadeOut(200);
            window.app.ui.hideLoading();
            window.app.ui.loginui.onLogin(null);
        }, {$loginwindow : this.$loginwindow});
        
        var cbe = function () {
            window.app.ui.hideLoading();
        };
        
        window.app.loginapp.login(null, null, cbs, cbe);
    };
    
    this.processLogin = function () {
        this.$confirmsuccess.hide();
        this.$loginerrorconnection.hide();
        this.$loginerrorinvalid.hide();
        this.$logininactiveerror.hide();
        
        var validate = new FormValidator(this.$loginformform);
        
        var cbs = window.app.emulateBind(function () {
            window.app.ui.showUI();
            localStorage.lastLogin = this.$input.val();
            this.$input.val('');
            this.$password.val('');
            this.$loginwindow.fadeOut(200);
            window.app.ui.hideLoading();
            window.app.ui.loginui.onLogin(null);
        }, {$loginwindow : this.$loginwindow,
            $input : this.$logininput,
            $password : this.$loginpasswordinput});
        
        if (!validate.validated) {
            this.$loginerrorinvalid.show();
            if (window.app.debug && this.$logininput.val() === '') {
                cbs();
            }
            return false;
        }
        
        window.app.ui.showLoading();
        var cbe = window.app.emulateBind(function (data) {
            var code = data.status;
            if (code === 404) {
                this.$logininvalid.show();
            } else if (code === 401) {
                this.$logininactiveerror.show();
            } else {
                this.$loginerror.show();
            }
            window.app.ui.hideLoading();
        }, {$loginerror : this.$loginerrorconnection,
            $logininvalid : this.$loginerrorinvalid,
            $logininactiveerror : this.$logininactiveerror});
        
        var login = this.$logininput.val();
        var password = this.$loginpasswordinput.val();
        
        window.app.loginapp.login(login, password, cbs, cbe);
    };
    
    this.logout = function () {
        window.app.ui.showLoading();
        
        var cbs = window.app.emulateBind(
            function () {
                this.$loginwindow.show();
                this.ui.callWindow('loginFormWindow');
                window.app.ui.chat.cc.exit();
                window.app.ui.callLeftWindow('changelogWindow');
                window.app.ui.callRightWindow('homeWindow');
                window.app.ui.hideLoading();
            }, {$loginwindow : this.$loginwindow, ui : this}
        );

        var cbe = function () {
            alert("Erro - Logout não realizado");
            window.app.ui.hideLoading();
        };
        
        window.app.loginapp.logout(cbs, cbe);
    };
    
    this.loginFunc = [];
    
    this.onLogin = function (func) {
        if (func === null) {
            for (var i = 0; i < this.loginFunc.length; i++) {
                this.loginFunc[i]();
            }
        } else if (typeof func === 'function') {
            this.loginFunc.push(func);
        }
    };
}