function data_to_server()
{
    this.opt  = "";
    this.type = "";
    this.data = "";
    this.proj = "";
    this.version = "";
}

function post_dbdata_to_server(obj, dbstruct, callback, timeout){
    _timeout = (typeof(t)=="undefined")?1000:timeout; 
    $.ajax({
        type: "POST",
        url: '/writedb/',
        timeout:_timeout,
        async: true,
        data: {            
        	bookname: dbstruct.bookname,
        	bookno: dbstruct.bookno,
        	booktype: dbstruct.booktype,
        	buytime: dbstruct.buytime,
        	bookprice: dbstruct.bookprice,
        	bookintroduct: dbstruct.bookintroduct,
        	bookowner: dbstruct.bookowner,        	
        }, 
        beforeSend:function(){
            ;
        },
        success:function(data_to_server, status){
            if (typeof(callback)!="undefined")
            {
                callback(data_to_server, status);
            }
        },
        error:function(xhr,status){
            ;
        },
        complete:function(){
            ;
        }
    });
}

$(document).ready(function(){	
	$("#saveid").click(function(){		
		 if($('#book_no').val() == '' || $('#book_name').val()=='' || $('#book_type').val()=='')
		 {
			 alert("请输入完整的图书信息!!!");	 
			 return;
		 }
		 
		var dbstruct = {
				bookname:$('#book_name').val(),
				bookno:$('#book_no').val(), 
				booktype:$('#book_type').val(), 
				buytime:$('#buy_time').val(), 
				bookprice:$('#book_price').val(),
				bookintroduct:$('#book_introduction').val(), 
				bookowner:$('#book_owner').val(), 				
			}
    		post_dbdata_to_server(this, dbstruct, recv_submitname);    	
    });
});


function setInputDisable()
{
	var inputList = document.getElementsByTagName("input");
	for( var i = 0; i < inputList.length; i++) {		
		inputList[i].readOnly = true;
	}    	
}


function setInputEnable()
{
	var inputList = document.getElementsByTagName("input");
	for( var i = 5; i < inputList.length; i++) {		
		inputList[i].readOnly = false;
	}    	
}

var null_response = "";
function recv_submitname(response, status){
	 /*alert("success");	*/
	 if(response == null_response){return;}
	 var result = eval(response);
	 if(result[0].result == 'success')
	 {
		 alert("入库成功!");	 
	 }
	 setInputDisable();
}



$(document).ready(function(){
    var book_type_list = ['Web开发','程序设计','虚拟化技术','通信技术','敏捷方法','软件工程','其他']; 
    var options = "";
    $("#book_type").html('<option selected>select...</option>').trigger("change"); 

    for(var loop = 0; loop < book_type_list.length; loop++)
    {
        options += "<option>" + book_type_list[loop] + "</option>\n";
    }
    
    $("#book_type").append(options).trigger("change"); 
});


$(document).ready(function(){
    var book_owner_list = ['虚拟化西安开发部','本人','其他']; 
    var options = "";
    $("#book_owner").html('<option selected>select...</option>').trigger("change"); 

    for(var loop = 0; loop < book_owner_list.length; loop++)
    {
        options += "<option>" + book_owner_list[loop] + "</option>\n";
    }
    
    $("#book_owner").append(options).trigger("change"); 
});
