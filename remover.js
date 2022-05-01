function remover(){

    var container = document.getElementById('container').value;
    var rack = document.getElementById('rack').value;
    var gaveta = document.getElementById('gaveta').value;
    var linha = document.getElementById('linha').value;
    var coluna = document.getElementById('coluna').value;


    if(linha.length > 0 && coluna.length > 0 && linha <= 100 && coluna <= 100 && !isNaN(container) && !isNaN(rack) && !isNaN(gaveta)){

        let BancoRef = firebase.database().ref("Banco/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + coluna);
        let DeletadosRef = firebase.database().ref("Deletados/" + container + "/" + rack + "/" + gaveta + "/" + linha + "-" + coluna);

        BancoRef.once("value", snap => {
                    
            if(snap.child("Celula").val() == null){
                
                document.getElementById("existeElemento").className = "validacao";

                document.getElementById("existeElemento").addEventListener("animationend", () => {
                    document.getElementById("existeElemento").className = "validacaoEscondida";
                    document.getElementById("existeElemento").removeEventListener("animationend", arguments.callee);
                });
            
            }
            else{

                let celula = {};

                //cria uma copia da celula como backup
                snap.forEach(childSnapshot => {
                    celula[childSnapshot.key] = childSnapshot.val();
                });

                //salva o autor da modificação
                celula.ultima_mod = firebase.database.ServerValue.TIMESTAMP;
                celula.ultima_mod_por = usuario;
                
                //salva a copia
                DeletadosRef.set(celula);
                
                //deleta do banco
                BancoRef.remove();


                //mostra confirmação da remoção
                document.getElementById("confirmado").className = "validacao";

                document.getElementById("confirmado").addEventListener("animationend", () => {
                    document.getElementById("confirmado").className = "validacaoEscondida";
                    document.getElementById("confirmado").removeEventListener("animationend", arguments.callee);
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


function posicao(e){

    if (e.keyCode == 13)
        remover();

    
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