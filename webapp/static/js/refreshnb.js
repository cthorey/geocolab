
function changeNb(nb)
{
    $.post({
        url: $SCRIPT_ROOT + "/_change_nb",
        dataType:"json",
        data: {'nb' : nb},
        success : function (result){
            console.log(result);
        }
    })
}

/*********************************************************************
**********************************************************************
Refresher of the select menu
**********************************************************************
*********************************************************************/

var translation = {'Use only 25 first recommendations':25,
                   'Use 50 first recommendations':50,
                   'Use 100 first recommendations':100}
    
function refreshTogleNbAbstract()
// Helper to refresh the nb of abstract in the togle
{
    $("#select-nb").on('changed.bs.select',function()
                       {
                           var nb = $(this).val();
                           ajaxCallNbAbstrats(translation[nb.trim()]);
                       })
}

/*********************************************************************
**********************************************************************
AJAX CALL
Refresh everything given a different number of abstract
the recommendation should be based on 
**********************************************************************
*********************************************************************/

function  ajaxCallNbAbstrats(nb)
{
    var nb = parseInt(nb)
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based/_refresh_nbcollab",
        data: {'nb': nb },
        success: function(result) {
            if ($('.nav.navbar-nav li.tab.active').attr('id') == 'collab')
            {
                refreshMessage(result.nbcollabs)
                refreshMap(result.data,result.colors)
                refreshThumbnail()
            }
            else if ($('.nav.navbar-nav li.tab.active').attr('id') == 'schedule')
            {
                refreshScheduleonNb()
            }
        }
    });     
}

/**********************************************************************
App journey
**********************************************************************/

function refreshScheduleonNb()
{
    day = $(".btn.day.active").text()
    ajaxScheduleDay(day)
}

/**********************************************************************
App collaborators
**********************************************************************/
    
function refreshMap(data,colors)
{
    $('#map-container-collab').empty()
    displayMapCollab(data,colors)
}

function refreshThumbnail()
{
    var selector = $('#thumbmail-collab .alert')
    if (selector.hasClass('alert-info'))
    {
        country = selector.select('.alert-info').text().split(' : ')[0]
    }
    else if (selector.hasClass('alert-success'))
    {
        country = selector.select('.alert-sucess').text().split(' : ')[0]
    }
    if (country.trim() != "")
    {
        ajaxCallCollab(country.trim())
    }
}

function refreshMessage2(nbcollabs)
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


