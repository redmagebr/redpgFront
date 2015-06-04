function AddonApp () {
	this.loadingVantagens = false;
	this.loadingTecnicas = false;
	
    this.loadVantagens = function (cbs, cbe) {
    	if (this.loadingVantagens) return;
    	this.loadingVantagens = true;
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'http://rules.redpg.com.br/paginas/Vantagens.js',
            dataType : 'script',
            success : cbs,
            error: cbe
        });
    };
    
    this.loadTecnicas = function (cbs, cbe) {
    	if (this.loadingTecnicas) return;
    	this.loadingTecnicas = true;
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'http://rules.redpg.com.br/paginas/TecnicasAddons.js',
            dataType : 'script',
            success : cbs,
            error: cbe
        });
    };
}