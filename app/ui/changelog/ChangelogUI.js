function ChangelogUI () {
    this.$updatetarget;
    
    this.newestVersion;
    
    this.init = function () {
        this.newestVersion = window.app.version;
        this.$updatetarget = $('#changelogAjaxTarget');
        
        var ajax = new ChangelogAjax();
        ajax.updateChangelog();
        
        $('#changelogLoadFully').on('click', function () {
            var ajax = new ChangelogAjax();
            ajax.getFullLog();
            window.app.ui.blockLeft();
        });
    };
    
    this.compareVersions = function (v1, v2) {
        if (v1[0] > v2[0]) {
            return true;
        } else if (v1[0] === v2[0]) {
            if (v1[1] > v2[1]) {
                return true;
            } else if (v1[1] === v2[1]) {
                if (v1[2] > v2[2]) {
                    return true;
                }
            }
        }
        return false;
    };
    
    this.considerNewest = function (version) {
        if (this.compareVersions(version, this.newestVersion)) {
            this.newestVersion = version;
        }
    };
    
    this.processUpdate = function (data) {
        $('#changelogAjaxError').hide();
        this.$updatetarget.html(data);
        
        this.$updatetarget.find('div').each(function () {
            var $this = $(this);
            var version = [parseInt($this.attr('data-major')),
                           parseInt($this.attr('data-minor')),
                           parseInt($this.attr('data-release'))
                          ];
            window.app.ui.changelogui.considerNewest(version);
            if (window.app.ui.changelogui.compareVersions(version, window.app.version)) {
                $this.addClass('newUpdate');
                $('#changelogUpdateNotice').show();
            }
        });
        
        $('#currentVersion').html(window.app.version[0] +
                                  '.' + window.app.version[1] +
                                  '.' + window.app.version[2]);
                          
                          
                          
        $('#updatedVersion').html(this.newestVersion[0] +
                                  '.' + this.newestVersion[1] +
                                  '.' + this.newestVersion[2]);
    };
    
    this.attach = function (data) {
        window.app.ui.unblockLeft();
        this.$updatetarget.append(data);
        $('#changelogLoadFully').hide();
    };
    
    this.attachError = function (data) {
        window.app.ui.unblockLeft();
        this.processError(data);
        $('#changelogLoadFully').hide();
    };
    
    this.processError = function (data) {
        this.$updatetarget.hide();
        $('#changelogAjaxError').show();
        $('#currentVersion').html(window.app.version[0] +
                                  '.' + window.app.version[1] +
                                  '.' + window.app.version[2]);
        $('#updatedVersion').parent().hide();
    };
}