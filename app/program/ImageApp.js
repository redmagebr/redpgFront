function ImageApp () {
    this.updateDB = function (cbs, cbe) {
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
}