/*********************************************************************
**********************************************************************
Events
**********************************************************************
*********************************************************************/
function onSearch()
{
    $('#search-click').click(function ()
                       {
                           console.log('click')
                           search = $('select-abstract').val()
                           $.ajax({
                               dataType:"json",
                               url: $SCRIPT_ROOT + "/query_based_journey/_on_search",
                               data:search,
                               success: function(result)
                               {
                                   displayBlockMessage()
                                   day = $(".day.active").text()
                                   displayBlockApp(day)
                               }
                           })
                             
                         })
}



function initMessageSchedule()
{
    displayBlockMessage()
}

function initMonday()
{
    displayBlockApp("Mon")
}
/**********************************************************************
Refresh on click on day */

function onClickDay()
// Helper to refresh the nb of abstract in the togle
{
    $("#whichday .btn").click(function(){
        $(".day").removeClass('active')
        var day = $(this).text();
        $("#button-%s".format(day)).addClass('active')
        displayBlockApp(day)
    });
}

/**********************************************************************
Refresh on click on changing Nb */

    
function onSelectNb()
{
    $("#select-nb").on('changed.bs.select',function()
                       {
                           var nb = parseInt($(this).val().split('=')[1].trim());
                           changeNb(nb);
                           displayBlockMessage()
                           day = $(".day.active").text()
                           displayBlockApp(day)
                       })
}

/*********************************************************************
**********************************************************************
Block display
**********************************************************************
*********************************************************************/

function displayBlockMessage()
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based_journey/_get_nb_results",
        success: function(result)
        {
            refreshMessage(result.n,result.is_qry)
        }
    })
}

function displayBlockApp(day)
{
    var day2day = {"Mon":"Monday","Tue":"Tuesday","Wed":"Wednesday","Thu":"Thursday","Fri":"Friday"}
    var day = day2day[day]
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based_journey/_get_schedule_day",
        data: {'day': day },
        success: function(result) {
            $.each(result,function(sess,obj) {
                displaySpan(sess,obj);
                displaySessions(sess,obj);
            })
        }
    });     
}

/*********************************************************************
**********************************************************************
Helpers
**********************************************************************
*********************************************************************/

/*********************************************************************
Message */

function refreshMessage(nb,is_qry)
{
    var selector = $('#messageSchedule')
    selector.empty()
    if (!(is_qry))
    {
        var message = 'Type something in the search panel above to help us identify what you are looking for.'
        var content = '<div class="alert alert-info">'+
            '<strong> Info: </strong> %s'+
            '</div>'
        selector.append(content.format(message))
    }
    else if (nb == 0)
    {
        var message = 'we did not find any contributions that'+
            ' could potentially match your request. Try with a different request.'
        var content = '<div class="alert alert-warning">'+
            '<strong> Sorry, </strong> %s'+
            '</div>'
        selector.append(content.format(message))
    }
    else
    {
        var message = 'We select %s contributions that '+
            'could interest you during the week. '+
            'Click on each day to get the details.'
        var message = message.format(nb)
        var content = '<div class="alert alert-success">'+
            '<strong> Looks like a busy AGU for you. </strong> %s'+
            '</div>'
        selector.append(content.format(message))
    }  
}

/*********************************************************************
App */

function displaySpan(session,obj)
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
    var message0 = 'Seems like a perfect moment for sight-seeing'
    var message1 = 'Seems like a perfect moment for networking. '
        + 'You might want to start <a href="'+ $SCRIPT_ROOT+'query_based_link">here</a>.'
    var message2 = 'Seems like a perfect moment for networking. '
        + 'You might want to start <a href="'+ $SCRIPT_ROOT+'query_based_title">here</a>.'
    var message3 = 'Seems like a perfect moment for networking. '
        + 'You might want to start <a href="'+ $SCRIPT_ROOT+'query_based_query">here</a>.'
    var messages = [message0,message1,message2,message3]
    var idx = Math.floor(Math.random() * messages.length);
    var a = '<li class="list-group-item list-group-item-warning">'+
        '<h5 class="list-group-item-heading">Nothing for you here</h5>'+
        '<p class="list-group-item-text"> %s</p>'+
        '</li>'

    return a.format(messages[idx])   
}


function displayOral(oral)
/*
Given a poster, return the div balise
*/
{
    var a = '<li class="list-group-item">'+
        '<h5 class="list-group-item-heading">%s - %s'+
        ' <a target="_blank" href=%s><span class="glyphicon glyphicon-info-sign pull-right"></span></a></h5>'+
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
        '<h5 class="list-group-item-heading">Location - %s'+
        ' <a target="_blank" href=%s><span class="glyphicon glyphicon-info-sign pull-right"></span></a></h5>'+
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
