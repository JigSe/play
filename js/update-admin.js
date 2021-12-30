const getInputData = () => {
    console.log("aa")
    var sesaid = $("#sesaid").val();  
    var username = $("#username").val();  
    var user_type = $("#user_type option:selected").val();  
    const data = {
        key : sesaid,
        val : {
            "Name" : username, 
            "User_Type" : user_type,   
        }         
    }
    return data; 
}

const openModal = () =>{
    $('.modal').addClass('is-active')
}

const closeModal = () =>{
    $('.modal').removeClass('is-active')
}

const showModal = () =>{
   alert('successfully updated');
   setTimeout(
    function() {
        window.location.href = "acl-view.html";
    }, 3000);
  
}

const updateAdminAccess = () => {
    const reqBody = {
        data : getInputData(),
        requestAction : "Update Admin"
    }
    $.ajax({
        type: "POST",
        url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/actions",
        data: JSON.stringify(reqBody),
        success: function (data) {
           console.log(data)
           showModal(); 
        }
     })   
}       
   

$('button.update').on('click', updateAdminAccess); 

