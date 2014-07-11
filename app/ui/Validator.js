function Validator () {
    this.validate = function (val, valtype) {
        if (valtype === 'email') {
            if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)) {
                console.log('invalidMail');
                return false;
            }
        } else if (valtype === 'password') {
            if (!val.match('^[a-zA-Z0-9]{3,12}$')) {
                console.log('invalidPassword');
                return false;
            }
        } else if (valtype === 'name') {
            if (!val.match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,30}$') || val.charAt(0) === ' ') {
                console.log('invalidName');
                return false;
            }
        } else if (valtype === 'shortname') {
            if (!val.match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,12}$') || val.charAt(0) === ' ') {
                console.log('invalidShortName');
                return false;
            }
        } else if (valtype === 'nicksufix') {
            if (!val.match('^[0-9]{4,4}$')) {
                console.log('invalidNickSufix');
                return false;
            }
        } else if (valtype === 'nickname') {
            if (!val.match('^[a-zA-Z0-9çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,12}$')) {
                console.log('invalidNickname');
                return false;
            }
        } else if (valtype === 'longname') {
            if (!val.match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,200}$') || val.charAt(0) === ' ') {
                console.log('invalidLongName');
                return false;
            }
        } else if (valtype === 'login') { 
            if (!val.match('^[a-z0-9]{3,12}$')) {
                console.log('invalidLogin');
                return false;
            }
        } else if (valtype === 'number') {
            if (!$.isNumeric(val)) {
                console.log('invalidNumber');
                return false;
            }
        } else if (valtype === 'notnull') {
            if (val === '') {
                console.log('invalidNotnull');
                return false;
            }
        }
        return true;
    };
}