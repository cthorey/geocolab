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
                                             initThumbnail()
                                             refreshApp()
                                         }
                                         displayBlockMessage(app)
                                     }
                                 })
                             })

}

function initMessage(searchby)
{
    selector = $('#message')
    selector.find("#spin").hide()
    if (searchby == 'byabstract')
    {
        var message = '<strong> Info: </strong> Fill in the form above by picking an author and the '
            +'abstract you want to use to initialize the recomendation engine. When ready, click on the search button.'
    }
    else if (searchby == 'byquery')
    {
        var message = '<strong> Info: </strong> Fill in the form above by providing a query you want to use to initialize the recomendation engine. When ready, click on the search button.'
    }
    selector.find("#info").html(message)
}

function displayBlockMessage(app)
{
    if (app =="schedule") {
        $.ajax({
            dataType:"json",
            url: $SCRIPT_ROOT + "/query_based_journey/_get_nb_results",
            success: function(result) {
                refreshMessage(result.n,result.is_qry,app);
            }
        })}
    else if (app=='collab') {
        $.ajax({
            dataType:"json",
            url: $SCRIPT_ROOT + "/query_based/_get_nb_collabs",
            success: function(result){
                refreshMessage(result.n,result.is_qry,app);
            }
        })}
}

function refreshMessage(nb,is_qry,app)
{
    var selector = $('#message')
    if (!(is_qry))
    {
        var message = '<strong> Warning: </strong> The form above in not properly filled. Make sure to choose an author'+
            ' and an abstract before running the search.'
        selector.find("#info").html(message)
        selector.attr('class','alert alert-warning')
    }
    else if (nb == 0)
    {
        var message = '<strong> Sorry: </strong> we did not find any %s that'+
            ' could potentially match your request. Try with something different.'
        if (app == 'schedule'){
            var message = message.format('contributions')
        } else if (app=='collab'){
            var message = message.format('contributors')
        }
        selector.find("#info").html(message)
        selector.attr('class','alert alert-warning')
    }
    else
    {
        if (app == 'schedule'){
            var message = 'We found %s contributions that '+
                'could interest you during the week. '+
                'Click on each day to get the details.'
        } else if (app=='collab'){
            var message = 'We found %s people with whom you could potentially work.'+
                ' Click on each country to get the details.'
        }
        var message = message.format(nb)
        var content = '<strong> Congratulation. </strong> %s'.format(message)
        selector.attr('class','alert alert-success')
        selector.find("#info").html(content)
    }
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
            $('#search-user').attr('class','fa fa-user')
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
            global:false,
            beforeSend: function(){
                $('#search-user').attr('class','fa fa-spinner fa-spin fa-1x')
            },
            success: function(result)
            {
                selector = $('#fill-abstract')
                selector.empty()
                var query = '<p>%s</p>'.format(result.query)
                selector.html(query)
            },
            complete: function() {
                $('#search-user').attr('class','fa fa-search')
            },
        })
    });}
