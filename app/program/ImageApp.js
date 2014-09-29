function ImageApp () {
    this.updateDB = function (cbs, cbe) {
        
        // Disabled until implemented
        return cbs(null);
        
        
        cbs = window.app.emulateBind(function (data) {
            window.app.imagedb.updateFromJSON(data['images'], true);
            this.cbs(data['space']);
        }, {cbs : cbs});
        
        var ajaxObj = {
            url : 'Image',
            dataType : 'json',
            data : {action : 'list'},
            success: cbs,
            error: cbe
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.uploadImage = function (formdata, cbs, cbe, progress) {
        /** @type FormData */ var formdata;
        
        var ajaxObj = {
            url : 'Image',
            xhr: function() {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){ // Check if upload property exists
                    myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
                }
                return myXhr;
            },
            progressUpload : progress,
            success: cbs,
            error: cbe,
            data: formdata,
            cache: false,
            contentType: false,
            processData: false
        };
    };
    
    this.updateFromLocal = function () {
        var imageJSON = window.app.memory.getMemory('imageLinks', []);
        window.app.imagedb.updateFromJSON(imageJSON, false);
    };
    
    this.saveToLocal = function () {
        var images = window.app.imagedb.images;
        var toSave = [];
        for (var id in images) {
            if (images[id].id < 0) {
                toSave.push({
                    id : images[id].id,
                    name : images[id].name,
                    url : images[id].url
                });
            }
        }
        window.app.memory.setMemory('imageLinks', toSave);
    };
    
    this.prepareUrl = function (url) {
        if (url.indexOf('dropbox.com') !== -1) {
            if (url.indexOf('?dl=1') !== -1) {
                return url;
            }
            var at = url.lastIndexOf('?');
            at = at === -1 ? url.length : at;
            url = url.substring(0, at) + '?dl=1';
            return url;
        } else {
            return url;
        }
    };
}