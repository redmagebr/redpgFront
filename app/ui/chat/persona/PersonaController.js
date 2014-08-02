/**
 * Controls every UI element related to Personas.
 * @class PersonaController
 * @constructor
 */
function PersonaController () {
    this.$btup;
    this.$btdown;
    this.$btadd;
    this.$btremove;
    this.$container;
    
    /* Form */
    this.$creationWindow;
    this.$nameinput;
    this.$hideinput;
    
    this.init = function () {
        this.$btup = $('#personaUpButton');
        this.$btdown = $('#personaDownButton');
        this.$btadd = $('#personaAddButton');
        this.$btremove = $('#personaRemoveButton');
        this.$container = $('#personaCenterBox');
        
        this.$creationWindow = $('#personaCreateDiv');
        this.$nameinput = $('#PCFName');
        this.$avatarinput = $('#PCFAvatar');
        this.$hideinput = $('#PCFHide');
        
        this.setBindings();
        this.considerScrollers();
        this.closeWindow();
    };
    
    this.setBindings = function () {
        this.$btdown.bind('click', function (){
            window.app.ui.chat.pc.animateDown();
        });
        
        this.$btup.bind('click', function (){
            window.app.ui.chat.pc.animateUp();
        });
        
        $('#personaAddButton').bind('click', function () {
            window.app.ui.chat.pc.openCreation();
        });
        
        $('#personaRemoveButton').bind('click', function () {
            window.app.ui.chat.pc.removePersona();
        });
        
        $('#PCForm').on('submit', function () {
            window.app.ui.chat.pc.submit();
        });
    };
    
    this.handleResize = function () {
        this.considerScrollers();
    };
    
    this.considerScrollers = function () {
        var scrollTop = this.$container.scrollTop();
        var height = this.$container.height() / 2;
        var scrollHeight = this.$container[0].scrollHeight;
        
        if (scrollTop + (height * 2) < scrollHeight) {
            this.$btdown.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btdown.stop(true, true).addClass('deactivated', 200);
        }
        
        if (scrollTop > 0) {
            this.$btup.stop(true, true).removeClass('deactivated', 200);
        } else {
            this.$btup.stop(true, true).addClass('deactivated', 200);
        }
    };
    
    this.animateDown = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.pc.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height() / 2;
                var scrollHeight = $this[0].scrollHeight;
                if (scrollTop + height <= scrollHeight) {
                    if (scrollTop + (height * 2) <= scrollHeight) {
                        return scrollTop + (height * 2);
                    }
                    return scrollTop + height;
                } else {
                    return scrollTop;
                }
            } ()
        }, 200, function () {
            window.app.ui.chat.pc.considerScrollers();
        });
    };
    
    this.animateUp = function () {
        this.$container.stop(true, true).animate({
            scrollTop : function () {
                var $this = window.app.ui.chat.pc.$container;
                var scrollTop = $this.scrollTop();
                var height = $this.height() / 2;
                if (scrollTop - height >= 0) {
                    if (scrollTop - (height * 2) >= 0) {
                        return scrollTop - (height * 2);
                    }
                    return scrollTop - height;
                } else {
                    return scrollTop;
                }
            } ()
        }, 200, function () {
            window.app.ui.chat.pc.considerScrollers();
        });
    };
    
    this.removePersona = function () {
        var $found = this.$container.find('a.toggled');
        if ($found.length > 0) {
            this.setPersona($($found[0]));
            var nome = $($found[0]).attr('data-persona');
            $($found[0]).remove();
            window.app.ui.chat.cc.room.persona = null;
            this.removeMemory(nome);
        }
    };
    
    this.addPersona = function (persona, avatar, hidepers, restoring) {
        if (typeof restoring === 'undefined') restoring = false;
        var $found = this.$container.find('a');
        var $this;
        for (var i = 0; i < $found.length; i++) {
            $this = $($found[i]);
            if ($this.attr('data-persona') === persona) {
                $this.remove();
            }
        }
        
        var $pers = $('<a class="button" />');
        $pers.text(persona);
        $pers.attr('data-persona', persona);
        $pers.attr('data-avatar', avatar);
        $pers.attr('data-hidepers', hidepers);
        
        $pers.bind('click', function () {
            window.app.ui.chat.pc.setPersona($(this));
        });
        
        this.$container.find('a.toggled').removeClass('toggled');
        this.$container.append($pers);
        
        this.considerScrollers();
        if (!restoring) {
            this.setPersona($pers);
            this.addMemory(persona, avatar, hidepers);
        }
    };
    
    this.setPersona = function ($persona, force) {
        if (typeof force === 'undefined') force = false;
        if ($persona.hasClass('toggled') && !force) {
            $persona.removeClass('toggled');
            window.app.ui.chat.cc.room.persona = null;
            window.app.ui.chat.cc.room.avatar = null;
            var $html = $('<p class="chatSistema language" data-langhtml="_NICKREMOVED_" />');
        } else {
            window.app.ui.chat.cc.room.persona = $persona.attr('data-persona');
            window.app.ui.chat.cc.room.avatar = $persona.attr('data-avatar');
            window.app.ui.chat.cc.room.hidePersona = $persona.attr('data-hidepers') === 'true';
            this.$container.find('a.toggled').removeClass('toggled');
            $persona.addClass('toggled');
            var persona = $persona.html();
            var $html = $('<p class="chatSistema language" data-langhtml="_NICKCHANGE_" />');
            $html.attr("data-langp", persona);
        }
        
        window.app.ui.language.applyLanguageTo($html);
        
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.submit = function () {
        var avatar = this.$avatarinput.val();
        if (avatar === '') avatar = null;
        this.addPersona(
            this.$nameinput.val(),
            avatar,
            this.$hideinput.is(':checked')
        );
        this.closeWindow();
    };
    
    this.closeWindow = function () {
        this.$creationWindow.finish().fadeOut(200);
    };
    
    this.openWindow = function () {
        this.$avatarinput.val('');
        this.$nameinput.val('');
        this.$hideinput.removeAttr('checked');
        this.$creationWindow.finish().fadeIn(200, function () {
            window.app.ui.chat.pc.$nameinput.focus();
        });
    };
    
    this.openCreation = function () {
        if (this.$creationWindow.is(':visible')) {
            this.closeWindow();
        } else {
            this.openWindow();
        }
    };
    
    this.restore = function () {
        var personas = window.app.memory.getMemory("Personas", {});
        if (typeof personas[window.app.ui.chat.cc.room.id] === 'undefined') {
            personas[window.app.ui.chat.cc.room.id] = {};
        }
        
        var persona;
        for (var i in personas[window.app.ui.chat.cc.room.id]) {
            persona = personas[window.app.ui.chat.cc.room.id][i];
            this.addPersona(persona.persona, persona.avatar, persona.hidepers, true);
        }
    };
    
    this.addMemory = function (persona, avatar, hidepers) {
        var personas = window.app.memory.getMemory("Personas", {});
        if (typeof personas[window.app.ui.chat.cc.room.id] === 'undefined') {
            personas[window.app.ui.chat.cc.room.id] = {};
        }
        personas[window.app.ui.chat.cc.room.id][persona] = {
            persona : persona,
            avatar : avatar,
            hidepers : hidepers
        };
        
        window.app.memory.saveMemory();
    };
    
    this.removeMemory = function (persona) {
        var personas = window.app.memory.getMemory("Personas", {});
        if (typeof personas[window.app.ui.chat.cc.room.id] === 'undefined') {
            personas[window.app.ui.chat.cc.room.id] = {};
        }
        delete personas[window.app.ui.chat.cc.room.id][persona];
        window.app.memory.saveMemory();
    };
}