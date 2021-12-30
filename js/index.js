import { common_utils } from './commonUtils.js';


const statusColorMap = {
  "Pending": "yellow",
  "Done": "green",
  "Rejected": "red",
  "Approved": "blue"
};


const emptyTableData = () =>  $('#trdata').empty();


const appendToTable = (data) => {
  $.each(data, function (key, val) { // data = all req; key = req no val = reqdata
    let req = val
    let tr = `<tr>`

    $("th").each(function () {
      var heading = $(this).text().trim();

      if (heading.toLowerCase() == ("REQUEST NO".toLowerCase())) {
        tr += `<td><a> ${key}</a></td>`
      }

      else if (heading == "Managers Approval Status" || heading == "Administrator Status") {
        let color = statusColorMap[req[heading]];
        tr += `<td><button class="${color}"> ${req[heading]} </button></td>`;
      }
      else if (heading == "Requestor Name" || heading == "Manager Name") { //manager name - manager -details -> name
        let appendedKey = heading.split(" ")[0] + " Details";
        tr += `<td> ${req[appendedKey]["Name"]} </td>`
      }
      else {
        tr += `<td> ${req[heading] == undefined ? '' : req[heading]} </td>` // value isnt defined yet? leave it blank
      }
    });

    tr += `</tr>`
    $('tbody').append(tr)
  })
}


function readRequests(adminStatus, reqnos) {
  const reqBody = { "requestAction": "fetchReqData" };

  $.ajax({
    type: "POST",
    url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/actions",
    data: JSON.stringify(reqBody),

    success: function (data) {

      let filteredObj = {};

      if (adminStatus == "True") {
        filteredObj = data.message["Requests"];
      }

      else {
        $.each(data.message["Requests"], function (reqno, reqobj) {
          if (reqnos.includes(reqno)) 
            filteredObj[reqno] = reqobj;
        });
      }

      emptyTableData();
      appendToTable(filteredObj);
    }
  });
}

const getEncryptedSESA = () => {
  let EncryptedSESA = window.location.href.split("?")[1].replace("req_sesaid=", "");
  return EncryptedSESA;
}

const redirect = (url) => {
  window.location.href = url;
}

const isValid = () => {
  return (localStorage.getItem('reqnos') != null || 
  localStorage.getItem('adminStatus') == 'True' )&& localStorage.getItem('sesa')!=null;
}


function setDecryptedSESA() {
    const reqFunc = {
      "action": "checkAccess",
      "username": getEncryptedSESA()
    };
    
    $.ajax({
      type: "POST",
      url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/signedurl",
      data: JSON.stringify(reqFunc),

      success: function (data) {
        
        return data["decrypted_sesa"];
      }


    })
   
  }
  

  



const checkAccess = () => {

  if(isValid()){
    // console.log("true")
    const adminStatus = common_utils.getDataFromLocalStorage('admin-status');

    if(adminStatus == 'True') readRequests(adminStatus);
    
    else {
      const reqNos = JSON.parse(localStorage.getItem("reqnos")); 
      readRequests(adminStatus, reqNos); 
    }
     
  }
  // 
  
  
 //
  const reqBody = {
    "action": "checkAccess",
    "username": setDecryptedSESA()
  };

  $.ajax({
    type: "POST",
    url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/signedurl",
    data: JSON.stringify(reqBody),

    success: function (data) {
      // console.log(data)
      if (data.status == "failed") redirect("accessdenied.html");
    
      else {
        const adminStatus = data["admin"];
        const reqNos = data["reqnos"];
        console.log(reqNos)

        localStorage.setItem('sesa' , data["decrypted_sesa"]);
        localStorage.setItem('admin-status' , adminStatus);
        localStorage.setItem("reqnos", JSON.stringify(data["reqnos"]));
        // console.log(localStorage)
        readRequests(adminStatus, reqNos);
      }
    },


    error: function (XMLHttpRequest, textStatus, errorThrown) {
      
      redirect("accessdenied.html");

    }
  });
}

$('body').on('click', 'td a', function (event) {

  let that = event.currentTarget
  let reqNo = $(that).text().trim();
  localStorage.setItem('req no', reqNo);
  common_utils.redirect('view-req.html');
})

checkAccess();