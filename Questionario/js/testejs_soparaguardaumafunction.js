/**
 * Funcao para testar a guardar as respostas
 */
function testHandleForm(){
    let d= Date();
    let xmlString="<Questionario>";
    let Rq1 = document.forms["t03"]["age"].value;
    xmlString+='<q id="q1">'+ Rq1 +'</q>';
    let Rq2 = document.forms["t03"]["gender"].value;
    xmlString+='<q id="q2">'+ Rq2 +'</q>';
    let Rq3 = document.forms["t03"]["internet_usage"].value;
    xmlString+='<q id="q3">'+ Rq3 +'</q>';
    let Rq4 = document.forms["t03"]["teste"].value;
    xmlString+='<q id="q4">'+ Rq4 +'</q>';
    let Rq5 = document.forms["t03"]["other_search_engine"].value;
    xmlString+='<q id="q5">'+ Rq5 +'</q>';
    let Rq6 = document.forms["t03"]["Nome"].value;
    xmlString+='<q id="q6">'+ Rq6 +'</q>';
    let Rq7 = document.forms["t03"]["task_01"].value;
    xmlString+='<q id="q7">'+ Rq7 +'</q>';
    let Rq8 = document.forms["t03"]["task_02_8"].value;
    xmlString+='<q id="q8">'+ Rq8 +'</q>';
    let Rq9 = document.forms["t03"]["task_02_9"].value;
    xmlString+='<q id="q9">'+ Rq9 +'</q>';
    let Rq10 = document.forms["t03"]["task_02_10"].value;
    xmlString+='<q id="q10">'+ Rq10 +'</q>';
    let Rq11 = document.forms["t03"]["task_02_11"].value;
    xmlString+='<q id="q11">'+ Rq11 +'</q>';
    let Rq12 = document.forms["t03"]["task_02_12"].value;
    xmlString+='<q id="q12">'+ Rq12 +'</q>';
    let Rq13 = document.forms["t03"]["task_02_13"].value;
    xmlString+='<q id="q13">'+ Rq13 +'</q>';
    let Rq14 = document.forms["t03"]["task_02_14"].value;
    xmlString+='<q id="q14">'+ Rq14 +'</q>';
    let Rq15 = document.forms["t03"]["task_02_15"].value;
    xmlString+='<q id="q15">'+ Rq15 +'</q>';
    let Rq16 = document.forms["t03"]["global_evaluation_01_01"].value;
    xmlString+='<q id="q16">'+ Rq16 +'</q>';
    let Rq17 = document.forms["t03"]["global_evaluation_17"].value;
    xmlString+='<q id="q17">'+ Rq17 +'</q>';
    let Rq18 = document.forms["t03"]["global_evaluation_18"].value;
    xmlString+='<q id="q18">'+ Rq18 +'</q>';
    let Rq19 = document.forms["t03"]["global_evaluation_19"].value;
    xmlString+='<q id="q19">'+ Rq19 +'</q>';
    let Rq20 = document.forms["t03"]["global_evaluation_20"].value;
    xmlString+='<q id="q20">'+ Rq20 +'</q>';
    let Rq21 = document.forms["t03"]["global_evaluation_21"].value;
    xmlString+='<q id="q21">'+ Rq21 +'</q>';
    let Rq22 = document.forms["t03"]["global_evaluation_22"].value;
    xmlString+='<q id="q22">'+ Rq22 +'</q>';
    let Rq23 = document.forms["t03"]["global_evaluation_23"].value;
    xmlString+='<q id="q23">'+ Rq23 +'</q>';
    let Rq24 = document.forms["t03"]["global_evaluation_24"].value;
    xmlString+='<q id="q24">'+ Rq24 +'</q>';
    let Rq25 = document.forms["t03"]["global_evaluation_25"].value;
    xmlString+='<q id="q25">'+ Rq25 +'</q>';
    let Rq26 = document.forms["t03"]["global_evaluation_26"].value;
    xmlString+='<q id="q26">'+ Rq26 +'</q>';

    xmlString+="</Questionario>";
    window.localStorage.setItem(1,xmlString);
    finalizeQuestionary();


}
function testGetDataForm(){
    let todo_index=window.localStorage.length;
    for(let i=0;i<todo_index;i++){
        let info=window.localStorage.getItem(window.localStorage.key(i));
        if(window.DOMParser){
            let parser= new DOMParser();
            let xmlDoc=parser.parseFromString(info,"text/xml");
        }
        console.log(info)
    }
    let x = document.getElementsByTagName("q");
    document.write("<p> Respostas dadas no Questionário: Utilizador 1</p>");
    document.write("<p>Pergunta 1 : "+ x[0].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 2 : "+ x[1].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 3 : "+ x[2].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 4 : "+ x[3].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 5 : "+ x[4].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 6 : "+ x[5].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 7 : "+ x[6].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 8 : "+ x[7].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 9 : "+ x[8].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 10 : "+ x[9].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 11 : "+ x[10].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 12 : "+ x[11].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 13 : "+ x[12].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 14 : "+ x[13].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 15 : "+ x[14].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 16 : "+ x[15].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 17 : "+ x[16].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 18 : "+ x[17].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 19 : "+ x[18].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 20 : "+ x[19].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 21 : "+ x[20].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 22 : "+ x[21].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 23 : "+ x[22].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 24 : "+ x[23].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 25 : "+ x[24].childNodes[0].nodeValue +"</p>");
    document.write("<p>Pergunta 26 : "+ x[25].childNodes[0].nodeValue +"</p>");



}
function testGetData(){
    let todo_index=window.localStorage.length;
    for(let i=0;i<todo_index;i++){
        let info=window.localStorage.getItem(window.localStorage.key(i));
        console.log(info)
    }
}