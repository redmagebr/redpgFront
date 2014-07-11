function ConfigUI () {
    this.$mainwindow;
    this.$systemconfig;
    this.$statusunchanged;
    this.$statuschanged;
    
    this.$configlist;
    
    this.$error;
    this.$success;
    
    this.options = [];
    
    this.addonConfigs = {};
    
    
    this.init = function () {
        this.$configlist = $('#configList');
        this.$mainwindow = $('#configWindow');
        
        this.$error = $('#configError').hide();
        this.$success = $('#configSuccess').hide();
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#callSettingsWindowBt').bind('click', function () {
            window.app.ui.callLeftWindow("configWindow");
        });
        
        $('#configVersion').html(window.app.version[0] +
                                  '.' + window.app.version[1] +
                                  '.' + window.app.version[2]);
                          
        $('#configVersionButton').bind('click', function () {
            window.app.ui.callLeftWindow("changelogWindow");
        });
        
        $('#configSaveButton').bind('click', function () {
            window.app.ui.configui.saveConfig();
        });
        
        $('#configResetButton').bind('click', function () {
            window.app.configdb.empty();
        });
    };
    
    this.saveConfig = function () {
        window.app.ui.configui.$success.hide();
        window.app.ui.configui.$error.hide();
        var cbs = function () {
            window.app.ui.configui.$success.show();
        };
        var cbe = function () {
            window.app.ui.configui.$error.show();
        };
        window.app.configdb.sendToServer(cbs, cbe);
    };
    
    this.updateConfig = function () {
        this.$configlist.empty();
    };
}