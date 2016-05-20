function dropdownMenuNav()

{
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
}


function changeNb(nb)
{
    $.post({
        url: $SCRIPT_ROOT + "/_change_nb",
        dataType:"json",
        data: {'nb' : nb},
        success : function (result){
            console.log(result);
        }
    })
}

// autocomplet


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
            $('#select-abstract').empty().prop('disabled', true).selectpicker('refresh')
            $('#button-abstract').prop('disabled',true)
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
    selector = $('#select-abstract')
    selectorabs = $('#fill-abstract')
    selector.prop('disabled', false).selectpicker('refresh');
    selector.empty().selectpicker('refresh');
    var option = '<option> %s </option>'
    if (data.titles.length == 1)
    {
        console.log(option.format(data.titles))
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
    $("#select-abstract").on('changed.bs.select',function()
                             {
                                 $('#button-abstract').prop('disabled',false)
                                 if (suggestion.titles.length==1)
                                 {
                                     abstract = '<p>%s</p>'.format(suggestion.abstracts)
                                 }
                                 else
                                 {
                                     var title = $("#select-abstract").val()
                                     var idx = suggestion.titles.indexOf(title)
                                     var abstract = '<p>%s</p>'.format(suggestion.abstracts[idx])
                                 }
                                 
                                 selector.html(abstract)})
}
