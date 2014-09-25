/**
 * @class Language
 * @constructor
 * @returns {Language}
 */
function Language () {
    /**
     * Not implemented. This needs to be stored and retrieved from database object.
     * @type String|String
     */
    if (localStorage.lastLang !== undefined) {
        this.currentlang = localStorage.lastLang;
    } else {
        this.currentlang = navigator.language;
    }
    
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
        this.updateConfig();
        this.applyLanguage();
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
        this.currentlang = lang;
        localStorage.lastLang = lang;
        window.app.configdb.store("language", lang);
        this.applyLanguage();
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
    
    
    this.updateConfig = function () {
        var language = window.app.configdb.get("language", this.currentlang);
        language = language.replace('-', '_');
        if (typeof window.lingo[language] === 'undefined' && language.indexOf('_') !== -1) {
            language = language.split('_')[0];
        }
        if (language !== this.currentlang && typeof window.lingo[language] !== 'undefined') {
            this.currentlang = language;
        } else if (window.lingo[this.currentlang] === undefined) {
            this.currentlang = 'pt_br';
        }
        this.applyLanguage();
    };
}

window.lingo = {};