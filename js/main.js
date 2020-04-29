/**
 * WELCOME TO MOMENT JS
 */
$(document).ready(function () {
    
    /**
     * SETUP
     */

    // Punto di partenza
    var baseMonth = moment('2018-01-01'); 
    console.log(baseMonth.month());
    
    //Referenze bottoni
    var btnPrev = $('.prev');
    var btnNext = $('.next');

    // Init Hndlenars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);

    // print giorno
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

    //Click dei bottoni avanti e indietro
    btnPrev.click(function() { 
        
        var meseAttivo = moment($('h1').attr('data-this-date'));

        if (meseAttivo.month() == 0) {
            alert('Calendario 2017 non presente')
        } else {
            
            var nuovoMese = meseAttivo.subtract(1, 'months');
            //Rimuovo vecchio mese
            $('.month-list').html(' ');

            printMonth(template, nuovoMese);
            printHoliday(nuovoMese);

        }
        
        
    });
    btnNext.click(function() { 
        var meseAttivo = moment($('h1').attr('data-this-date'));

        if (meseAttivo.month() == 11) {
            alert('Calendario 2019 non presente');
        }
        else {
            var nuovoMese = meseAttivo.add(1, 'months');
            //Rimuovo vecchio mese
            $('.month-list').html(' ');

            printMonth(template, nuovoMese);
            printHoliday(nuovoMese);    
        }
        
    });


}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    //  setta header
    $('h1').html( date.format('MMMM YYYY') );

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date',  date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('DD MMMM'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function(res) {
            var holidays = res.response;

            for (var i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                if(listItem) {
                    listItem.addClass('holiday');
                    listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                }
            }
        },
        error: function() {
            console.log('Errore chiamata festività'); 
        }
    });
}