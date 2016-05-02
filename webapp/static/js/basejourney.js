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
    $('#schedule').append('<div class="list-group">')
    var a = '<a href="#" class="list-group-item active" data-toggle="collapse" data-target="#toggle-orals">'+
        '<h3>Oral presentation </h3></a>'
    $('#schedule').append(a)
    var orals_html = $.map(orals,function(obj,idx) {return displayOral(obj)})
    $('#schedule').append(orals_html)
    $('#schedule').append('</div">')

    $('#schedule').append('<div class="list-group">')
    var a = '<a href="#" class="list-group-item active" data-toggle="collapse" data-target="#toggle-posters">'+
        '<h3>Poster presentation </h3></a>'
    $('#schedule').append(a)
    var posters_html = $.map(posters,function(obj,idx) {return displayOral(obj)})
    $('#schedule').append(posters_html)
    $('#schedule').append('</div">')    
}

function displayOral(oral)
/*
Given a poster, return the div balise
*/
{
    var a = '<a href="#" class="list-group-item" id ="toggle-orals">'+
        '<h4 class="list-group-item-heading">%s - %s</h4>'+
        '<p class="list-group-item-text"> %s </p>'+
        '</a>'
    return a.format(oral.time,oral.room,oral.title)
}

function displayPoster(poster)
/*
Given a poster, return the div balise
*/
{

    var a = '<a href="#" class="list-group-item" id="toggle-posters">'+
        '<h4 class="list-group-item-heading">%s</h4>'+
        '<p class="list-group-item-text"> %s </p>'+
        '</a>'
    return a.format(poster.time,poster.title)
}


