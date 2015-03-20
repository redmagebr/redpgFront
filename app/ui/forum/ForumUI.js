function ForumUI () {
    this.$forum = $("#forumRecent");
    
    var ajax = new AjaxController();
    ajax.requestPage({
        url: "http://forum.redpg.com.br/index.php?p=/discussions",
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
        this.$forum.empty();
        var $latest = $(data).find("table.DiscussionsTable.DataTable > tbody");
        var $tr = $latest.find("tr");
        
        var $threadName;
        var $threadCategory;
        var $threadPoster;
        
        var $as;
        var $trr;
        
        var $ul = $("<ul />");
        var $li;
        
        for (var i = 0; i < $tr.length; i++) {
            $trr = $($tr[i]);
            $as = $trr.find("td.DiscussionName a");
            
            $threadName = $($as[0]).removeClass().addClass("textLink").attr("target", "_blank");
            $threadCategory = $($as[1]).removeClass().addClass("textLink").attr("target", "_blank");
            
            $as = $trr.find("td.LastUser a");
            
            $threadPoster = $($as[1]).removeClass().addClass("textLink").attr("target", "_blank");
            
            $li = $("<li />")
                    .append("<span class='language' data-langhtml='_FORUMLATESTPOST_'>"
                            + window.app.ui.language.getLingo("_FORUMLATESTPOST_")
                            + "</span>: ")
                    .append($threadName)
                    .append(" <span class='language' data-langhtml='_FORUMLATESTIN_'>" 
                            + window.app.ui.language.getLingo("_FORUMLATESTIN_") 
                            + "</span> ")
                    .append($threadCategory)
                    .append(", <span class='language' data-langhtml='_FORUMBY_'>" +
                            + window.app.ui.language.getLingo("_FORUMBY_")
                            + "</span> ")
                    .append($threadPoster)
                    .append(".");
            
            $ul.append($li);
        }
        
        this.$forum.append($ul);
        return;
        
        
        
        $latest.find("span.LastCommentBy").each(function () {
            var $this = $(this);
            var $a = $this.find("a");
            $this.empty()
                    .append("<span class='language' data-langhtml='_FORUMBY_'>" +
                            + window.app.ui.language.getLingo("_FORUMBY_")
                            + "</span> ")
                    .append($a);
        });
        
        
        $latest.find("span.options").remove();
        $latest.find("span.ViewCount").remove();
        $latest.find("span.CommentCount").remove();
        $latest.find("div.Title").prepend(
            "<span class='language' data-langhtml='_FORUMLATESTPOST_'>"
            + window.app.ui.language.getLingo("_FORUMLATESTPOST_")
            + "</span>: "
        );

        $(
            "<span> <span class='language' data-langhtml='_FORUMLATESTIN_'>" 
                + window.app.ui.language.getLingo("_FORUMLATESTIN_") 
          + "</span> </span>"
        ).insertBefore($latest.find("span.Category"));
        $latest.find("span.LastCommentDate").remove();
        
        var $as = $latest.find("a").addClass("textLink");
        var $a;
        var href;
        for (var i = 0; i < $as.length; i++) {
            $a = $($as[i]);
            href = $a.attr("href");
            if (href.indexOf("://") === -1) {
                $a.attr("href", "http://forum.redpg.com.br" + (href.indexOf("/") === 0 ? "" : "/") + href);
            }
            $a.attr("target", "_blank");
        }
        
        
        $latest.find("span.DiscussionScore").remove();
        this.$forum.empty().append($latest);
    };
}