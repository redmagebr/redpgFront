function StyleUI () {
    
    this.$form = $('#styleEditCreate').on('submit', function (e) {
        e.preventDefault();
        window.app.ui.styleui.submitForm();
    }).hide();
    
    this.$stylelist = $('#styleList');
    
    this.$idinput = $('#styleIdInput');
    this.$nameinput = $('#styleNameInput');
    this.$publicinput = $('#stylePublicInput');
    this.$afterinput = $('#styleAfterInput');
    this.$htmlinput = $('#styleHtmlInput');
    this.$cssinput = $('#styleCssInput');
    this.$beforeinput = $('#styleBeforeInput');
    this.$stayinput = $('#styleStayInput');
    this.$formError = $('#formError').empty();
    
    this.callSelf = function () {
        this.$form.hide();
        window.app.ui.callLeftWindow('styleWindow');
        
        var cbs = function () {
            window.app.ui.unblockLeft();
            window.app.ui.styleui.fillList();
        };
        
        var cbe = function () {
            window.app.ui.unblockLeft();
            alert("Erro");
        };
        window.app.ui.blockLeft();
        window.app.sheetapp.loadMyStyles(cbs, cbe);
    };
    
    this.fillList = function () {
        this.$stylelist.empty();
        
        var $style;
        var $edit;
        var style;
        
        for (var id in window.app.styledb.styles) {
            style = window.app.styledb.getStyle(id);
            if (style.idCreator !== window.app.loginapp.user.id) continue;
            $style = $('<p class="textLink hoverable" />').text(style.name).on('click', window.app.emulateBind(function () {
                window.app.ui.styleui.callEdit(this.id);
            }, {id : id}));
            this.$stylelist.append($style);
        }
        
        var $p = $('<p class="textLink hoverable language" data-langhtml="_STYLECREATE_" />').on('click', function () {
            window.app.ui.styleui.callEdit(0);
        });
        
        window.app.ui.language.applyLanguageTo($p);
        
        this.$stylelist.append($p).show();
    };
    
    this.callEdit = function (id) {
        this.$idinput.val(id);
        this.$stylelist.hide();
        window.app.ui.blockLeft();
        
        var cbs = function () {
            window.app.ui.styleui.fillEdit();
            window.app.ui.unblockLeft();
        };
        
        var cbe = function () {
            alert('erro');
            window.app.ui.unblockLeft();
        };
        if (id != 0) {
            window.app.sheetapp.loadStyle(id, cbs, cbe);
        } else {
            cbs();
        }
    };
    
    this.fillEdit = function () {
        this.$form.show();
        var id = parseInt(this.$idinput.val());
        var style = window.app.styledb.getStyle(id);
        if (style === null) style = new Style_Instance();
        
        this.$afterinput.val(style.afterProcess);
        this.$beforeinput.val(style.beforeProcess);
        this.$cssinput.val(style.css);
        this.$htmlinput.val(style.html);
        this.$nameinput.val(style.name);
    };
    
    this.submitForm = function () {
        var style = new Style_Instance();
        style.afterProcess = this.$afterinput.val();
        style.beforeProcess = this.$beforeinput.val();
        style.css = this.$cssinput.val();
        style.html = this.$htmlinput.val();
        style.id = parseInt(this.$idinput.val());
        style.name = this.$nameinput.val();
        style.public = this.$publicinput[0].checked;
        
        var cbs = function () {
            window.app.ui.styleui.$formError.hide();
            window.app.ui.unblockLeft();
            if (!window.app.ui.styleui.$stayinput[0].checked) {
                window.app.ui.styleui.callSelf();
            }
        };
        
        var cbe = function () {
            window.app.ui.unblockLeft();
            window.app.ui.styleui.$formError.text("Error").show();
        };
        
        window.app.ui.blockLeft();
        
        window.app.sheetapp.sendStyleUpdate(style, cbs, cbe);
    };
}