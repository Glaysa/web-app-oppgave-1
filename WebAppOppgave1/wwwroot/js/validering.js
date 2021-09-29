﻿
////////////////////////////////////////////////////////////////////
/////                                                          /////
/////               Validerer alle input feltene               /////
/////             før bruker kan gå videre til neste           /////   
/////               trinn av billett bestillingen              /////
/////                                                          /////
////////////////////////////////////////////////////////////////////

// Input variabler

let reiseTypeInput = $("#reise-type");
let fraDatoInput = $("#fra-dato");
let tilDatoInput = $("#til-dato");

// Feil meldinger

let ruteInputFeilMelding = $("#rute-feil-melding");
let reiseTypeFeilMelding = $("#reise-type-feil-melding");
let fraDatoFeilMelding = $("#fra-dato-feil-melding");
let tilDatoFeilMelding = $("#til-dato-feil-melding");

function validerRute(){
    // Tømmer arrayet, unngår duplikater i listen fordi funksjonen er kalt på onchange event
    valgtRute.length = 0;
    // Sjekket rute
    let checkedRute = $("input[name=ruter]:checked").val()
    
    if (checkedRute === undefined || checkedRute === "") {
        $("#rute-input-placeholder").addClass('is-invalid');
        ruteInputFeilMelding.removeClass('d-none');
        return false;
    } else {
        // Slik at navn til steder kan aksesseres
        let ruteFra = $('#' + checkedRute + '-col .rute-fra').text();
        let ruteTil = $('#' + checkedRute + '-col .rute-til').text();
        valgtRute.push({'ruteFra': ruteFra});
        valgtRute.push({'ruteTil': ruteTil});
        $("#rute-input-placeholder").removeClass('is-invalid');
        ruteInputFeilMelding.addClass('d-none');
        aktiverInput(reiseTypeInput);
        return true;
    }
}

function validerReiseType(){
    valgtReiseType = reiseTypeInput.val();
    let ok = true;

    if (valgtReiseType === "") {
        reiseTypeInput.addClass('is-invalid');
        reiseTypeFeilMelding.removeClass('d-none');
        ok = false;
    } else if(valgtReiseType === "en-vei"){
        reiseTypeInput.removeClass('is-invalid');
        reiseTypeFeilMelding.addClass('d-none');
        $("#til-dato-col").addClass('d-none');
        aktiverInput(fraDatoInput);
        // Skjul retur elementer
    } else {
        reiseTypeInput.removeClass('is-invalid');
        reiseTypeFeilMelding.addClass('d-none');
        $("#til-dato-col").removeClass('d-none');
        aktiverInput(fraDatoInput);
        // Vis retur elementer
    }
    return ok;
}

function validerFraDato(){
    let idag = moment(new Date());
    let fra = moment(new Date(fraDatoInput.val()));
    let ok = false;
    
    if(!datoErTom(fraDatoInput, fraDatoFeilMelding, "Velg en avreise dato.")) {
        if(fra.isSameOrBefore(idag)){
            visDatoFeilMelding(fraDatoInput, fraDatoFeilMelding, "Ingen billetter finnes for denne dato.");
        } else if(fra.isBefore(idag)){
            visDatoFeilMelding(fraDatoInput, fraDatoFeilMelding, "Ugyldig avreise dato.");
        } else {
            valgtAvreiseDato = fra.format('DD/MM/YYYY');
            fjernDatoFeilMelding(fraDatoInput, fraDatoFeilMelding);
            aktiverInput(tilDatoInput);
            ok = true;
        }
    }
    return ok;
}

function validerTilDato(){
    if(reiseTypeInput.val() === "en-vei") return true;
    let fra = moment(new Date(fraDatoInput.val()));
    let til = moment(new Date(tilDatoInput.val()));
    let ok = false;

    if(!datoErTom(tilDatoInput, tilDatoFeilMelding, "Velg en retur dato.")) {
        if(til.isSame(fra)) {
            visDatoFeilMelding(tilDatoInput, tilDatoFeilMelding, "Avreise og retur dato kan ikke være samme dag.");
        } else if(til.isBefore(fra)){
            visDatoFeilMelding(tilDatoInput, tilDatoFeilMelding, "Ugyldig retur dato.");
        } else {
            valgtReturDato = til.format('DD/MM/YYYY'); 
            fjernDatoFeilMelding(tilDatoInput, tilDatoFeilMelding);
            ok = true;
        }
    }
    return ok;
}

// Hjelpe funksjoner for dato valideringer

function datoErTom(datoInput, feilMeldingBox, feilMelding){
    if(datoInput.val() === "") {
        visDatoFeilMelding(datoInput, feilMeldingBox, feilMelding);
        return true;
    }
    return false;
}

function visDatoFeilMelding(datoInput, feilMeldingBox, feilMelding){
    datoInput.addClass('is-invalid');
    feilMeldingBox.removeClass('d-none');
    feilMeldingBox.text(feilMelding);
}

function fjernDatoFeilMelding(datoInput, feilMeldingBox){
    datoInput.removeClass('is-invalid');
    feilMeldingBox.addClass('d-none');
}

// Validerer antall passasjerer

function pluss(type, max) {
    let plussBtn = $("#" + type + " .pluss");
    let minusBtn = $("#" + type + " .minus");
    let label = $(".antall-" + type);
    let value = Number(label.text());
    
    if(value < max) {
        value++;
        label.text(value);
        plussBtn.removeClass('disabled');
        minusBtn.removeClass('disabled');
    } else {
        plussBtn.addClass('disabled');
    }
}

function minus(type, min) {
    let plussBtn = $("#" + type + " .pluss");
    let minusBtn = $("#" + type + " .minus");
    let label = $(".antall-" + type);
    let value = Number(label.text());
    
    if(value > min) {
        value--;
        label.text(value);
        plussBtn.removeClass('disabled');
        minusBtn.removeClass('disabled');
    } else {
        minusBtn.addClass('disabled');
    }
}

// Validerer trinn

function validerTrinn1(){
    let ok = validerRute() && validerReiseType() && validerFraDato() && validerTilDato();
    if(ok) {
        merkerFerdig('#trinn-1');
        skjulOgVisTrinn('#trinn-1','#neste-trinn','','');
    }
}

function validerTrinn2() {
    antallVoksen = Number($(".antall-voksen").text());
    antallBarn = Number($(".antall-barn").text());
    antallDyr = Number($(".antall-dyr").text());
    antallSykler = Number($(".antall-sykkel").text());
    
    console.log('voksen:', antallVoksen);
    console.log('barn:', antallBarn);
    console.log('kjæledyr:', antallDyr);
    console.log('sykler:', antallSykler);
    
    merkerFerdig('#neste-trinn');
    skjulOgVisTrinn('#trinn-2','#trinn-3','#trinn-2-btns','#trinn-3-btns');
}

function validerTrinn3() {
    merkerFerdig('#trinn-3');
    skjulOgVisTrinn('#trinn-3','#trinn-4','#trinn-3-btns','#trinn-4-btns');
}

function validerTrinn4() {
    merkerFerdig('#trinn-4');
    skjulOgVisTrinn('#trinn-4','#trinn-5','#trinn-4-btns','#trinn-5-btns');
}

function validerTrinn5() {
    merkerFerdig('#trinn-5');
    skjulOgVisTrinn('#trinn-5','#trinn-6','#trinn-5-btns','#trinn-6-btns');
}

function validerTrinn6() {
    merkerFerdig('#trinn-6');
    skjulOgVisTrinn('#trinn-6','#trinn-7','#trinn-6-btns','#trinn-7-btns');
}

function validerTrinn7() {
    merkerFerdig('#trinn-7');
}