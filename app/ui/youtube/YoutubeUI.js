function YoutubeUI () {
    //src = http://www.youtube.com/v/XGSy3_Czz8k
    
    this.$player;
    
    this.init = function () {
        this.$player = $('#youtubePlayer');
    };
    
    this.parseUrl = function (url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return null;
        }
    };
    
    this.play = function (id, autoplay) {
        //https://www.youtube.com/v/ID?autoplay=1&loop=1&playlist=ID
        //Autoplay loop
        //But no good, won't be added.
        if (typeof autoplay === 'undefined') autoplay = false;
        id.replace(/"/g, '');
        if (autoplay) {
            id = id + "?autoplay=1";
        }
        //var $play = $('<embed type="application/x-shockwave-flash" src="http://www.youtube.com/v/' + id + '" />');
        
        var $play = $('<iframe id="youtubeiFrame" class="youtube-player" type="text/html" src="http://www.youtube.com/embed/' + id + '" allowfullscreen frameborder="0"></iframe>');
        
        this.$player.empty().append($play);
        
        var $a = $('<a class="button" />');
        
        $a.bind('click', function () {
            window.app.ui.hideRightWindows(function () {
                window.app.ui.youtubeui.$player.empty();
            });
        });
        
        this.$player.append($a);
        
        window.app.ui.callRightWindow('youtubeWindow');
    };
    
    
    this.updateConfig = function () {
        window.app.ui.configui.$configlist.append("<p class='centered language' data-langhtml='_CONFIGAUTOVIDEO_'></p>");
        
        var $options = $('<p class="centered" />');
        var $auto = $('<input id="configautoVIDEOon" type="radio" name="configautoVIDEO" value="auto" />');
        $auto.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.configdb.store('autoVIDEO', true);
                window.app.updateConfig();
            }
        });
        if (window.app.configdb.get('autoVIDEO', true)) {
            $auto.prop('checked', true);
        }
        $options.append($auto);
        $options.append($('<label for="configautoVIDEOon" class="language" data-langhtml="_AUTOVIDEOON_" />'));
        
        var $always = $('<input id="configautoVIDEOoff" type="radio" name="configautoVIDEO" value="off" />');
        $always.bind('change', function () {
            if ($(this).prop('checked')) {
                window.app.configdb.store('autoVIDEO', false);
                window.app.updateConfig();
            }
        });
        if (!window.app.configdb.get('autoVIDEO', true)) {
            $always.prop('checked', true);
        }
        $options.append($always);
        $options.append($('<label for="configautoVIDEOoff" class="language" data-langhtml="_AUTOVIDEOOFF_" />'));
        
        
        window.app.ui.configui.$configlist.append($options);
        
        window.app.ui.configui.$configlist.append($('<p class="explain language" data-langhtml="_CONFIGAUTOVIDEOEXPLAIN_" />'));
    };
}