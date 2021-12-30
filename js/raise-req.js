const writeRequests = (data) => {
  const reqBody = {
    "requestAction": "writeRequests",
    "new_request": data
  };

  $.ajax({
    type: "POST",
    url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/actions",
    data: JSON.stringify(reqBody),
    success: function (data) {
      console.log(data);
    }
  })
}

const getSESA = () => {
  return localStorage.getItem('sesa');
}

const autoPopulate = (data, fieldsList, selector) => {
  let i = 0;

  $(`.${selector} input`).each(function (e) {
    $(this).val(data[fieldsList[i++]]);
    $(this).attr('readonly', true);
  });
}

const getIdDetails = () => {
  const SESAID = getSESA();
  const reqBody = { "reqsesaid": SESAID };

  $.ajax({
    type: "POST",
    url: "https://hiq0alqxwh-vpce-08cc10ba4022fe2cc.execute-api.eu-west-1.amazonaws.com/prod/ids-details",
    data: JSON.stringify(reqBody),
    success: function (data) {
      const reqDetails = [
        "req_sesaid", "req_name", "req_designation", "req_businessdiv", "req_businessdiv"
      ];

      autoPopulate(data["userdata"], reqDetails, "requestor-details");

      const managerDetails = [
        "manager_sesaid", "manager_name", "manager_designation", "manager_businessdiv", "manager_ph"
      ];

      autoPopulate(data["userdata"], managerDetails, "manager-details");
    }
  })
}

const writeToS3 = (url, fileData) => {
  console.log("isndei")
  $.ajax({
    type: "PUT",
    url: url,
    data: fileData,
    processData: false,
    contentType: false,
    success: function (data) {
      console.log(data)
    }

  });
  setTimeout(
    function () {
      window.location.href = "pagestatus.html";
    }, 5000);

};

const apiCallToGenerateSignedUrl = (fileName, fileData) => {
  $.ajax({
    type: "POST",
    url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/signedurl",
    headers: { "Content-type": "application/json" },

    data: JSON.stringify({
      action: "PutFile",
      filenames: fileName
    }),

    success: function (data) {

      let url = data.message[fileName];
      writeToS3(url, fileData);
    }
  })
}

const uploadManagersApproval = () => {
  const fileData = $('#fileinput').prop('files')[0];
  const extension = fileData["name"].split(".")[1];
  if (fileData != undefined) {

    $.ajax({
      type: "POST",
      url: "https://e41wdf3mml-vpce-06e2f74570634aea4.execute-api.eu-west-1.amazonaws.com/dev/actions",
      data: JSON.stringify({ "requestAction": "getRequestNo" }),
      success: function (data) {
        const reqNo = data.message;
        const fileName = `REQ${reqNo}.${extension}`;
        apiCallToGenerateSignedUrl(fileName, fileData);
      }
    })
  }

  return extension;
}

const setAccessExpiryDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear() + 1;

  today = yyyy + '-' +  mm + '-' + dd;
  $('#date').val(today);
}

getIdDetails();
setAccessExpiryDate();
/////////////////

function submit() {
  //generate signed url 
  const fileExtension = uploadManagersApproval();


  var reqsesa = $("#reqsesa").val();
  var reqname = $("#reqname").val();
  var rertit = $("#rertit").val();
  var reqbusi = $("#reqbusi").val();
  var reqphon = $("#reqphon").val();

  var mansesa = $("#mansesa").val();
  var manname = $("#manname").val();
  var mantit = $("#mantit").val();
  var manbusi = $("#manbusi").val();
  var manphon = $("#manphon").val();

  var date = $("#date").val();
  var access = $("input[name='access[]']:checked").map(function () { return $(this).val(); }).get();
  var division = $("input[name='division[]']:checked").map(function () { return $(this).val(); }).get();
  var country = $("input[name='country[]']:checked").map(function () { return $(this).val(); }).get();
  var cscdata1 = $("#cscdata").is(":checked");
  if (cscdata1) {
    var cscdata = "True";
  }
  else {
    var cscdata = "False";
  }
  var comments = $("#comments").val();
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();

  if (month.toString().length == 1) {
    month = '0' + month;
  }
  if (day.toString().length == 1) {
    day = '0' + day;
  }

  var dates = year + '-' + month + '-' + day;

  const data = {
    "Requestor Details": {
      "SESA": reqsesa,
      "Name": reqname,
      "Title": rertit,
      "Business Division": reqbusi,
      "Phone": reqphon
    },
    "Manager Details": {
      "SESA": mansesa,
      "Name": manname,
      "Title": mantit,
      "Business Division": manbusi,
      "Phone": manphon
    },
    "Date requested": dates,
    "Managers Approval Status": "Pending",
    "Administrator Status": "Pending",
    "Access services": access,
    "Access expiry date": date,
    "Country": country,
    "Division": division,
    "Include CSC Data": cscdata,
    "Additional Comments/Purpose": comments,
    "fileExtension": fileExtension
  }
  writeRequests(data)
}



