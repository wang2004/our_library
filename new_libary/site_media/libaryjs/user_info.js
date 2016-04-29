function data_to_server()
{
    this.opt  = "";
    this.type = "";
    this.data = "";
    this.proj = "";
    this.version = "";
}

function getUserBooksList(obj, callback) {
	$.ajax({
        type: "GET",
        url: '/getUserBooksList/',
        success:function(response, status){
            if (typeof(callback)!="undefined")
            {
                callback(response, status);
            }
        },
        error:function(xhr, status){
            ;
        },
        complete:function(){
            ;
        }
    });
}

var null_response = "";
function recieveUserBooksList(response, status)
{
    if(response == null_response) return;
    
    var BooksList = eval(response);
    var options = "";
    $("#UserBooksList").find('tbody').html(""); 

    for(var loop = 0; loop < BooksList.length; loop++)
    {       
        options += "<tr>" + 
        "<td text-align='center'>" + BooksList[loop].book_no  + "</td>" +
        "<td class='center'>" + BooksList[loop].book_name + "</td>" +      
        "<td class='center'>" + BooksList[loop].book_type + "</td>" +
        "<td class='center'>" + BooksList[loop].book_introduction + "</td>" + 
        "<td class='center'>" + BooksList[loop].book_state + "</td>" + 
        "<td class='center'>" + BooksList[loop].book_borrower + "</td>" + 
        "<td class='center'>" + BooksList[loop].borrow_endtime + "</td>" +            
        "</tr>";  
    }
    $("#UserBooksList").find('tbody').append(options).trigger("change");
}

$(document).ready(function(){	
	getUserBooksList(this, recieveUserBooksList);
});