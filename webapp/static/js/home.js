function displayHomeMap()
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/_get_homemap_spec",
        success: function(result) {
            console.log(result.data)
            drawHomeMap(result.data,result.fills)
        }  
    })
    
}

function drawHomeMap(data,fills)
{
    $('#chart1').empty()
    var map = new Datamap({
        scope : 'world',
        element: document.getElementById('chart1'),
        projection: 'mercator',
        fills: fills,
        data : data,
        geographyConfig: {
            popupTemplate: function(geography, data) {
                return ['<div class="hoverinfo"> %s'.format(geography.properties.name),
                        '<br/> Nb. contributors : %s'.format(data.ntotal),
                        '<br/> Main topic : %s'.format(data.section),
                        '<br/> Main inst : %s'.format(data.inst),
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

function displayHomePie()
{
    $.ajax({
        dataType:"json",
        url: $SCRIPT_ROOT + "/_get_homepie_spec",
        success: function(result) {
            drawPie(result.data)
        }  
    })
    
}

function drawPie(data)
{
     var pie = new d3pie(document.getElementById("chart2"), {
         responsive:true,
	 data: {
	     content: data
	 }
     });
}
