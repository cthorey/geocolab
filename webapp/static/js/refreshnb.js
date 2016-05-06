
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



