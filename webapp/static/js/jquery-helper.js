function refreshMap(data,colors)
{
    $('#map-container-collab').empty()
    displayMapCollab(data,colors)
}

function refreshMessage(nbcollabs)
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

// ajax call to increase or decrease the number of abraacts to take
// in consideration
function  ajaxCallNbAbstrats(nb,query)
{
    var query = $('#name-query').attr('placeholder')
    var nb = parseInt(nb)
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/collab/_refresh_nb_collab",
        data: {'query':query,'nb': nb },
        success: function(result) {
            refreshMap(result.data,result.colors)
            refreshMessage(result.nbcollabs)
        }
    });     
}


function refreshTogleNbAbstract()
// Helper to refresh the nb of abstract in the togle
{
    $("#dropdown-nb-abstracts li a").click(function(){
        $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        var nb = $(this).parents('.dropdown').find('.btn').val();
        ajaxCallNbAbstrats(nb);
    });
}
