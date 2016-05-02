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
    $('#schedule').empty()
    $('#schedule').append('<h2> Oral presentation </h2>')
    console.log(orals)
    var orals_html = $.map(orals,function(obj,idx) {return displayOral(obj)})
    $('#schedule').append(orals_html)
    $('#schedule').append('<h2> Poster presentation </h2>')
    var posters_html = $.map(posters,function(obj,idx) {return displayOral(obj)})
    $('#schedule').append(posters_html)
}

function displayPoster(poster)
/*
Given a poster, return the div balise
*/
{
    var p = '<p>'+poster.title+'</p>'
    return p
}

function displayOral(oral)
/*
Given a poster, return the div balise
*/
{
    var p = '<p>'+oral.title+'</p>'
    return p
}
