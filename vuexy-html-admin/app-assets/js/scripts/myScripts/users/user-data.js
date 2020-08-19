const baseURL = "https://coe-api.azurewebsites.net/api/";
var user_id = "5e8e4bcaa148b90044206526";


// Template POst request Ajax call
var makePostRequest = function(url, data, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'POST',
        url: baseURL + url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};

// Template PUT request Ajax call
var makePutRequest = function(url, data, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'PUT',
        url: baseURL + url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};


// Template Delete request Ajax call
var makeDeleteRequest = function(url, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'DELETE',
        url: baseURL + url,
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};	

// Template GET request Ajax call
var makeGetRequest = function(url, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'GET',
        url: baseURL + url,
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};


// $(document).on('click', '#add_item_button', function() {
    // var JSON_data = {
    //     "Name": null,
    //     "email": null,
    //     "UWID": null,
    //     "profile_imageURL": "",
    //     "verified_user": false
    // }
    // JSON_data.name

    // // delete the head and tail space
    // var expense_description = $('input[name=expense]').val().replace(/(^\s*)|(\s*$)/g, "");
    // JSON_data += '"expense":' + '"' + expense_description + '",';
    // var business_purpose = $('input[name=business]').val().replace(/(^\s*)|(\s*$)/g, "");
    // JSON_data += '"business":' + '"' + business_purpose + '",';
    // var category = $('input[name=category]').val().replace(/(^\s*)|(\s*$)/g, "");
    // JSON_data += '"category":' + '"' + category + '",';

// })

// var editeditems = [];
// ...

// $('#SaveChanges').click(function() {
//     $('.portlet').each(function() {
//         var settings = [];
//         $('.settingInput').each(function() {
//             settings.push({
//                 settingkey: $(this).attr('name'),
//                 settingvalue: $(this).attr('value')
//             });
//         });

//         editeditems.push({
//             itemname: $(this).data('itemname'),
//             settings: settings
//         });
//     });

//     ...
// });

// var requestInfo = [];

$(document).on('click', '#confirm_item', function uploadFiles_without_HTML_FORMS() {
    alert('!!!');
    var formData = new FormData();

    //this is the JSON Object we are sending to the server
    var JSON_toServer = {
        "userID_ref": null, 
        "OrderType": null, 
        "OrderInfo": null,  //this is where we are going to put JSON_OrderInfo_inForm JSON object, but we will convert JSON_OrderInfo_inForm JSON object to string to send to server
        "OrderStatus": null, 
        "ChatInfo": null,
        "assignedTo": null
    }

    var requestInfo = {
        ReimburseFor: $("input[name='myselfOrBehalfRadio']:checked").val(),
        Individual: $("input[name='individual-reimbursed']:checked").val(),
        PaymentMethod: $("input[name='paymentRadio']:checked").val(),
        ExpenseDescription: $("input[name='expense']").val(),
        BusinessPurpose: $("input[name='business']").val(),
        Category: $("select#category option:checked").val(),
        Amount: $("input[name='amount']").val(),
        TaxPaid: $("input[name='taxRadio']").val(),
        BudgetNum: $("select#budgetNum option:checked").val()
    }

    //this is the information, you need to collect from the frontend. Field in the JSON object will be different according to the type of Form user is submitting
    // var JSON_OrderInfo_inForm = {
    //     "ReimburseFor": null,
    //     "Individual": null,
    //     "PaymentMethod": null,
    //     "ExpenseDescription": null,
    //     "BusinessPurpose": null,
    //     "Category": null,
    //     "Amount": null,
    //     "TaxPaid": null,
    //     "BudgetNum": null
    // }

    //lets setup JSON_OrderInfo_inForm JSON Object according to the information from the frontend form --> actual field names varies according to your frontend form
    // JSON_OrderInfo_inForm.ReimburseFor = $("input[name='myselfOrBehalfRadio']:checked").val();
    // JSON_OrderInfo_inForm.Individual = $("input[name='individual-reimbursed']:checked").val();
    // JSON_OrderInfo_inForm.PaymentMethod = $("input[name='paymentRadio']:checked").val();
    // JSON_OrderInfo_inForm.ExpenseDescription = $("input[name='expense']").val();
    // JSON_OrderInfo_inForm.BusinessPurpose = $("input[name='business']").val();
    // JSON_OrderInfo_inForm.Category = $("select#category option:checked").val();
    // JSON_OrderInfo_inForm.Amount = $("input[name='amount']").val();
    // JSON_OrderInfo_inForm.TaxPaid = $("input[name='taxRadio']").val();
    // JSON_OrderInfo_inForm.BudgetNum = $("select#budgetNum option:checked").val();

    //now lets set up the JSON_toServer JSON Object
    JSON_toServer.userID_ref = user_id;  // 5e63127145f8e019d1f26ddc
    JSON_toServer.OrderType = "Test Orderzz_TEST";
    // JSON_toServer.OrderInfo = JSON.stringify(JSON_OrderInfo_inForm);
    // JSON_toServer.OrderInfo = JSON.stringify(requestInfo);
    JSON_toServer.OrderInfo = JSON.stringify(requestInfo);
    // console.log(typeof(requestInfo));
    JSON_toServer.OrderStatus = "Submitted"; //leave this as Submitted, this represent current status of the Order. Example Order Status: Submitted, approved, etc:
    JSON_toServer.ChatInfo = "TEST CHAT INFO"; //leaving this empty since there's no chat when user upload a order first
    JSON_toServer.assignedTo = null; //leaving this as null since there's no one assigned when a user upload/submit a order.


    var fileSelect = document.getElementById("fileField1");
    for(var x = 0; x < fileSelect.files.length; x++) {
        formData.append(fileSelect.files[x].name, fileSelect.files[x]);
    }
    formData.append("files", fileSelect.files[x]); //"files" should stay as it is, becuase this is how server can identify files from the JSON information, when it get this HTTP request"
    
    


    //here we just pass in the JSON object we need to pass to the server. "JSON_body" should stay as it is, becuase this is how server can identify files from the JSON information, when it get this HTTP request
    formData.set("JSON_body", JSON.stringify(JSON_toServer));
    // Http Request  
    var request = new XMLHttpRequest();
    //this function will get the response from the server after we upload the order
    request.onreadystatechange = function() {
        console.log("HERE");
        if (request.readyState == 4) {

            // show it in the console
            const response_obj = JSON.parse(request.response);
            const data_obj = response_obj.data;
            //convert order info to JSON
            const orderInfo_obj = JSON.parse(data_obj.OrderInfo);
            console.log(orderInfo_obj);

            // show it in the summary table
        }
    }
    request.open('POST', baseURL + "uploadOrder");
    request.send(formData);
});

