function  ajaxScheduleDay(day)
{
    var day = day
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based_journey/_get_schedule_day",
        data: {'day': day },
        success: function(result) {
            refreshSpan(result.orals.n,result.posters.n)
            displayOrals(result.orals)
            displayPosters(result.posters)
        }
    });     
}

function refreshSpan(orals,posters)
{
    $('#span-oral').text(Object.keys(orals).length)
    $('#span-poster').text(Object.keys(posters).length)
}


function displayOrals(orals)
{
    // oral = {'item0':{'score':0.3,'title':'dezze','room':'dezde'}}
    $('#Orals').empty()
    $('#Orals').append('<ul class="list-group">')
    var orals_arr = $.map(orals,function(obj,idx){return obj}) //Create the array
    var arr = orals_arr.sort(function(a, b) {
        return parseTime(a.time.split('-')[0]) - parseTime(b.time.split('-')[0]);});
    // Next fill in
    arr.forEach(function(oral) {
        $("#Orals").append(displayOral(oral));
    });
    $('#Orals').append('</ul">')
}

function displayPosters(posters)
{
    $('#poster-morning').empty()
    var posters_html = $.map(posters.am,function(obj,idx) {return displayPoster(obj)})
    $('#Posters').append(posters_html)
    $('#Posters').append('</ul">')
    $('#Posters').append('</li">')
    $('#Posters').append('<li class="list-group-item">')
    $('#Posters').append('<h3>Afternoon - 14h30-18h30 </h3>')
    $('#Posters').append('<ul class="list-group">')
    var posters_html = $.map(posters,function(obj,idx) {return displayPoster(obj)})
    $('#Posters').append(posters_html)
    $('#Posters').append('</ul">')
    $('#Posters').append('</li">')    
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


function parseTime(time) {

    // Number of decimal places to round to
    var decimal_places = 2;

    // Maximum number of hours before we should assume minutes were intended. Set to 0 to remove the maximum.
    var maximum_hours = 15;

    // 3
    var int_format = time.match(/^\d+$/);

    // 1:15
    var time_format = time.match(/([\d]*):([\d]+)/);

    // 10m
    var minute_string_format = time.toLowerCase().match(/([\d]+)m/);

    // 2h
    var hour_string_format = time.toLowerCase().match(/([\d]+)h/);

    if (time_format != null) {
	hours = parseInt(time_format[1]);
	minutes = parseFloat(time_format[2]/60);
	time = hours + minutes;
    } else if (minute_string_format != null || hour_string_format != null) {
	if (hour_string_format != null) {
	    hours = parseInt(hour_string_format[1]);
	} else {
	    hours = 0;
	}
	if (minute_string_format != null) {
	    minutes = parseFloat(minute_string_format[1]/60);
	} else {
	    minutes = 0;
	}
	time = hours + minutes;
    } else if (int_format != null) {
	// Entries over 15 hours are likely intended to be minutes.
	time = parseInt(time);
	if (maximum_hours > 0 && time > maximum_hours) {
	    time = (time/60).toFixed(decimal_places);
	}
    }

    // make sure what ever we return is a 2 digit float
    time = parseFloat(time).toFixed(decimal_places);

    return time;
}
