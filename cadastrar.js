function cadastrar(){

    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    var confirmar = document.getElementById('confirmar').value;
    var senhaCadastro = document.getElementById('senhaCadastro').value;

    var errorElement = document.getElementById('errorMessage');
    var user;


    if(nome.length > 0 && email.length > 0 && senha.length > 0 && senhaCadastro.length > 0 && confirmar.length > 0){

        if(senha == confirmar){

            firebase.database().ref("SenhaCadastro").once("value", snap => {
                
                if(senhaCadastro == snap.val()){

                    firebase.auth().createUserWithEmailAndPassword(email, senha).then((userCredential) => {
                        user = userCredential.user;

                        user.updateProfile({
                            displayName: nome
                        }).then(function() {
                            window.location.href = "main";
                        }).catch(function(error) {
                            console.log(error);
                        });


                        document.getElementById("confirmado").className = "validacao";

                        document.getElementById("confirmado").addEventListener("animationend", () => {
                            document.getElementById("confirmado").className = "validacaoEscondida";
                            document.getElementById("confirmado").removeEventListener("animationend", arguments.callee);
                        });

                    })
                    .catch((error) => {

                        errorElement.innerText = error.message;

                        document.getElementById("senhaInvalida").className = "validacao";

                        document.getElementById("senhaInvalida").addEventListener("animationend", () => {
                            document.getElementById("senhaInvalida").className = "validacaoEscondida";
                            document.getElementById("senhaInvalida").removeEventListener("animationend", arguments.callee);
                        });

                    });
                
                }
                else{

                    errorElement.innerText = "Senha para o cadastro inválida!";
                    errorElement.style.fontSize = "30px";

                    document.getElementById("senhaInvalida").className = "validacao";

                    document.getElementById("senhaInvalida").addEventListener("animationend", () => {
                        document.getElementById("senhaInvalida").className = "validacaoEscondida";
                        document.getElementById("senhaInvalida").removeEventListener("animationend", arguments.callee);
                    });

                }


            });

        }
        else{

            errorElement.innerText = "As senhas não coincidem!";
            errorElement.style.fontSize = "30px";

            document.getElementById("senhaInvalida").className = "validacao";

            document.getElementById("senhaInvalida").addEventListener("animationend", () => {
                document.getElementById("senhaInvalida").className = "validacaoEscondida";
                document.getElementById("senhaInvalida").removeEventListener("animationend", arguments.callee);
            });

        }

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
        cadastrar();
}