function goFab () {
    alert("Função não implementada.");
}

function loadScript (href, target) {
   href = 'http://redpg.com.br/' + href;
   target = typeof target !== 'undefined' ? target : "conteudo";
   $('#'+target).html("<p id='loadScriptLoading' align=center><img src='images/loading.gif' /></p>");
   // USAR SESSÕES SEM COOKIE
    if (typeof window.phpsessid !== 'undefined' && window.phpsessid !== null) {
        if (href.indexOf('?') !== -1)
            href = href + '&';
        else
            href = href + '?';
        href = href + 'PHPSESSID=' + window.phpsessid;
    }
   // FIM USAR SESSÕES SEM COOKIE
   $.ajax({
      url: href,
         crossDomain: false,
      dataType: "script",
      error: function (errorCode) {
         var msg;
         var tipo = 'error';
         switch (errorCode.status) {
            case 400:
               msg = "Houve um erro com a geração do pedido.";
               break;
            case 401:
               msg = "Você não possui autorização para acessar essa página.";
               updateLogin ();
               break;
            case 404:
               msg = "Página não encontrada.";
               break;
            case 501:
               msg = "Essa função ainda não foi implementada.";
               tipo = 'warning';
               break;
            case 512:
               msg = "Erro no acesso ao banco de dados.";
               break;
            default:
               msg = "Houve um erro no processamento do pedido. - " + errorCode.status;
         }
         $('#loadScriptLoading').remove();
         informar(msg, tipo);
      },
      success: function () {
         $('#loadScriptLoading').remove();
      }
   });
}


function ajaxify (href, target) {
   target = typeof target !== 'undefined' ? target : "conteudo";
   $('#'+target).html("<p id='loadScriptLoading' align=center><img src='images/loading.gif' /></p>");
   href = 'http://redpg.com.br/' + href;
    // USAR SESSÕES SEM COOKIE
    if (typeof window.phpsessid !== 'undefined' && window.phpsessid !== null) {
        if (href.indexOf('?') !== -1)
            href = href + '&';
        else
            href = href + '?';
        href = href + 'PHPSESSID=' + window.phpsessid;
    }
   // FIM USAR SESSÕES SEM COOKIE
   $.ajax({
      url: href,
         crossDomain: false,
      error: function (errorCode) {
         var msg;
         var tipo = 'error';
         switch (errorCode.status) {
            case 400:
               msg = "Houve um erro com a geração do pedido.";
               break;
            case 401:
               msg = "Você não possui autorização para acessar essa página.";
               updateLogin ();
               break;
            case 404:
               msg = "Página não encontrada.";
               break;
            case 501:
               msg = "Essa função ainda não foi implementada.";
               tipo = 'warning';
               break;
            case 512:
               msg = "Erro no acesso ao banco de dados.";
               break;
            default:
               msg = "Houve um erro no processamento do pedido.";
         }
         $('#loadScriptLoading').remove();
         informar(msg, tipo);
      },
      success: function (result) {
         $('#'+target).html(result);
      }
   });
}

function loginajax () {
   var href = 'http://redpg.com.br/AJAX/ajax_loginForm.php';
   $('#usuario').html("<p id='loadScriptLoading' align=center>LOADING</p>");
   $.ajax({
      url: href,
         crossDomain: false,
      error: function() {
         $("#usuario").html('<p>Erro! <a class="retry" href="#">Tentar Novamente?</a></p>');
         $("#usuario"+" a.retry").click(function() {
                 loginajax();
         });
      },
      success: function(result) {
         $('#usuario').html(result);
         $('#formulario_login').submit(function() {
            login();
            return false;
         });
         $('#loginForm').focus();
      }
    });
   window.scrollTo(0,0);
   return false;
}

function login() {
   if ($("#loginForm").val() != "" && $("#senhaForm").val() != "") {
      var loginVal = $("#loginForm").val();
      var senhaVal = $("#senhaForm").val();
      $('#usuario').html("<p id='loadScriptLoading' align=center>LOADING</p>");
      $('#leftmenu').html("<p id='loadScriptLoading' align=center>LOADING</p>");
      var href = 'http://redpg.com.br/AJAX/ajax_loginProc.php';
         // USAR SESSÕES SEM COOKIE
    if (typeof window.phpsessid !== 'undefined' && window.phpsessid !== null) {
        if (href.indexOf('?') !== -1)
            href = href + '&';
        else
            href = href + '?';
        href = href + 'PHPSESSID=' + window.phpsessid;
    }
   // FIM USAR SESSÕES SEM COOKIE
      $.ajax({
         url: href,
         type: "POST",
         crossDomain: false,
         data: {
            login: loginVal,
            senha: senhaVal
         },
         dataType: "script",
         statusCode: {
            401: function () {
               $("#usuario").html('<p>Erro! <a class="retry" href="#">Tentar Novamente?</a></p>');
               $("#usuario"+" a.retry").click(function() {
                       loginajax();
               });
            }
         },
         error: function() {
            $("#usuario").html('<p>Erro! <a class="retry" href="#">Tentar Novamente?</a></p>');
            $("#usuario"+" a.retry").click(function() {
                    loginajax();
            });
         }
      });
   } else {
      alert("Você precisa preencher tanto o Login quanto a Senha antes de tentar loggar.");
   }
}

function updateLogin () {
    var href = 'http://redpg.com.br/AJAX/ajax_loginProc.php?update=1';
       // USAR SESSÕES SEM COOKIE
    if (typeof window.phpsessid !== 'undefined' && window.phpsessid !== null) {
        if (href.indexOf('?') !== -1)
            href = href + '&';
        else
            href = href + '?';
        href = href + 'PHPSESSID=' + window.phpsessid;
    }
   // FIM USAR SESSÕES SEM COOKIE
    $.ajax({url: href,
             dataType: "script",
         crossDomain: false,
             error: function() {
                 $('#leftmenu').html("<p>ERRO</p>");
                 $("#usuario").html('<p>Erro! <a class="retry" href="#">Tentar Novamente?</a></p>');
                 $("#usuario"+" a.retry").click(function() {
                         loginajax();
                 });
             }});
}   
   
function logout() {
   $('#usuario').html("<p id='loadScriptLoading' align=center>LOADING</p>");
   $('#leftmenu').html("<p id='loadScriptLoading' align=center>LOADING</p>");
   var href = 'http://redpg.com.br/AJAX/ajax_loginProc.php?logout=1';
      // USAR SESSÕES SEM COOKIE
    if (typeof window.phpsessid !== 'undefined' && window.phpsessid !== null) {
        if (href.indexOf('?') !== -1)
            href = href + '&';
        else
            href = href + '?';
        href = href + 'PHPSESSID=' + window.phpsessid;
    }
   // FIM USAR SESSÕES SEM COOKIE
   $.ajax({url: href,
         crossDomain: false,
           dataType: "script"});
   
}

/**
 * sendForm will send the value of fieldIDs towards HREF through POST and will also place the returned
 * page inside #conteudo.
 * Stringify defines which values will be encoded in JSON before being sent.
 * Mandatory defines which values cannot be empty ("").
 * Field Names are always split with ';'.
 * @param {OBJECT FORM} form
 * @returns {BOOLEAN}
 */
function sendForm (form) {
    var href = $(form).attr('action');
    var formId = $(form).attr('id');
    var error = false;
    var formData = new Object();
    $('#'+ formId + ' :input').each(function(i) {
       if ($(this).attr('mandatory') && $(this).val() === '') {
           informar ('O campo ' + $(this).attr('name') + ' não pode ser vazio.', 'warning');
           error = true;
           return true;
       }
       if (typeof $(this).attr('equalTo') !== 'undefined' && $(this).val() !== $('#'+$(this).attr('equalTo')).val()) {
           informar ('O campo ' + $(this).attr('name') + ' deve ser igual ao campo ' + $('#'+$(this).attr('equalTo')).attr('name')+'.', 'warning');
           error = true;
           return true;
       }
       if ($(this).attr('validName') && (!$(this).val().match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,30}$') || $(this).val()[0] === ' ')) {
           informar ('O campo ' + $(this).attr('name') + ' só pode conter letras e números, tendo um tamanho mínimo de 3 caracteres e um máximo de 30. Ele não pode começar com um espaço.', 'warning');
           error = true;
       }
       if ($(this).attr('json')) {
           formData[$(this).attr('id')] = JSON.stringify($(this).val());
       } else {
           formData[$(this).attr('id')] = $(this).val();
       }
    });
    if (error) {
        return false;
    }
    $('#loadingBody').show();
   href = 'http://redpg.com.br/' + href;
    // USAR SESSÕES SEM COOKIE
    if (typeof window.phpsessid !== 'undefined' && window.phpsessid !== null) {
        if (href.indexOf('?') !== -1)
            href = href + '&';
        else
            href = href + '?';
        href = href + 'PHPSESSID=' + window.phpsessid;
    }
   // FIM USAR SESSÕES SEM COOKIE
   console.log("Send form to " + href);
   console.log(formData);
    $.ajax({
      url: href,
         crossDomain: false,
      type: "POST",
      data: formData,
      error: function (errorCode) {
         var msg;
         var tipo = 'error';
         switch (errorCode.status) {
            case 400:
               msg = "Houve um erro com a geração do pedido.";
               break;
            case 401:
               msg = "Você não possui autorização para acessar essa página.";
               updateLogin ();
               break;
            case 404:
               msg = "Página não encontrada.";
               break;
            case 501:
               msg = "Essa função ainda não foi implementada.";
               tipo = 'warning';
               break;
            case 512:
               msg = "Erro no acesso ao banco de dados.";
               break;
            default:
               msg = "Houve um erro no processamento do pedido.";
         }
         $('#loadingBody').hide();
         informar(msg, tipo);
      },
      success: function (result) {
         $('#conteudo').html(result);
         $('#loadingBody').hide();
         return false;
      }
   });
   return false;
}

function disableLoginInterval () {
    if (typeof window.loginInterval !== 'undefined')
        clearInterval(window.loginInterval);
}

function enableLoginInterval () {
    disableLoginInterval();
    window.loginInterval = window.setInterval(
    function() {
        updateLogin (); 
    }, 30000);
}

function openGroup (obj) {
	var id = $(obj).attr('opener');
	if ($('#grupo'+id).is(":visible")) {
		$('#grupo'+id).fadeOut(150);
		$(obj).html($(obj).html().replace('-', '+'));
	} else {
		$('#grupo'+id).fadeIn(100);
		$(obj).html($(obj).html().replace('+', '-'));
	}
	return false;
}



// SHORTCUT

/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}
	
			var modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
                        
			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);
	
				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;
	
					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
};


// AUTO RESIZE
(function(b){var a={resize:function(g,d){var j=false;if(d.autoHeightUp||d.autoHeightDown){var i=g.css("overflowY");if(d.force){g.css("overflowY","scroll")}var e=g.prop("scrollHeight");var f=g.prop("clientHeight");if(e>f){if(d.autoHeightUp){g.height(e)}}else{if(e==f){if(d.autoHeightDown){g.after(function(){var l="background-color: transparent;";l+="width: 0px;";l+="height: "+g.height()+"px;";l+="overflow: hidden;";l+="border-width: 0px;";l+="padding: 0px;";l+="margin: 0px;";l+="float: "+g.css("float")+";";var k="<div style='"+l+"'/>";return k});g.height(0);g.height(g.prop("scrollHeight"));g.next().remove()}}else{if(d.autoHeightDown){g.height(e)}}}if(d.force){g.css("overflowY",i)}}if(d.autoHeightUp){var h=g.height()-g.prop("clientHeight");if(h>0){g.height(g.height()+h)}}}};var c={init:function(d){return this.each(function(e){a.resize(b(this),d);var f=[];if(d.keyup){f.push("keyup.xautoresize")}if(d.keydown){f.push("keydown.xautoresize")}if(d.focus){f.push("focus.xautoresize")}if(d.change){f.push("change.xautoresize")}if(f.length>0){f=f.join(" ");b(this).unbind(f);b(this).bind(f,function(){a.resize(b(this),d)})}})},destroy:function(){return this.each(function(d){b(this).unbind(".xautoresize")})},resize:function(d){return this.each(function(e){a.resize(b(this),d)})}};b.fn.xautoresize=function(d){d=b.extend({action:"init",force:false,autoHeightUp:true,autoHeightDown:true,keyup:true,keydown:true,focus:true,change:true},d);if(d.autoHeightUp!==true){d.autoHeightUp=false}if(d.autoHeightDown!==true){d.autoHeightDown=false}if(d.keyup!==true){d.keyup=false}if(d.keydown!==true){d.keydown=false}if(d.focus!==true){d.focus=false}if(d.change!==true){d.change=false}if(c[d.action]){return c[d.action].apply(this,[d])}else{return c.init.apply(this,[d])}}})(jQuery);

// ERROS
/**
 * @author Reddo
 */

function boxCleanUp() {
    $('.infoMessage').each(function() {
       if ((new Date().getTime() - 10000) > $(this).attr('timeAppear')) {
           $(this).slideUp(1000, function() {
               $(this).remove();
           });
       }
    });
    if ($('.infoMessage').length < 1) {
        window.clearInterval(window.boxInterval);
        delete window.boxInterval;
    }
}

var erroCount = 0;
function informar (mensagem, tipo) {
	tipo = typeof tipo !== 'undefined' ? tipo : "error";
	tipo = tipo !== 'error' && tipo !== 'warning' && tipo !== 'success' ? "error" : tipo;
	if ($('#infoMessage').length > 0) {
            $('#infoMessage').remove();
        }
        $('#messageBox').append("<div id='infoMessage"+ (++window.erroCount) + "' class='"+tipo+"Container infoMessage' timeAppear='"+new Date().getTime()+"' style='display: none'><img src='images/"+tipo
+"Image.png' class='"+tipo+"Image' /><a onclick=\"$(this.parentNode).slideUp(1000, function() { $(this).remove(); }); return false;\" class='"+tipo+"Close' href='#' title='Fechar essa mensagem.'>Fechar</a><p class='"+tipo
+"Message'>" + mensagem + "</p></div>");
        $('#infoMessage'+ window.erroCount).fadeIn(150);
        if (typeof window.boxInterval === 'undefined')
            window.boxInterval = window.setInterval(boxCleanUp, 500);
	return false;
}

$(document).ready(function() {
    $('#rightmenu').hide();
    
    if (document.location.host.indexOf('redpg.com.br') !== -1) {
        updateLogin();
    }
});