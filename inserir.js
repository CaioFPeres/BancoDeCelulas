/*
    Insercao funciona da seguinte forma: container possui racks, rack possui gavetas, e cada gaveta pode ter até 100 celulas.
    As gavetas possuem formato de matriz.
    Cada recipiente virou uma pasta para seu conteudo.
    Cada gaveta possui todas as posicoes.
    A posicao foi definida como uma pasta de nome linha-coluna.
*/


function inserir(){


    if(document.getElementById("opcaoPrincipal").value == "acmm"){
        var celula = celulaAcMm();
    }
    else if(document.getElementById("opcaoPrincipal").value == "linhagem"){
        var celula = celulaLinhagem();
    }
    else if(document.getElementById("opcaoPrincipal").value == "primaria"){
        var celula = celulaPrimaria();
    }
    else if(document.getElementById("opcaoPrincipal").value == "tecido"){
        var celula = celulaTecido();
    }



    if(celula == null){

        document.getElementById("validacao").className = "validacao";

        document.getElementById("validacao").addEventListener("animationend", () => {
            document.getElementById("validacao").className = "validacaoEscondida";
            document.getElementById("validacao").removeEventListener("animationend", arguments.callee);

        });

        return;

    }


    var container = document.getElementById('container').value;
    var rack = document.getElementById('rack').value;
    var gaveta = document.getElementById('gaveta').value;
    var linha = document.getElementById('linha').value;
    var coluna = document.getElementById('coluna').value;



    if(linha.length > 0 && coluna.length > 0 && linha <= 100 && coluna <= 100 && !isNaN(container) && !isNaN(rack) && !isNaN(gaveta)){

        firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + coluna).once("value", snap => {


            if(snap.child("Celula").val() == null){

                // mostra o loading gif
                document.getElementById("loading").className = "validacaoLoading";


                // optei por não existir substituição

                firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + coluna).set(celula).then( () => {
                    
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
            else{

                document.getElementById("existeElemento").className = "validacao";

                document.getElementById("existeElemento").addEventListener("animationend", () => {
                    document.getElementById("existeElemento").className = "validacaoEscondida";
                    document.getElementById("existeElemento").removeEventListener("animationend", arguments.callee);
                });

            }

        });
        

    }
    else{

        document.getElementById("validacao").className = "validacao";

        document.getElementById("validacao").addEventListener("animationend", () => {
            document.getElementById("validacao").className = "validacaoEscondida";
            document.getElementById("validacao").removeEventListener("animationend", arguments.callee);

        });

    }

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


function enter(e){
    if (e.keyCode == 13)
        inserir();
}


function validaData(e){

    if (e.keyCode == 13)
        inserir();


    if(isNaN(e.key))
        e.preventDefault();


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
        inserir();


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
        inserir();

    
    if(isNaN(e.key)){
        e.preventDefault();
    }


    if(e.target.value.length == 0 && e.key == "0")
        e.preventDefault();


    if (e.target.value.length > 2 && getSelectedTextLength() < 1){
        e.preventDefault();
    }

}


function posicao(e){

    if (e.keyCode == 13)
        inserir();

    
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


function celulaAcMm(){

    //pega dia mes e ano do congelamento
    let dia = parseInt(document.getElementById("dia1").value);
    let mes = parseInt(document.getElementById("mes1").value);
    let ano = parseInt(document.getElementById("ano1").value);

    if(dia == 0 || mes == 0 || ano == 0)
        return null;

    //cria timestamp
    let data = new Date( ano, mes - 1, dia);


    if(document.getElementById("protocolo").value == "" || document.getElementById("Nprotocolo").value == "" || 
    document.getElementById("Nhibrido").value == "" || document.getElementById("clonagem").value == "" ||
    document.getElementById("especificidade").value == "" || isNaN(data)){
        return null;
    }


    var celula = {
        Celula: "AcMm",
        Protocolo: document.getElementById("protocolo").value,
        Nprotocolo: parseInt(document.getElementById("Nprotocolo").value).toString(), // parseInt garante que não terá zeros a esquerda
        Nhibrido: parseInt(document.getElementById("Nhibrido").value).toString(),
        Clonagem: document.getElementById("clonagem").value,
        Especificidade: document.getElementById("especificidade").value,
        Congelamento: data.getTime(),
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }

    
    if(celula.Nprotocolo == "0" || celula.Nhibrido == "0")
        return null;

    return celula;

}


function celulaLinhagem(){

    //pega dia mes e ano do congelamento
    let dia = parseInt(document.getElementById("dia2").value);
    let mes = parseInt(document.getElementById("mes2").value);
    let ano = parseInt(document.getElementById("ano2").value);

    if(dia == 0 || mes == 0 || ano == 0)
        return null;

    //cria timestamp
    let data = new Date( ano, mes - 1, dia);


    if(document.getElementById("denominacao").value == "" || document.getElementById("opcaoOrigem").value == "" || document.getElementById("origem").value == "" || 
        document.getElementById("obtidaDe").value == "" || document.getElementById("opcaoTipoCulturaLinhagem").value == "" || isNaN(data)){
        return null;
    }


    var celula = {
        Celula: "Linhagem",
        Denominacao: document.getElementById("denominacao").value,
        TipoDeAnimal: document.getElementById("opcaoOrigem").value,
        TecidoDeOrigem: document.getElementById("origem").value,
        ObtidaDe: document.getElementById("obtidaDe").value,
        Cultura: document.getElementById("opcaoTipoCulturaLinhagem").value,
        Congelamento: data.getTime(),
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }


    if(document.getElementById("opcaoOrigem").value == "Outro"){
        if(document.getElementById("NomeOutroTipoAnimalLinhagem").value == ""){
            return null;
        }
        else{
            celula.TipoDeAnimal = document.getElementById("NomeOutroTipoAnimalLinhagem").value;
        }
    }


    return celula;

}



function celulaPrimaria(){

    //pega dia mes e ano do congelamento
    let dia = parseInt(document.getElementById("dia3").value);
    let mes = parseInt(document.getElementById("mes3").value);
    let ano = parseInt(document.getElementById("ano3").value);

    if(dia == 0 || mes == 0 || ano == 0)
        return null;

    //cria timestamp
    let data = new Date( ano, mes - 1, dia);

    if(document.getElementById("denominacaoP").value == "" || document.getElementById("opcaoTipo").value == "" || document.getElementById("opcaoTipoAnimal").value == "" ||
        document.getElementById("opcaoTipoCultura").value == "" || document.getElementById("passagemPrimaria").value == "" || isNaN(data)){
        return null;
    }

    var celula = {
        Celula: "Primaria",
        Denominacao: document.getElementById("denominacaoP").value,
        TipoDeCelula: document.getElementById("opcaoTipo").value,
        TipoDeAnimal: document.getElementById("opcaoTipoAnimal").value,
        Cultura: document.getElementById("opcaoTipoCultura").value,
        Passagem: parseInt(document.getElementById("passagemPrimaria").value).toString(),
        Congelamento: data.getTime(),
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }


    if(celula.Passagem == "0")
        return null;


    if(document.getElementById("opcaoTipoAnimal").value == "Outro"){
        if(document.getElementById("NomeOutroTipoAnimalPrimaria").value == ""){
            return null;
        }
        else{
            celula.TipoDeAnimal = document.getElementById("NomeOutroTipoAnimalPrimaria").value;
        }
    }


    if(document.getElementById("opcaoTipo").value == "Outro"){
        if(document.getElementById("NomeOutroTipoCelula").value == ""){
            return null;
        }
        else{
            celula.TipoDeCelula = document.getElementById("NomeOutroTipoCelula").value;
        }
    }


    return celula;

}



function celulaTecido(){

    //pega dia mes e ano do congelamento
    let dia = parseInt(document.getElementById("dia4").value);
    let mes = parseInt(document.getElementById("mes4").value);
    let ano = parseInt(document.getElementById("ano4").value);

    if(dia == 0 || mes == 0 || ano == 0)
        return null;

    //cria timestamp
    let data = new Date( ano, mes - 1, dia);


    if(document.getElementById("opcaoTecido").value == "" || isNaN(data)){
        return null;
    }


    var celula = {
        Celula: "Tecido",
        TipoDeAnimal: document.getElementById("opcaoTecido").value,
        Doador: null,
        RGHC: null,
        Nascimento: null,
        Sigla: null,
        Congelamento: data.getTime(),
        ultima_mod: firebase.database.ServerValue.TIMESTAMP,
        ultima_mod_por: usuario,
        Obs: document.getElementById("obs").value
    }



    if(document.getElementById("opcaoTecido").value == "Humano"){

        //pega dia mes e ano
        let dia = parseInt(document.getElementById("diaN").value);
        let mes = parseInt(document.getElementById("mesN").value);
        let ano = parseInt(document.getElementById("anoN").value);

        if(dia == 0 || mes == 0 || ano == 0)
            return null;

        //cria timestamp
        let dataN = new Date( ano, mes - 1, dia);

        if(document.getElementById("doador").value == "" || document.getElementById("rghc").value == "" || isNaN(dataN)){
            return null;
        }

        celula.Doador = document.getElementById("doador").value;
        celula.RGHC = document.getElementById("rghc").value;
        celula.Nascimento = dataN.getTime();

        delete celula.Sigla;
    }
    else if (document.getElementById("opcaoTecido").value == "Outro"){

        if(document.getElementById("siglaAnimal").value == "" || document.getElementById("outroTipo").value == ""){
            return null;
        }

        celula.TipoDeAnimal = document.getElementById("outroTipo").value;
        celula.Sigla = document.getElementById("siglaAnimal").value;

        delete celula.Doador;
        delete celula.RGHC;
        delete celula.Nascimento;
    }
    else{
        
        if(document.getElementById("siglaAnimal").value == ""){
            return null;
        }

        celula.Sigla = document.getElementById("siglaAnimal").value;

        delete celula.Doador;
        delete celula.RGHC;
        delete celula.Nascimento;
    }

    return celula;

}


// funcao para inserir dados
function inserirTeste(){


    //AcMm

    let container = 1;
    let rack = 1;
    let gaveta = 1;
    let linha = 1;
    

    let celula = {
        Celula: "AcMm",
        Protocolo: "Protocolo1",
        Nprotocolo: "1",
        Nhibrido: "1",
        Clonagem: "Clonagem1",
        Especificidade: "Especificidade1",
        Congelamento: new Date( 2010, 1 - 1, 1).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 1).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs1"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 1).set(celula);

    celula = {
        Celula: "AcMm",
        Protocolo: "Protocolo2",
        Nprotocolo: "2",
        Nhibrido: "2",
        Clonagem: "Clonagem2",
        Especificidade: "Especificidade2",
        Congelamento: new Date( 2010, 1 - 1, 2).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 2).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs2"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 2).set(celula);

    celula = {
        Celula: "AcMm",
        Protocolo: "Protocolo3",
        Nprotocolo: "3",
        Nhibrido: "3",
        Clonagem: "Clonagem3",
        Especificidade: "Especificidade3",
        Congelamento: new Date( 2010, 1 - 1, 3).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 3).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs3"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 3).set(celula);

    celula = {
        Celula: "AcMm",
        Protocolo: "Protocolo4",
        Nprotocolo: "4",
        Nhibrido: "4",
        Clonagem: "Clonagem4",
        Especificidade: "Especificidade4",
        Congelamento: new Date( 2010, 1 - 1, 4).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 4).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs4"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 4).set(celula);

    celula = {
        Celula: "AcMm",
        Protocolo: "Protocolo5",
        Nprotocolo: "5",
        Nhibrido: "5",
        Clonagem: "Clonagem5",
        Especificidade: "Especificidade5",
        Congelamento: new Date( 2010, 1 - 1, 5).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 5).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs5"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 5).set(celula);

    celula = {
        Celula: "AcMm",
        Protocolo: "Protocolo6",
        Nprotocolo: "6",
        Nhibrido: "6",
        Clonagem: "Clonagem6",
        Especificidade: "Especificidade6",
        Congelamento: new Date( 2010, 1 - 1, 6).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 6).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs6"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 6).set(celula);


    //Linhagem

    celula = {
        Celula: "Linhagem",
        Denominacao: "Denominacao1",
        TipoDeAnimal: "Boi",
        TecidoDeOrigem: "Tec1",
        ObtidaDe: "Alguem1",
        Cultura: "Aderente",
        Congelamento: new Date( 2010, 1 - 1, 7).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 7).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs7"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 7).set(celula);

    celula = {
        Celula: "Linhagem",
        Denominacao: "Denominacao2",
        TipoDeAnimal: "Caprino",
        TecidoDeOrigem: "Tec2",
        ObtidaDe: "Alguem2",
        Cultura: "Suspensão",
        Congelamento: new Date( 2010, 1 - 1, 8).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 8).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs8"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 8).set(celula);

    celula = {
        Celula: "Linhagem",
        Denominacao: "Denominacao3",
        TipoDeAnimal: "Cavalo",
        TecidoDeOrigem: "Tec3",
        ObtidaDe: "Alguem3",
        Cultura: "3D",
        Congelamento: new Date( 2010, 1 - 1, 9).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 9).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs9"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 9).set(celula);

    celula = {
        Celula: "Linhagem",
        Denominacao: "Denominacao4",
        TipoDeAnimal: "Cão",
        TecidoDeOrigem: "Tec4",
        ObtidaDe: "Alguem4",
        Cultura: "Aderente",
        Congelamento: new Date( 2010, 1 - 1, 10).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 10).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs10"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 10).set(celula);

    celula = {
        Celula: "Linhagem",
        Denominacao: "Denominacao5",
        TipoDeAnimal: "Coelho",
        TecidoDeOrigem: "Tec5",
        ObtidaDe: "Alguem5",
        Cultura: "Suspensão",
        Congelamento: new Date( 2010, 1 - 1, 11).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 11).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs11"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 11).set(celula);

    celula = {
        Celula: "Linhagem",
        Denominacao: "Denominacao6",
        TipoDeAnimal: "Humano",
        TecidoDeOrigem: "Tec6",
        ObtidaDe: "Alguem6",
        Cultura: "3D",
        Congelamento: new Date( 2010, 1 - 1, 12).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 12).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs12"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 12).set(celula);


    //Primaria

    celula = {
        Celula: "Primaria",
        Denominacao: "Denominacao7",
        TipoDeCelula: "Adipócitos",
        TipoDeAnimal: "Boi",
        Cultura: "Aderente",
        Passagem: 1,
        Congelamento: new Date( 2010, 1 - 1, 13).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 13).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs13"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 13).set(celula);

    celula = {
        Celula: "Primaria",
        Denominacao: "Denominacao8",
        TipoDeCelula: "CTM-TA",
        TipoDeAnimal: "Caprino",
        Cultura: "Suspensão",
        Passagem: 2,
        Congelamento: new Date( 2010, 1 - 1, 14).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 14).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs14"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 14).set(celula);

    celula = {
        Celula: "Primaria",
        Denominacao: "Denominacao9",
        TipoDeCelula: "CTM-CO",
        TipoDeAnimal: "Cavalo",
        Cultura: "3D",
        Passagem: 3,
        Congelamento: new Date( 2010, 1 - 1, 15).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 15).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs15"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 15).set(celula);

    celula = {
        Celula: "Primaria",
        Denominacao: "Denominacao10",
        TipoDeCelula: "CTM-Limbo",
        TipoDeAnimal: "Cão",
        Cultura: "Aderente",
        Passagem: 4,
        Congelamento: new Date( 2010, 1 - 1, 16).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 16).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs16"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 16).set(celula);

    celula = {
        Celula: "Primaria",
        Denominacao: "Denominacao11",
        TipoDeCelula: "TESTEOUTRO",
        TipoDeAnimal: "TESTEOUTRO",
        Cultura: "Suspensão",
        Passagem: 5,
        Congelamento: new Date( 2010, 1 - 1, 17).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 17).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs17"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 17).set(celula);

    celula = {
        Celula: "Primaria",
        Denominacao: "Denominacao12",
        TipoDeCelula: "Epiteliais",
        TipoDeAnimal: "Humano",
        Cultura: "3D",
        Passagem: 6,
        Congelamento: new Date( 2010, 1 - 1, 18).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 18).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs18"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 18).set(celula);



    //tecido

    celula = {
        Celula: "Tecido",
        TipoDeAnimal: "Boi",
        Sigla: "BO",
        Congelamento: new Date( 2010, 1 - 1, 19).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 19).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs19"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 19).set(celula);

    celula = {
        Celula: "Tecido",
        TipoDeAnimal: "Caprino",
        Sigla: "CAP",
        Congelamento: new Date( 2010, 1 - 1, 20).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 20).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs20"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 20).set(celula);

    celula = {
        Celula: "Tecido",
        TipoDeAnimal: "TESTEOUTRO",
        Sigla: "TO",
        Congelamento: new Date( 2010, 1 - 1, 21).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 21).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs21"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 21).set(celula);

    celula = {
        Celula: "Tecido",
        TipoDeAnimal: "Humano",
        Doador: "Caio1",
        RGHC: 123456789,
        Nascimento: new Date( 1996, 3 - 1, 30).getTime(),
        Congelamento: new Date( 2010, 1 - 1, 22).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 22).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs22"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 22).set(celula);

    celula = {
        Celula: "Tecido",
        TipoDeAnimal: "Humano",
        Doador: "Caio2",
        RGHC: 123456789,
        Nascimento: new Date( 1996, 3 - 1, 30).getTime(),
        Congelamento: new Date( 2010, 1 - 1, 23).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 23).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs23"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 23).set(celula);

    celula = {
        Celula: "Tecido",
        TipoDeAnimal: "Humano",
        Doador: "Caio3",
        RGHC: 123456789,
        Nascimento: new Date( 1996, 3 - 1, 30).getTime(),
        Congelamento: new Date( 2010, 1 - 1, 24).getTime(),
        ultima_mod: new Date( 2020, 1 - 1, 24).getTime(),
        ultima_mod_por: usuario,
        Obs: "Obs24"
    }

    firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + 24).set(celula);

}