// Get the country from datamap along with their geocode
var COUNTRIES = Datamap.prototype.worldTopo.objects.world.geometries; 
var dict_code_country = {}
for (var i = 0, n = COUNTRIES.length; i < n; i++) {
    dict_code_country[COUNTRIES[i].properties.name]=COUNTRIES[i].id;
}

// ajax call to get the collaborators from a specific country
function  ajaxCallCollab(country)
{
    var query = $("#name-query").text()
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/collab/_refresh_collab",
        data: {'country': dict_code_country[country],'query':query},
        success: function(result) {
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
    map.graticule();
    // Pure JavaScript
    window.addEventListener('resize', function() {
        map.resize();
    });
}






