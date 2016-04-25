function displayMapCollab(data,fills)
{
    var map = new Datamap({
        scope : 'world',
        element: document.getElementById('map-container-collab'),
        projection: 'mercator',
        height : 500,
        fills: fills,
        data : data,
        geographyConfig: {
            popupTemplate: function(geography, data) {
                return ['<div class="hoverinfo">' + geography.properties.name,
                        '<br/>Nb of potential collaborators :' + data.Nbcollab,
                        '<\div>'].join('')
            },
            highlightBorderWidth: 3
        }
    }
                         );
}



