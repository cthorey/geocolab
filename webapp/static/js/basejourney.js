function  ajaxScheduleDay(day)
{
    var day = day
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based_journey/_get_schedule_day",
        data: {'day': day },
        success: function(result) {
            displayAll(result.orals,result.posters)
        }
    });     
}

function displayAll(orals,posters)
/* Get some data for one 
poster = {'item0':{'score':0.3,'title':'dezze','room':'dezde'}}
oral = {'item0':{'score':0.3,'title':'dezze','room':'dezde'}}
*/
{
    $('#Orals').empty()
    $('#Orals').append('<ul class="list-group">')
    var orals_html = $.map(orals,function(obj,idx) {return displayOral(obj)})
    $('#Orals').append(orals_html)
    $('#Orals').append('</ul">')

    $('#Posters').empty()
    $('#Posters').append('<ul class="list-group">')
    var posters_html = $.map(posters,function(obj,idx) {return displayOral(obj)})
    $('#Posters').append(posters_html)
    $('#Posters').append('</ul">')    
}

function displayOral(oral)
/*
Given a poster, return the div balise
*/
{
    var a = '<li class="list-group-item">'+
        '<h4 class="list-group-item-heading">%s - %s</h4>'+
        '<p class="list-group-item-text"> %s </p>'+
        '</li>'
    return a.format(oral.time,oral.room,oral.title)
}

function displayPoster(poster)
/*
Given a poster, return the div balise
*/
{

    var a = '<li class="list-group-item" id="toggle-posters">'+
        '<h4 class="list-group-item-heading">%s</h4>'+
        '<p class="list-group-item-text"> %s </p>'+
        '</li>'
    return a.format(poster.time,poster.title)
}


