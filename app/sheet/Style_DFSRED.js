/**
 * Parts that are customizable:
 *    this.html;
 *    this.css;
 *    add code BEFORE PROCESS;
 *    add code AFTER PROCESS;
 * @param {Sheet_Instance} sheet
 * @class Style
 * @constructor
 */
function Style_DFSRED (sheet) {
    
    this.sheet = sheet;
    
    this.changed = false;
    
    this.editing = false;
    
    this.html = "<div class='row'>\n" +
"                    <div class='cell div11'>\n" +
"                        <b>Nome:</b> <span class='sheetName'>Lessien Tonerre</span>\n" +
"                    </div>\n" +
"                    <div class='cell div13'>\n" +
"                        <b>Jogador:</b> <span class='sheetPlayer'>Red</span>\n" +
"                    </div>\n" +
"                    <div class='cell div13 centered'>\n" +
"                        <b>HP: </b> 10/10\n" +
"                    </div>\n" +
"                </div>\n" +
"                <div class='row'>\n" +
"                    <div class='cell div13'>\n" +
"                        <b>Arquétipo: </b> <span class='sheetVariable' data-id='Arquétipo' data-type='text' data-placeholder='Arquétipo'>Arquétipo</span>\n" +
"                    </div>\n" +
"                    <div class='cell div13'>\n" +
"                        <b>Idade:</b> <span class='sheetVariable' data-id='Idade' data-type='number' data-placeholder='20'>Idade</span>\n" +
"                    </div>\n" +
"                    <div class='cell div13'>\n" +
"                        <b>Raça:</b> <span class='sheetVariable' data-id='Raça' data-type='text' data-placeholder='Raça'>Raça</span>\n" +
"                    </div>\n" +
"                    <div class='cell div13 centered' style='border-top: none;'>\n" +
"                        <b>MP: </b> 10/10\n" +
"                    </div>\n" +
"                </div>\n" +
"                <div class='row'>\n" +
"                    <div class='cell div1'>\n" +
"                        <b>Objetivo:</b> <span style='display: inline-block; vertical-align: top;' class='sheetVariable' data-id='Objetivo' data-type='longtext' data-placeholder='Objetivo'>Objetivo<br/> Linha 2</span>\n" +
"                    </div>\n" +
"                </div>\n" +
"                <div class='row'>\n" +
"                    <div class='cell div1'>\n" +
"                        <b>Aparência: </b> <span style='display: inline-block; vertical-align: top;' class='sheetVariable' data-id='Aparência' data-type='longtext' data-placeholder='Aparência'>Aparência</span>\n" +
"                    </div>\n" +
"                </div>\n" +
"                <div class='row'>\n" +
"                    <div class='cell div1'>\n" +
"                        <b>Personalidade: </b> <span style='display: inline-block; vertical-align: top;' class='sheetVariable' data-id='Personalidade' data-type='longtext' data-placeholder='Personalidade'>Personalidade</span>\n" +
"                    </div>\n" +
"                </div>\n" +
"                <div class='row'>\n" +
"                    <div class='cell div111 centered header'>Combate</div>\n" +
"                    <div class='cell div111 centered header'>Atributos-Teste</div>\n" +
"                    <div class='cell div12 centered header'>Perícias</div>\n" +
"                </div>\n" +
"                <div class='row'>\n" +
"                    <div id=\"combatStats\" class='cell div111'>\n" +
"                        <p class=\"amBG\"><b>Artes Marciais:</b> <span class=\"sheetVariable resistance\" data-id=\"ArtesMarciaisRD\" data-type=\"integer\" data-default=\"0\">1</span><span class=\"sheetVariable damage\" data-id=\"ArtesMarciais\" data-type=\"integer\" data-default=\"0\">0</span></p>\n" +
"                        <p class=\"armaBG\"><b>Arma:</b> <span class=\"sheetVariable resistance\" data-id=\"ArmaRD\" data-type=\"integer\" data-default=\"0\">0</span><span class=\"sheetVariable damage\" data-id=\"Arma\" data-type=\"integer\" data-default=\"0\">0</span></p>\n" +
"                        <p class=\"techBG\"><b>Tecnologia:</b> <span class=\"sheetVariable resistance\" data-id=\"TecnologiaRD\" data-type=\"integer\" data-default=\"0\">0</span><span class=\"sheetVariable damage\" data-id=\"Tecnologia\" data-type=\"integer\" data-default=\"0\">0</span></p>\n" +
"                        <p class=\"eleBG\"><b>Elemento:</b> <span class=\"sheetVariable resistance\" data-id=\"ElementoRD\" data-type=\"integer\" data-default=\"0\">0</span><span class=\"sheetVariable damage\" data-id=\"Elemento\" data-type=\"integer\" data-default=\"0\">0</span></p>\n" +
"                        <p class=\"magBG\"><b>Magia:</b> <span class=\"sheetVariable resistance\" data-id=\"MagiaRD\" data-type=\"integer\" data-default=\"0\">0</span><span class=\"sheetVariable damage\" data-id=\"Magia\" data-type=\"integer\" data-default=\"0\">0</span></p>\n" +
"                        <p class=\"lidBG\"><b>Liderança:</b> <span class=\"sheetVariable resistance\" data-id=\"LiderançaRD\" data-type=\"integer\" data-default=\"0\">0</span><span class=\"sheetVariable damage\" data-id=\"Liderança\" data-type=\"integer\" data-default=\"0\">0</span></p>\n" +
"                        <p class=\"rdBG\"><b>Resistência Geral:</b> <span class=\"sheetVariable resistance\" data-id=\"RDGeral\" data-type=\"integer\" data-default=\"0\">0</span></p>\n" +
"                        <hr />\n" +
"                        <p class=\"defBG\"><b>Defesa:</b> <span class=\"sheetVariable dodge\" data-id=\"Defesa\" data-type=\"integer\" data-default=\"0\">1</span></p>\n" +
"                        <p class=\"atkBG\"><b>Ataque:</b> <span class=\"sheetVariable target\" data-id=\"Ataque\" data-type=\"integer\" data-default=\"0\">2</span></p>\n" +
"                    </div>\n" +
"                    <div class='cell div111 centered header'>Atributos-Teste</div>\n" +
"                    <div class='cell div12 centered header'>Perícias</div>\n" +
"                </div>\n" +
"                <div class='tbody page' id='initialPage'>\n" +
"                    <div class=\"row\">\n" +
"                        <div class=\"cell div1\">\n" +
"                            The width is mine!\n" +
"                        </div>\n" +
"                    </div>\n" +
"                    <div class=\"row\">\n" +
"                        <div class=\"cell div11\">\n" +
"                            I only get halfsies\n" +
"                        </div>\n" +
"                        <div class=\"cell div11\">\n" +
"                            Damn that guy\n" +
"                        </div>\n" +
"                    </div>\n" +
"                    <div class=\"row\">\n" +
"                        <div class=\"cell div111\">\n" +
"                            What about me, I get a third.\n" +
"                        </div>\n" +
"                        <div class=\"cell div111\" style='vertical-align: middle'>\n" +
"                                Yeah we suck\n" +
"                        </div>\n" +
"                        <div class=\"cell div12\">\n" +
"                            (I have a little more than them don't tell anyone)\n" +
"                        </div>\n" +
"                    </div>\n" +
"                </div>\n" +
"                <div class='tbody page' id='techsPage'>\n" +
"                    <div class='row'>\n" +
"                        <div class='cell div1'>\n" +
"                            Shhh I'm hiding\n" +
"                        </div>\n" +
"                    </div>\n" +
"                </div>";
    
    this.css = "#sheetViewer {\n" +
"                font-size: 0.9em;\n" +
"display: block; \n" +
"                width: 600px;\n" +
"                height: 500px;\n" +
"                font-family: alegreya;\n" +
"            }\n" +
"            \n" +
"            \n" +
"#combatStats input[type=text] { width: 20px; }" +
"            \n" +
"            \n" +
"            #sheetDiv {\n" +
"                width: 100%;\n" +
"                position: relative;\n" +
"                display: table;\n" +
"                background-color: #FFF;\n" +
"                border-right: solid 1px #000;\n" +
"                border-bottom: solid 1px #000;\n" +
"                -moz-box-sizing: border-box;\n" +
"                box-sizing: border-box;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.sheetPages {\n" +
"                position: absolute;\n" +
"                right: -31px;\n" +
"                top: 0px;\n" +
"                width: 30px;\n" +
"                height: auto;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.sheetPages > a {\n" +
"                width: 30px;\n" +
"                height: 60px;\n" +
"                overflow: hidden;\n" +
"                display: block;\n" +
"                background-color: #0F0;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.sheetPages > a.toggled {\n" +
"                background-color: #F0F;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.row {\n" +
"                display: table-row;\n" +
"                border: solid 0px #000;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.tbody {\n" +
"                display: table-row-group;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.cell {\n" +
"                position: relative;\n" +
"                height: 100%;\n" +
"                display: table-cell;\n" +
"                vertical-align: top;\n" +
"                border: solid 0px #000;\n" +
"                border-top-width: 1px;\n" +
"                border-left-width: 1px;\n" +
"                -moz-box-sizing: border-box;\n" +
"                box-sizing: border-box;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.cell > b {\n" +
"                padding-left: 5px;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.centered {\n" +
"                text-align: center;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.cell.centered > b {\n" +
"                padding-left: 0px;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.div11 {\n" +
"                display: inline-block;\n" +
"                width: 50%;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.div12 {\n" +
"                display: inline-block;\n" +
"                width: 34%;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.div111 {\n" +
"                display: inline-block;\n" +
"                width: 33%;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.div21 {\n" +
"                display: inline-block;\n" +
"                width: 66%;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.div13 {\n" +
"                display: inline-block;\n" +
"                width: 25%;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.div1 {\n" +
"                display: inline-block;\n" +
"                width: 100%;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p {\n" +
"                margin: 0px;\n" +
"                padding: 0px;\n" +
"                padding-left: 5px;\n" +
"                line-height: 30px;\n" +
"                padding-right: 5px;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p > span {\n" +
"                float: right;\n" +
"                text-align: center;\n" +
"                height: 27px;\n" +
"                line-height: 27px;\n" +
"                padding: 0px;\n" +
"                padding-bottom: 3px;\n" +
"                width: 30px;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p > span:hover {\n" +
"                cursor: pointer;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.amBG {\n" +
"                color: #931398;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.amBG:hover {\n" +
"                background-color: #fbdbfc;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.armaBG {\n" +
"                color: #ba0000;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.armaBG:hover {\n" +
"                background-color: #ffbaba;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.techBG {\n" +
"                color: #000498;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.techBG:hover {\n" +
"                background-color: #cfd0ff;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.eleBG {\n" +
"                color: #620098;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.eleBG:hover {\n" +
"                background-color: #ebc6ff;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.magBG {\n" +
"                color: #999900;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.magBG:hover {\n" +
"                background-color: #eeeeb6;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.lidBG {\n" +
"                color: #0f9f00;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.lidBG:hover {\n" +
"                background-color: #deffdb;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.rdBG {\n" +
"                color: #717171;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.rdBG:hover {\n" +
"                background-color: #d7d7d7;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.defBG {\n" +
"                color: #008d88;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.defBG:hover {\n" +
"                background-color: #ceeae9;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.atkBG {\n" +
"                color: #940000;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p.atkBG:hover {\n" +
"                background-color: #e6b4b4;\n" +
"            }\n" +
"            \n" +
"            #combatStats > p > span.damage {\n" +
"                background-image: url('img/dfs/swordIcon.png');\n" +
"            }\n" +
"            \n" +
"            #combatStats > p > span.target {\n" +
"                background-image: url('img/dfs/targetIcon.png');\n" +
"            }\n" +
"            \n" +
"            #combatStats > p > span.resistance {\n" +
"                background-image: url('img/dfs/shieldIcon.png');\n" +
"            }\n" +
"            \n" +
"            #combatStats > p > span.dodge {\n" +
"                background-image: url('img/dfs/defenseIcon.png');\n" +
"            }\n" +
"            \n" +
"            #combatStats > hr {\n" +
"                border: none;\n" +
"                border-bottom: 1px solid #d0d0d7;\n" +
"                margin: 0px;\n" +
"                padding: 0px;\n" +
"            }\n" +
"            \n" +
"            #sheetDiv div.header {\n" +
"                font-size: 1.3em;\n" +
"                font-weight: bold;\n" +
"            }";
    
    this.$css = $('<style type="text/css" />').html(this.css);
    
    this.$html = $('<div id="sheetDiv" />').html(this.html);
    
    this.mainSheet = new Sheet(this.$html, this, true);
    
    this.variableTypes = {
        'text' : window.Variable_Varchar,
        'number' : window.Variable_Number,
        'integer' : window.Variable_Integer,
        'longtext' : window.Variable_Longtext
    };
    
    this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
    };
    
    this.setValues = function () {
        this.mainSheet.update(this.sheet.values);
        this.mainSheet.update$();
    };
    
    this.beforeProcess = function (sheet, instance, style) {
        // Run Before Process
    };
    
    this.afterProcess = function (sheet, instance, style) {

    };
    
    this.process = function () {
        this.beforeProcess(this.mainSheet, this.sheet, this);
        
        this.mainSheet.process();
        
        var setChanged = this.emulateBind(
            function () {
                this.style.changed = true;
            }, {style : this}
        );

        this.mainSheet.$visible.on('changedVariable', setChanged);
        this.mainSheet.$visible.on('changedRows', setChanged);
        
        this.afterProcess(this.mainSheet, this.sheet, this);
    };
    
    this.toggleEdit = function () {
        if (!this.sheet.editable) {
            this.editing = false;
        } else {
            this.editing = !this.editing;
        }
        this.mainSheet.update$();
    };
    
    this.getField = function (id) {
        if (typeof this.mainSheet.fields[id] === 'undefined') {
            return null;
        }
        return this.mainSheet.fields[id];
    };
    
    this.get$ = function () {
        return this.$html;
    };
    
    this.get$css = function () {
        return this.$css;
    };
    
    this.getObject = function () {
        return this.mainSheet.getObject();
    };
    
    this.seppuku = function () {
        this.$html.remove();
        this.$html = null;
        this.$css.remove();
        this.$css = null;
        this.mainSheet.seppuku();
        this.mainSheet = null;
    };
}