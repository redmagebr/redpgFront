function AddonUI () {
    
    this.$box = $('#addonBox').hide();
    
    this.$handle = $('#addonBoxHandle').empty();
    this.$ul = $('#addonBoxUL');
    
    this.currentAddon = '';
    
    this.currentList = {};
    this.currentType = '';
    
    /**
     * 
     * @param {jQuery} $dom
     * @returns {$dom}
     */
    this.addonize = function ($dom, addon) {
        $dom.off('.addon').on('mouseenter.addon', function (e) {
            window.app.ui.addonui.showAddonBox($(this), e, 'addon');
        }).on('mouseleave.addon', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove.addon', function (e) {
            window.app.ui.addonui.moveAddonBox(e);
        }).attr('data-listid', addon);
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @returns {$dom}
     */
    this.turnVantagem = function ($dom, vantagem) {
        $dom.off('.addon').on('mouseenter.addon', function (e) {
            window.app.ui.addonui.showAddonBox($(this), e, 'vantagem');
        }).on('mouseleave.addon', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove.addon', function (e) {
            window.app.ui.addonui.moveAddonBox(e);
        }).attr('data-listid', vantagem);
    };
    
    /**
     * 
     * @param {jQuery} $dom
     * @returns {$dom}
     */
    this.turnDesvantagem = function ($dom, desvantagem) {
        $dom.off('.addon').on('mouseenter.addon', function (e) {
            window.app.ui.addonui.showAddonBox($(this), e, 'desvantagem');
        }).on('mouseleave.addon', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove.addon', function (e) {
            window.app.ui.addonui.moveAddonBox(e);
        }).attr('data-listid', desvantagem);
    };
    
    this.unAddonize = function ($dom) {
        $dom.off('.addon').attr('data-listid', '');
    };
    
    this.showAddonBox = function ($dom, e, type) {
        if (type === 'addon') {
            this.currentList = window.techAddonsHash;
            this.listType = 'addon';
        } else if (type === 'vantagem') {
            this.currentList = window.vantagensHash;
            this.listType = 'vantagem';
        } else if (type === 'desvantagem') {
            this.listType = 'desvantagem';
            this.currentList = window.desvantagensHash;
        }
        this.currentAddon = $dom.attr("data-listid").toUpperCase();
        if (this.currentList === undefined) {
            var cbs = function () {
                window.app.ui.addonui.updateAddonBox(2);
            };
            
            var cbe = function () {
                window.app.ui.addonui.updateAddonBox(0);
            };
            
            if (this.listType === 'addon') {
                window.app.addonapp.loadTecnicas(cbs, cbe);
            } else if (this.listType === 'vantagem' || this.listType === 'desvantagem') {
                window.app.addonapp.loadVantagens(cbs, cbe);
            }
            this.updateAddonBox(1);
        } else {
            window.app.ui.addonui.updateAddonBox(3);
        }
        this.$box.stop(true, false).fadeIn(100);
        this.moveAddonBox(e);
    };
    
    this.updateAddonBox = function (how) {
        if (this.listType === 'addon') {
            this.currentList = window.techAddonsHash;
        } else if (this.listType === 'vantagem') {
            this.currentList = window.vantagensHash;
        } else if (this.listType === 'desvantagem') {
            this.currentList = window.desvantagensHash;
        }
        var oldHeight = this.$box.height();
        if (this.currentList === undefined) {
            this.$handle.empty().append("<img id='addonBoxIcon' src='http://rules.redpg.com.br/img/icon/Unknown.png' />");
            if (how === 1) {
                this.$handle.append(window.app.ui.language.getLingo("_ADDONBOXLOADING_"));
                this.$ul.empty().append(
                    $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXLOADINGEXPLAIN_"))
                );
            } else if (how === 0) {
                this.$handle.append(window.app.ui.language.getLingo("_ADDONBOXLOADINGERROR_"));
                this.$ul.empty().append(
                    $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXLOADINGERROREXPLAIN_"))
                );
            } else {
                this.$handle.append(window.app.ui.language.getLingo("_ADDONBOXLOADEDERROR_"));
                this.$ul.empty().append(
                    $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXLOADEDERROREXPLAIN_"))
                );
            }
        } else if (this.currentList[this.currentAddon] === undefined) {
            this.$handle.empty().append("<img id='addonBoxIcon' src='http://rules.redpg.com.br/img/icon/Unknown.png' />")
                        .append(window.app.ui.language.getLingo("_ADDONBOXNOTFOUND_"));
            this.$ul.empty().append(
                $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXNOTFOUNDEXPLAIN_"))
            );
        } else if (this.listType === 'addon') {
            var addon = this.currentList[this.currentAddon];
            this.$handle.empty();
            var $img = $('<img id="addonBoxIcon" />').attr('src', 'http://rules.redpg.com.br/img/icon/' + addon.nomeLimpo + '.png');
            this.$handle.text(addon.nome).prepend($img);
            this.$ul.empty();
            var $li;
            for (var i = 0; i < addon.efeitos.length; i++) {
                $li = $('<li />').text(addon.efeitos[i]);
                this.$ul.append($li);
            }
        } else if (this.listType === 'vantagem' || this.listType === 'desvantagem') {
            var addon = this.currentList[this.currentAddon];
            this.$handle.empty().text(addon.nome + ', ' + addon.pontos + (addon.pontos !== '1' ? " pontos" : ' ponto'));
            this.$ul.empty();
            var $li;
            for (var i = 0; i < addon.descricao.length; i++) {
                $li = $('<li />').text(addon.descricao[i]);
                this.$ul.append($li);
            }
        }
        
        var newTop = oldHeight - this.$box.height();
        this.$box.css('top', newTop + this.$box.position().top);
    };
    
    /**
     * 
     * @param {Event} event
     * @returns {undefined}
     */
    this.moveAddonBox = function (event) {
        var top = event.pageY - this.$box.height() - 20;
        var left = event.pageX + 20;
        if (top < 10) {
            top = 10;
        }
        if (left + this.$box.width() + 10 > $(window).width()) {
            left = ($(window).width() - this.$box.width() - 10);
        }
        this.$box.css({
            left : left,
            top : top
        });
    };
}