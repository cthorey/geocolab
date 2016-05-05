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

function initMessageCollab()
{
    displayBlockMessage()
}


/*********************************************************************
Resize map automatically*/

function resizemap(map)
{
    window.addEventListener('resize', function() {
        map.resize();
    });
}

/*********************************************************************
OnClickCountry event*/
function onClickCountry()
{
    map.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
        displayBlockApp(geography.properties.name);
    })
}
/**********************************************************************
Refresh on click on changing Nb */

var translation = {'Use only 25 first recommendations':25,
                   'Use 50 first recommendations':50,
                   'Use 100 first recommendations':100}
    
function onSelectNb()
{
    $("#select-nb").on('changed.bs.select',function()
                       {
                           var nb = $(this).val();
                           changeNb(translation[nb.trim()]);
                           displayBlockMessage()
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
        url: $SCRIPT_ROOT + "/query_based/_get_nb_collabs",
        success: function(result)
        {
            refreshMessageCollab(result.n,result.is_qry)
        }
    })
}

function displayBlockApp(country)
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based/_refresh_collab",
        data: {'country': dict_code_country[country]},
        success: function(result) {
            displayThumbnails(result,country)
        }
    })
}

/*********************************************************************
**********************************************************************
Helpers
**********************************************************************
*********************************************************************/

/*********************************************************************
Message */

function refreshMessageCollab(nb,is_qry)
{
    var selector = $('#messageCollab')
    selector.empty()
    if (!(is_qry))
    {
        var message = 'Type something in the place above'
        var content = '<div class="alert alert-info">'+
            '<strong> Info: </strong> %s'+
            '</div>'
        selector.append(content.format(message))
    }
    else if (nb == 0)
    {
        var message = 'we did not find any potential contributors that'+
            'could potentially match your request. Give us'+
            ' more clues about whom your are looking for'
        var content = '<div class="alert alert-warning">'+
            '<strong> Sorry, </strong> %s'+
            '</div>'
        selector.append(content.format(message))
    }
    else
    {
        var message = 'we found %s collegues which are just waiting '+
            'for your call to work together. '
            'Click on each country to get the details.'
        var message = message.format(nb)
        var content = '<div class="alert alert-success">'+
            '<strong> Congratulations, </strong> %s'+
            '</div>'
        selector.append(content.format(message))
    }
  
}


/*********************************************************************
App */

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
                         )
    return map
}


function displayThumbnails(result,country)
{
    if ($.isEmptyObject(result))
    {
        DisplayNullColab(country)
    }
    else
    {
        DisplayCollabThumbmail(result,country)
    }
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

