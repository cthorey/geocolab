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

function ajaxwait()
{
     $(document).ajaxStart(function()
         {
             $('#message').find("#info").hide()
             $('#message').find("#spin").show()
         }
     );
     $(document).ajaxStop(function()
         {
             $('#message').find("#spin").hide()
             $('#message').find("#info").show()
         }
     )
}

