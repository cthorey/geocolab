function refreshMap(data,colors)
{
    $('#map-container-collab').empty()
    displayMapCollab(data,colors)
}

function refreshMessage(nbcollabs)
{
    $('#nb-collab').empty()
    var message= '<p class="lead">Our recommendation system detect at least <mark>'+
        nbcollabs +' potential collaborators</mark> accross the world </p>'
    $('#nb-collab').append(message)
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
