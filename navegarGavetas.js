function pesquisar(){


    // para pesquisar no firebase
    searchString = ["Celula", "Denominacao", "Protocolo", "Nprotocolo", "Nhibrido", "Especificidade", "Clonagem", "TecidoDeOrigem", "TipoDeCelula", "ObtidaDe", "TipoDeAnimal", "Cultura", "Passagem", "Sigla", "Obs", "ultima_mod_por", "Doador", "RGHC", "Nascimento", "Congelamento", "ultima_mod"];


    let table = document.getElementById("table");
    let headers = adicionaHeaders();


    //listener para fechar a janela
    document.getElementById("fechar").addEventListener("click", function() {

        document.getElementById("overlay").className = "validacaoEscondida";

        limparTable(table, headers);
        
        //restaura o scroll
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        document.getElementsByTagName("html")[0].style.overflowX = "auto";

        //remove listener
        document.getElementById("fechar").removeEventListener("click", arguments.callee);
    });


    var search = {
        container: document.getElementById("container").value,
        rack: document.getElementById("rack").value,
        gaveta: document.getElementById("gaveta").value
    }

    for (let p in search){
        if(isNaN(search[p])){
            //erro
            document.getElementById("validacao").className = "validacao";
            limparTable(table, headers);
            //listener para mensagem de erro
            document.getElementById("validacao").addEventListener("animationend", () => {
                document.getElementById("validacao").className = "validacaoEscondida";
                document.getElementById("validacao").removeEventListener("animationend", arguments.callee);
            });
            return;
        }
    }


    // mostra o loading gif
    document.getElementById("loading").className = "validacaoLoading";


    //mostra resultados
    document.getElementById("overlay").className = "validacaoTable";

    //remove o scroll da pagina de traz
    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    document.getElementsByTagName("html")[0].style.overflowX = "hidden";


    busca(table, search, searchString);

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



function busca(table, search, searchString){

    //busca no firebase
    firebase.database().ref("Banco/" + search.container + "/" + search.rack + "/" + search.gaveta).once("value", snap => {

        //pega cada posicao
        snap.forEach( function(posicao) {

            adicionarTable(table, searchString, posicao);
            
        });

    }).then( () => {
        setTimeout(function(){
            // remove o loading gif
            document.getElementById("loading").className = "validacaoEscondida";
        }, 300);
    });

}


function adicionaHeaders(){

    let tableTr = document.getElementById("tabletr");

    let headers = [];
    let headersString = [];
    
    
    // esse header string é o nome que vai direto no cabeçalho da tabela, diferente do da main function, que é o nome como está no banco
    headersString = ["Celula", "Denominação", "Protocolo", "Nprotocolo", "Nhibrido", "Espec.", "Clonagem", "Tecido De Origem", "Tipo De Celula", "Obtida de", "Tipo de Animal", "Cultura", "Passagem", "Sigla", "Obs", "Ultima Mod. Por", "Doador", "RGHC", "Nascimento", "Congelamento", "Ultima Mod.", "Local"];


    for(let i = 0; i < headersString.length; i++){
        headers[i] = document.createElement("th");
        tableTr.appendChild(headers[i]);
        headers[i].innerHTML = headersString[i];
    }

    return headers;

}



function adicionarTable(table, headersString, posicao){

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

    var stringPosicao = "L: " + linha + "\nC: " + coluna;



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