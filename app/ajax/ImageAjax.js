function ImageAjax () {
    this.grabLinks = function (url, folder, cbs, cbe) {
        if (url.indexOf('dropbox.com') !== -1) {
            return this.grabDropboxLinks(url, folder, cbs, cbe);
        }
        
        return this.grabIndexedLinks(url, folder, cbs, cbe);
    };
    
    this.grabIndexedLinks = function (url, folder, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            var url = this.url;
            if (url.charAt(url.length - 1) !== '/') {
                url = url + '/';
            }
            
            var $data = $(data).find('a[href]');
            var found = [];
            var $el;
            var link;
            var at;
            for (var i = 0; i < $data.length; i++) {
                $el = $($data[i]);
                link = $el.attr('href');
                if (link.indexOf('://') === -1) {
                    link = url + link;
                }
                if (found.indexOf(link) === -1) found.push(link);
            }
            
            console.log(found);
            
            var images = [];
            var extensions = ['JPG','JPEG','PNG','GIF','BMP'];
            var image;
            var ext;
            for (var i = 0; i < found.length; i++) {
                image = new Image_Link();
                image.url = found[i];
                image.name = decodeURI(found[i]).substring(found[i].lastIndexOf('/')+1);
                if (image.name.trim() === '') continue;
                ext = image.name.substring(image.name.lastIndexOf('.')+1);
                if (extensions.indexOf(ext.toUpperCase()) === -1) continue;
                image.name = image.name.substring(0, image.name.lastIndexOf('.'));
                image.folder = folder;
                image.id = window.app.imagedb.getFakeId();
                window.app.imagedb.addImage(image);
                window.app.imagedb.saveToStorage();
            }
            this.cbs();
        }, {cbs : cbs, url : url});
        
        ajax.requestPage({
            url : url,
            dataType : 'html',
            success : cbs,
            error: cbe
        });
    };
    
    this.grabDropboxLinks = function (url, folder, cbs, cbe) {
        var ajax = new AjaxController();
        
        cbs = window.app.emulateBind(function (data) {
            var $data = $(data).find('a.thumb-link');
            var found = [];
            var $el;
            var link;
            for (var i = 0; i < $data.length; i++) {
                $el = $($data[i]);
                link = $el.attr('href');
                link = window.app.imageapp.prepareUrl(link);
                if (found.indexOf(link) === -1) found.push(link);
            }
            
            var images = [];
            var extensions = ['JPG','JPEG','PNG','GIF','BMP'];
            var image;
            var ext;
            for (var i = 0; i < found.length; i++) {
                image = new Image_Link();
                image.url = found[i];
                image.name = decodeURI(found[i]).substring(found[i].lastIndexOf('/')+1);
                if (image.name.trim() === '') continue;
                ext = image.name.substring(image.name.lastIndexOf('.')+1);
                if (extensions.indexOf(ext.toUpperCase()) === -1) continue;
                image.name = image.name.substring(0, image.name.lastIndexOf('.'));
                image.folder = folder;
                image.id = window.app.imagedb.getFakeId();
                window.app.imagedb.addImage(image);
                window.app.imagedb.saveToStorage();
            }
            this.cbs();
        }, {cbs : cbs});
        
        ajax.requestPage({
            url : url,
            dataType : 'html',
            success : cbs,
            error: cbe
        });
    };
}