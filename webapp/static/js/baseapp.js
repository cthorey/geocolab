/*********************************************************************
**********************************************************************
Get the country from datamap along with their geocode
Use the library datamap.js
**********************************************************************
*********************************************************************/

var COUNTRIES = Datamap.prototype.worldTopo.objects.world.geometries; 
var dict_code_country = {}
for (var i = 0, n = COUNTRIES.length; i < n; i++) {
    dict_code_country[COUNTRIES[i].properties.name]=COUNTRIES[i].id;
}


/*********************************************************************
**********************************************************************
DISPLAY THE MAP OF COLLABORATORS
**********************************************************************
*********************************************************************/

function displayMapCollab(data,fills)
/**
 * @summary Diplay the map of collaborators.
 *
 * Rely of the library datamap.js
 * data and fills are normal input for this kind of map !
 * 
 * @param array $data classic input for datamap.
 * @param array $fills classic input for datamap.
 */
{
    var map = new Datamap({
        scope : 'world',
        element: document.getElementById('map-container-collab'),
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                ajaxCallCollab(geography.properties.name);
            })},
        projection: 'mercator',
        fills: fills,
        data : data,
        geographyConfig: {
            popupTemplate: function(geography, data) {
                return ['<div class="hoverinfo">' + geography.properties.name,
                        '<br/>Nb of potential collaborators :' + data.Nbcollab,
                        '<\div>'].join('')
            },
            highlightBorderWidth: 3
        },
        responsive: true,
    }
                         );
    // Pure JavaScript
    window.addEventListener('resize', function() {
        map.resize();
    });
}

/*********************************************************************
**********************************************************************
AJAX CALL
The function below handle the thunmbnail stuff
when clicking on a specific country on the map
**********************************************************************
*********************************************************************/

function  ajaxCallCollab(country)
/**
 * @summary Ajax call to get the recomendation for a specific country.
 *
 * If the call return nothing, handle by DisplayNullColab
 * Else, return a thumbnail of the different potential collaborators
 * 
 * @param str $country coutry clicked.
 **/
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based/_refresh_collab",
        data: {'country': dict_code_country[country]},
        success: function(result) {
            if (jQuery.isEmptyObject(result))
            {
                DisplayNullCollab(country)
            }
            else
            {
                DisplayCollabThumbmail(result,country);
            }
           
        }
            
    });     
}

function CollabDisplay(author)
/**
 * @summary Given a specific author, return a div for one thumbnail.
 *
 * 
 * @param object $author object that handle contribution details.
 */
{
    var div='<div class="col-md-4">'+
        '<div class="thumbnail">'+
        '<div class="caption">'+
        '<h3>' + author['name'] + '</h3>' + 
        '<p> <strong>Inst. </strong>' + author['inst'] + '</p>' +
        '<p> <strong>Confidence: </strong>' + parseFloat(author['score']).toFixed(2) + '</p>'+
        '<p> <strong> Based on his/her contribution untitled: </strong><br>' + author['title'] + '</p>'+
        '<p><a href="'+author['link']+'" class="btn btn-primary btn-block btn-thumbnail" role="button">Abstract</a></p>'+
        '</div>'+
        '</div>'+
        '</div>'
    return div
}

function DisplayCollabThumbmail(result,country)
/**
 * @summary Organize and display all the thumbnail for a specific country.
 *
 * Organize and display all the thumbnail (one for each recommendation author).
 * 
 * @param object $result output of the ajax all for this specific country.
 * @param str $country coutry clicked.
 */
{
    // // empty the element
    $("#thumbmail-collab").empty();
        // // Sucess of the request
    var div = '<div class="alert alert-success">'+
        '<strong> Success! :</strong> '+
        'At least '+ Object.keys(result).length + ' collaborators are waiting for your call in ' + country+
        '</div>';
    $("#thumbmail-collab").append(div);
    // Fill in the thumbnails
    // First sort the results
    var arr = $.map(result,function(obj,idx){return obj}) //Create the array
    var arr = arr.sort(function(a, b) {
        return -(parseFloat(a.score) - parseFloat(b.score));});
    // Next fill in
    arr.forEach(function(author) {
        $("#thumbmail-collab").append(CollabDisplay(author));
    });
    // Some jquery to uniform their sizes
    var maxHeight = 0;			
    $(".thumbnail").each(function(){
        if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
    });			
    $(".thumbnail").height(maxHeight);

}

function DisplayNullCollab(country)
/**
 * @summary Handle the case where no collab is found in a specific country.
 *
 * @param str $country coutry clicked.
 */
{
    $("#thumbmail-collab").empty();
    var div = '<div class="alert alert-info">'+
        '<strong>'+ country +' :</strong> '+
        'The recomendation system did not find any collaborators for you in this country'
        '</div>';
    $("#thumbmail-collab").append(div);
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
            refreshMap(result.data,result.colors)
            refreshMessage(result.nbcollabs)
        }
    });     
}

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
