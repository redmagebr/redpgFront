function Navigator () {
    this.$window;
    this.$iframe;
    
    this.init = function () {
        this.$window = $('#navigationWindow');
        this.$iframe = $('#navigationiFrame');
        
        this.setBindings();
    };
    
    this.setBindings = function () {
    };
    
    this.navigate = function (url) {
        if (this.$iframe.attr('src') !== url) {
            this.$iframe.attr('src', url);
        }
        
        window.app.ui.callLeftWindow('navigationWindow');
    };
}