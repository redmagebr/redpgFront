function AddonApp () {
    this.loadVantagens = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'http://rules.redpg.com.br/paginas/Vantagens.js',
            dataType : 'script',
            success : cbs,
            error: cbe
        });
    };
    
    this.loadTecnicas = function (cbs, cbe) {
        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'http://rules.redpg.com.br/paginas/TecnicasAddons.js',
            dataType : 'script',
            success : cbs,
            error: cbe
        });
    };
}