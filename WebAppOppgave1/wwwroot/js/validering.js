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
    // Sjekket rute
    let checkedRute = $("input[name=ruter]:checked").val()
    
    if (checkedRute === undefined || checkedRute === "") {
        $("#rute-input-placeholder").addClass('is-invalid');
        ruteInputFeilMelding.removeClass('d-none');
        return false;
    } else {
        // Slik at navn til steder kan aksesseres
        valgtRute['ruteFra'] = $('#' + checkedRute + '-col .rute-fra').text();
        valgtRute['ruteTil'] = $('#' + checkedRute + '-col .rute-til').text();
        $("#rute-input-placeholder").removeClass('is-invalid');
        ruteInputFeilMelding.addClass('d-none');
        aktiverInput(reiseTypeInput);
        return true;
    }
}

function validerReiseType(){
    let reiseType = reiseTypeInput.val();
    let ok = true;

    if (reiseType === "") {
        reiseTypeInput.addClass('is-invalid');
        reiseTypeFeilMelding.removeClass('d-none');
        ok = false;
    } else if(reiseType === "en-vei"){
        reiseTypeInput.removeClass('is-invalid');
        reiseTypeFeilMelding.addClass('d-none');
        $("#til-dato-col").addClass('d-none');
        valgtReiseType = 'enVei';
        aktiverInput(fraDatoInput);
        $('.retur-element').addClass('d-none');
    } else {
        reiseTypeInput.removeClass('is-invalid');
        reiseTypeFeilMelding.addClass('d-none');
        $("#til-dato-col").removeClass('d-none');
        valgtReiseType = 'turRetur';
        aktiverInput(fraDatoInput);
        $('.retur-element').removeClass('d-none');
    }
    return ok;
}

function validerFraDato(){
    let idag = moment(new Date());
    let fra = moment(new Date(fraDatoInput.datepicker('getDate')));
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
    let fra = moment(new Date(fraDatoInput.datepicker('getDate')));
    let til = moment(new Date(tilDatoInput.datepicker('getDate')));
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

function formatterDato(id) {
    let datoInput = $("#" + id);
    let datoVerdi = moment(new Date(datoInput.datepicker('getDate')));
    return  datoVerdi.format('DD/MM/YYYY');
}

// Validerer antall reisefølger

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

// Legger måltid objekter til en liste
function leggTilValgtMaaltid(){
    $(".maaltid-row").on('click', function () {
        let inputId = '#' + $('#' + this.id + ' input').attr('id')
        let maaltidPris = Number($('#' + this.id + ' span.pris').text());
        let maaltidNavn = $('#' + this.id + ' .tittel').text();
        let input = $(inputId);

        // virker som en checked/unchecked toggle
        $(input).attr("checked", !$(input).attr("checked"));

        if($(input).is(':checked')) {
            valgtMaaltid.push({'id': inputId, 'navn': maaltidNavn, 'pris': maaltidPris});
            $(inputId + "-ikon").removeClass('d-none');
            $(inputId + '-info').addClass('on');
        } else {
            // Fjern det fra valgt måltid array hvis unchecked
            valgtMaaltid.forEach(function (item, index) {
                if(item.id === inputId) valgtMaaltid.splice(index, 1);
            });
            $(inputId + "-ikon").addClass('d-none');
            $(inputId + '-info').removeClass('on');
        }
    });
}

// Validerer passasjer inputs

function validerFornavn(id){
    let input = $('#' + id);
    
    if(input.val() === '' || input.val() === undefined) {
        visPassasjerInputFeilMelding(id, 'Fornavn er tomt.');
        return false;
    } else {
        skjulPassasjerInputFeilMelding(id);
        return true;
    }
}

function validerEtternavn(id){
    let input = $('#' + id);

    if(input.val() === '' || input.val() === undefined) {
        visPassasjerInputFeilMelding(id, 'Etternavn er tomt.');
        return false;
    } else {
        skjulPassasjerInputFeilMelding(id);
        return true;
    }
}

function validerFodselsDato(id){
    let input = $('#' + id);

    if(input.val() === '' || input.val() === undefined) {
        visPassasjerInputFeilMelding(id, 'Fødselsdato er tomt.');
        return false;
    } else {
        skjulPassasjerInputFeilMelding(id);
        return true;
    }
}

function validerPassajerForm(fornavnListe, etternavnListe, fodselsDatoListe) {
    let valid = false;
    for(let i = 0; i < fornavnListe.length; i++){
        let ok = validerFornavn(fornavnListe[i].id)
            && validerEtternavn(etternavnListe[i].id)
            && validerFodselsDato(fodselsDatoListe[i].id);

        if(ok) {
            valid = true;
        } else {
            location.href = '#bestill';
            valid = false;
            break;
        }
    }
    return valid;
}

function visPassasjerInputFeilMelding(id, melding) {
    let input = $('#' + id);
    let feilMelding = $('#' + id + '-feil-melding');
    input.addClass('is-invalid');
    feilMelding.removeClass('d-none');
    feilMelding.text(melding);
}

function skjulPassasjerInputFeilMelding(id){
    let input = $('#' + id);
    let feilMelding = $('#' + id + '-feil-melding');
    input.removeClass('is-invalid');
    feilMelding.addClass('d-none');
}

function lagePassasjerObjekt(fornavnListe, etternavnListe, datoListe){
    // Tæmmer arrayet når bruker går tilbake og endrer antall passasjerer
    passasjerer.length = 0;
    
    for(let i = 0; i < fornavnListe.length; i++) {
        let fornavn = fornavnListe[i].value;
        let etternavn = etternavnListe[i].value;
        let formattedDate = formatterDato(datoListe[i].id);
        
        let objekt = {'fornavn': fornavn, 'etternavn':etternavn, 'fodselsDato': formattedDate };
        passasjerer.push(objekt);
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
    
    // antall passasjer form er avhengig på antall passasjerer
    renderPassasjerInputsTemplate(antallVoksen, antallBarn);
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
    let fornavnListe = $('input[name=fornavn]');
    let etternavnListe = $('input[name=etternavn]');
    let fodselsDatoListe = $('input[name=fodselsdato]');
    if(validerPassajerForm(fornavnListe, etternavnListe, fodselsDatoListe)) {
        lagePassasjerObjekt(fornavnListe, etternavnListe, fodselsDatoListe);
        merkerFerdig('#trinn-5');
        skjulOgVisTrinn('#trinn-5','#trinn-6','#trinn-5-btns','#trinn-6-btns');
    }
}

function validerTrinn6() {
    merkerFerdig('#trinn-6');
    skjulOgVisTrinn('#trinn-6','#trinn-7','#trinn-6-btns','#trinn-7-btns');
}

function validerTrinn7() {
    merkerFerdig('#trinn-7');
}