function AudioController () {
    this.bgm;
    this.se;

    this.revokeurl = false;
    this.attemptedURL;
    
    this.$bar;
    
    this.$player;
    this.$playpause;
    this.$repeat;
    this.$volup;
    this.$voldown;
    this.$volumeslider;
    this.permittedFiles = $('#chatSounds')[0];
    
    this.init = function () {
        window.app.config.registerConfig('bgmVolume', this);
        window.app.config.registerConfig('seVolume', this);
        window.app.config.registerConfig('bgmLoop', this);
        window.app.config.registerConfig('autoBGM', this);
        window.app.config.registerConfig('autoSE', this);
        
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

        this.bgm.onload = function (e) {
            if (window.app.ui.chat.audioc.revokeurl) {
                URL.revokeObjectURL(this.src);
                alert("Revoked");
            }
        }
    };
    
    this.updateBar = function (current, max) {
        this.$bar.attr('value', current / max);
        if (current >= max) {
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
        this.bgm.loop = window.app.config.get("bgmLoop");
        if (!this.bgm.loop) {
            this.$repeat.removeClass('toggled');
        } else {
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
            //this.play("aaaa");
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
    };
    
    this.setBindings = function () {
        $('#musicPlayerAudioBGM').on('timeupdate', function() {
            window.app.ui.chat.audioc.updateBar(this.currentTime, this.duration);
        });
        
        this.$playpause.bind('click', function () {
            window.app.ui.chat.audioc.playpause();
        });
        
        this.$repeat.bind('click', function () {
            window.app.config.store("bgmLoop",
                !window.app.config.get("bgmLoop"));
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
            var volume = 1 - ((mouse - pointzero) / max);
            volume = + volume.toFixed(2);
            
            window.app.config.store("bgmVolume", volume);
        });
        
        this.$volup.bind('click', function () {
            window.app.ui.chat.audioc.changeVolume(0.05);
        });
        
        this.$voldown.bind('click', function () {
            window.app.ui.chat.audioc.changeVolume(-0.05);
        });
    };
    
    this.playse = function (filename) {
        var foundPerfect = false;
        if (filename.indexOf('://') === -1) {
            foundPerfect = this.setPermittedSource(false, filename);
            if (!foundPerfect) {
                filename = 'Sounds/' + filename;
            } else {
                return;
            }
        }
        this.se.setAttribute('src', filename);
        this.se.play();
    };
    
    this.stopse = function () {
        this.se.pause();
    };
    
    this.play = function (filename) {
        if (filename.indexOf("dropbox.com") !== -1) {
            filename = filename.replace("www.dropbox.com", "dl.dropboxusercontent.com");
        }
        this.lastFilename = filename;
        this.$player.addClass('shown');
        var foundPerfect = false;
        if (filename.indexOf('://') === -1) {
            foundPerfect = this.setPermittedSource(true, filename);
            if (!foundPerfect) {
                filename = 'Sounds/' + filename;
            }
        }
        if (!foundPerfect) {
            this.bgm.setAttribute('src', filename);
            this.justPlayBGM();
        }
    };
    
    this.justPlayBGM = function () {  
        this.bgm.play();
        this.$playpause.addClass('toggled');
        this.changeVolumeTo(this.bgm.volume);
    };
    
    this.setPermittedSource = function (bgm, filename) {
        for (i = 0; i < this.permittedFiles.files.length; i++) {
            if (this.permittedFiles.files[i].name === filename) {
                var reader = new FileReader();
                if (bgm) {
                    reader.onload = function (e) {
                        window.app.ui.chat.audioc.bgm.setAttribute('src', e.target.result);
                        window.app.ui.chat.audioc.justPlayBGM();
                    };
                } else {
                    reader.onload = function (e) {
                        window.app.ui.chat.audioc.se.setAttribute('src', e.target.result);
                        window.app.ui.chat.audioc.se.play();
                    };
                }
                reader.readAsDataURL(this.permittedFiles.files[i]);
                return true;
            }
        }
    };
    
    this.configValidation = function (id, value) {
        if (id === 'bgmVolume' || id === 'seVolume') {
            if (typeof value === 'number' && value >= 0 && value <= 1) return true;
        }
        if (id === 'bgmLoop') {
            if (typeof value === 'boolean') return true;
        }
        if (id === 'autoBGM'|| id === 'autoSE') {
            if (typeof value !== 'number' || value < 0 || value > 2 || parseInt(value) !== value) return false;
            return true;
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'bgmVolume') return 1;
        if (id === 'seVolume') return 0.05;
        if (id === 'bgmLoop') return true;
        if (id === 'autoBGM') return 1;
        if (id === 'autoSE') return 1;
    };
    
    this.configChanged = function (id) {
        if (id === 'bgmVolume') {
            this.changeVolumeTo(window.app.config.get('bgmVolume'));
        } else if (id === 'seVolume') {
            this.se.volume = window.app.config.get('seVolume');
        } else if (id === 'bgmLoop') {
            this.considerRepeat();
        }
    };

    this.playDropbox = function (url) {
        this.bgm.pause();
        this.attemptedURL = url;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {
                // Note: .response instead of .responseText
                var blob = new Blob([this.response], {type: 'audio'});
            }
            var audioc = window.app.ui.chat.audioc;
            audioc.revokeurl = true;
            audioc.bgm.src = URL.createObjectURL(blob);
            audioc.justPlayBGM();
        };
        xhr.onerror = function () {
            var audioc = window.app.ui.chat.audioc;
            audioc.bgm.setAttribute("src", audioc.attemptedURL);
            audioc.justPlayBGM();
        };
        xhr.send();
    }
}