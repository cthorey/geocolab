function refreshSchedule()
// Helper to refresh the nb of abstract in the togle
{
    $("#whichday .btn").click(function(){
        $(".day").removeClass('active')
        var day = $(this).text();
        $("#button-%s".format(day)).addClass('active')
        ajaxScheduleDay(day)
    });
}

function  ajaxScheduleDay(day)
{
    var day = day
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based_journey/_get_schedule_day",
        data: {'day': day },
        success: function(result) {
            displayScheduleMessage(result.ntotal)
            displaySchedule(result)
        }
    });     
}

function displaySchedule(result)
{
    ["orals","posters"].forEach(function (sess) {
        refreshSpan(sess,result[sess]);
        displaySessions(sess,result[sess]);
    })
}

function refreshScheduleMessage(nbcollabs)
{
    $('#nb-collab').empty()
    if (parseInt(nbcollabs) == 0) {
        $('#nb-collab').append('<h2> Sorry:</h2>')
        var message= '<p class="lead"> Sorry, we did not find any collaborators for you based on this query. Try to be more specific.  </p>'
        $('#nb-collab').append(message)
    } else
    {
        $('#nb-collab').append('<h2> Congratulation:</h2>')
        var message= '<p class="lead">Our recommendation system detect at least <mark>'+
            nbcollabs +' potential collaborators</mark> accross the world </p>'
        $('#nb-collab').append(message)
        $('#nb-collab').append('<p class="lead"> Click on a specific country to get more details. </p>')
    }
}

function displayScheduleMessage(n)
{
    if (n==0)
    {
        selector = $("#messageSchedule")
        selector.empty()
        message = '<p class="lead"> Sorry we did not find any contribution for you to see during the conference. </p>'
        selector.append(message)
    }
    else
    {
        selector = $("#messageSchedule")
        selector.empty()
        message = '<p class="lead"> We found %s contribution that might be of interest during AGU. </p>'
        selector.append(message.format(n))
    }
}
function refreshSpan(session,obj)
{
    bselector = '#span-%s'.format(session)
    $(bselector).text(obj.n)
    $(bselector+'-am').text(Object.keys(obj.am).length)
    $(bselector+'-pm').text(Object.keys(obj.pm).length)
}

function displaySessions(sess,obj)
{
    ["am","pm"].forEach(function (time){ displaySession(sess,obj,time)})
}

function displaySession(sess,obj,time)
{
    var n = Object.keys(obj[time]).length
    var selector = $('#%s-%s'.format(sess,time))
    if (n == 0)
    {
        var content = displayEmpty(selector)
    }
    else
    {
        var content = get_content(sess,obj[time])
    }
    fillinlist(selector,content)   
}

function get_content(sess, objs)
{
    if (sess=='orals')
    {
        var content = $.map(objs,function(obj,idx){return obj}); //Create the array
        var content = content.sort(function(a, b) {
            return parseTime(a.time.split('-')[0]) - parseTime(b.time.split('-')[0]);});
        var content = $.map(content,function(obj) {return displayOral(obj)})
    }
    else
    {
        var content = $.map(objs,function(obj,idx) {return displayPoster(obj)})
    }
    return content
}

function fillinlist(selector,content)
{
    selector.empty()
    selector.append('<ul class="list-group">')
    selector.append(content)
    selector.append('</ul">')    
}

function displayEmpty(selector,obj)
{
    var message = 'Seems like a perfect moment for sight-seeing' 
    var a = '<li class="list-group-item list-group-item-warning">'+
        '<h4 class="list-group-item-heading">Nothing for you here</h4>'+
        '<p class="list-group-item-text"> %s</p>'+
        '</li>'
    return a.format(message)   
}


function displayOral(oral)
/*
Given a poster, return the div balise
*/
{
    var a = '<li class="list-group-item">'+
        '<h4 class="list-group-item-heading">%s - %s'+
        ' <a target="_blank" href=%s><span class="glyphicon glyphicon-info-sign pull-right"></span></a></h4>'+
        '<p class="list-group-item-text"> %s </p>'+
        '</li>'
    return a.format(oral.time,oral.place,oral.link,oral.title)
    
}

function displayPoster(poster)
/*
Given a poster, return the div balise
*/
{

    var a = '<li class="list-group-item">'+
        '<h4 class="list-group-item-heading">Location - %s'+
        ' <a target="_blank" href=%s><span class="glyphicon glyphicon-info-sign pull-right"></span></a></h4>'+
        '<p class="list-group-item-text"> %s </p>'+
        '</li>'
    return a.format(poster.tag,poster.link,poster.title)
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
