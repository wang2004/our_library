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
        url: '/borrow_modify_db/',
        timeout:_timeout,
        async: true,
        data: {            
        	bookno: dbstruct.bookno,
        	borrower: dbstruct.borrower,
        	borrowtime: dbstruct.borrowtime,
        	shouldbacktime: dbstruct.shouldbacktime,
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
		 if($('#book_no').val() == '' || $('#borrower_name').val()=='' || $('#borrow_time').val()==''|| $('#should_back_time').val()=='')
		 {
			 alert("请输入完整的借阅登记信息!!!");	 
			 return;
		 }
		 
		var dbstruct = {
				bookno:$('#book_no').val(), 
				borrower:$('#borrower_name').val(), 
				borrowtime:$('#borrow_time').val(), 
				shouldbacktime:$('#should_back_time').val(),
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
		 alert("恭喜您，借阅成功！");	 
	 }
	 
	 if(result[0].result == 'error')
	 {
		 alert("对不起，该书已被其他人借用！");	 
	 }
	 
	 setInputDisable();
}


