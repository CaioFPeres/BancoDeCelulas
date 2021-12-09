function login(){

    //////////////////// A persistencia do usuario se dá no firebase
    //////////////////// Ao identificar que vc está logando do mesmo navegador,
    //////////////////// O firebase retorna a sessão ao usuario.
    
    
    var email = document.getElementById('email').value;
    var password = document.getElementById('senha').value;

    var errorElement = document.getElementById("errorMessage");


    if(email.length > 0 && password.length > 0){

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
    
            return firebase.auth().signInWithEmailAndPassword(email, password).then(function() {

            }).catch(function(error){

                document.getElementById("senhaInvalida").className = "validacao";

                errorElement.innerText = error.message;

                document.getElementById("senhaInvalida").addEventListener("animationend", () => {
                    document.getElementById("senhaInvalida").className = "validacaoEscondida";
                    document.getElementById("senhaInvalida").removeEventListener("animationend", arguments.callee);
                });

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
    
    
function logout(){

    firebase.auth().signOut().then(function() {
        //fazer nada, ja tem um listener de redirecionamento
    }).catch(function(error) 
    {
        alert(error);
    });

}


function enter(e){
    if (e.keyCode == 13)
        login();
}