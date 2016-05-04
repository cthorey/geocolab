function refreshTogleNbAbstract()
// Helper to refresh the nb of abstract in the togle
{
    $("#dropdown-nb-abstracts li a").click(function(){
        $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        var nb = $(this).parents('.dropdown').find('.btn').val();
        ajaxCallNbAbstrats(nb);
    });
}

function dropdownMenuNav()

{
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
}

