function AddonUI () {
    
    this.$box = $('#addonBox').hide();
    
    this.$handle = $('#addonBoxHandle').empty();
    this.$ul = $('#addonBoxUL');
    
    this.currentAddon = '';
    
    /**
     * 
     * @param {jQuery} $dom
     * @returns {$dom}
     */
    this.addonize = function ($dom, addon) {
        console.log("ADDONIZING FOR " + addon);
        console.log($dom);
        $dom.off('.addon').on('mouseenter.addon', function (e) {
            window.app.ui.addonui.showAddonBox($(this), e);
        }).on('mouseleave.addon', function () {
            window.app.ui.addonui.$box.stop(true, false).fadeOut(100);
        }).on('mousemove.addon', function (e) {
            window.app.ui.addonui.moveAddonBox(e);
        }).attr('data-addon', addon);
    };
    
    this.unAddonize = function ($dom) {
        console.log("UNADDONIZING");
        console.log($dom);
        $dom.off('.addon').attr('data-addon', '');
    };
    
    this.showAddonBox = function ($dom, e) {
        this.currentAddon = $dom.attr("data-addon").toUpperCase();
        if (window.techAddonsHash === undefined) {
            var cbs = function () {
                window.app.ui.addonui.updateAddonBox(2);
            };
            
            var cbe = function () {
                window.app.ui.addonui.updateAddonBox(0);
            };
            window.app.addonapp.loadTecnicas(cbs, cbe);
            this.updateAddonBox(1);
        } else {
            window.app.ui.addonui.updateAddonBox(3);
        }
        this.$box.stop(true, false).fadeIn(100);
        this.moveAddonBox(e);
    };
    
    this.updateAddonBox = function (how) {
        var oldHeight = this.$box.height();
        if (window.techAddonsHash === undefined) {
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
        } else if (window.techAddonsHash[this.currentAddon] === undefined) {
            this.$handle.empty().append("<img id='addonBoxIcon' src='http://rules.redpg.com.br/img/icon/Unknown.png' />")
                        .append(window.app.ui.language.getLingo("_ADDONBOXNOTFOUND_"));
            this.$ul.empty().append(
                $('<li />').text(window.app.ui.language.getLingo("_ADDONBOXNOTFOUNDEXPLAIN_"))
            );
        } else {
            var addon = window.techAddonsHash[this.currentAddon];
            this.$handle.empty();
            var $img = $('<img id="addonBoxIcon" />').attr('src', 'http://rules.redpg.com.br/img/icon/' + addon.nomeLimpo + '.png');
            this.$handle.text(addon.nome).prepend($img);
            this.$ul.empty();
            var $li;
            for (var i = 0; i < addon.efeitos.length; i++) {
                $li = $('<li />').text(addon.efeitos[i]);
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
        var top = event.pageY - this.$box.height() - 10;
        var left = event.pageX;
        if (top <= 0) {
            top = 10;
            left += 10;
        }
        if (left + this.$box.width() >= $(window).width()) {
            left = $(window.width() - this.$box.width() - 10);
        }
        this.$box.css({
            left : left,
            top : top
        });
    };
}