// Get the country from datamap along with their geocode
var COUNTRIES = Datamap.prototype.worldTopo.objects.world.geometries; 
var dict_code_country = {}
for (var i = 0, n = COUNTRIES.length; i < n; i++) {
    dict_code_country[COUNTRIES[i].properties.name]=COUNTRIES[i].id;
}

// Success ajaxcall
function ListCollab(result)
{
    $("#recomlists").empty();
    var items = [];
    $.each( result, function( key, val ) {
        items.push( "<li id='" + key + "'>"+
                    key + " from the " + val['inst'] + ", " + val['country']+ "<br>"+
                    "Based on his/her abstract untitled: <br> "+
                    val['title'] + "<a href="+val['link']+"> abstract </a>"+
                    "</li>" );
    });
    $("#recomlists").html(items.join(""));
}
    
// Success ajaxcall - thumbmail fashion

function CollabDisplay(author)
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

// Create one div thumbnail 
function DisplayCollabThumbmail(result,country)
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
// Display null message - no collab in this country

function DisplayNullCollab(country)
{
    $("#thumbmail-collab").empty();
    var div = '<div class="alert alert-info">'+
        '<strong>'+ country +' :</strong> '+
        'The recomendation system did not find any collaborators for you in this country'
        '</div>';
    $("#thumbmail-collab").append(div);
}

// ajax call to get the collaborators from a specific country
function  ajaxCallCollab(country)
{
    var query = $('#name-query').attr('placeholder')
    console.log(query)
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/query_based/_refresh_collab",
        data: {'country': dict_code_country[country],'query':query},
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

// Display the map of collaborators
function displayMapCollab(data,fills)
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





