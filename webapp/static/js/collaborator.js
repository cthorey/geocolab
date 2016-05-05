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
        '<strong> %s :</strong> '+
        'We found at least %s collaborators which are waiting for your call there.'+
        '</div>';
    $("#thumbmail-collab").append(div.format(country,Object.keys(result).length));
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
        '<strong> %s :</strong> '+
        'We did not find any collaborators for you in this country. Try to increase Nb if you really need to work with someone there.'
        '</div>';
    $("#thumbmail-collab").append(div.format(country));
}

