

function Deleteuser(key){
     
    $('.row'+key).remove();  
  
}

////////////////////////////////////
fetchACLData()
function fetchACLData(){
  let reqBody = {"requestAction":"fetchACLData"} 

  $.ajax({
      type: "POST",
      url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/actions",
      data: JSON.stringify(reqBody),
    success: function (data) {
      myItems = data['message'];  
      $.each(myItems, function (key, val) {
        
            var  html_content ="";
            html_content += `<tr class="row`+key+`">
                            <td class="has-text-dark"><a href="edit-user.html?id=`+key+`"> <i  class="fa fa-pencil"></i></a> <a onclick="Deleteuser('`+key+`');"> <i class="fa fa-trash"></i></a> </td>
                            <td>`+key+`</td> 
                                             
                            <td>`+val.Name+`</td>
                            <td>`+val["User_Type"]+`</td>
                            `;
        html_content += ` </tr>`;
        $('#trdata').append(html_content);
      });
      console.log(data)
   }
})   
}

