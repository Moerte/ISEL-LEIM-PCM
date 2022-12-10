var FORM_NAME = 'form_data';
var N_RESPONSES_STRING = 'form_n_responses';
var PROGRESS_INCREMENT = 100 / 28;

var elms_with_input = [];

function open_tab(evt, tabName) {

    let tabcontent = $(".tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    let tablinks = $(".tablinks");
    for (let j = 0; j < tablinks.length; j++) {
        tablinks[j].className = tablinks[j].className.replace(" active", "");
    }

    $("#" + tabName).css('display', 'block');
    if (evt.currentTarget.className.includes("btn")) {
        $("." + tabName).addClass(" active");
    } else evt.currentTarget.className += " active";
}

function checkBrowser(elemento, event) {
    increment_progress_bar(event);
    let opcao1 = document.getElementById("primeiro");
    let opcao2 = document.getElementById("segundo");
    let opcao3 = document.getElementById("terceiro");
    if ((elemento.id.localeCompare("primeiro") !== 0) && (elemento.value ===
        opcao1.value)) {
        opcao1.value = "";
    }
    if ((elemento.id.localeCompare("segundo") !== 0) && (elemento.value ===
        opcao2.value)) {
        opcao2.value = "";
    }
    if ((elemento.id.localeCompare("terceiro") !== 0) && (elemento.value ===
        opcao3.value)) {
        opcao3.value = "";
    }
}

function Write_Text(event) {
    increment_progress_bar(event);
    let x = document.forms["t03"]["other_search_engine"].value;
    if (x == "no") {
        $("textarea[name=other_search_engine_quais]").attr('disabled', true);
        if (!$("#other_search_engine_quais_label").hasClass('d-none')) {
            $("#other_search_engine_quais_label").addClass('d-none');
        }
        $("textarea[name=other_search_engine_quais]").text("");
    } else {
        $("textarea[name=other_search_engine_quais]").attr('disabled', false);
        $("#other_search_engine_quais_label").removeClass('d-none');
    }
}
// Inicia o formulario
function initializeQuestionary() {
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
}
//Finaliza o Formulario
function finalizeQuestionary() {
    // Hide the form and show the thank you message
    $('.heading-thankyou').css('display', 'block');
    $('.main').removeClass('half-height');
    $('.main').addClass('all-height');
    $('.heading-primary-main').addClass('d-none');
    $('#t03').css('display', 'none');
    $('.navbar').addClass('d-none');
}
// Valida se os campos obrigatorios estão preenchidos
function formValidation(requiredField) {
    let counter = 0;
    if ($(requiredField).attr('type') == 'radio') {
        let name = $(requiredField).attr('name');
        let selected = $('input[name=' + name + ']:checked').val();
        if (!$('input[name=' + name + ']:checked').val()) {
            $("label[for='" + $(requiredField).attr('id') + "']").addClass('text-danger');
            counter++;
        }
    } else {
        if ($(requiredField).val() == '') {
            $("label[for='" + $(requiredField).attr('id') + "']").addClass('text-danger');
            counter++;
        }
    }
    return counter;
}

function handle_form() {

    // get number of responses
    let n_responses = parseInt(localStorage.getItem(N_RESPONSES_STRING)) || 0;
    // get localStorage data
    let data = get_data();
    // get and join form data
    data = update_data(data);
    // save data to localStorage
    localStorage.setItem(FORM_NAME, JSON.stringify(data));
    localStorage.setItem(N_RESPONSES_STRING, ++n_responses);
    console.log(data);
}

function get_data() {

    return JSON.parse(localStorage.getItem(FORM_NAME)) || {};
}

function update_data(data) {
    let elements = document.forms['t03'];
    for (let i = 0; i < elements.length; i++) {
        let elm = elements[i];
        if ((elm.type === 'radio' && elm.checked || elm.type === 'range') && check_user_input(elm.name)) {
            // create keys
            if (data[elm.name] === undefined) {
                data[elm.name] = {};
            }
            if (data[elm.name][elm.value] === undefined) {
                data[elm.name][elm.value] = 0;
            }
            data[elm.name][elm.value]++
        }
        else if (elm.tagName === 'TEXTAREA' && elm.value !== '' && check_user_input(elm.name)) {
            // create keys
            if (data[elm.name] === undefined) {
                data[elm.name] = [];
            }
            data[elm.name].push(elm.value);
        } else if (elm.tagName === 'SELECT' && elm.value != '') {
            if (data[elm.name] === undefined) {
                data[elm.name] = {};
            }
            if (data[elm.name][elm.value] === undefined) {
                data[elm.name][elm.value] = 0;
            }
            data[elm.name][elm.value]++
        }
    }
    data = global_evaluation(data);
    return data;
}

function read_data(data) {
    for (key in data) {
        if (Object.keys(data[key]).length > 0) {
            read_data(data[key]);
        }
        else {
            console.log(key, data[key]);
        }
    }
}

function check_user_input(name) {

    if (elms_with_input.indexOf(name) === -1) {
        return false;
    }
    return true;
}

function increment_progress_bar(evt) {

    if (!check_user_input(evt.target.name)) {
        elms_with_input.push(evt.target.name);
        $('#progress_bar').val(function (i, oldval) {
            return oldval += PROGRESS_INCREMENT;
        });
    }
    if (evt.target.tagName === 'TEXTAREA' && evt.target.value === '') {

        elms_with_input.pop(evt.target.name);
        $('#progress_bar').val(function (i, oldval) {
            return oldval -= PROGRESS_INCREMENT;
        });
    }

}

/**
 * Calculates the average of each item in global evaluation
 */
function global_evaluation(data) {

    let key_string = 'global_evaluation_01';
    let keys = ['01', '02', '03', '04'];
    for (let i = 0; i < keys.length; i++) {
        let total = 0;
        let weight = 0;
        let values = data[key_string + '_' + keys[i]];
        delete data[key_string + '_' + keys[i]];
        for (key in values) {
            total += parseInt(key) * values[key];
            weight += values[key];
        }
        if (data[key_string] === undefined) {
            data[key_string] = {};
        }
        data[key_string][i + 1] = ((data[key_string][i + 1] + total) / 2) || (total / weight);
    }
    return data;
}