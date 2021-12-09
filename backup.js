function backup(){


    document.getElementById("avisoBackup").className = "avisoBackup";


    //mais facil pegar o banco inteiro e salvar, porem consome alguns kbytes a mais (vem com funcoes do firebase junto)
    firebase.database().ref().once("value", snap => {

        
        var storageRef = firebase.storage().ref();

        var file = new Blob([JSON.stringify(snap)], {type: 'application/json'});
        
        var hoje = new Date(Date.now());
        var dia = hoje.getDate();
        var mes = hoje.getMonth() + 1;
        var ano = hoje.getFullYear();

        
        storageRef.child("Backup_" + mes + "-" + ano).put(file).then(function(snapshot) {
            
            //atualizar data do backup
            firebase.database().ref("UltimoBackup/Timestamp").set(firebase.database.ServerValue.TIMESTAMP);
            
            
            // pega a data de 6 meses atrás
            let deletar6Meses = new Date(ano, mes - 7, dia);
            let deletarMes = deletar6Meses.getMonth() + 1;
            let deletarAno = deletar6Meses.getFullYear();
            
            
            // procedimento para deletar todos os backups de 6 meses atrás
            if(usuario.includes("Elenice")){
                storageRef.listAll().then( res => {
                    res.items.forEach(each => {

                        let i = 7;
                        let mesString = "";
                        let anoString = "";
                        let mesNumero;
                        let anoNumero;

                        while(each.name[i] != "-"){
                            mesString += each.name[i++];
                        }

                        i++;

                        while(each.name[i] != null){
                            anoString += each.name[i++];
                        }

                        mesNumero = parseInt(mesString);
                        anoNumero = parseInt(anoString);


                        if(mesNumero <= deletarMes || anoNumero < deletarAno){

                            // só uma conta especifica vai poder deletar (definida nas regras do storage)
                            storageRef.child("Backup_" + mesNumero + "-" + anoNumero).delete().then(function() {
                                
                            }).catch(function(error) {
                                //o resto vai dar erro
                                console.log("Por segurança, apenas uma conta pode deletar.");
                            });

                        }

                    });
                });
            

            }
            
            //mostrar pro usuario que terminou a tarefa
            document.getElementById("backupText").innerHTML = "Backup realizado!";
            
            setTimeout( () => { 
                document.getElementById("avisoBackup").className = "validacaoEscondida";
            }, 1000);
            
        });
        

    });

}


// nao to usando, mais facil pegar tudo e salvar direto
async function salvaBanco(Banco, backupObject){

    //busca no firebase
    firebase.database().ref(Banco).once("value", snap => {

        //entra no container
        snap.forEach( function(container) {

            backupObject[Banco][container.key] = {};

            //entra no rack
            container.forEach(function (rack){

                backupObject[Banco][container.key][rack.key] = {};

                //entra na gaveta
                rack.forEach(function (gaveta){

                    backupObject[Banco][container.key][rack.key][gaveta.key] = {};
                    
                    //verifica cada posicao da gaveta
                    gaveta.forEach(function (posicao){

                        backupObject[Banco][container.key][rack.key][gaveta.key][posicao.key] = {};

                        posicao.forEach( chave => {

                            backupObject[Banco][container.key][rack.key][gaveta.key][posicao.key][chave.key] = chave.val();
                        });

                    });

                });
            });
        });

    });
    
    return await backupObject;

}