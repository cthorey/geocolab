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
Events
**********************************************************************
*********************************************************************/

/*********************************************************************
Init message */

function initThumbnail()
{
    $('#thumbnail-container').hide()

}
/**********************************************************************
Refresh on click on changing Nb */

var translation = {'N = 25':25,
                   'N = 50':50,
                   'N = 100':100}
    
function onSelectNb()
{
    $("#select-nb").on('changed.bs.select',function()
                       {
                           var nb = parseInt($(this).val().split('=')[1].trim());
                           changeNb(nb);
                           displayBlockMessage('collab')
                           refreshApp()
                       })
}

/*********************************************************************
**********************************************************************
Block display
**********************************************************************
*********************************************************************/
function refreshApp()
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based/_get_map_spec",
        success: function(result) {
            displayMap(result.data,result.colors,result.nb)
            if (result.nb != 0){
                refreshThumbnail()
            } else {
                $('#thumbnail-container').hide()
            }
        }  
    })    
}

function displayBlockThumbnails(country)
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based/_get_thumbnails",
        data: {'country': dict_code_country[country]},
        global:false,
        beforeSend:function(){
            $('#thumbnail-info').hide()
            $('#thumbnail-spin').show()
            $('#thumbnail-container').show()
        },
        success: function(result) {
            displayThumbnails(result,country)
        },
        complete:function(){
            $('#thumbnail-info').show()
            $('#thumbnail-spin').hide()
        }
    })
}

function refreshThumbnail()
{
    var country = $('#thumbnail-info').find('strong').text()
    var country = country.split(':')[0].trim()
    console.log(country)
    if (country != "")
    {
        displayBlockThumbnails(country)
    }
    else
    {
        $('#thumbnail-container').hide()
    }
    
}


/*********************************************************************
**********************************************************************
Helpers
**********************************************************************
*********************************************************************/


/*********************************************************************
App */

function displayMap(data,fills,nb)
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
    $('#map-container-collab').empty()
    var map = new Datamap({
        scope : 'world',
        element: document.getElementById('map-container-collab'),
        projection: 'mercator',
        fills: fills,
        data : data,
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                if (nb !=0)
                    {
                        displayBlockThumbnails(geography.properties.name);
                    } else {
                        $('#thumbnail-container').hide()}
            })},
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
                         )
    // Pure JavaScript
    window.addEventListener('resize', function() {
        map.resize();})
}


function displayThumbnails(result,country)
{
    if (!(result.is_qry)){
        $("#thumbmail-container").hide();
    } else {
        $('#thumbnail-container').show();
        if ($.isEmptyObject(result.result)){
            DisplayNullCollab(country);
        } else {
            DisplayCollabThumbmail(result.result,country);
        }}
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
        '<p><a target="_blank" href="'+author['link']+'" class="btn btn-primary btn-block btn-thumbnail" role="button">Abstract</a></p>'+
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
        // // Sucess of the request
    var message = '<strong> %s :</strong> %s waiting for your call there.'
    var n = Object.keys(result).length
    if (n ==1)
    {
        var mess = '%s collaborator is '.format(n)
    }
    else
    {
        var mess = '%s collaborators are '.format(n)
    }
    var messfinal = message.format(country,mess)
    $("#thumbnail-info").html(messfinal);
    $("#thumbnail-info").show()
    // Fill in the thumbnails
    $("#thumbnail-body").empty()
    // First sort the results
    var arr = $.map(result,function(obj,idx){return obj}) //Create the array
    var arr = arr.sort(function(a, b) {
        return -(parseFloat(a.score) - parseFloat(b.score));});
    // Next fill in
    arr.forEach(function(author) {
        $("#thumbnail-body").append(CollabDisplay(author));
    });
    $('#thumbnail-body').show()
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
    $('#thumbnail-body').hide()
    message = '<strong> %s :</strong> Nobody for you in this country.'
    var messfinal = message.format(country)
    $("#thumbnail-info").html(messfinal);
    $("#thumbnail-info").show()
}

