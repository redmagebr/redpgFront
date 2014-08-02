/**
 * @constructor
 * @returns {AjaxController}
 */
function AjaxController () {
    this.addSession = function (url) {
        if (window.app.loginapp.hasJsessid()) {
            url = url + ';jsessionid=' + window.app.loginapp.getJsessid();
        }
        return url;
    };
    
    this.requestPage = function (object) {
        object.crossDomain = true;
        
        
        if (object.url.indexOf('://') === -1) {
            object.url = window.app.host + object.url;
            object.url = this.addSession(object.url);
        }
        
        
        console.log("Ajax request for: " + object.url);
        
        
        if (typeof object.data !== 'undefined') {
            object.type = 'POST';
            for (var i in object.data) {
                if (typeof object.data[i] === 'object' || typeof object.data[i] === 'array') {
                    object.data[i] = JSON.stringify(object.data[i]);
                }
                // null gets turned into "null" on the form and that fucks things up.
                if (object.data[i] === null) {
                    delete object.data[i];
                }
            }
            console.log("Ajax request includes data:");
            console.log(object.data);
        }
        
        if (typeof object.timeout === 'undefined') {
            object.timeout = 10000;
        }
        
        
        $.ajax(object).done(function( data ) {
            if (typeof data === 'string')
                console.log( "Ajax request done. Sample of data:", data.slice( 0, 100 ) );
            else if (typeof data === 'object') {
                console.log("Ajax request done. Object received:");
                console.log(data);
            }
        }).error(function (data) {
            console.log("Ajax request resulted in error. Data:");
            console.log(data);
            if (data.status === 401) {
                window.app.loginapp.checkLogin();
            }
        });
    };
}