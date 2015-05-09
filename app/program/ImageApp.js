function ImageApp () {
    this.updateDB = function (cbs, cbe) {
        
        // Disabled until implemented
        //return cbs(null);
        
        
        cbs = window.app.emulateBind(function (data) {
            window.app.imagedb.updateFromJSON(data['imagess3'], true);
            var obj = {"images" : data.images};
            window.app.storage.updateFromJSON(obj);
            this.cbs(data);
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
    
    this.deleteImage = function (uuid, cbs, cbe) {
        var ajaxObj = {
            url : 'Image',
            success: cbs,
            error: cbe,
            data: {
                action : "delete",
                uuid : uuid
            }
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.updateImage = function (data, cbs, cbe) {
        data.action = "update";
        var ajaxObj = {
            url : 'Image',
            success: cbs,
            error: cbe,
            data: data
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
    };
    
    this.uploadImage = function (formdata, cbs, cbe) {
        
        var ajaxObj = {
            url : 'ImageUpload',
//            xhr: function() {  // Custom XMLHttpRequest
//                var myXhr = $.ajaxSettings.xhr();
//                if(myXhr.upload){ // Check if upload property exists
//                    myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
//                }
//                return myXhr;
//            },
//            progressUpload : progress,
            success: cbs,
            error: cbe,
            data: formdata
        };
        
        var ajax = new AjaxController();
        
        ajax.requestPage (ajaxObj);
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