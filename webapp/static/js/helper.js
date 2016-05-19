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
    	onSelect: function (suggestion) {
       	    $('#selection').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
    	},
    	showNoSuggestionNotice: true,
        noSuggestionNotice: 'Sorry, no matching results',
    });
    
}


