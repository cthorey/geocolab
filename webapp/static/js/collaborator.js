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
                           displayBlockMessage()
                           refreshMap()
                           refreshThumbnail()
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
            refreshMessage(result.n,result.is_qry)
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
        success: function(result) {
            displayThumbnails(result,country)
        }
    })
}

function refreshMap()
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based/_get_map_spec",
        success: function(result) {
            displayMap(result.data,result.colors)
        }  
    })
    
}

function refreshThumbnail()
{
    var country = $('.info-thumbnail strong').text()
    var country = country.split(':')[0].trim()
    if (country != "")
    {
        displayBlockThumbnails(country)
    }
    
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
    var selector = $('#message')
    if (!(is_qry))
    {

        var message = '<strong> Info: </strong> Fill the form above to initialize the recomendation engine.'
        selector.attr('class', 'alert alert-info');
        $('#message').find('#info').show()
    }
    else if (nb == 0)
    {
        var message = '<strong> Sorry: </strong> we did not find any contributions that'+
            ' could potentially match this abstract. Try with another one.'
        selector.attr('class', 'alert alert-warning');
        selector.find("#info").text(message)
        $('#message').find('#info').show()
    }
    else
    {
        var message = 'We select %s contributions that '+
            'could interest you during the week. '+
            'Click on each day to get the details.'
        var message = message.format(nb)
        var content = '<strong> Looks like a busy AGU for you. </strong> %s'.format(message)
        selector.attr('class', 'alert alert-success');
        selector.find("#info").html(content)
        $('#message').find('#info').show()
    }  
}



/*********************************************************************
App */

function displayMap(data,fills)
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
    console.log(data)
    $('#map-container-collab').empty()
    var map = new Datamap({
        scope : 'world',
        element: document.getElementById('map-container-collab'),
        projection: 'mercator',
        fills: fills,
        data : data,
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                displayBlockThumbnails(geography.properties.name);
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
    if (!(result.is_qry))
    {
        $("#thumbmail-collab").empty()
    }
    else if ($.isEmptyObject(result.result))
    {
        DisplayNullCollab(country)
    }
    else
    {
        DisplayCollabThumbmail(result.result,country)
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
    // // empty the element
    $("#thumbmail-collab").empty();
        // // Sucess of the request
    var div = '<div class="alert alert-info info-thumbnail">'+
        '<strong> %s :</strong> '+
        '%s waiting for your call there.'+
        '</div>';
    var n = Object.keys(result).length
    if (n ==1)
    {
        var mess = '%s collaborator is '.format(n)
    }
    else
    {
        var mess = '%s collaborators are '.format(n)
    }
    var div = div.format(country,mess)
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
    var div = '<div class="alert alert-info info-thumbnail">'+
        '<strong> %s :</strong> '+
        'Nobody for you in this country.'
        '</div>';
    $("#thumbmail-collab").append(div.format(country));
}

