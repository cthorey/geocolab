function onSearch(app)
{
    $('#search-click').click(function ()
                             {
                                 console.log('click')
                                 search = $('#search').val()
                                 console.log(search)
                                 $.ajax({
                                     dataType:"json",
                                     url: $SCRIPT_ROOT + "/_on_search",
                                     data: {'search': search },
                                     beforeSend: function() {
                                         $('#message').empty()
                                         var waiting = '<div class="text-center">'+
                                             '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'+
                                             '<span class="sr-only"> Loading... </span><br>'+
                                             '</div>'
                                         $('#message').html(waiting)
                                     },
                                     success: function(result)
                                     {
                                         if (app=='schedule')
                                         {
                                             console.log(app)
                                             displayBlockMessage()
                                             day = $(".day.active").text()
                                             displayBlockApp(day)
                                         }
                                         else if (app=="collab")
                                         {
                                             console.log(app)
                                             displayBlockMessage()
                                             refreshMap()
                                             refreshThumbnail()
                                         }                                             
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
    	//callback just to show it's working
        onSearchStart: function () {
            $('#search').empty().prop('disabled', true).selectpicker('refresh')
            $('#button-abstract').prop('disabled',true)
        },
        search: function(event, ui) { 
            $('.spinner').show();
        },
        response: function(event, ui) {
            $('.spinner').hide();
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
