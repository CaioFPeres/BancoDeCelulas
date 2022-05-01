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

                        let listenerFunction = () => {
                            document.getElementById("confirmado").className = "validacaoEscondida";
                            document.getElementById("confirmado").removeEventListener("animationend", listenerFunction);
                        }

                        document.getElementById("confirmado").addEventListener("animationend", listenerFunction);

                    })
                    .catch((error) => {

                        errorElement.innerText = error.message;

                        document.getElementById("senhaInvalida").className = "validacao";

                        let listenerFunction = () => {
                            document.getElementById("senhaInvalida").className = "validacaoEscondida";
                            document.getElementById("senhaInvalida").removeEventListener("animationend", listenerFunction);
                        }

                        document.getElementById("senhaInvalida").addEventListener("animationend", listenerFunction);

                    });
                
                }
                else{

                    errorElement.innerText = "Senha para o cadastro inválida!";
                    errorElement.style.fontSize = "30px";

                    document.getElementById("senhaInvalida").className = "validacao";

                    let listenerFunction = () => {
                        document.getElementById("senhaInvalida").className = "validacaoEscondida";
                        document.getElementById("senhaInvalida").removeEventListener("animationend", listenerFunction);
                    }

                    document.getElementById("senhaInvalida").addEventListener("animationend", listenerFunction);

                }


            });

        }
        else{

            errorElement.innerText = "As senhas não coincidem!";
            errorElement.style.fontSize = "30px";

            document.getElementById("senhaInvalida").className = "validacao";

            let listenerFunction = () => {
                document.getElementById("senhaInvalida").className = "validacaoEscondida";
                document.getElementById("senhaInvalida").removeEventListener("animationend", listenerFunction);
            }

            document.getElementById("senhaInvalida").addEventListener("animationend", listenerFunction);

        }

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
        cadastrar();
}