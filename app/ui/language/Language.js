/**
 * @class Language
 * @constructor
 * @returns {Language}
 */
function Language () {
    /**
     * Generates clickable flags to change language.
     * @returns {String} html
     */
    this.createFlags = function () {
        var html = '';
        for (var language in window.lingo) {
            html += "<a class='" + language + 
                    "_Flag' title=\"" + 
                    window.lingo[language]['_LANGUAGENAME_'] + 
                    "\" onclick=\"" +
                    "window.app.ui.language.changeLanguage('" +
                    language +
                    "');\"></a>";
        }
        return html;
    };
    
    /**
     * Implements abstract.
     * Applies language on init.
     * @returns {void}
     */
    this.init = function () {
        window.app.config.registerConfig("language", this);
        this.configChanged();
    };
    
    this.configValidation = function (id, value) {
        if (id === 'language' && typeof value === 'string') {
            if (typeof window.lingo[value] !== 'undefined') {
                return true;
            }
        }
        return false;
    };
    
    this.configDefault = function (id) {
        if (id === 'language') {
            var language = this.getNavigator();
            if (typeof window.lingo[language] !== 'undefined') {
                return language;
            }
            return "pt_br";
        }
    };
    
    this.getNavigator = function () {
        var language = navigator.language.toLowerCase();
        language = language.replace('-', '_');
        if (typeof window.lingo[language] === 'undefined' && language.indexOf('_') !== -1) {
            language = language.split('_')[0];
        }
        return language;
    };
    
    /**
     * Finds text value for String id in current language and returns it.
     * If not found, will return id itself.
     * @param {String} id
     * @returns {String}
     */
    this.getLingo = function (id) {
        if (typeof window.lingo[this.currentlang] !== 'undefined') {
            if (typeof window.lingo[this.currentlang][id] !== 'undefined') {
                return window.lingo[this.currentlang][id];
            }
        }
        return id;
    };
    
    this.getLingoOn = function (id, p) {
        if (typeof window.lingo[this.currentlang] !== 'undefined') {
            if (typeof window.lingo[this.currentlang][id] !== 'undefined') {
                return window.lingo[this.currentlang][id].replace(new RegExp("%p", "g"), p);
            }
        }
        return id;
    };
    
    /**
     * Changes current language and applies it to page immediately.
     * @param {String} lang
     * @returns {void}
     */
    this.changeLanguage = function (lang) {
        window.app.config.store("language", lang);
    };
    
    /**
     * Searches document for language elements and calls applyLanguageTo on each of them.
     * Elements need to be wrapped with a tag, any tag.
     * @returns {void}
     */
    this.applyLanguage = function () {
        $('.language').each(function() {
            var $this = $(this);
            window.app.ui.language.applyLanguageTo($this);
        });
        
        $('#formPaypalButton').attr('src', 'img/home/paypal_' + this.currentlang + '.gif').off('error.Language').on('error.Language', function () {
            $(this).attr('src', 'https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif').off('error.Language');
        });
    };
    
    this.replaceOnString = function (string) {
        var $string = $('<div />').html(string);
        this.applyLanguageOn($string);
        return $string.html();
    };
    
    this.workString = function (string) {
        var $elem = $('<div />');
        $elem.html(string);
        this.applyLanguageOn($elem);
        return $elem.html();
    };
    
    /**
     * Applies language to language elements _inside_ jQuery element $this.
     * 
     * @example
     *    var $teste = $('<div />');
     *    $teste.append ($('<p class="language" data-langhtml="_SUPERTEST_"></p>'));
     *    $teste.append($('<p class="language" data-langhtml="_SUPERTESTE2_"></p>'));
     *    window.app.ui.language.applyLanguageOn($teste);
     *    $('#areaChatBox').html('').append($teste.html());
     *    
     * @param {jQuery} $this
     * @returns {void}
     */
    this.applyLanguageOn = function ($this) {
        $this.find('.language').each(function() {
            window.app.ui.language.applyLanguageTo($(this));
        });
        
        if ($this.hasClass('language')) {
            window.app.ui.language.applyLanguageTo($this);
        }
    };
    
    /**
     * Applies current language to jQuery element $this.
     * Should be called on creation of a language element that is about to be added to the page.
     * Element should still have language markers - if language is changed it needs to be updated.
     * @param {jQuery} $this
     * @returns {void}
     */    
    this.applyLanguageTo = function ($this) {
        // HTML
        if ($this.is("[data-langhtml]")) {
            var langhtml = $this.attr('data-langhtml');
            langhtml = window.app.ui.language.getLingo(langhtml);
            var replacers = ['p', 'd'];
            for (var index = 0; index < replacers.length; ++index) {
                if ($this.is("[data-lang"+replacers[index]+"]")) {
                    langhtml = langhtml.replace(new RegExp("%"+replacers[index], "g"), $this.attr("data-lang"+replacers[index]));
                }
            }
            $this.html(langhtml);
        }
        
        // TITLE
        if ($this.is("[data-langtitle]")) {
            var langtitle = $this.attr('data-langtitle');
            $this.attr('title', window.app.ui.language.getLingo(langtitle));
        }
        
        // LABEL
        if ($this.is("[data-langlabel]")) {
            var langlabel = $this.attr('data-langlabel');
            $this.attr('label', window.app.ui.language.getLingo(langlabel));
        }
        
        // PLACEHOLDER
        if ($this.is("[data-langplaceholder]")) {
            var langplaceholder = $this.attr('data-langplaceholder');
            $this.attr('placeholder', window.app.ui.language.getLingo(langplaceholder));
        }
        
        // PLACEHOLDER
        if ($this.is("[data-langvalue]")) {
            var langvalue = $this.attr('data-langvalue');
            $this.attr('value', window.app.ui.language.getLingo(langvalue));
        }
    };
    
    
    this.configChanged = function () {
        var language = window.app.config.get("language");
        this.currentlang = language;
        this.applyLanguage();
    };
}

if (window.lingo === undefined) window.lingo = {};