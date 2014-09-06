function ImageUI () {
    
    
    this.init = function () {
        
        this.setBindings();
    };
    
    this.setBindings = function () {
        $('#openImagesBt').bind('click', function () {
            window.app.ui.imageui.callSelf();
        });
    };
    
    this.callSelf = function () {
        window.app.ui.callRightWindow('imageWindow');
    };
}