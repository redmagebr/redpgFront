function LoginApp () {
    this.logged = false;
    this.user = new User();
    this.jsessid = typeof localStorage.lastSession !== 'undefined' ? localStorage.lastSession : null;
    this.timeout = null;
    
    this.onLoggedout = function () {};
    
    this.setJsessid = function (id) {
        this.jsessid = id;
        localStorage.lastSession = id;
    };
    
    this.getJsessid = function () {
        return this.jsessid;
    };
    
    this.hasJsessid = function () {
        return (this.jsessid !== null);
    };
    
    this.approvedLogin = function (json) {
        this.user.updateFromJSON(json['user']);
        window.app.configdb.updateFromJSON(json.user['config']);
        this.logged = true;
        this.jsessid = json['session'];
        localStorage.lastSession = this.jsessid;
        this.setTimeout();
    };
    
    this.confirm = function (uuid, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'confirm', uuid: uuid},
            success : cbsuccess,
            error: cberror
        });
    };
    
    this.login = function (login, password, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        var cbs = window.app.emulateBind(
            function (data) {
                this.loginapp.approvedLogin(data);
                this.cbsuccess(data);
            },
            { loginapp : this,
            cbsuccess : cbsuccess }
        );
        
        var data = {};
        
        if (login !== null && password !== null) {
            data.login = login;
            data.password = password;
        }
        
        data.action = 'login';
        
        ajax.requestPage({
            url : 'Account',
            data : data,
            dataType : 'json',
            success : cbs,
            error: cberror
        });
    };
    
    this.createAccount = function (object, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        object.action = 'newAccount';
        
        ajax.requestPage({
            url : 'Account',
            data : object,
            success : cbsuccess,
            error: cberror
        });
    };
    
    this.changePassword = function (oldpassword, newpassword, cbsuccess, cberror) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'changePassword', 
                    oldpass: oldpassword,
                    newpass: newpassword},
            success : cbsuccess,
            error: cberror
        });
    };
    
    this.logout = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            window.app.loginapp.clearTimeout();
            this.cbs(data);
        }, {cbs : cbs});
        
        ajax.requestPage({
            url : 'Account',
            data: {action : 'logout'},
            success: cbs,
            error: cbe
        });
    };
    
    
    this.checkLogin = function () {
        window.app.ui.showLoading();
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'requestSession'},
            dataType : 'json',
            success : window.app.emulateBind(
                function (json) {
                    if (!json.logged) {
                        this.loginapp.logged = false;
                        this.loginapp.user = new User();
                        this.loginapp.jsessid = json.session;
                        this.loginapp.onLoggedout();
                    }
                }, {loginapp : this}
            ),
            complete : function () {
                window.app.ui.hideLoading();
            }
        });
    };
    
    this.silentlyCheckLogin = function () {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'Account',
            data : {action : 'requestSession'},
            dataType : 'json',
            success : window.app.emulateBind(
                function (json) {
                    if (!json.logged) {
                        this.loginapp.logged = false;
                        this.loginapp.user = new User();
                        this.loginapp.jsessid = json.session;
                        this.loginapp.onLoggedout();
                        return;
                    }
                    window.app.loginapp.setTimeout();
                }, {loginapp : this}
            )
        });
    };
    
    this.setTimeout = function () {
        this.clearTimeout();
        this.timeout = setTimeout(function () {
            window.app.loginapp.silentlyCheckLogin();
        }, 60000);
    };
    
    this.clearTimeout = function () {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
    };
}