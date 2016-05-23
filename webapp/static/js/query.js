function onSearch(app)
{
    $('#search-click').click(function ()
                             {
                                 search = $('#search').val()
                                 $.ajax({
                                     dataType:"json",
                                     url: $SCRIPT_ROOT + "/_on_search",
                                     data: {'search': search },
                                     success: function(result)
                                     {
                                         if (app=='schedule')
                                         {
                                             day = $(".day.active").text()
                                             displayBlockApp(day)
                                         }
                                         else if (app=="collab")
                                         {
                                             refreshMap()
                                             refreshThumbnail()
                                         }
                                         displayBlockMessage()
                                     }
                                 })
                             })

}


// Abstract-based recomendation engine

function autocompleteAuthor()
{
    
    $("#autocomplete-author").autocomplete({
    	//lookup: countries,
    	serviceUrl:"_ajaxautocomplete_authors", //tell the script where to send requests
    	type:'POST',
        dataType:'json',
        maxHeight:200,
        minChars:3,
        ajaxSettings:{'global':false},
    	//callback just to show it's working
        onSearchStart: function () {
            $('#search').empty().prop('disabled', true).selectpicker('refresh')
            $('#button-abstract').prop('disabled',true)
            $('#search-user').attr('class','fa fa-spinner fa-spin fa-1x')
        },
        onSearchComplete: function() {
            $('#search-user').attr('class','fa fa-search')
        },
    	onSelect: function (suggestion) {
            chooseabstract(suggestion.data)
            onSelectTitle(suggestion.data)
    	},
    	showNoSuggestionNotice: true,
        noSuggestionNotice: 'Sorry, no matching results',
    });
    
}

function chooseabstract(data)
{
    selector = $('#search')
    selectorabs = $('#fill-abstract')
    selector.prop('disabled', false).selectpicker('refresh');
    selector.empty().selectpicker('refresh');
    var option = '<option> %s </option>'
    if (data.titles.length == 1)
    {
        selector.html(option.format(data.titles)).selectpicker('refresh')
    }
    else if (data.titles.length >1)
    {
        var content = $.map(data.titles, function (title)
                                  {
                                      var t = option.format(title)
                                      return t
                                  })
        selector.html(content).selectpicker('refresh');
    }   
}

function onSelectTitle(suggestion)
{
    selector = $('#fill-abstract')
    selector.empty()
    $("#search").on('changed.bs.select',function()
                             {
                                 $('#button-abstract').prop('disabled',false)
                                 if (suggestion.titles.length==1)
                                 {
                                     var abstract = '<p>%s</p>'.format(suggestion.abstracts)
                                 }
                                 else
                                 {
                                     var title = $("#search").val()
                                     var idx = suggestion.titles.indexOf(title)
                                     var abstract = '<p>%s</p>'.format(suggestion.abstracts[idx])
                                 }
                                 
                                 selector.html(abstract)})
}

// Query-based recomendation engine

function showQuery()
{
    $( "#search" ).change(function() {
        query = $('#search').val()
        $.ajax({
            dataType:"json",
            url: $SCRIPT_ROOT + "/_modified_query",
            data: {'query': query },
            success: function(result)
            {
                console.log(result.query)
                selector = $('#fill-abstract')
                selector.empty()
                var query = '<p>%s</p>'.format(result.query)
                selector.html(query)
            }
        })
    });}
