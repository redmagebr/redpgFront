function LoginApp () {
    this.logged = false;
    this.user = new User();
    this.jsessid = null;
    
    this.onLoggedout = function () {};
    
    this.setJsessid = function (id) {
        this.jsessid = id;
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
}