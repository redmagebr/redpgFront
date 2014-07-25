function AudioController () {
    this.bgm;
    this.se;
    
    this.$bar;
    
    this.$player;
    this.$playpause;
    this.$repeat;
    this.$volup;
    this.$voldown;
    this.$volumeslider;
    
    this.init = function () {
        this.bgm = document.getElementById('musicPlayerAudioBGM');
        this.se = document.getElementById('musicPlayerAudioSE');
        this.$bar = $('#musicPlayerProgressCurrent');
        
        this.$player = $('#musicPlayerWrapper');
        this.$playpause = $('#musicPlayerActionButton');
        this.$repeat = $('#musicPlayerRepeatButton');
        
        this.$volup = $('#musicPlayerVolumeUp');
        this.$voldown = $('#musicPlayerVolumeDown');
        this.$volumeslider = $('#musicPlayerCurrentVolume');
        
        this.setBindings();
    };
    
    this.updateBar = function (current, max) {
        this.$bar.attr('value', current / max);
        if (jQuery.browser.mobile && current >= max) {
            this.ended();
        }
    };
    
    this.playpause = function () {
        if (this.$playpause.hasClass('toggled')) {
            this.bgm.pause();
            this.$playpause.removeClass('toggled');
        } else {
            this.$playpause.addClass('toggled');
            this.bgm.play();
        }
    };
    
    this.considerRepeat = function () {
        if (this.bgm.loop) {
            this.bgm.loop = false;
            window.app.configdb.store('bgmLoop', false);
            this.$repeat.removeClass('toggled');
        } else {
            this.bgm.loop = true;
            window.app.configdb.store('bgmLoop', true);
            this.$repeat.addClass('toggled');
        }
    };
    
    this.ended = function () {
        if (!this.bgm.loop) {
            this.$playpause.removeClass('toggled');
            this.bgm.currentTime = 0;
            this.bgm.pause();
        } else {
            //this.bgm.currentTime = 0;
            //this.bgm.play();
            var filename = this.lastFilename;
            this.play("aaaa");
            this.play(filename);
        }
    };
    
    this.moveSeeker = function (perc) {
        this.bgm.currentTime = (this.bgm.duration * perc);
    };
    
    this.changeVolume = function (diff) {
        this.bgm.volume += diff;
        if (this.bgm.volume >= 1) {
            this.bgm.volume = 1;
            this.$volup.addClass('deactivated');
            this.$voldown.removeClass('deactivated');
        } else if (this.bgm.volume <= 0) {
            this.bgm.volume = 0;
            this.$voldown.addClass('deactivated');
            this.$volup.removeClass('deactivated');
        } else {
            this.$volup.removeClass('deactivated');
            this.$voldown.removeClass('deactivated');
        }
    };
    
    this.changeVolumeTo = function (newVolume) {
        this.bgm.volume = newVolume;
        this.$volumeslider.height(this.bgm.volume * 100 + '%');
        window.app.configdb.store('bgmVolume', this.bgm.volume);
    };
    
    this.setBindings = function () {
        $('#musicPlayerAudioBGM').on('timeupdate', function() {
            window.app.ui.chat.audioc.updateBar(this.currentTime, this.duration);
        });
        
        this.$playpause.bind('click', function () {
            window.app.ui.chat.audioc.playpause();
        });
        
        this.$repeat.bind('click', function () {
            window.app.ui.chat.audioc.considerRepeat();
        });
        
        this.$bar.bind('click', function (e) {
            var $this = $(this);
            var pointzero = $this.offset().left;
            var max = $this.width();
            var mouse = e.pageX;
            window.app.ui.chat.audioc.moveSeeker((e.pageX - pointzero) / max);
        });
        
        $('#musicPlayerVolumeWrapper').on('click', function (e) {
            var $this = $(this);
            var pointzero = $this.offset().top;
            var max = $this.height();
            var mouse = e.pageY;
            window.app.ui.chat.audioc.changeVolumeTo(1 - ((mouse - pointzero) / max));
        });
        
        this.$volup.bind('click', function () {
            window.app.ui.chat.audioc.changeVolume(0.05);
        });
        
        this.$voldown.bind('click', function () {
            window.app.ui.chat.audioc.changeVolume(-0.05);
        });
    };
    
    this.playse = function (filename) {
        if (filename.indexOf('://') === -1) {
            filename = 'Sons/' + filename;
        }
        this.se.setAttribute('src', filename);
        this.se.play();
    };
    
    this.stopse = function () {
        this.se.pause();
    };
    
    this.play = function (filename) {
        this.lastFilename = filename;
        this.$player.addClass('shown');
        if (filename.indexOf('://') === -1) {
            filename = 'Sons/' + filename;
        }
        this.bgm.setAttribute('src', filename);
        this.bgm.play();
        this.$playpause.addClass('toggled');
        this.changeVolumeTo(this.bgm.volume);
    };
    
    
    
    
    this.updateConfig = function () {
        this.changeVolumeTo(window.app.configdb.get("bgmVolume", 1));
        window.app.configdb.store("seVolume", 0.55);
        this.se.volume = window.app.configdb.get("seVolume", 0.05);
        
        var loop = window.app.configdb.get("bgmLoop", true);
        if (loop !== this.bgm.loop) {
            this.considerRepeat();
        }
        window.app.configdb.get("autoBGM", true);
        
        
        window.app.ui.configui.$configlist.append("<p class='centered language' data-langhtml='_CONFIGAUTOBGM_'></p>");
        
        var $options = $('<p class="centered" />');
        var $auto = $('<input id="configautoBGMon" type="radio" name="configautoBGM" value="on" />');
        $auto.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.configdb.store('autoBGM', true);
                window.app.updateConfig();
            }
        });
        if (window.app.configdb.get('autoBGM', true)) {
            $auto.prop('checked', true);
        }
        $options.append($auto);
        $options.append($('<label for="configautoBGMon" class="language" data-langhtml="_AUTOBGMON_" />'));
        
        var $always = $('<input id="configautoBGMoff" type="radio" name="configautoBGM" value="off" />');
        $always.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.configdb.store('autoBGM', false);
                window.app.updateConfig();
            }
        });
        if (!window.app.configdb.get('autoBGM', true)) {
            $always.prop('checked', true);
        }
        $options.append($always);
        $options.append($('<label for="configautoBGMoff" class="language" data-langhtml="_AUTOBGMOFF_" />'));
        
        
        window.app.ui.configui.$configlist.append($options);
        
        window.app.ui.configui.$configlist.append($('<p class="explain language" data-langhtml="_CONFIGAUTOBGMEXPLAIN_" />'));
    };
}