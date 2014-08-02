function Logger () {
    
    this.$notification;
    this.logging = false;
    
    this.range = [];
    this.content = [];
    
    this.init = function () {
        this.$notification = $('#logNotification');
        
        this.updateNotification();
        this.setBindings();
    };
    
    this.stop = function () {
        this.range = [];
        this.content = [];
        this.logging = false;
        this.updateNotification();
    };
    
    this.updateNotification = function () {
        if (!this.logging) {
            this.$notification.fadeOut(100);
        } else {
            if (this.range.length === 0) {
                this.$notification.attr('data-lang', '_LOGGERFIRST_');
            } else {
                this.$notification.attr('data-lang', '_LOGGERSECOND_');
            }
            window.app.ui.language.applyLanguageTo(this.$notification);
            this.$notification.fadeIn(100);
        }
    };
    
    this.begin = function () {
        this.logging = true;
        $(document).unbind('click.LoggerClick').on('click.LoggerClick', function (e) {
            if (e.target !== null) {
                var $target = $(e.target).closest('p');
                console.log($target);
                if ($target.is('[data-msgid]')) {
                    window.app.ui.chat.logger.get(parseInt($target.attr('data-msgid')), $target.text());
                }
            }
        });
        this.updateNotification();
    };
    
    this.end = function () {
        $(document).unbind('click.LoggerClick');
        this.updateNotification();
    };
    
    this.get = function (id, content) {
        if (this.range.length > 2) {
            this.range = [id];
            this.content = [content];
        } else {
            this.range.push(id);
            this.range.sort();
            if (this.range[0] !== id) {
                this.content = [id, this.content[0]];
            } else {
                this.content.push(content);
            }
        }
        
        this.updateNotification();
    };
    
    this.setBindings = function () {
        this.$notification.on('click', function () {
            window.app.ui.chat.logger.stop();
        });
    };
}