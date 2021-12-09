function recuperar(){

    var auth = firebase.auth();
    var email = document.getElementById('email').value;
    var errorElement = document.getElementById('errorMessage');

    if(email.length > 0){

        auth.sendPasswordResetEmail(email).then(function() {
        
            document.getElementById("confirmado").className = "validacao";

            document.getElementById("confirmado").addEventListener("animationend", () => {
                document.getElementById("confirmado").className = "validacaoEscondida";
                document.getElementById("confirmado").removeEventListener("animationend", arguments.callee);
            });

        }).catch(function(error) {
        
            document.getElementById("senhaInvalida").className = "validacao";

            errorElement.innerText = error.message;

            document.getElementById("senhaInvalida").addEventListener("animationend", () => {
                document.getElementById("senhaInvalida").className = "validacaoEscondida";
                document.getElementById("senhaInvalida").removeEventListener("animationend", arguments.callee);
            });

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



function enter(e){
    if (e.keyCode == 13)
        recuperar();
}