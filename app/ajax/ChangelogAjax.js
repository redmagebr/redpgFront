function ChangelogAjax () {
    this.updateChangelog = function () {
        var ajax = new AjaxController();
        ajax.requestPage({
            url: window.app.staticHost + 'Changelog.html',
            dataType: 'html',
            success : function (data) {
                window.app.ui.changelogui.processUpdate(data);
            },
            error : function (data) {
                window.app.ui.changelogui.processError(data);
            }
        });
    };
}