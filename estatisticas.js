window.onload = function () {


    var canvas = document.getElementById('grafico');

    var table = document.getElementById("info");



    //dados
    var dataTemp = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
            hoverBorderColor: [],
            hoverBorderWidth: []
        }]
    };


    //cores do CSS
    var cor = [
        "AliceBlue",
        "AntiqueWhite",
        "Aqua",
        "Aquamarine",
        "Azure",
        "Beige",
        "Bisque",
        "Black",
        "BlanchedAlmond",
        "Blue",
        "BlueViolet",
        "Brown",
        "BurlyWood",
        "CadetBlue",
        "Chartreuse",
        "Chocolate",
        "Coral",
        "CornflowerBlue",
        "Cornsilk",
        "Crimson",
        "Cyan",
        "DarkBlue",
        "DarkCyan",
        "DarkGoldenRod",
        "DarkGray",
        "DarkGrey",
        "DarkGreen",
        "DarkKhaki",
        "DarkMagenta",
        "DarkOliveGreen",
        "Darkorange",
        "DarkOrchid",
        "DarkRed",
        "DarkSalmon",
        "DarkSeaGreen",
        "DarkSlateBlue",
        "DarkSlateGray",
        "DarkSlateGrey",
        "DarkTurquoise",
        "DarkViolet",
        "DeepPink",
        "DeepSkyBlue",
        "DimGray",
        "DimGrey",
        "DodgerBlue",
        "FireBrick",
        "FloralWhite",
        "ForestGreen",
        "Fuchsia",
        "Gainsboro",
        "GhostWhite",
        "Gold",
        "GoldenRod",
        "Gray",
        "Grey",
        "Green",
        "GreenYellow",
        "HoneyDew",
        "HotPink",
        "IndianRed",
        "Indigo",
        "Ivory",
        "Khaki",
        "Lavender",
        "LavenderBlush",
        "LawnGreen",
        "LemonChiffon",
        "LightBlue",
        "LightCoral",
        "LightCyan",
        "LightGoldenRodYellow",
        "LightGray",
        "LightGrey",
        "LightGreen",
        "LightPink",
        "LightSalmon",
        "LightSeaGreen",
        "LightSkyBlue",
        "LightSlateGray",
        "LightSlateGrey",
        "LightSteelBlue",
        "LightYellow",
        "Lime",
        "LimeGreen",
        "Linen",
        "Magenta",
        "Maroon",
        "MediumAquaMarine",
        "MediumBlue",
        "MediumOrchid",
        "MediumPurple",
        "MediumSeaGreen",
        "MediumSlateBlue",
        "MediumSpringGreen",
        "MediumTurquoise",
        "MediumVioletRed",
        "MidnightBlue",
        "MintCream",
        "MistyRose",
        "Moccasin",
        "NavajoWhite",
        "Navy",
        "OldLace",
        "Olive",
        "OliveDrab",
        "Orange",
        "OrangeRed",
        "Orchid",
        "PaleGoldenRod",
        "PaleGreen",
        "PaleTurquoise",
        "PaleVioletRed",
        "PapayaWhip",
        "PeachPuff",
        "Peru",
        "Pink",
        "Plum",
        "PowderBlue",
        "Purple",
        "Red",
        "RosyBrown",
        "RoyalBlue",
        "SaddleBrown",
        "Salmon",
        "SandyBrown",
        "SeaGreen",
        "SeaShell",
        "Sienna",
        "Silver",
        "SkyBlue",
        "SlateBlue",
        "SlateGray",
        "SlateGrey",
        "Snow",
        "SpringGreen",
        "SteelBlue",
        "Tan",
        "Teal",
        "Thistle",
        "Tomato",
        "Turquoise",
        "Violet",
        "Wheat",
        "White",
        "WhiteSmoke",
        "Yellow",
        "YellowGreen"
    ];


    //definicao do gráfico
    var PieChart = new Chart(canvas,{
        type: 'pie',
        data:   dataTemp,
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 16
                }
            },
            layout: {
                padding: {
                    bottom: 0
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data){

                    }
                },
                bodyFontSize: 18
            }
        }
    });


    //adiciona um espaço em baixo das legendas
    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 0;
    };


    //cria um objeto que terá as possiveis entradas
    var search = {};


    //busca no firebase
    firebase.database().ref("Banco").once("value", snap => {

        //entra no container
        snap.forEach( function(container) {
            //entra no rack
            container.forEach(function (rack){
                //entra na gaveta
                rack.forEach(function (gaveta){
                    //verifica cada posicao da gaveta
                    gaveta.forEach(function (posicao){

                        if(search[posicao.child("TipoDeAnimal").val()] == null){
                            search[posicao.child("TipoDeAnimal").val()] = 1;
                        }
                        else{
                            search[posicao.child("TipoDeAnimal").val()] = search[posicao.child("TipoDeAnimal").val()] + 1;
                        }

                    });
                });
            });
        });


        //deleta null
        if(search["null"]){
            delete search["null"];
        }

        var total = 0;

        //pega o total
        for(let i = 0; i < Object.keys(search).length; i++){
            total = total + Object.values(search)[i];
        }


        var j = 0;
        var porcentagens = [];


        for(let i = 0; i < Object.keys(search).length ; i++){

            porcentagens[i] = (((Object.values(search)[i])*100)/total).toFixed(2);
            
            //adiciona na tabela
            var newRow = table.insertRow(i+1);

            var cel0 = newRow.insertCell(0);
            var cel1 = newRow.insertCell(1);
            var cel2 = newRow.insertCell(2);

            cel0.innerHTML = Object.keys(search)[i];
            cel0.style.textAlign = "center";
            cel1.innerHTML = Object.values(search)[i];
            cel1.style.textAlign = "center";
            cel2.innerHTML = porcentagens[i] + "%";
            cel2.style.textAlign = "center";


            //adiciona no chart
            PieChart.data.datasets[0].data[i] = Object.values(search)[i];
            PieChart.data.labels[i] = Object.keys(search)[i];


            //callback da label modificada
            PieChart.options.tooltips.callbacks.label = function(tooltipItem, data) {
                var label = " " + data.labels[tooltipItem.index] || '';

                if (label) {
                    label += ': ';
                }

                label += data.datasets[0].data[tooltipItem.index];


                //adicionando a porcentagem
                label += ", " + porcentagens[tooltipItem.index] + "%";

                return label;
            }


            if(j > cor.length)
                j = 0;

            //style
            PieChart.data.datasets[0].backgroundColor[i] = cor[j];
            PieChart.data.datasets[0].hoverBackgroundColor[i] = cor[j];
            PieChart.data.datasets[0].hoverBorderColor[i] = "rgba(0, 0, 0, 0.6)";
            PieChart.data.datasets[0].hoverBorderWidth[i] = 3;
            PieChart.data.datasets[0].fontColor

            j++;

        }

        //atualiza o chart
        PieChart.update();


    });




}



// nao está implementado
function downloadCSV(){
///////////// Criar blob (um arquivo, que pode ser qualquer coisa)
//////////// Alem disso, tambem cria a URL para o blob

    urlTextFile = function (text) {
        /* If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        var urlTextFile = null;
        if (urlTextFile !== null) {
            window.URL.revokeObjectURL(urlTextFile);
        }
        */
       var blob = new Blob([text], {type: 'text/plain'});
        
        return window.URL.createObjectURL(blob);
    };


//////////// metodo de criar botão invisivel, se nao, nao funciona

    var a = document.createElement("a");

    document.body.appendChild(a);
    a.style = "display: none";
    a.download = "Reservas.csv";

    let headers = ["Celula", "Denominacao", "Protocolo", "Nprotocolo", "Nhibrido", "Especificidade", "Clonagem", "TecidoDeOrigem", "TipoDeCelula", "ObtidaDe", "TipoDeAnimal", "Cultura", "Passagem", "Sigla", "Obs", "ultima_mod_por", "Doador", "RGHC", "Nascimento", "Congelamento", "ultima_mod", "Local\n"];

    let text = [];


    firebase.database().ref().once("value", snap => {
    
        snap.forEach( function(child) {

//////////////////////////////////// Montando CSV

            text = text + "\n";

        });

//////////////// Colocando a referencia da url no link e clicando
        a.href = urlTextFile(text);
        a.click();
        window.URL.revokeObjectURL(urlTextFile(text));
        a.remove();
    });


}