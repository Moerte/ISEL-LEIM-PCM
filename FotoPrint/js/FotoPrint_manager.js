let app = null;
let mousedown;

window.onload = function () {
    app = new FotoPrint();
    mousedown = false;
    $("#textDialog").css("display", "none");
};

//Helper functions
function getMouseCoords(ev) {
    let mx = null;
    let my = null;

    if (ev.layerX || ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    } else {
    }
    return { mx, my }
}

function drawCanvasRect(cnv) {
    let ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cnv.width, cnv.height);
}

//Drag & Drop operation
//drag
//NOTE: use shift for drag
function drag(ev, cnv) {
    let { mx, my } = getMouseCoords(ev)

    if (app.mode == "brush") {
        mousedown = true;

    } else {
        if (app.dragObj(mx, my)) {
            $('#main').css('cursor', 'pointer');
            cnv = document.getElementById('main');
            cnv.addEventListener('mousemove', move);
            cnv.addEventListener('mouseup', drop);
        }
    }
}

//Drag & Drop operation
//move
function move(ev) {
    var cnv = document.getElementById('main');

    let { mx, my } = getMouseCoords(ev);
    mx = ev.movementX;
    my = ev.movementY;

    app.moveObj(mx, my);
    drawCanvasRect(cnv);
    app.drawObj(cnv);

}

//Drag & Drop operation
//drop
function drop(cnv) {

    var cnv = document.getElementById('main');
    cnv.removeEventListener('mousemove', move);
    cnv.removeEventListener('mouseup', drop);
    $('#main').css('cursor', 'crosshair');
}

//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev, cnv) {
    let { mx, my } = getMouseCoords(ev);

    if (app.mode == "shape") {
        if (app.selected_obj && app.insertObj(mx, my)) {
            drawCanvasRect(cnv);
            app.drawObj(cnv);
        } else {
            if (app.selected_obj) {
                makeselecteditem(ev, cnv);
            }
        }
    }

    if (app.mode == "text") {
        modalText(ev, cnv);
    }
}

function textHandler(text, ev, cnv) {
    let { mx, my } = getMouseCoords(ev);
    if (text) {
        let fontfamily = $("#font_family").val();
        let fontsize = $("#font_size").val();
        if (!fontsize) {
            fontsize = "12px";
        }
        fontsize = fontsize.replace("px", "")
        app.drawText(mx, my, fontsize, fontfamily, text);
        app.drawObj(cnv);
    }
}

function makeselecteditem(ev, cnv) {
    if (app.mode == "shape") {
        let { mx, my } = getMouseCoords(ev)

        if (app.insertSelectedObj(mx, my)) {
            drawCanvasRect(cnv);
            app.drawObj(cnv);
        }
    }
}

function selectitem(ev) {
    let { mx, my } = getMouseCoords(ev);
    app.selectObj(mx, my);
}

function modalText(ev, cnv) {
    var text;

    $("#textDialog").dialog({
        autoOpen: false,
        modal: true,
        "title": "Insert Text",
        buttons: {
            "Ok": function () {
                let text2 = $("#text");
                text = text2.val();
                text2.val("");
                textHandler(text, ev, cnv);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#textDialog").dialog("open");
}

function modalAlert(text) {
    $("#alertDialog").dialog({
        autoOpen: false,
        modal: true,
        "title": "Alert Text",
        body: text,
    });
    $("#alertDialog").dialog("open");
}

//Save button
//Onclick Event
function saveasimage(cnv) {
    try {
        let link = $('<a/>').attr('download', "imagecanvas.png");
        link.attr('href', cnv.toDataURL("image/png").replace("image/png", "image/octet- stream"));
        link[0].click();
    } catch (err) {
        modalAlert("ERROR! You need to change the browser!");
    }
}