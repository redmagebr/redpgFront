function ConfigUI () {
    
    this.$langImg = $("#configLanguageImg");
    this.$langSelect = $("#configLanguageSelect").empty().on('change', function () {
        window.app.ui.language.changeLanguage($(this).val());
    });
    
    this.$ele = {};
    
    this.$ele['chatuseprompt'] = $("#configPromptSelect").on('change', function () {
        window.app.config.store('chatuseprompt', parseInt($(this).val()));
    });
    this.$ele['fsmode'] = $("#configFullscreen").on('change', function () {
        window.app.config.store('fsmode', parseInt($(this).val()));
    });
    this.$ele['autoBGM'] = $("#configAutoBGM").on('change', function () {
        window.app.config.store('autoBGM', parseInt($(this).val()));
    });
    this.$ele['autoSE'] = $("#configAutoSE").on('change', function () {
        window.app.config.store('autoSE', parseInt($(this).val()));
    });
    this.$ele['autoVIDEO'] = $("#configAutoVIDEO").on('change', function () {
        window.app.config.store('autoVIDEO', parseInt($(this).val()));
    });
    
    this.$ele['autoImage'] = $("#configAutoImage").on('change', function () {
        window.app.config.store('autoImage', parseInt($(this).val()));
    });
    
    this.$error = $("#configSaveError").hide();
    this.$success = $("#configSaveSuccess").hide();
    
    $("#configSaveButton").on('click', function () {
        window.app.ui.configui.$error.finish().hide();
        window.app.ui.configui.$success.finish().hide();
        var cbs = function () {
            window.app.ui.configui.$error.hide();
            window.app.ui.configui.$success.show().fadeOut(4000);
            window.app.ui.unblockLeft();
        };
        var cbe = function () {
            window.app.ui.configui.$error.show();
            window.app.ui.unblockLeft();
        };
        window.app.ui.blockLeft();
        window.app.config.sendToServer(cbs, cbe);
    });
    
    this.configChanged = function (id) {
        if (id === 'language') {
            var lang = window.app.config.get("language");
            this.$langSelect.val(lang);
            this.$langImg.removeClass().addClass(lang + "_Flag").attr("title", window.lingo[lang]._LANGUAGENAME_);
        } else if (['chatuseprompt', 'fsmode', 'autoBGM', 'autoSE', 'autoVIDEO','autoImage'].indexOf(id) !== -1) {
            this.$ele[id].val(window.app.config.get(id).toString());
        }
    };
    
    this.init = function () {
        window.app.config.addListener("language", this);
        window.app.config.addListener("autoBGM", this);
        window.app.config.addListener("autoSE", this);
        window.app.config.addListener("autoVIDEO", this);
        window.app.config.addListener("autoImage", this);
        window.app.config.addListener("chatuseprompt", this);
        window.app.config.addListener("fsmode", this);
        
        var lingos = window.lingo;
        var $option;
        for (var key in lingos) {
            $option = $("<option />").val(key).text(lingos[key]._LANGUAGENAME_);
            this.$langSelect.append($option);
        }
        
        
        $('#configVersion').html(window.app.version[0] +
                                 '.' + window.app.version[1] +
                                 '.' + window.app.version[2]);
                         
        $('#callSettingsWindowBt').bind('click', function () {
            window.app.ui.callLeftWindow("configWindow");
        });
  };
    
}