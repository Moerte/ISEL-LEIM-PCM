// Para a view
$(document).ready(function () {
  $('#startQuest').click(function () {
    $(".main").removeClass("all-height");
    $('.navbar').removeClass('d-none');
    $(".main").addClass("half-height");
    $(".main").addClass("fixed-top");
    $("#startQuest").css('display', 'none');
    $(".heading-primary-sub").css('display', 'none');
    $('#t03').css({
      'display': 'block',
      'margin-top': '22vh'
    });
  });
});

function populate_results() {

  data = get_data()
  console.log(data);
  for (key in data) {
    if (key == 'age') {
      drawAge(data[key]);
    }
    if (key == 'global_evaluation_17') {
      drawG17(data[key]);
    }
    append_childs(data[key], ('#' + key))
  }
}

function append_childs(childs, parent) {

  for (key in childs) {
    if (parent == '#task_02_9' || parent == '#task_02_11' || parent == '#task_02_14' ||
     parent == '#task_02_15' || parent == '#task_01'||parent == '#other_search_engine_quais') {
      var elm = document.createElement('span')
      var child_elm = document.createTextNode(key + ': ' + childs[key])
      var br = document.createElement('br')

      elm.appendChild(child_elm)
      elm.appendChild(br)

      $("" + parent + "").append(elm);
    }else if(parent == '#global_evaluation_01'){
      var elm = document.createElement('span')
      if(key==1) var child_elm = document.createTextNode('De 0 a 5 entre Fantástica e Horrivel a media é: ' + Math.round(childs[key]));
      if(key==2) var child_elm = document.createTextNode('De 0 a 5 entre Estimulante e Aborrecida a media é: ' + Math.round(childs[key]));
      if(key==3) var child_elm = document.createTextNode('De 0 a 5 entre Gratificante e Frustante a media é: ' + Math.round(childs[key]));
      if(key==4) var child_elm = document.createTextNode('De 0 a 5 entre Fácil e Dificil a media é: ' + Math.round(childs[key]));
      
      var br = document.createElement('br')

      elm.appendChild(child_elm)
      elm.appendChild(br)

      $("" + parent + "").append(elm);
    } else {
      var elm = document.createElement('span')
      var child_elm = document.createTextNode('A Resposta ' + key + ' foi dada: ' + childs[key] + ' vezes')
      var br = document.createElement('br')

      elm.appendChild(child_elm)
      elm.appendChild(br)

      $("" + parent + "").append(elm);
    }
  }
}
function drawAge(data) {
  //Definar os array para usar
  let labels = [];
  let val = [];
  let allColors = ['#CC0000', '#F3E400', '#0074F3', '#186B09', '#452D45'];
  let colors = [];
  for (i in data) {
    labels.push(i);
    val.push(data[i]);
  }
  for (let j = 0; j < val.length; j++) {
    colors.push(allColors[j]);
  }
  var canvas = document.getElementById("can");
  var ctx = canvas.getContext("2d");
  var lastend = 0;
  var data = val;
  var myTotal = 0;
  var myColor = colors;


  for (var e = 0; e < data.length; e++) {
    myTotal += data[e];
  }

  // make the chart 10 px smaller to fit on canvas
  var off = 10
  var w = (canvas.width - off) / 2
  var h = (canvas.height - off) / 2
  for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = myColor[i];
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w, h);
    var len = (data[i] / myTotal) * 2 * Math.PI
    var r = h - off / 2
    ctx.arc(w, h, r, lastend, lastend + len, false);
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var mid = lastend + len / 2
    ctx.fillText(labels[i], w + Math.cos(mid) * (r / 2), h + Math.sin(mid) * (r / 2));
    lastend += Math.PI * 2 * (data[i] / myTotal);
  }
  console.log(colors);
}
function drawG17(data) {
  //Definar os array para usar
  let labels = [];
  let val = [];
  let allColors = ['#CC0000', '#F3E400', '#0074F3', '#186B09', '#452D45'];
  let colors = [];
  for (i in data) {
    labels.push(i);
    val.push(data[i]);
  }
  for (let j = 0; j < val.length; j++) {
    colors.push(allColors[j]);
  }
  var canvas = document.getElementById("can2");
  var ctx = canvas.getContext("2d");
  var lastend = 0;
  var data = val;
  var myTotal = 0;
  var myColor = colors;


  for (var e = 0; e < data.length; e++) {
    myTotal += data[e];
  }

  // make the chart 10 px smaller to fit on canvas
  var off = 10
  var w = (canvas.width - off) / 2
  var h = (canvas.height - off) / 2
  for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = myColor[i];
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w, h);
    var len = (data[i] / myTotal) * 2 * Math.PI
    var r = h - off / 2
    ctx.arc(w, h, r, lastend, lastend + len, false);
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var mid = lastend + len / 2
    ctx.fillText(labels[i], w + Math.cos(mid) * (r / 2), h + Math.sin(mid) * (r / 2));
    lastend += Math.PI * 2 * (data[i] / myTotal);
  }
  console.log(colors);
}