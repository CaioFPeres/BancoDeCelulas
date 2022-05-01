
let gCelula;
let search;

function pesquisar(){

    let table = document.getElementById("table");

    limparTable(table);
    
    search = {
        container: document.getElementById("container").value,
        rack: document.getElementById("rack").value,
        gaveta: document.getElementById("gaveta").value,
        linha: document.getElementById("linha").value,
        coluna: document.getElementById("coluna").value
    }

    for (let p in search){
        if(isNaN(search[p])){
            //erro
            ErrorMessage("Preencha todos os campos!");
            return;
        }
    }

    // mostra o loading gif
    document.getElementById("loading").className = "validacaoLoading";

    busca(table, search);

}

function modificar(){

    let celula;

    if(gCelula == null){
        ErrorMessage("Pesquise a celula a ser modificada primeiro!");
        return;
    }
    
    if(gCelula.child("Celula").val().toLowerCase() == "acmm"){
        celula = celulaAcMm();
    }
    else if(gCelula.child("Celula").val().toLowerCase() == "linhagem"){
        celula = celulaLinhagem();
    }
    else if(gCelula.child("Celula").val().toLowerCase() == "primaria"){
        celula = celulaPrimaria();
    }
    else if(gCelula.child("Celula").val().toLowerCase() == "tecido"){
        celula = celulaTecido();
    }


    if(celula == null){
        ErrorMessage("Insira a modificação!");
        return;
    }

    // abordagem tem que ser: o que tiver faltando na celula local, recebe da celula global
    // mas se for tecido, indo de humano para outro animal, precisa deletar data de nascimento, rghc, etc

    gCelula.forEach( item => {
        if(!celula[item.key]){
            celula[item.key] = item.val();
        }
    });
    
    if(gCelula.child("Celula").val() == "Tecido"){
        if(gCelula.child("TipoDeAnimal").val() == "Humano"){
            if(celula["TipoDeAnimal"] != "Humano"){
                delete celula["Doador"];
                delete celula["RGHC"];
                delete celula["Nascimento"];
            }
        }
    }

    
    inserir(celula);

}


function inserir(celula){

    // mostra o loading gif
    document.getElementById("loading").className = "validacaoLoading";

    
    firebase.database().ref("Banco/" + search.container + "/" + search.rack + "/" + search.gaveta + "/" + search.linha + "-" + search.coluna).set(celula).then( () => {
        
        // remove o loading gif
        document.getElementById("loading").className = "validacaoEscondida";
        
        // mostra que foi inserido
        document.getElementById("confirmado").className = "validacao";
    });
    

    // remove a confirmação depois de alguns segundos
    document.getElementById("confirmado").addEventListener("animationend", () => {
        document.getElementById("confirmado").className = "validacaoEscondida";
        document.getElementById("confirmado").removeEventListener("animationend", arguments.callee);
    });

}

function busca(table, search){

    let exist = false;

    //busca no firebase
    firebase.database().ref("Banco/" + search.container + "/" + search.rack + "/" + search.gaveta + "/" + search.linha + "-" + search.coluna).once("value", celula => {
        
        if(celula.child("Celula").val() != null ){

            exist = true;
            adicionarTable(table, celula, search.gaveta, search.rack, search.container);

            opcoesPrincipais(celula.child("Celula").val());
            gCelula = celula;
        }
        else{

            exist = false;

            // remove loading gif
            document.getElementById("loading").className = "validacaoEscondida";

            ErrorMessage("Celula não encontrada!");
        
        }

    }).then( () => {
        setTimeout(function(){
            // remove o loading gif
            if(exist)
                document.getElementById("loading").className = "validacaoEscondida";
        }, 300);
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

}


// só a posicao q é o objeto do firebase, gaveta, rack e container sao strings
function adicionarTable(table, celula, gaveta, rack, container){

    let headersString = [];

    // headers como estão no banco
    if(celula.child("Celula").val() == "AcMm"){
        adicionaHeaders(1);
        headersString = ["Celula", "Protocolo", "Nprotocolo", "Nhibrido", "Clonagem", "Especificidade", "Obs", "ultima_mod_por", "Congelamento", "ultima_mod"];
    }
    else if(celula.child("Celula").val() == "Linhagem"){
        adicionaHeaders(2);
        headersString = ["Celula", "Denominacao", "TipoDeAnimal", "TecidoDeOrigem", "ObtidaDe", "Cultura", "Obs", "ultima_mod_por", "Congelamento", "ultima_mod"];
    }
    else if(celula.child("Celula").val() == "Primaria"){
        adicionaHeaders(3);
        headersString = ["Celula", "Denominacao", "TipoDeCelula", "TipoDeAnimal", "Cultura", "Passagem", "Obs", "ultima_mod_por", "Congelamento", "ultima_mod"];
    }
    else if(celula.child("Celula").val() == "Tecido"){
        adicionaHeaders(4);
        headersString = ["Celula", "TipoDeAnimal", "Sigla", "Obs", "ultima_mod_por", "Doador", "RGHC", "Nascimento", "Congelamento", "ultima_mod"];
    }

    let nas = 0;
    let newRow = table.insertRow();
    let cell;

    //pega ultima modificacao
    var dataM = new Date(celula.child("ultima_mod").val());
    var diaM = dataM.getDate();
    var mesM = dataM.getMonth() + 1;
    var anoM = dataM.getFullYear();

    var stringDataM = diaM + "/" + mesM + "/" + anoM;

    //data de congelamento
    var dataC = new Date(celula.child("Congelamento").val());
    var diaC = dataC.getDate();
    var mesC = dataC.getMonth() + 1;
    var anoC = dataC.getFullYear();

    var stringDataC = diaC + "/" + mesC + "/" + anoC;

    var stringDataN;

    if(celula.child("Nascimento").val() != null){

        nas = 1;
            
        //pega data do nascimento
        var dataN = new Date(celula.child("Nascimento").val());
        var diaN = dataN.getDate();
        var mesN = dataN.getMonth() + 1;
        var anoN = dataN.getFullYear();

        stringDataN = diaN + "/" + mesN + "/" + anoN;
    
    }


    var linha = celula.key.split("-")[0];
    var coluna = celula.key.split("-")[1];

    var stringPosicao = "C: " + container + "\nR: " + rack + "\nG: " + gaveta + "\nL: " + linha + "\nC: " + coluna;


    for(let i = 0; i < headersString.length - 2 - nas; i++){
        
        cell = newRow.insertCell(i);

        cell.innerHTML = celula.child(headersString[i]).val();

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


function ErrorMessage(message){

    document.getElementById("validacao").className = "validacao";
            
    document.getElementById("validacaoErro").innerHTML = message;

    document.getElementById("validacao").addEventListener("animationend", () => {
        document.getElementById("validacao").className = "validacaoEscondida";
        document.getElementById("validacao").removeEventListener("animationend", arguments.callee);
    });
}


function opcoesPrincipais(tipoDeCelula){

    document.getElementById("acmm").className = "opcaoEscondida";
    document.getElementById("linhagem").className = "opcaoEscondida";
    document.getElementById("primaria").className = "opcaoEscondida";
    document.getElementById("tecido").className = "opcaoEscondida";

    document.getElementById(tipoDeCelula.toLowerCase()).className = "opcaoSelecionada";
    
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

    let dataC = getData("1");

    let celula = {
        Celula: "AcMm",
        Protocolo: document.getElementById("protocolo").value,
        Nprotocolo: parseInt(document.getElementById("Nprotocolo").value).toString(), // parseInt garante que não terá zeros a esquerda
        Nhibrido: parseInt(document.getElementById("Nhibrido").value).toString(),
        Clonagem: document.getElementById("clonagem").value,
        Especificidade: document.getElementById("especificidade").value,
        Congelamento: dataC ? dataC.getTime() : NaN,
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }

    
    if(isNaN(celula["Congelamento"])){
        delete celula["Congelamento"];
    }

    if(celula.Nprotocolo == "0"){
        ErrorMessage("Numero do protocolo não pode ser 0!")
        return null;
    }

    if(celula.Nhibrido == "0"){
        ErrorMessage("Numero do hibrido não pode ser 0!");
        return null;
    }
    
    //remove entradas invalidas
    for ( item in celula ){
        if(celula[item] == "" || celula[item] == null || celula[item] == "NaN"){
            delete celula[item];
        }
    }

    if(Object.keys(celula).length == 3)
        return null;
    else
        return celula;

}


function celulaLinhagem(){

    let dataC = getData("2");

    let celula = {
        Celula: "Linhagem",
        Denominacao: document.getElementById("denominacao").value,
        TipoDeAnimal: document.getElementById("opcaoOrigem").value,
        TecidoDeOrigem: document.getElementById("origem").value,
        ObtidaDe: document.getElementById("obtidaDe").value,
        Cultura: document.getElementById("opcaoTipoCulturaLinhagem").value,
        Congelamento: dataC ? dataC.getTime() : NaN,
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }


    if(document.getElementById("opcaoOrigem").value == "Outro"){

        celula.TipoDeAnimal = document.getElementById("NomeOutroTipoAnimalLinhagem").value;

        if(celula.TipoDeAnimal == "")
            return null;
    }
    

    if(isNaN(celula["Congelamento"])){
        delete celula["Congelamento"];
    }


    //remove entradas invalidas
    for ( item in celula ){
        if(celula[item] == "" || celula[item] == null || celula[item] == "NaN"){
            delete celula[item];
        }
    }

    if(Object.keys(celula).length == 3)
        return null;
    else
        return celula;

}



function celulaPrimaria(){

    let dataC = getData("3");

    var celula = {
        Celula: "Primaria",
        Denominacao: document.getElementById("denominacaoP").value,
        TipoDeCelula: document.getElementById("opcaoTipo").value,
        TipoDeAnimal: document.getElementById("opcaoTipoAnimal").value,
        Cultura: document.getElementById("opcaoTipoCultura").value,
        Passagem: parseInt(document.getElementById("passagemPrimaria").value).toString(),
        Congelamento: dataC ? dataC.getTime() : NaN,
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }


    if(celula.Passagem == "0")
        return null;

    
    if(document.getElementById("opcaoTipoAnimal").value == "Outro"){

        celula.TipoDeAnimal = document.getElementById("NomeOutroTipoAnimalPrimaria").value;

        if(celula.TipoDeAnimal == "")
            return null;

    }
    
    
    if(document.getElementById("opcaoTipo").value == "Outro"){

        celula.TipoDeCelula = document.getElementById("NomeOutroTipoCelula").value

        if(celula.TipoDeCelula == "")
            return null;
    }
    
    
    if(isNaN(celula["Congelamento"])){
        delete celula["Congelamento"];
    }


    //remove entradas invalidas
    for ( item in celula ){
        if(celula[item] == "" || celula[item] == null || celula[item] == "NaN"){
            delete celula[item];
        }
    }

    if(Object.keys(celula).length == 3)
        return null;
    else
        return celula;

}



function celulaTecido(){

    let dataC = getData("4");
    
    let celula = {
        Celula: "Tecido",
        TipoDeAnimal: document.getElementById("opcaoTecido").value,
        Doador: null,
        RGHC: null,
        Nascimento: null,
        Sigla: null,
        Congelamento: dataC ? dataC.getTime() : NaN,
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }


    if(isNaN(celula["Congelamento"])){
        delete celula["Congelamento"];
    }


    if(document.getElementById("opcaoTecido").value == "Humano"){

        let dataN = getData("N");

        celula.Doador = document.getElementById("doador").value;
        celula.RGHC = document.getElementById("rghc").value;
        celula.Nascimento = dataN ? dataN.getTime() : NaN;

        if(gCelula.child("TipoDeAnimal").val() != "Humano"){

            if(celula.Doador == "" || celula.RGHC == "" || isNaN(celula.Nascimento)){
                return null;
            }            
        }

        if(isNaN(celula.Nascimento))
            delete celula.Nascimento;

        delete celula.Sigla;        

    }
    else if (document.getElementById("opcaoTecido").value == "Outro"){

        celula.TipoDeAnimal = document.getElementById("outroTipo").value;
        celula.Sigla = document.getElementById("siglaAnimal").value;

        if(celula.Sigla == "" || celula.TipoDeAnimal == "")
            return null;

        delete celula.Doador;
        delete celula.RGHC;
        delete celula.Nascimento;

    }
    else{

        celula.Sigla = document.getElementById("siglaAnimal").value;

        if(celula.Sigla == "")
            return null;

        delete celula.Doador;
        delete celula.RGHC;
        delete celula.Nascimento;

    }


    //remove entradas invalidas
    for ( item in celula ){
        if(celula[item] == "" || celula[item] == null || celula[item] == "NaN"){
            delete celula[item];
        }
    }

    if(Object.keys(celula).length == 3)
        return null;
    else
        return celula;

}

// recebe o id do elemento sem o "dia", "mes" ou "ano"
function getData(id){

    //pega dia mes e ano
    let dia = parseInt(document.getElementById("dia" + id).value);
    let mes = parseInt(document.getElementById("mes" + id).value);
    let ano = parseInt(document.getElementById("ano" + id).value);

    if(dia == 0 || mes == 0 || ano == 0)
        return null;

    return new Date( ano, mes - 1, dia);
}


function limparTable(table){

    while ( table.rows.length > 1 )
    {
     table.deleteRow(1);
    }

    while(table.rows[0].cells.length != 0){
        table.rows[0].cells[table.rows[0].cells.length - 1].remove();
    }

}


function validaData(e){

    if (e.keyCode == 13)
        modificar();


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

function posicao(e){

    if (e.keyCode == 13){
        if(e.srcElement.id == "coluna" || e.srcElement.id == "linha"){
            pesquisar();
        }
        else{
            modificar();
        }
    }

    
    if(isNaN(e.key)){
        e.preventDefault();
    }


    if(e.target.value.length == 0 && e.key == "0")
        e.preventDefault();


    if (parseInt(e.target.value + e.key) > 10){

        if(getSelectedTextLength() > 0){
            
            if(e.target.value.split("")[1] && getSelectedTextLength() < 2){
                e.preventDefault();
            }
            else if (e.key == "0"){
                e.preventDefault();
            }

        }
        else{
            e.preventDefault();
        }

    }
    else if (parseInt(e.target.value + e.key) == 10 && getSelectedTextLength() > 0){
        if(e.key == "0")
            e.preventDefault();
    }

}

function enter(e){

    if (e.keyCode == 13)
        modificar();

}


function validaPassagemProtocolo(e){
    
    if (e.keyCode == 13)
        modificar();


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
        modificar();

    
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


function getMapKeyElement(mapObject, n){
    return Array.from(mapObject.keys())[n];
}

function getMapValueElement(mapObject, n){
    return Array.from(mapObject.values())[n];
}