function data_to_server()
{
    this.opt  = "";
    this.type = "";
    this.data = "";
    this.proj = "";
    this.version = "";
}

function getBooksList(obj, callback) {
	$.ajax({
        type: "GET",
        url: '/getBooksList/',
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
function recieveBooksList(response, status)
{
    if(response == null_response) return;
    
    var BooksList = eval(response);
    var options = "";
    $("#BooksList").find('tbody').html(""); 

    for(var loop = 0; loop < BooksList.length; loop++)
    {       
        options += "<tr>" + 
        "<td text-align='center'>" + BooksList[loop].book_no  + "</td>" +
        "<td class='center'>" + BooksList[loop].book_name + "</td>" +      
        "<td class='center'>" + BooksList[loop].book_type + "</td>" +
        "<td class='center'>" + BooksList[loop].book_owner + "</td>" +        
        "<td class='center'>" + BooksList[loop].book_introduction + "</td>" + 
        "<td class='center'>" + BooksList[loop].book_state + "</td>" + 
        "<td class='center'>" + BooksList[loop].book_borrower + "</td>" + 
        "<td class='center'>" + BooksList[loop].borrow_endtime + "</td>" +            
        "</tr>";  
    }
    $("#BooksList").find('tbody').append(options).trigger("change");
}

$(document).ready(function(){	
	getBooksList(this, recieveBooksList);
});

