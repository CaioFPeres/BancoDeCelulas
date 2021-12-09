function pesquisar(){


    let table = document.getElementById("table");
    let headers;
    let headersString;
    let ref;
    let search;
    
    
    // mostra o loading gif
    document.getElementById("loading").className = "validacaoLoading";


    // verifica se a busca será nas celulas que estão atualmente no banco ou no registro de celulas deletadas
    if(document.getElementById("opcaoBanco").value == "Banco"){
        ref = firebase.database().ref("Banco");
    }
    else{
        ref = firebase.database().ref("Deletados");
    }



    // verifica qual tipo de celula será buscada e é então escolhida as configurações corretas para a busca
    if(document.getElementById("opcaoPrincipal").value == "acmm"){
        search = celulaAcMm();
        headers = adicionaHeaders(1);
        headersString = ["Celula", "Protocolo", "Nprotocolo", "Nhibrido", "Clonagem", "Especificidade", "Obs", "ultima_mod_por", "Congelamento", "ultima_mod"];
    }
    else if(document.getElementById("opcaoPrincipal").value == "linhagem"){
        search = celulaLinhagem();
        headers = adicionaHeaders(2);
        headersString = ["Celula", "Denominacao", "TipoDeAnimal", "TecidoDeOrigem", "ObtidaDe", "Cultura", "Obs", "ultima_mod_por", "Congelamento", "ultima_mod"];
    }
    else if(document.getElementById("opcaoPrincipal").value == "primaria"){
        search = celulaPrimaria();
        headers = adicionaHeaders(3);
        headersString = ["Celula", "Denominacao", "TipoDeCelula", "TipoDeAnimal", "Cultura", "Passagem", "Obs", "ultima_mod_por", "Congelamento", "ultima_mod"];
    }
    else if(document.getElementById("opcaoPrincipal").value == "tecido"){
        search = celulaTecido();
        headers = adicionaHeaders(4);
        headersString = ["Celula", "TipoDeAnimal", "Sigla", "Obs", "ultima_mod_por", "Doador", "RGHC", "Nascimento", "Congelamento", "ultima_mod"];
    }


    //mostra nova janela com resultados
    document.getElementById("overlay").className = "validacaoTable";

    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    document.getElementsByTagName("html")[0].style.overflowX = "hidden";

    //listener para fechar a janela
    document.getElementById("fechar").addEventListener("click", function() {

        document.getElementById("overlay").className = "validacaoEscondida";

        limparTable(table, headers);
        
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        document.getElementsByTagName("html")[0].style.overflowX = "auto";
        document.getElementById("fechar").removeEventListener("click", arguments.callee);

    });


    //soh existe um caso de null: se o usuario preencher as datas de forma incompleta/incorretamente
    if(search == null){
        
        document.getElementById("validacao").className = "validacao";

        document.getElementById("validacao").addEventListener("animationend", () => {
            document.getElementById("validacao").className = "validacaoEscondida";
            document.getElementById("validacao").removeEventListener("animationend", arguments.callee);

        });

        return;
    }



    //para ver se o usuario quer buscar pelas datas
    let buscaData = 0;
    let limitesBusca = [];


    for(let i = search.length - 1; i >= 0; i--){

        if(search[i].chave == "LimiteUltima_mod"){
            limitesBusca[buscaData++] = search[i].valor;
            search.splice(i, 1);
        }
        else if(search[i].chave == "LimiteCongelamento"){
            limitesBusca[buscaData++] = search[i].valor;
            search.splice(i, 1);
        }
        
    }


    // inverte as posicoes
    if(buscaData == 2){
        let limAux;
        limAux = limitesBusca[1];
        limitesBusca[1] = limitesBusca[0];
        limitesBusca[0] = limAux;
    }


    //pega o tamanho do objeto
    let tamanho = search.length;

    buscaQualquerTam(ref, table, headersString, tamanho - 1, buscaData, limitesBusca, search);

}


function buscaQualquerTam(ref, table, headersString, tam, buscaData, limitesBusca, search){

    //busca no banco de celulas escolhido
    ref.once("value", snap => {

        //entra no container
        snap.forEach( function(container) {
            //entra no rack
            container.forEach(function (rack){
                //entra na gaveta
                rack.forEach(function (gaveta){
                    //verifica cada posicao da gaveta
                    gaveta.forEach(function (posicao){

                        if(compararTudo(tam, buscaData, limitesBusca, search, posicao)){

                            adicionarTable(table, headersString, posicao, gaveta.key, rack.key, container.key);

                        }

                    });
                });
            });
        });

        
    }).then( () => {
        setTimeout(function(){
            // remove o loading gif
            document.getElementById("loading").className = "validacaoEscondida";
        }, 300);
    });

}


function compararTudo(tam, buscaData, limitesBusca, search, posicao){

    if(buscaData > 0){
        return ( posicao.child(search[tam].chave).val() >= search[tam].valor && posicao.child(search[tam].chave).val() <= limitesBusca[buscaData - 1] ) && compararTudo(tam - 1, buscaData - 1, limitesBusca, search, posicao);
    }
    else if( tam >= 0){
        return subStringCompare(search[tam].valor, posicao.child(search[tam].chave).val()) && compararTudo(tam - 1, buscaData, limitesBusca, search, posicao);
    }

    return true;
}

// string1 é o que está sendo buscado, tem que ser menor ou igual a string2
function subStringCompare(string1, string2){

    let contador = 0;


    if(string1 == null || string2 == null)
        return false;


    // tenta transformar em minuscula, se for valor numerico irá falhar na string2
    try{
        string1 = string1.toLowerCase();
        string2 = string2.toLowerCase();
    }
    // se for valor numerico, fazemos uma comparação entre inteiros
    catch(err){
        if(string2 == parseInt(string1)){
            return true;
        }
    }


    if(string1.length > string2.length)
        return false;

    if(string1.length == 0)
        return true;


    for(let i = 0; i < string2.length - string1.length + 1; i++){
        
        for(let j = 0; j < string1.length; j++){

            if(string2[i+j] == string1[j]){
                contador++;
            }
            else{
                contador = 0;
                break;
            }
        }

        if(contador == string1.length){
            return true;
        }
    
    }

    return false;

}


// nao to usando para nada
function buscaTudo(ref, table){

    //busca no firebase
    ref.once("value", snap => {

        //entra no container
        snap.forEach( function(container) {
            //entra no rack
            container.forEach(function (rack){
                //entra na gaveta
                rack.forEach(function (gaveta){
                    //verifica cada posicao da gaveta
                    gaveta.forEach(function (posicao){
                            
                        adicionarTable(table, posicao, gaveta.key, rack.key, container.key);
                    
                    });

                });

            });

        });

    });

}


function adicionaHeaders(celula){

    let tableTr = document.getElementById("tabletr");

    let headers = [];
    let headersString = [];

    // esse header string é o nome que vai direto no cabeçalho da tabela, diferente do da main function, que é o nome como está no banco
    if(celula == 1)
        headersString = ["Celula", "Protocolo", "Nprotocolo", "Nhibrido", "Clonagem", "Espec.", "Obs.", "Ultima Mod. Por", "Congelamento", "Ultima Mod.", "Local"];
    else if( celula == 2)
        headersString = ["Celula", "Denominação", "Origem Animal", "Tecido De Origem", "Obtida de", "Cultura", "Obs.", "Ultima Mod. Por", "Congelamento", "Ultima Mod.", "Local"];
    else if( celula == 3)
        headersString = ["Celula", "Denominação", "Tipo de Celula", "Tipo de Animal", "Cultura", "Passagem", "Obs.", "Ultima Mod. Por", "Congelamento", "Ultima Mod.", "Local"];
    else if( celula == 4)
        headersString = ["Celula", "Tipo de Animal", "Sigla", "Obs.", "Ultima Mod. Por", "Doador", "RGHC", "Nascimento", "Congelamento", "Ultima Mod.", "Local"];



    for(let i = 0; i < headersString.length; i++){
        headers[i] = document.createElement("th");
        tableTr.appendChild(headers[i]);
        headers[i].innerHTML = headersString[i];
    }

    return headers;

}


// só a posicao q é o objeto do firebase, gaveta, rack e container sao strings
function adicionarTable(table, headersString, posicao, gaveta, rack, container){

    let nas = 0;
    let newRow = table.insertRow();
    let cell;

    //pega ultima modificacao
    var dataM = new Date(posicao.child("ultima_mod").val());
    var diaM = dataM.getDate();
    var mesM = dataM.getMonth() + 1;
    var anoM = dataM.getFullYear();

    var stringDataM = diaM + "/" + mesM + "/" + anoM;

    //data de congelamento
    var dataC = new Date(posicao.child("Congelamento").val());
    var diaC = dataC.getDate();
    var mesC = dataC.getMonth() + 1;
    var anoC = dataC.getFullYear();

    var stringDataC = diaC + "/" + mesC + "/" + anoC;

    var stringDataN;

    if(posicao.child("Nascimento").val() != null){

        nas = 1;
            
        //pega data do nascimento
        var dataN = new Date(posicao.child("Nascimento").val());
        var diaN = dataN.getDate();
        var mesN = dataN.getMonth() + 1;
        var anoN = dataN.getFullYear();

        stringDataN = diaN + "/" + mesN + "/" + anoN;
    
    }


    var linha = posicao.key.split("-")[0];
    var coluna = posicao.key.split("-")[1];

    var stringPosicao = "C: " + container + "\nR: " + rack + "\nG: " + gaveta + "\nL: " + linha + "\nC: " + coluna;


    for(let i = 0; i < headersString.length - 2 - nas; i++){
        
        cell = newRow.insertCell(i);

        cell.innerHTML = posicao.child(headersString[i]).val();

        cell.style.textAlign = "center";

    }

    

    if(nas != 0){
        cell = newRow.insertCell(headersString.length - 3);

        cell.innerHTML = stringDataN;
        cell.style.textAlign = "center";
    }

    
    cell = newRow.insertCell(headersString.length - 2);

    cell.innerHTML = stringDataC
    cell.style.textAlign = "center";

    cell = newRow.insertCell(headersString.length - 1);

    cell.innerHTML = stringDataM
    cell.style.textAlign = "center";

    cell = newRow.insertCell(headersString.length);

    cell.innerHTML = stringPosicao
    cell.style.textAlign = "center";
    cell.style.whiteSpace = "pre";

}


function opcoesPrincipais(){

    document.getElementById("acmm").className = "opcaoEscondida";
    document.getElementById("linhagem").className = "opcaoEscondida";
    document.getElementById("primaria").className = "opcaoEscondida";
    document.getElementById("tecido").className = "opcaoEscondida";

    document.getElementById(document.getElementById("opcaoPrincipal").value).className = "opcaoSelecionada";
    
}


function opcoesLinhagem(){
    if(document.getElementById("opcaoOrigem").value == "Outro")
        document.getElementById("OutroTipoAnimalLinhagem").className = "opcaoSelecionada";
    else
        document.getElementById("OutroTipoAnimalLinhagem").className = "opcaoEscondida";
}


function opcoesPrimariaTipoCelula(){
    if(document.getElementById("opcaoTipo").value == "Outro")
        document.getElementById("OutroTipoCelula").className = "opcaoSelecionada";
    else
        document.getElementById("OutroTipoCelula").className = "opcaoEscondida";
}


function opcoesPrimariaTipoAnimal(){
    if(document.getElementById("opcaoTipoAnimal").value == "Outro")
        document.getElementById("OutroTipoAnimalPrimaria").className = "opcaoSelecionada";
    else
        document.getElementById("OutroTipoAnimalPrimaria").className = "opcaoEscondida";
}


function opcoesTecido(){

    document.getElementById("humanoTecido").className = "opcaoEscondida";
    document.getElementById("outro").className = "opcaoEscondida";
    document.getElementById("siglaDoAnimal").className = "opcaoEscondida";

    if(document.getElementById("opcaoTecido").value == "Humano")
        document.getElementById("humanoTecido").className = "opcaoSelecionada";
    else if (document.getElementById("opcaoTecido").value == "Outro"){
        document.getElementById("siglaDoAnimal").className = "opcaoSelecionada";
        document.getElementById("outro").className = "opcaoSelecionada";
    }
    else if (document.getElementById("opcaoTecido").value != ""){
        document.getElementById("siglaDoAnimal").className = "opcaoSelecionada";
    }

}


function celulaAcMm(){

    let dataC = getData("C1");
    let dataLC = getData("LC1");
    let dataM = getData("M1");
    let dataLM = getData("LM1");


    // map é chato, usando arraylist de objetos (objetos comuns não mantem ordem e map não deixa acessar por indice (da pra criar uma função especifica para isso), 
    // nem aceita funções aparentemente)
    let celula = [];

    celula.push(new CellFeature("Celula", "AcMm"));
    celula.push(new CellFeature("Protocolo", document.getElementById("protocolo").value));
    celula.push(new CellFeature("Nprotocolo", document.getElementById("Nprotocolo").value));
    celula.push(new CellFeature("Nhibrido", document.getElementById("Nhibrido").value));
    celula.push(new CellFeature("Clonagem", document.getElementById("clonagem").value));
    celula.push(new CellFeature("Especificidade", document.getElementById("especificidade").value));
    celula.push(new CellFeature("ultima_mod_por", document.getElementById("mod_por1").value));
    celula.push(new CellFeature("Congelamento", dataC.getTime()));
    celula.push(new CellFeature("ultima_mod", dataM.getTime()));
    celula.push(new CellFeature("LimiteCongelamento", dataLC.getTime()));
    celula.push(new CellFeature("LimiteUltima_mod", dataLM.getTime()));

    
    verificaDatas(celula);

    
    //remove entradas invalidas
    for( let i = celula.length - 1; i >= 0; i--){
        if(celula[i].valor == "" || celula[i].valor == null){
            celula.splice(i, 1);
        }
    }

    return celula;

}


function celulaLinhagem(){

    let dataC = getData("C2");
    let dataLC = getData("LC2");
    let dataM = getData("M2");
    let dataLM = getData("LM2");

    let celula = [];


    celula.push(new CellFeature("Celula", "Linhagem"));
    celula.push(new CellFeature("Denominacao", document.getElementById("denominacao").value));
    celula.push(new CellFeature("TipoDeAnimal", document.getElementById("opcaoOrigem").value));
    celula.push(new CellFeature("TecidoDeOrigem", document.getElementById("origem").value));
    celula.push(new CellFeature("ObtidaDe", document.getElementById("obtidaDe").value));
    celula.push(new CellFeature("Cultura", document.getElementById("opcaoTipoCulturaLinhagem").value));
    celula.push(new CellFeature("ultima_mod_por", document.getElementById("mod_por2").value));
    celula.push(new CellFeature("Congelamento", dataC.getTime()));
    celula.push(new CellFeature("ultima_mod", dataM.getTime()));
    celula.push(new CellFeature("LimiteCongelamento", dataLC.getTime()));
    celula.push(new CellFeature("LimiteUltima_mod", dataLM.getTime()));


    if(document.getElementById("opcaoOrigem").value == "Outro")
        celula[2].valor = document.getElementById("NomeOutroTipoAnimalLinhagem").value;
    

    verificaDatas(celula);


    //remove entradas invalidas
    for( let i = celula.length - 1; i >= 0; i--){
        if(celula[i].valor == "" || celula[i].valor == null){
            celula.splice(i, 1);
        }
    }
        

    return celula;

}



function celulaPrimaria(){

    let dataC = getData("C3");
    let dataLC = getData("LC3");
    let dataM = getData("M3");
    let dataLM = getData("LM3");


    let celula = [];


    celula.push(new CellFeature("Celula", "Primaria"));
    celula.push(new CellFeature("Denominacao", document.getElementById("denominacaoP").value));
    celula.push(new CellFeature("TipoDeCelula", document.getElementById("opcaoTipo").value));
    celula.push(new CellFeature("TipoDeAnimal", document.getElementById("opcaoTipoAnimal").value));
    celula.push(new CellFeature("Cultura", document.getElementById("opcaoTipoCultura").value));
    celula.push(new CellFeature("Passagem", document.getElementById("passagemPrimaria").value));
    celula.push(new CellFeature("ultima_mod_por", document.getElementById("mod_por3").value));
    celula.push(new CellFeature("Congelamento", dataC.getTime()));
    celula.push(new CellFeature("ultima_mod", dataM.getTime()));
    celula.push(new CellFeature("LimiteCongelamento", dataLC.getTime()));
    celula.push(new CellFeature("LimiteUltima_mod", dataLM.getTime()));

    
    
    if(document.getElementById("opcaoTipoAnimal").value == "Outro")
    celula[3].valor = document.getElementById("NomeOutroTipoAnimalPrimaria").value;
    
    
    if(document.getElementById("opcaoTipo").value == "Outro")
    celula[2].valor = document.getElementById("NomeOutroTipoCelula").value
    
    
    verificaDatas(celula);


    //remove entradas invalidas
    for( let i = celula.length - 1; i >= 0; i--){
        if(celula[i].valor == "" || celula[i].valor == null){
            celula.splice(i, 1);
        }
    }


    return celula;

}



function celulaTecido(){

    let dataC = getData("C4");
    let dataLC = getData("LC4");
    let dataM = getData("M4");
    let dataLM = getData("LM4");


    let celula = [];


    celula.push(new CellFeature("Celula", "Tecido"));
    celula.push(new CellFeature("TipoDeAnimal", document.getElementById("opcaoTecido").value));
    celula.push(new CellFeature("Doador", null));
    celula.push(new CellFeature("RGHC", null));
    celula.push(new CellFeature("Nascimento", null));
    celula.push(new CellFeature("Sigla", null));
    celula.push(new CellFeature("ultima_mod_por", document.getElementById("mod_por4").value));
    celula.push(new CellFeature("Congelamento", dataC.getTime()));
    celula.push(new CellFeature("ultima_mod", dataM.getTime()));
    celula.push(new CellFeature("LimiteCongelamento", dataLC.getTime()));
    celula.push(new CellFeature("LimiteUltima_mod", dataLM.getTime()));


    verificaDatas(celula);


    if(document.getElementById("opcaoTecido").value == "Humano"){

        //pega dia mes e ano
        var dia = parseInt(document.getElementById("diaN").value);
        var mes = parseInt(document.getElementById("mesN").value);
        var ano = parseInt(document.getElementById("anoN").value);

        //cria timestamp
        var dataN = new Date( ano, mes - 1, dia);


        // procura os campos para alterar e deletar

        for(let i = celula.length - 1; i >= 0; i--){
            
            if(celula[i].chave == "Doador")
                celula[i].valor = document.getElementById("doador").value;
            if(celula[i].chave == "RGHC")
                celula[i].valor = document.getElementById("rghc").value;
            if(celula[i].chave == "Nascimento"){
                if(!isNaN(dataN.getTime()))
                    celula[i].valor = dataN.getTime();
                else
                    celula.splice(i, 1);
            }

            if(celula[i].chave == "Sigla")
                celula.splice(i, 1);
        }

    }
    else if (document.getElementById("opcaoTecido").value == "Outro"){

        for(let i = celula.length - 1; i >= 0; i--){

            if(celula[i].chave == "TipoDeAnimal")
                celula[i].valor = document.getElementById("outroTipo").value;
            if(celula[i].chave == "Sigla")
                celula[i].valor = document.getElementById("siglaAnimal").value;


            if(celula[i].chave == "Doador")
                celula.splice(i, 1);
            if(celula[i].chave == "RGHC")
                celula.splice(i, 1);
            if(celula[i].chave == "Nascimento")
                celula.splice(i, 1);

        }
    }
    else{

        for(let i = celula.length - 1; i >= 0; i--){

            if(celula[i].chave == "Sigla")
                celula[i].valor = document.getElementById("siglaAnimal").value;


            if(celula[i].chave == "Doador")
                celula.splice(i, 1);
            if(celula[i].chave == "RGHC")
                celula.splice(i, 1);
            if(celula[i].chave == "Nascimento"){
                celula.splice(i, 1);
            }
            
        }

    }


    //remove entradas invalidas
    for( let i = celula.length - 1; i >= 0; i--){
        if(celula[i].valor == "" || celula[i].valor == null){
            celula.splice(i, 1);
        }
    }
    

    return celula;

}

// recebe o id do elemento sem o "dia", "mes" ou "ano"
function getData(id){

    //pega dia mes e ano
    let dia = parseInt(document.getElementById("dia" + id).value);
    let mes = parseInt(document.getElementById("mes" + id).value);
    let ano = parseInt(document.getElementById("ano" + id).value);

    //cria timestamp
    if(id.includes("L"))
        return new Date( ano, mes - 1, dia, 23, 59, 59);
    else
        return new Date( ano, mes - 1, dia, 0, 0, 0);

}

// @param: timestamp
function getFimDoDia(timestamp){

    let data = new Date(timestamp);

    if(isNaN(data))
        return NaN;

    //dia seguinte importante para limitar a busca
    let dia = data.getDate();
    let mes = data.getMonth();
    let ano = data.getFullYear();

    let diaSeguinte = (new Date(ano, mes, dia, 23, 59, 59)).getTime();

    return diaSeguinte;
}


function verificaDatas(celula){

    let num;
    let c;

    if(celula[0].valor == "AcMm"){
        num = 1;
        c = 7;
    }
    else if(celula[0].valor == "Linhagem"){
        num = 2;
        c = 7;
    }
    else if(celula[0].valor == "Primaria"){
        num = 3;
        c = 7;
    }
    else if(celula[0].valor == "Tecido"){
        num = 4;
        c = 7;
    }


    //deleta data de congelamento se for invalida
    if( isNaN(celula[c].valor)){
        celula.splice(c+2, 1); // LimiteCongelamento
        celula.splice(c, 1); // Congelamento

        if(document.getElementById("diaC" + num).value.length > 0 || document.getElementById("mesC" + num).value.length > 0 || document.getElementById("anoC" + num).value.length > 0)
            return null;
    }
    else{
        if(isNaN(celula[c+2].valor)){
            if(document.getElementById("diaLC" + num).value.length > 0 || document.getElementById("mesLC" + num).value.length > 0 || document.getElementById("anoLC" + num).value.length > 0)
                return null;

            celula[c+2].valor = getFimDoDia(celula[c].valor);
        }
    }
    
    
    for( let i = celula.length - 1; i >= 0; i--){
        
        if(celula[i].chave == "ultima_mod" ){

            //deleta data de modificacao se for invalida
            if(isNaN(celula[i].valor)){

                celula.splice(i, 1);

                for( let j = celula.length - 1; j >= 0; j--){
                    if(celula[j].chave == "LimiteUltima_mod" ){
                        celula.splice(j, 1);
                        break;
                    }
                }
                
                if(document.getElementById("diaM" + num).value.length > 0 || document.getElementById("mesM" + num).value.length > 0 || document.getElementById("anoM" + num).value.length > 0)
                    return null;
            }
            else{

                for( let j = celula.length - 1; j >= 0; j--){
                    if(celula[j].chave == "LimiteUltima_mod" ){
                        if(isNaN(celula[j].valor)){
                            if(document.getElementById("diaLM" + num).value.length > 0 || document.getElementById("mesLM" + num).value.length > 0 || document.getElementById("anoLM" + num).value.length > 0)
                                return null;

                            celula[j].valor = getFimDoDia(celula[i].valor);
                        }

                        break;
                    }
                }
                
            }

            break;
        }

    }

}


function limparTable(table, headers){

    while ( table.rows.length > 1 )
    {
     table.deleteRow(1);
    }

    for(let i = 0; i < headers.length; i++){
        headers[i].remove();
    }

}


function enter(e){
    if (e.keyCode == 13)
        pesquisar();
}


function validaData(e){

    if (e.keyCode == 13)
        pesquisar();


    if(isNaN(e.key)){
        e.preventDefault();
    }


    //usando placeholder pra ser generico
    if (e.target.placeholder == "Dia" && parseInt(e.target.value + e.key) > 31){

        if(getSelectedTextLength() > 0){

            let textWithoutSelected = privateSplit(e.target.value, getSelectedText());

            if(e.target.value.split("")[0] == textWithoutSelected){
                if(parseInt(textWithoutSelected + e.key) > 31)
                    e.preventDefault();
            }
            else{
                if(parseInt(e.key + textWithoutSelected) > 31)
                    e.preventDefault();
            }

        }
        else
            e.preventDefault();
    }
    else if(e.target.placeholder == "Mes" && parseInt(e.target.value + e.key) > 12){
        
        if(getSelectedTextLength() > 0){

            let textWithoutSelected = privateSplit(e.target.value, getSelectedText());

            if(e.target.value.split("")[0] == textWithoutSelected){
                if(parseInt(textWithoutSelected + e.key) > 12)
                    e.preventDefault();
            }
            else{
                if(parseInt(e.key + textWithoutSelected) > 12)
                    e.preventDefault();
            }

        }
        else
            e.preventDefault();
    }
    else if (e.target.placeholder == "Ano" && e.target.value.length > 3){
        if(getSelectedTextLength() < 1)
            e.preventDefault();
    }
    
}


function validaPassagemProtocolo(e){
    
    if (e.keyCode == 13)
        pesquisar();


    if(isNaN(e.key)){
        e.preventDefault();
    }


    if(e.target.value.length == 0 && e.key == "0")
        e.preventDefault();


    if (e.target.value.length > 1 && getSelectedTextLength() < 1){
        e.preventDefault();
    }

}


function hibrido(e){

    if (e.keyCode == 13)
        pesquisar();

    
    if(isNaN(e.key)){
        e.preventDefault();
    }


    if(e.target.value.length == 0 && e.key == "0")
        e.preventDefault();


    if (e.target.value.length > 2 && getSelectedTextLength() < 1){
        e.preventDefault();
    }

}


// o split padrão não funciona direito, remove varias vezes o mesmo elemento  ( "22".split("2", 1) )
function privateSplit(string, delimiter){

    let arr = string.split("");
    let count = 0;

    for( let i = arr.length - 1; i >= 0; i--){
        for( let j = delimiter.length - 1; j >= 0; j--){
            if(arr[i] == delimiter[j]){
                arr.splice(i, 1);
                count++;
                break;
            }
        }

        if(count == delimiter.length)
            break;
    
    }

    return arr.toString();

}


function getSelectedTextLength() {

    var textLength = 0;

    // window.getSelection
    if (window.getSelection) {
        textLength = window.getSelection().toString().length;
    }
    // document.getSelection
    else if (document.getSelection) {
        textLength = document.getSelection().toString().length;
    }
    // document.selection
    else if (document.selection) {
        textLength = document.selection.createRange().text.length;
    }
    // browser desconhecido
    else
        return;

    return textLength;
}


function getSelectedText() {

    var textLength = "";

    // window.getSelection
    if (window.getSelection) {
        textLength = window.getSelection().toString();
    }
    // document.getSelection
    else if (document.getSelection) {
        textLength = document.getSelection().toString();
    }
    // document.selection
    else if (document.selection) {
        textLength = document.selection.createRange().text;
    }
    // browser desconhecido
    else
        return;

    return textLength;

}


// nao to usando
function testeMap(){

    let celula = new Map();

    celula.set("Celula", "AcMm")
        .set("Protocolo", 1)
        .set("Nprotocolo", 2);


    console.log(getMapKeyElement(celula, 1));


    // abordagem usando map para a celula AcMm

    /*
    let celula = new Map();

    celula.set("Celula", "AcMm")
        .set("Protocolo", document.getElementById("protocolo").value)
        .set("Nprotocolo", document.getElementById("Nprotocolo").value)
        .set("Nhibrido", document.getElementById("Nhibrido").value)
        .set("Clonagem", document.getElementById("clonagem").value)
        .set("Especificidade", document.getElementById("especificidade").value)
        .set("ultima_mod_por", document.getElementById("mod_por1").value)
        .set("Congelamento", dataC.getTime())
        .set("ultima_mod", dataM.getTime())
        .set("LimiteCongelamento", dataLC.getTime())
        .set("LimiteUltima_mod", dataLM.getTime());
    


    //deleta data de congelamento se for invalida
    if( isNaN(celula.get("Congelamento"))){
        celula.delete("Congelamento");
        celula.delete("LimiteCongelamento");

        if(document.getElementById("diaC1").value.length > 0 || document.getElementById("mesC1").value.length > 0 || document.getElementById("anoC1").value.length > 0)
            return null;
    }
    else{
        if(isNaN(celula.get("LimiteCongelamento"))){
            if(document.getElementById("diaLC1").value.length > 0 || document.getElementById("mesLC1").value.length > 0 || document.getElementById("anoLC1").value.length > 0)
                return null;

            celula.set("LimiteCongelamento", getDiaSeguinte(dataC));
        }
    }
    

    //deleta data de modificacao se for invalida
    if( isNaN(celula.get("ultima_mod"))){
        celula.delete("ultima_mod");
        celula.delete("LimiteUltima_mod");
        
        if(document.getElementById("diaM1").value.length > 0 || document.getElementById("mesM1").value.length > 0 || document.getElementById("anoM1").value.length > 0)
            return null;
    }
    else{
        if(isNaN(celula.get("LimiteUltima_mod"))){
            if(document.getElementById("diaLM1").value.length > 0 || document.getElementById("mesLM1").value.length > 0 || document.getElementById("anoLM1").value.length > 0)
                return null;

            celula.set("LimiteUltima_mod", getDiaSeguinte(dataM));
        }
    }

    //remove entradas invalidas
    celula.forEach( (value, key) => {
        if(value == "" || value == null){
            celula.delete(key)
        }
    });


    */

}


function getMapKeyElement(mapObject, n){
    return Array.from(mapObject.keys())[n];
}

function getMapValueElement(mapObject, n){
    return Array.from(mapObject.values())[n];
}