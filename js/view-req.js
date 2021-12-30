let downloadLink ='';

const fetchFromLocalStorage = (LSVariable) => {
  return localStorage.getItem(`${LSVariable}`);
}

const populateInputs = (fields, classSelector) => {
  let i = 0; 

  $(`.${classSelector} input`).each(function (e) {
      const nameAttribute = $(this).attr('name'); 
      $(this).val(fields[nameAttribute]);
  });
}

const setInputsToReadOnly = () => {
  $('input').attr('readonly', true);
  $('textarea').attr('readonly', true);
}

const populateDropdowns = (arr, idSelector) => {
  for(const field of arr){
    $(`#${idSelector}`).append(`<option value="${field}"> ${field} </option>`); 
  }
}

const checkBox = (servicesArr) => {

  for(const service of servicesArr){
    $(`[name='${service}']`).prop('checked', true);
  }
}

const populateFields = (res) => {
    populateInputs(res["Manager Details"], "manager-details"); 
    populateInputs(res["Requestor Details"], "requestor-details"); 
    populateDropdowns(res["Division"], "Division"); 
    populateDropdowns(res["Country"], "Country"); 
    checkBox(res["Access services"]); 

    if(res["Include CSC Data"] != "False"){
      $('#Include-CSC-Data').prop('checked', true);
    }
    $('textarea').val(res["Additional Comments/Purpose"]);
    $('.expirydate').val(res["Access expiry date"])
}

$('#download-link').click(function (e) {
  e.preventDefault();
  window.location.href = downloadLink;
});

const hideButtons = () =>{
  $('#approve-button').css('display', 'none'); 
  $('#reject-button').css('display', 'none'); 
}

const updateProgressBar = (res) => {
  const key = "Administrator Status"; 
  const adminStatus = res[key];
  if(adminStatus == "Pending") return; 

  $(`[name='${key}']`).addClass('blue-background'); 
  hideButtons(); 
}

const checkIfAdmin = (data) => {
  const requestor = data["Requestor Details"]["SESA"]; 
  const loggedInSESA = fetchFromLocalStorage('sesa');
  if(requestor == loggedInSESA){
    hideButtons(); 
  }
}

const readData = () => {
  $('body').css('display', 'none'); 

  const reqBody = {
    "requestAction": "fetchReqData"
  };

  $.ajax({
    type: "POST",
    url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/actions",
    data: JSON.stringify(reqBody),
    success: function (res) {

      const reqno = fetchFromLocalStorage('req no').toUpperCase(); 
      const data = res["message"]["Requests"][reqno]; 

      if ("fileExtension" in data){  // file has been uploaded
          apiCallForDownloadLink(data["fileExtension"])
          $('#download-link').css('display', `block`)
      }
      
      checkIfAdmin(data); 
      updateProgressBar(data); 
      populateFields(data); 
      $('body').css('display', 'block'); 
    }
  })
}

const setAdminStatus = (event) => {
  const reqNo = fetchFromLocalStorage('req no').substring(3); 
  console.log(reqNo)
  const status = event.data.status;

  const reqBody = {
    "requestAction":"changeStatusOfRequests", 
    "req_no" : reqNo, 
    "status_type" : "Administrator Status",
    "status_value" : status
  };

   $.ajax({
      type: "POST",
      url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/actions",
      data: JSON.stringify(reqBody),
      success: function (res) {
        console.log(res);

      }
    })
}

$('#approve-button').on('click', {
  status : "Approved"
}, setAdminStatus); 


$('#reject-button').on('click', {
  status : "Reject"
}, setAdminStatus); 

function apiCallForDownloadLink(fileExtension){
  // console.log(`${getReqNo()}.${fileExtension}`)
  const reqno = fetchFromLocalStorage('req no'); 
  console.log(`${reqno}.${fileExtension}`)
   $.ajax({
       type: "POST", 
       url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/signedurl",
       data: JSON.stringify({
         action : "GetFile", 
         fileName : `${reqno}.${fileExtension}`,
          bucketName : "core-dev-intel-pricing", 
          prefix : "Managers-Approval/"
       }),
       success: function (data) {
         console.log(data)
         downloadLink = data.message
   }})
}


setInputsToReadOnly();
readData();




