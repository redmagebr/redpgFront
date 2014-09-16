function SimpleFloater () {
    this.$floater = $('#simpleFloater');
    
    this.apply = function ($title) {
        $title.off('.tooltip').on('mouseenter.tooltip', function () {
            var $this = $(this);
            var $p = $('<p />').text($this.attr('data-title'));
            window.app.ui.simplefloater.showFloaterAtElement($p, $this);
        }).on('mousemove.tooltip', function () {
            window.app.ui.simplefloater.moveFloaterToElement($(this));
        }).on('mouseleave.tooltip', function () {
            window.app.ui.simplefloater.hideFloater();
        });
    };
    
    this.showFloaterAtElement = function ($content, $element) {
        this.$floater.empty().append($content);
        this.$element = $element;
        this.moveFloaterToElement($element);
        this.$floater.stop(true,false).fadeIn(100);
    };
    
    this.moveFloaterToElement = function ($element) {
        if ($element === undefined) var $element = this.$element;
        var offset = $element.offset();
        var left = offset.left + 6;
        if (left + this.$floater.width() > ($(window).width() - 10)) {
            left = $(window.width() - 10 - this.$floater.width());
        }
        var top = offset.top + 8 + $element.height();
        if (top < 10) {
            top = 10;
        }
        this.$floater.css({
            top: offset.top - this.$floater.height() - 8,
            left: left
        });
    };
    
    this.hideFloater = function () {
        this.$floater.stop(true,false).fadeOut(100);
    };
}