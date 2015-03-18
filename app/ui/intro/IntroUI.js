function IntroUI () {
    this.$intro = $("#intro").on('click', function () {
        window.app.ui.intro.$intro.fadeOut(250);
        window.app.memory.setMemory("seenIntro", 1);
    }).hide();;
    
    this.init = function () {
        window.app.ui.loginui.onLogin(function () {
            window.app.ui.intro.update();
        });
    };
    
    this.update = function () {
        if (window.app.memory.getMemory("seenIntro", 0) === 0 && !window.app.ui.$leftWindow.hasClass("fullScreen")) {
            this.$intro.show();
        } else {
            this.$intro.hide();
        }
    };
}