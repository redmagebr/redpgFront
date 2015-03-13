function ForumUI () {
    this.$forum = $("#forumRecent");
    
    var ajax = new AjaxController();
    ajax.requestPage({
        url: "http://forum.redpg.com.br/index.php",
        dataType: 'html',
        success : function (data) {
            window.app.ui.forumui.addLatest(data);
        },
        error : function (data) {
            window.app.ui.forumui.addError(data);
        }
    });
    
    this.addError = function (data) {
        this.$forum.html("<p class='language' data-langhtml='_HOMEFORUMERROR_'>" + 
                window.app.ui.language.getLingo("_HOMEFORUMERROR_") + "</p>");
    };
    
    this.addLatest = function (data) {
        var $latest = $(data).find("#top_five");
        $latest.find("thead").remove();
        $latest.find("td:not(:first-child)").remove();
        $latest = $latest.find("li");
        var $as = $latest.find("a");
        var $a;
        for (var i = 0; i < $as.length; i++) {
            $a = $($as[i]);
            var href = $a.attr("href");
            if (href === '') continue;
            href = "http://forum.redpg.com.br/" + href.replace("./", "");
            $a.attr("href", href);
            $a.attr("target", "_BLANK");
            $a.addClass("textLink");
        }
        
        this.$forum.empty();
        var $li;
        
        for (i = 0; i < $latest.length; i++) {
            $li = $($latest[i]);
            this.$forum.append("<p>" + $li.html().replace(";&nbsp;by ", " " + window.app.ui.language.getLingo("_FORUMBY_") + " ") + "</p>");
        }
        
        
        console.log($latest);
    };
}