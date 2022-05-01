function recuperar(){

    var auth = firebase.auth();
    var email = document.getElementById('email').value;
    var errorElement = document.getElementById('errorMessage');

    if(email.length > 0){

        auth.sendPasswordResetEmail(email).then(function() {
        
            document.getElementById("confirmado").className = "validacao";

            let listenerFunction = () => {
                document.getElementById("confirmado").className = "validacaoEscondida";
                document.getElementById("confirmado").removeEventListener("animationend", listenerFunction);
            }

            document.getElementById("confirmado").addEventListener("animationend", listenerFunction);

        }).catch(function(error) {
        
            document.getElementById("senhaInvalida").className = "validacao";

            errorElement.innerText = error.message;

            let listenerFunction = () => {
                document.getElementById("senhaInvalida").className = "validacaoEscondida";
                document.getElementById("senhaInvalida").removeEventListener("animationend", listenerFunction);
            }

            document.getElementById("senhaInvalida").addEventListener("animationend", listenerFunction);

        });

    }
    else{

        document.getElementById("validacao").className = "validacao";

        let listenerFunction = () => {
            document.getElementById("validacao").className = "validacaoEscondida";
            document.getElementById("validacao").removeEventListener("animationend", listenerFunction);
        }

        document.getElementById("validacao").addEventListener("animationend", listenerFunction);

    }

}



function enter(e){
    if (e.keyCode == 13)
        recuperar();
}