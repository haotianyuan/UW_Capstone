var itemNum = 1;
var fileNum = 1;
// Store all line items in an array
var lineItems = [];
// Track if this id is deleted
var idFlags = [];
// _id = 0, no such id
idFlags.push(false);
// _id = 1, the initial one
idFlags.push(true);

var budgetIds = [];
budgetIds.push(2);

// <K, V> => <line item id, {total, dollar, percent}>
let budgetMap = new Map();

var defaultMode = false;

var formData = new FormData();
var type = "";
var unit_id = "";
var budgets_database = [];
const baseURL = "https://coe-api.azurewebsites.net/api/";
var user_id = "5e8e45eea148b9004420651f";

/******************************************************* BEGIN: Wizard step control ************************************************/

/*=========================================================================================
    File Name: my-wizard-steps.js
    Description: wizard steps page specific js based on original js file
    ----------------------------------ORIGINAL INFO---------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


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


// Wizard tabs with numbers setup
$(".number-tab-steps").steps({
    headerTag: "h6",
    bodyTag: "fieldset",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    labels: {
        finish: 'Submit'
    },
    onFinished: function (event, currentIndex) {
        alert("Form submitted.");
    }
});

// Wizard tabs with icons setup
$(".icons-tab-steps").steps({
    headerTag: "h6",
    bodyTag: "fieldset",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    labels: {
        finish: 'Submit'
    },
    onFinished: function (event, currentIndex) {
        alert("Form submitted.");
    }
});


// Validate steps wizard

// Show form
var form = $(".steps-validation").show();

$(".steps-validation").steps({
    headerTag: "h6",
    bodyTag: "fieldset",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    labels: {
        finish: 'Submit'
    },
    onStepChanging: function (event, currentIndex, newIndex) {
        // Allways allow previous action even if the current form is not valid!
        if (currentIndex > newIndex) {
            return true;
        }

        // Needed in some cases if the user went back (clean up)
        if (currentIndex < newIndex) {
            // To remove error styles
            form.find(".body:eq(" + newIndex + ") label.error").remove();
            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
        }
        form.validate().settings.ignore = ":disabled,:hidden";
        return form.valid();
    },
    onFinishing: function (event, currentIndex) {
        // form.validate().settings.ignore = ":disabled,:hidden";
        return form.valid();
    },
    onFinished: function (event, currentIndex) {
        alert("Submitted!");
        alert('send data to database');

        submitClicked();
    }
});

// Initialize validation
$(".steps-validation").validate({
    ignore: "input[type=hidden], input[name='split_dollar_input_value_1']", // ignore hidden fields
    errorClass: 'danger',
    successClass: 'success',
    highlight: function (element, errorClass) {
        $(element).removeClass(errorClass);
    },
    unhighlight: function (element, errorClass) {
        $(element).removeClass(errorClass);
    },
    errorPlacement: function (error, element) {
        if (element.hasClass('custom-control-input') || element.parent().hasClass('input-group')) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    },
    rules: {
        name: {
            required: true
        },
        "ship-address": {
            required: true
        },
        "ship-city": {
            required: true
        },
        "ship-state": {
            required: true
        },
        "ship-zip": {
            required: true
        },
        country: {
            required: true
        },
        "vendor-name": {
            required: true
        },
        quantity: {
            required: true
        },
        "unit-price-1": {
            required: true,
            number: true
        },
        budget_num_1: {
            required: true
        }
    },
    messages: {
        budget_num_1: {
            required: "Please choose a budget number"
        }
    }
});

// jQuery.validator.addMethod("sumEqual", function(value, element, params) {
//     return this.optional(element) || value == params[0];
// }, jQuery.validator.format("Please enter the correct value {0}"));


// $( "input[name='split_dollar_input_value_1']" ).rules( "add", {
//     required: true,
//     minlength: 2,
//     sumEqual: 10,
//     messages: {
//       required: "Required input",
//       minlength: jQuery.validator.format("Please, at least {0} characters are necessary"),
//       sumEqual: jQuery.validator.format("Please enter the correct value for {0}")
//     }
// });


// $( "input[name='split_dollar_input_value_1']" ).rules( "add", {
//     required: true
// });




/************************************************ END: Wizard step control *******************************************************/




/**************************************************** BEGIN: Form Control ********************************************************/


/**
 * Get user information and budget information when the page loading
 * Set global variables
 */
window.onload = function() {
    if (window.localStorage.getItem('defaultAddr')) {
        defaultMode = true;
    }
    if (defaultMode) {
        var addrObj = JSON.parse(window.localStorage.getItem('defaultAddr'));
        var addrContent = document.getElementById('addr-content');
        addrContent.appendChild(genAddrLine(addrObj.FullName));
        addrContent.appendChild(genAddrLine(addrObj.AddrLine1));
        addrContent.appendChild(genAddrLine(addrObj.AddrLine2));
        var city = addrObj.AddrCity + ', ' + addrObj.AddrState + ' ' + addrObj.AddrZip;
        addrContent.appendChild(genAddrLine(city));
        addrContent.appendChild(genAddrCountry(addrObj.AddrCountry));
    } else {
        var default_block = document.getElementById('default-block');
        default_block.setAttribute('class', 'hidden');
        var addrInput = document.getElementById('mail-addr');
        addrInput.setAttribute('class', 'visible');
    }
    this.getUserInfo();
    this.getBudgetsInfo();
    // Initialize the budget select box
    var budget_select = this.document.getElementById('init_budget_select_box');
    for (var i = 0; i < this.budgets_database.length; i++) {
        var num = budgets_database[i];
        budget_select.appendChild(addBudgetData(num));
    }
};

$(document).on('change', '#unit_price_1', function() {
    var u = $('#unit_price_1').val();
    var q = $('#quantity_1').val();

    updateLastSplitVal(1, parseFloat(u) * parseFloat(q));
});

$(document).on('change', '#quantity_1', function() {
    var u = $('#unit_price_1').val();
    var q = $('#quantity_1').val();

    updateLastSplitVal(1, parseFloat(u) * parseFloat(q));
});

/**
 * Auto-calculate the last budget split value
 * @param {int} idx the line item index
 * @param {float} amount input amount
 * @param {float} currD input dollar
 * @param {float} currP input percentage
 * @param {boolean} DorP true represent dollar, flase represent percentage
 */

function updateLastSplitVal(idx, amount) {
    var total_pre = amount;
    var presumD = 0;
    var presumP = 0;
    if (budgetMap.has(idx)) {
        total_pre = budgetMap.get(idx).total;
    }
    
    var dollarInputs = document.getElementsByName(`split_dollar_input_value_${idx}`);
    var percInputs = document.getElementsByName(`split_percent_input_value_${idx}`);
    var n = dollarInputs.length;
    if (amount != total_pre) {
        budgetMap.set(idx, {
            total: amount,
            dollar: 0,
            perc: 0
        })
        for (var x = 0; x < n - 1; x++) {
            dollarInputs[x].value = 0;
            percInputs[x].value = 0;
        }
    } else {
        for (var x = 0; x < n - 1; x++) {
            presumD += parseFloat(dollarInputs[x].value);
            presumP += parseFloat(percInputs[x].value);
        }
        budgetMap.set(idx, {
            total: amount,
            dollar: presumD,
            perc: presumP
        });
    }
    
    var lastPerc = percInputs[n - 1];
    var lastDollar = dollarInputs[n - 1];

    lastDollar.value = budgetMap.get(idx).total - budgetMap.get(idx).dollar;
    lastPerc.value = 100 - budgetMap.get(idx).perc;
    
    console.log(budgetMap);
}

function genAddrLine(content) {
    var p = document.createElement('p');
    p.setAttribute('style', 'margin: 0');
    p.innerHTML = content.toUpperCase();
    return p;
}

function genAddrCountry(content) {
    var p = document.createElement('p');
    p.innerHTML = content;
    return p;
}

/**
 * Get the user information from database
 * @param {string} type global variable, track the type (unit or subunit) which will be used in upload route
 * @param {string} unitID global variable, track the unit or subunit id, also need in upload route
 */
function getUserInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("user information is here");
            console.log(data.data);
            var level = data.data.AccessLevel;
            if (level == "Submitter" || level == "Approver") {
                type = "subunit";
                unit_id = data.data.SubUnitID;
            } else if (level == "Fiscal Staff" || level == "Fiscal Administrator") {
                type = "unit";
                unit_id = data.data.UnitID;
            }
            
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("getuserInformation/" + user_id, onSuccess, onFailure);
}

/**
 * Get the budgets information from database
 * @param {array} budgets_database global variable, store all the budget number of this unit or subunit
 */
function getBudgetsInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            for (var i = 0; i < data.data.length; i++) {
                budgets_database.push(data.data[i].budgetNumber);
            }
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("getBudgetsUnderSubUnit/" + unit_id, onSuccess, onFailure);
}


/************ BEGIIN:  Step1 & Step2 *****************/

$(document).on('click', '#use-new-addr', function() {
    var newAddr = document.getElementById('use-new-addr');
    var addrInput = document.getElementById('mail-addr');
    if (newAddr.checked) {
        addrInput.setAttribute('class', 'visible');
    } else {
        addrInput.setAttribute('class', 'hidden');
    }
});


/************ END:  Step1 & Step2 *****************/


/***************** BEGIN: Step3 *******************/

function submitClicked() {
    /** Confirm each line item */
    for (var x = 1; x <= idFlags.length; x++) {
        if (idFlags[x]) {
            confirmItem(x);
        }
    }

    // getUserInfo();
    var formData = new FormData();

    // var itemsCost = 0;
    // for (var i = 0; i < lineItems.length; i++) {
    //     var firstChar = lineItems[i].Amount.charAt(0);
    //     if (firstChar === "$") {
    //         var amountNum = lineItems[i].Amount.substr(1);
    //         itemsCost += parseFloat(amountNum);
    //     } else {
    //         itemsCost += parseFloat(lineItems[i].Amount);
    //     }
    // }

    //this is the JSON Object we are sending to the server
    var JSON_toServer = {
        "userID_ref": null, 
        "OrderType": null, 
        "OrderInfo": null,  //this is where we are going to put JSON_OrderInfo_inForm JSON object, but we will convert JSON_OrderInfo_inForm JSON object to string to send to server
        "OrderStatus": null, 
        "ChatInfo": null,
        "assignedTo": null
    };

    var addrInfo = null;

    if (defaultMode) {
        var useNewAddr = document.getElementById('use-new-addr');
        if (useNewAddr.checked) {
            addrInfo = {
                FullName: document.getElementById('full_name').value,
                AddrLine1: document.getElementById('street_addr_1').value,
                AddrLine2: document.getElementById('street_addr_2').value,
                AddrCity: document.getElementById('addr_city').value,
                AddrState: document.getElementById('addr_state').value,
                AddrZip: document.getElementById('addr_zip').value,
                AddrCountry: document.getElementById('addr_country').value
            };
            var saveAddr = document.getElementById('save-default-addr');
            if (saveAddr.checked) {
                window.localStorage.setItem('defaultAddr', JSON.stringify(addrInfo));
            }
        } else {
            addrInfo = JSON.parse(window.localStorage.getItem('defaultAddr'));
        }
    } else {
        addrInfo = {
            FullName: document.getElementById('full_name').value,
            AddrLine1: document.getElementById('street_addr_1').value,
            AddrLine2: document.getElementById('street_addr_2').value,
            AddrCity: document.getElementById('addr_city').value,
            AddrState: document.getElementById('addr_state').value,
            AddrZip: document.getElementById('addr_zip').value,
            AddrCountry: document.getElementById('addr_country').value
        };
        var saveAddr = document.getElementById('save-default-addr');
        if (saveAddr.checked) {
            window.localStorage.setItem('defaultAddr', JSON.stringify(addrInfo));
        }
    }



    var vendor_info = {
        Name: $("input[name='vendor-name']").val(),
        Email: $("input[name='vendor-email']").val(),
        Phone: $("input[name='vendor-phone']").val(),
        Website: $("input[name='vendor-website']").val()
    };

    var requestInfo = {
        VendorInfo: vendor_info,
        Addr: addrInfo,
        LineItems: lineItems
        // ItemsCost: itemsCost
    };

    //now lets set up the JSON_toServer JSON Object
    JSON_toServer.userID_ref = user_id;  // 5e63127145f8e019d1f26ddc
    JSON_toServer.OrderType = "Purchase Request";
    JSON_toServer.OrderInfo = JSON.stringify(requestInfo);
    // console.log(typeof(requestInfo));
    JSON_toServer.OrderStatus = "Submitted"; //leave this as Submitted, this represent current status of the Order. Example Order Status: Submitted, approved, etc:
    JSON_toServer.ChatInfo = "TEST CHAT INFO"; //leaving this empty since there's no chat when user upload a order first
    JSON_toServer.assignedTo = null; //leaving this as null since there's no one assigned when a user upload/submit a order.

    for (var i = 1; i <= fileNum; i++) {
        var fileSelect = document.getElementById("file_" + i);
        if (fileSelect) {
            for(var x = 0; x < fileSelect.files.length; x++) {
                formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            }
            // "files" should stay as it is, 
            // becuase this is how server can identify files from the JSON information, 
            // when it get this HTTP request
            formData.append("files", fileSelect.files[x]);
        }
    }

    //here we just pass in the JSON object we need to pass to the server. "JSON_body" should stay as it is, becuase this is how server can identify files from the JSON information, when it get this HTTP request
    formData.set("JSON_body", JSON.stringify(JSON_toServer));
    // Http Request  
    var request = new XMLHttpRequest();
    //this function will get the response from the server after we upload the order
    request.onreadystatechange = function() {
        console.log("Request info is here:");
        if (request.readyState == 4) {
            // show it in the console
            const response_obj = JSON.parse(request.response);
            const data_obj = response_obj.data;
            console.log(data_obj);
            //convert order info to JSON
            const requestInfo_obj = JSON.parse(data_obj.OrderInfo);
            console.log(requestInfo_obj);
            sendRequestHistory(data_obj._id, "Submitted");
            window.sessionStorage.setItem('RequestID', data_obj._id);
            window.location.href = "../../../html/ltr/users/user-request-detailpage.html";
        }
    };
    request.open('POST', baseURL + "uploadOrder/" + type + "/" + unit_id);
    request.send(formData);
}

function sendRequestHistory(request_id, actionstr) {
    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: actionstr
    };

    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("update success");
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
}

// $(document).on('change', '#unit_price_1', function() {
//     updateBudgetValueInput(1);
// });

// $(document).on('change', '#split_with_1_1', function() {
//     updateBudgetValueInput(1);
// });

// function updateBudgetValueInput(_id) {
//     var inputBox = document.getElementsByName('split_dollar_input_value_' + _id);
//     if (inputBox.length == 1) {
//         if (inputBox[0].parentElement.parentElement.parentElement.className == "col-md-2 hidden") {
//             inputBox = document.getElementsByName('split_percent_input_value_' + _id);
//             inputBox[0].value = "100";
//         } else {
//             var q = document.getElementById('quantity_' + _id).value;
//             var u = document.getElementById('unit_price_' + _id).value;
//             var amount = q * parseFloat(u);
//             inputBox[0].value = amount;
//         }
//     }
// }

/**
 * BEGIN: Budgets Controller
 * @param _id id for line item, start from 1
 * @param _budget_id id for budget number in this line item, start from 1 
 * For each line item, we may have multiple budget number,
 * so for every budget number and budget button, 
 * they have their unique id
 * button: budget_btn_{line-item-id}_{budget-id}
 * budget number: budget_{line-item-id}_{budget-id}
 */

/**
 * This function just to tie the original button in page
 * Functionality: add more budget numbers
 */
$(document).on('click', '#budget_btn_1_1', function() {
    document.getElementById(`budget_1_${budgetIds[0]-1}`).after(addBudget(1, budgetIds[0]++, false));
});


/** 
 * Core function of budgets controller 
 * @param _id id for line item
 * @param _budget_id id for budget number in this line item
 * @param {boolean} init signal for if this is the original budget number in this line item
 * This function will use to add new budget block in form
 * If this is the initialized budget block for this line item (init == true),
 * the button will be plus button, otherwise the button will be delete button
 */
function addBudget(_id, _budget_id, init) {
    // Make the previous budget active
    if (!init) {
        var dollarValInput = document.getElementById(`split_dollar_input_value_${_id}_${_budget_id-1}`);
        var percentValInput = document.getElementById(`split_percent_input_value_${_id}_${_budget_id-1}`);
        dollarValInput.removeAttribute('disabled');
        percentValInput.removeAttribute('disabled');

        dollarValInput.addEventListener('change', function() {
            updateLastSplitVal(_id, budgetMap.get(_id).total);
        });

        percentValInput.addEventListener('change', function() {
            updateLastSplitVal(_id, budgetMap.get(_id).total);
        });
    }

    if (init) {
        budgetIds.push(2);
    }

    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');
    box.setAttribute('id', 'budget_' + _id + '_' + _budget_id);
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    if (init) {
        first.innerHTML = "<span>Budget Number</span>";
    }

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-2');
    second.appendChild(genBudgetsSelectBox(_id, _budget_id));

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-2');
    var sel2 = document.createElement('select');
    sel2.setAttribute('class', 'custom-select form-control');
    sel2.setAttribute('id', 'split_with_' + _id + '_' + _budget_id);
    sel2.setAttribute('name', 'split_with_' + _id);
    sel2.onclick = function() {
        splitWithChanged(_id, _budget_id);
    };
    var op1 = document.createElement('option');
    op1.setAttribute('value', 'amount');
    op1.innerHTML = "Amount";
    var op2 = document.createElement('option');
    op2.setAttribute('value', 'percentage');
    op2.innerHTML = "Percentage";
    sel2.appendChild(op1);
    sel2.appendChild(op2);
    third.appendChild(sel2);

    var forth = document.createElement('div');
    forth.setAttribute('class', 'col-md-2');
    forth.setAttribute('id', 'split_dollar_input_' + _id + '_' + _budget_id);
    forth.appendChild(inputGroup(_id, _budget_id, true, "$", "dollar"));

    var hiddenForth = document.createElement('div');
    hiddenForth.setAttribute('class', 'col-md-2 hidden');
    hiddenForth.setAttribute('id', 'split_percent_input_' + _id + '_' + _budget_id);
    hiddenForth.appendChild(inputGroup(_id, _budget_id, false, "%", "percent"));

    var fifth = document.createElement('div');
    fifth.setAttribute('class', 'col-md-1');
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    if (init) {
        btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-success');
        btn.setAttribute('id', 'budget_btn_' + _id + '_' + _budget_id);
    } else {
        btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
        btn.setAttribute('id', 'budget_btn_' + _id + '_' + _budget_id);
    }
    
    var icon = document.createElement('i');
    if (init) {
        icon.setAttribute('class', 'feather icon-plus-circle');
    } else {
        icon.setAttribute('class', 'feather icon-x-circle');
    }
    btn.appendChild(icon);
    if (init) {
        btn.onclick = function() {
            console.log(budgetIds);
            document.getElementById(`budget_${_id}_${budgetIds[_id-1]-1}`).after(addBudget(_id, budgetIds[_id - 1]++, false));
        }
    } else {
        btn.onclick = function() {
            document.getElementById('budget_' + _id + '_' + _budget_id).remove();
            updateLastSplitVal(_id, budgetMap.get(_id).total);
            // var budgetsNumArr = document.getElementsByName('budget_num_' + _id);
            // var budgetsLen = budgetsNumArr.length;
            // if (budgetsLen == 1) {
            //     var budgetAmountInput = document.getElementsByName('split_dollar_input_value_' + _id)[0];
            //     var budgetPercentInput = document.getElementsByName('split_percent_input_value_' + _id)[0];
            //     budgetAmountInput.removeAttribute('required');
            //     budgetPercentInput.removeAttribute('required');
            // }
        };
    }
    fifth.appendChild(btn);
    
    row.appendChild(first);
    row.appendChild(second);
    row.appendChild(third);
    row.appendChild(forth);
    row.appendChild(hiddenForth);
    row.appendChild(fifth);
    box.appendChild(row);
    box.appendChild(addBudgetOptions(_id, _budget_id));

    return box;
}

/** 
 * Generate input group with prepend or append label
 * @param _id id for line item
 * @param _budget_id id for budget number in this line item
 * @param {boolean} isPre a mark to indicate need prepend label or append label
 * @param {string} label what's the label is (e.g. "$" or "%")
 * @param {string} name use to set the input id
 * The input group is unique for every budget number, 
 * so we use format split_{dollar-or-percent}_input_value_{line-item-id}_{budget-id} to set input id
 */
function inputGroup(_id, _budget_id, isPre, label, name) {
    var f = document.createElement('fieldset');
    var d = document.createElement('div');
    d.setAttribute('class', 'input-group');

    var sig = document.createElement('div');
    if (isPre) {
        sig.setAttribute('class', 'input-group-prepend');
    } else {
        sig.setAttribute('class', 'input-group-append');
    }
    var s = document.createElement('span');
    s.setAttribute('class', 'input-group-text');
    s.innerHTML = label;
    sig.appendChild(s);

    var i = document.createElement('input');
    i.setAttribute('class', 'form-control');
    i.setAttribute('type', 'text');
    i.setAttribute('id', 'split_' + name + '_input_value_' + _id + '_' + _budget_id);
    i.setAttribute('name', 'split_' + name + '_input_value_' + _id);
    i.setAttribute('disabled', '');

    if (isPre) {
        d.appendChild(sig);
        d.appendChild(i);
    } else {
        d.appendChild(i);
        d.appendChild(sig);
    }

    f.appendChild(d);
    return f;

}

/** 
 * Generate task/option/project options behind each budget number 
 */
function addBudgetOptions(_id, _budget_id) {
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var zero = document.createElement('div');
    zero.setAttribute('class', 'col-md-4');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-1');
    first.appendChild(addNewBudgetInfoCheckbox(_id, _budget_id, 1));

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-1');
    second.appendChild(addNewBudgetInfoCheckbox(_id, _budget_id, 2));

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    third.appendChild(addNewBudgetInfoCheckbox(_id, _budget_id, 3));
    
    row.appendChild(zero);
    row.appendChild(first);
    row.appendChild(addNewBudgetInfoInput(_id, _budget_id, 1));
    row.appendChild(second);
    row.appendChild(addNewBudgetInfoInput(_id, _budget_id, 2));
    row.appendChild(third);
    row.appendChild(addNewBudgetInfoInput(_id, _budget_id, 3));

    return row;
}

/**
 * Add additional information checkboxes for a certain budget number
 * @param {int} _id the line item id
 * @param {int} _budget_id the budget id of this line item
 * @param {int} seq the info sequence of this budget number (1-task, 2-option, 3-project)
 */
function addNewBudgetInfoCheckbox(_id, _budget_id, seq) {
    var list = document.createElement('ul');
    list.setAttribute('class', 'list-unstyled mb-0');
    var bullet = document.createElement('li');
    bullet.setAttribute('class', 'd-inline-block mr-2');
    var f = document.createElement('fieldset');
    var d = document.createElement('div');
    d.setAttribute('class', 'custom-control custom-checkbox');
    var i = document.createElement('input');
    i.setAttribute('type', 'checkbox');
    i.setAttribute('class', 'custom-control-input');
    i.setAttribute('id', 'budget-info-' + _id + '-' + _budget_id + '-' + seq);
    i.onclick = function() {
        toggleInputBox(_id, _budget_id, seq);
    }
    var l = document.createElement('label');
    l.setAttribute('class', 'custom-control-label');
    l.setAttribute('for', 'budget-info-' + _id + '-' + _budget_id + '-' + seq);
    if (seq == 1) {
        l.innerHTML = "Task";
    } else if (seq == 2) {
        l.innerHTML = "Option";
    } else if (seq == 3) {
        l.innerHTML = "Project";
    }
    d.appendChild(i);
    d.appendChild(l);
    f.appendChild(d);
    bullet.appendChild(f);
    list.appendChild(bullet);
    return list;
}

/**
 * Add the budget information input row
 * @param {int} _id 
 * @param {int} _budget_id 
 * @param {int} seq the info sequence of this budget number (1-task, 2-option, 3-project)
 */
function addNewBudgetInfoInput(_id, _budget_id, seq) {
    var div = document.createElement('div');
    if (seq == 1 || seq == 2) {
        div.setAttribute('class', 'col-md-2 hidden');
    } else if (seq == 3) {
        div.setAttribute('class', 'col-md-3 hidden');
    }
    
    div.setAttribute('id', 'budget-info-input-' + _id + '-' + _budget_id + '-' + seq);
    var i = document.createElement('input');
    i.setAttribute('type', 'text');
    i.setAttribute('class', 'form-control');
    i.setAttribute('id', 'budget-info-value-' + _id + '-' + _budget_id + '-' + seq);
    if (seq == 1) {
        i.setAttribute('name', 'budget-task-' + _id);
    } else if (seq == 2) {
        i.setAttribute('name', 'budget-option-' + _id);
    } else if (seq == 3) {
        i.setAttribute('name', 'budget-project-' + _id);
    }
    
    div.appendChild(i);
    return div;
}

/**
 * Determine if the additional budget info input box triggered
 * @param {int} _id 
 * @param {int} _budget_id 
 * @param {int} seq 
 */
function toggleInputBox(_id, _budget_id, seq) {
    var checkbox = document.getElementById('budget-info-' + _id + '-' + _budget_id + '-' + seq);
    var infoInput = document.getElementById('budget-info-input-' + _id + '-' + _budget_id + '-' + seq);
    if (checkbox.checked) {
        if (seq == 1 || seq == 2) {
            infoInput.setAttribute('class', 'col-md-1');
        } else if (seq == 3) {
            infoInput.setAttribute('class', 'col-md-2');
        }
    } else {
        if (seq == 1 || seq == 2) {
            infoInput.setAttribute('class', 'col-md-1 hidden');
        } else if (seq == 3) {
            infoInput.setAttribute('class', 'col-md-2 hidden');
        }
    }
}

/** 
 * Bind to the initialized check box 
 */
$(document).on('click', '#budget-info-1-1-1', function() {
    toggleInputBox(1, 1, 1);
});
$(document).on('click', '#budget-info-1-1-2', function() {
    toggleInputBox(1, 1, 2);
});
$(document).on('click', '#budget-info-1-1-3', function() {
    toggleInputBox(1, 1, 3);
});

/** 
 * Split with amount or percentage controller
 * Use to transfer between split with amount or percentage
 * Each split select box and input value is bound to a single budget number,
 * so we use split_with_{line-item-id}_{budget-id} to set select box id
 * use split_input_with_{line-item-id}_{budget-id} to set user input id
 */
function splitWithChanged(_id, _budget_id) {
    var sel = document.getElementById('split_with_' + _id + '_' + _budget_id);
    var pick = sel.options[sel.selectedIndex].value;
    var dollar = document.getElementById('split_dollar_input_' + _id + '_' + _budget_id);
    var perc = document.getElementById('split_percent_input_' + _id + '_' + _budget_id);
    if (pick == "amount") {
        dollar.setAttribute('class', 'col-md-2 visible');
        perc.setAttribute('class', 'col-md-2 hidden');
    } else if (pick == "percentage") {
        dollar.setAttribute('class', 'col-md-2 hidden');
        perc.setAttribute('class', 'col-md-2 visible');
    }
}

function genBudgetsSelectBox(_id, _budget_id) {
    var sel = document.createElement('select');
    sel.setAttribute('class', 'custom-select form-control');
    sel.setAttribute('name', 'budget_num_' + _id);
    sel.setAttribute('id', 'budget_num_' + _id + '_' + _budget_id);
    sel.setAttribute('required', '');
    sel.appendChild(addBudgetData('0'));
    
    for (var i = 0; i < budgets_database.length; i++) {
        var num = budgets_database[i];
        sel.appendChild(addBudgetData(num));
    }

    return sel;
}


/** 
 * Bind to the initialized select box 
 */
$(document).on('click', '#split_with_1_1', function(){
    splitWithChanged(1, 1);
});

/**
 * Add budget numbers to selected box from database
 */
function addBudgetData(num) {
    var op = document.createElement('option');
    if (num == "0") {
        op.setAttribute('value', '');
        op.innerHTML = "Please select"
    } else {
        op.setAttribute('value', num);
        op.innerHTML = num;
    }
    return op;
}

/**
 * Deprecated
 * Previous options controller
 */
$(document).on('click', '#option_task', function() {
    if ($("#option_task").is(":checked")) {
        $('#task_checked').attr('class', 'col-md-3 visible');
    } else {
        $('#task_checked').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#option_option', function() {
    if ($("#option_option").is(":checked")) {
        $('#option_checked').attr('class', 'col-md-3 visible');
    } else {
        $('#option_checked').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#option_project', function() {
    if ($("#option_project").is(":checked")) {
        $('#project_checked').attr('class', 'col-md-3 visible');
    } else {
        $('#project_checked').attr('class', 'col-md-3 hidden');
    }
});

/** END: Budgets Controller */



/** 
 * BEGIN: New Line Item Controller 
 * @param _id line item id
 * @param _id line item id, assigned by idFlags.length, starts from 1
 *            each time when user add a new line item this _id will increase by 1 
 *            which serves as a unique id for all components inside this line item
 *            when this item (block) is deleted, the corresponding idFlag will turn to false
 * Users can add one more line item by clicking add-new-line-item button
 * This funtion will generate all needed components of each line item,
 * exactly the same as original box,
 * and each component and input value have unique id
 */

/** Core function */
function addNewLineItem(_id) {
    idFlags.push(true);

    var newBox = document.createElement('div');
    newBox.setAttribute('class', 'row d-flex justify-content-center');
    newBox.setAttribute('id', 'lineItemBox_' + _id);

    var newFeild = document.createElement('div');
    newFeild.setAttribute('class', 'col-11');
    newFeild.setAttribute('style', 'margin-top: 1rem; padding-top: 1.5rem; border-top: 1px dashed #d9d9d9;');

    var form = document.createElement('div');
    form.setAttribute('class', 'form form-horizontal');
    
    var formBody = document.createElement('div');
    formBody.setAttribute('class', 'form-body');

    var row = document.createElement('div');
    row.setAttribute('class', 'row');

    // append new line item content
    row.appendChild(addNewExpense(_id));
    row.appendChild(addNewPurpose(_id));
    row.appendChild(addNewCategory(_id));
    row.appendChild(addNewQuantity(_id));
    row.appendChild(addNewUnitPrice(_id));
    row.appendChild(addBudget(_id, 1, true));
    // row.appendChild(addNewConfirmButton(_id));

    formBody.appendChild(row);
    form.appendChild(formBody);
    newFeild.appendChild(form);
    newBox.appendChild(newFeild);
    var end = document.getElementById('new_line_item');
    end.before(newBox);

    // Register change event for quantity and unit price
    var qi = document.getElementById(`quantity_${_id}`);
    var ui = document.getElementById(`unit_price_${_id}`);
    qi.addEventListener('change', function() {
        var u = ui.value;
        var q = qi.value;

        updateLastSplitVal(_id, parseFloat(u) * parseFloat(q));
    });
    ui.addEventListener('change', function() {
        var u = ui.value;
        var q = qi.value;

        updateLastSplitVal(_id, parseFloat(u) * parseFloat(q));
    });

}

/** Bind to the initialized button */
$(document).on('click', '#add_new_line_item', function(){
    // itemNum ++;
    addNewLineItem(idFlags.length);
});



/** Helper Functions */
/** 
 * Add expense block
 * @param {int} _id line item id
 */
function addNewExpense(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Expense Description</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-7');
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'expense_' + _id);
    input.setAttribute('class', 'form-control');
    input.setAttribute('name', 'expense');
    input.setAttribute('placeholder', 'Expense Description');
    second.appendChild(input);

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    var button = document.createElement('button');
    button.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
    button.setAttribute('id', 'delete_' + _id);
    button.setAttribute('type', 'button');
    button.onclick = function() {
        removeLineItem(_id);
    };
    var icon = document.createElement('i');
    icon.setAttribute('class', 'feather icon-x-circle');
    button.appendChild(icon);
    third.appendChild(button);
    
    row.appendChild(first);
    row.appendChild(second);
    row.appendChild(third);
    box.appendChild(row);

    return box; 
}

/**
 * Add business purpose block
 * @param {int} _id 
 */
function addNewPurpose(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Business Purpose</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-7');
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'purpose_' + _id);
    input.setAttribute('class', 'form-control');
    input.setAttribute('name', 'purpose');
    input.setAttribute('placeholder', 'Business Purpose');
    second.appendChild(input);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}

/**
 * Add category block
 * @param {int} _id line item id
 */
function addNewCategory(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Category</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-4');
    var select = document.createElement('select');
    select.setAttribute('class', 'custom-select form-control');
    select.setAttribute('id', 'category_' + _id);
    var option1 = document.createElement('option');
    option1.setAttribute('value', '');
    option1.innerHTML = "Please select";
    select.appendChild(option1);
    second.appendChild(select);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}

/**
 * Add quantity block
 * @param {int} _id line item id
 */
function addNewQuantity(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Quantity</span>";
    
    row.appendChild(first);
    row.appendChild(genNumberInputGroup(_id));
    box.appendChild(row);

    return box; 
}

function genNumberInputGroup(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'input-group bootstrap-touchspin');

    var preSpan = document.createElement('span');
    preSpan.setAttribute('class', 'input-group-btn input-group-prepend bootstrap-touchspin-injected');
    var preBtn = document.createElement('button');
    preBtn.setAttribute('type', 'button');
    preBtn.setAttribute('class', 'btn btn-primary bootstrap-touchspin-down');
    var preIcon = document.createElement('i');
    preIcon.setAttribute('class', 'feather icon-chevron-down');
    preBtn.appendChild(preIcon);
    preSpan.appendChild(preBtn);

    var input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('class', 'touchspin-icon form-control');
    input.setAttribute('value', '1');
    input.setAttribute('id', 'quantity_' + _id);

    var postSpan = document.createElement('span');
    postSpan.setAttribute('class', 'input-group-btn input-group-append bootstrap-touchspin-injected');
    var postBtn = document.createElement('button');
    postBtn.setAttribute('type', 'button');
    postBtn.setAttribute('class', 'btn btn-primary bootstrap-touchspin-up');
    var postIcon = document.createElement('i');
    postIcon.setAttribute('class', 'feather icon-chevron-up');
    postBtn.appendChild(postIcon);
    postSpan.appendChild(postBtn);

    box.appendChild(preSpan);
    box.appendChild(input);
    box.appendChild(postSpan);
    return box;
}

/**
 * Add unit price block
 * @param {int} _id line item id
 */
function addNewUnitPrice(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Unit Price</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-4 col-12 mb-1');
    var fieldset = document.createElement('fieldset');
    var group = document.createElement('div');
    group.setAttribute('class', 'input-group');
    var prepend = document.createElement('div');
    prepend.setAttribute('class', 'input-group-prepend');
    prepend.innerHTML = "<span class='input-group-text'>$</span>";
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'form-control');
    // input.setAttribute('placeholder', '0.00');
    input.setAttribute('aria-label', 'Amount (to the nearest dollar)');
    input.setAttribute('id', 'unit_price_' + _id);
    input.setAttribute('name', 'unit-price-' + _id);
    group.appendChild(prepend);
    group.appendChild(input);
    fieldset.appendChild(group);
    second.appendChild(fieldset);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}

/**
 * Add a new confirm button at the end of each item block
 * @param {int} _id the line item id
 */
function addNewConfirmButton(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-1 offset-md-11');
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-success');
    btn.setAttribute('id', 'confirm_' + _id);
    var i = document.createElement('i');
    i.setAttribute('class', 'fa fa-check');
    btn.appendChild(i);
    btn.onclick = function() {
        // confirmItem(_id);
    }
    first.appendChild(btn);

    row.appendChild(first);
    box.appendChild(row);

    return box; 
}


/**
 * @param {int} _id line item id
 * @param {int} file_id file id in this line item
 * @param {boolean} init indicate if this is the original file input in this line item
 * For now, there is no plus button behind the first file upload input (set it to hidden)
 * Which means users can only upload one file for one line item
 * So when calling this function, file_id will always be 1, init will always be true
 */
function addOneMoreFile(file_id) {
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');
    row.setAttribute('id', 'file_row_' + file_id);

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    // if (init) {
    //     first.innerHTML = "<span>Upload Receipt</span>"
    // }

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-3');
    var file = document.createElement('input');
    file.setAttribute('type', 'file');
    file.setAttribute('name', 'file_input');
    file.setAttribute('id', 'file_' + file_id);
    second.appendChild(file);

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    // if (init) {
    //     btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-success');
    // } else {
    //     btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
    // }
    btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
    btn.setAttribute('id', 'file_btn_' + file_id);

    var icon = document.createElement('i');
    // if (init) {
    //     icon.setAttribute('class', 'feather icon-plus-circle');
    // } else {
    //     icon.setAttribute('class', 'feather icon-x-circle');
    // }
    icon.setAttribute('class', 'feather icon-x-circle');
    btn.appendChild(icon);
    // if (init) {
    //     btn.onclick = function() {
    //         document.getElementById('file_box_' + _id + '_' + file_id).after(addOneMoreFile(_id, file_id + 1, false));
    //     }
    // } else {
    //     btn.onclick = function() {
    //         document.getElementById('file_box_' + _id + '_' + file_id).remove();
    //     };
    // }
    btn.onclick = function() {
        document.getElementById('file_row_' + file_id).remove();
    };
    third.appendChild(btn);

    // var forth = document.createElement('div');
    // forth.setAttribute('class', 'col-md-1 offset-md-3');
    // var confirm_btn = document.createElement('button');
    // confirm_btn.setAttribute('type', 'button');
    // confirm_btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-success');
    // confirm_btn.setAttribute('id', 'confirm_' + _id);
    // var i = document.createElement('i');
    // i.setAttribute('class', 'fa fa-check');
    // confirm_btn.appendChild(i);
    // confirm_btn.onclick = function() {
    //     confirmItem(_id);
    // }
    // forth.appendChild(confirm_btn);

    row.appendChild(first);
    row.appendChild(second);
    row.appendChild(third);
    // row.appendChild(forth);
    return row;
}

/** 
 * Bind initialized add-more-file button 
 */
$(document).on('click', '#file_btn_1_1', function() {
    fileNum ++;
    document.getElementById('file_block').appendChild(addOneMoreFile(fileNum));
});

/** END: New Line Item Controller  */




/** 
 * BEGIN: Confirm & Delete Line Item Controller
 * @param _id line item id
 * @param {array} lineItems global variable, an array to store all line items of this form
 * Add all confirmed items to global variables lineItems array
 * Remove the delete item from global variables lineItems array
 */

/** Confirm function */
function confirmItem(_id) {

    // If this id exists (the item is not deleted)
    if (idFlags[_id]) {

        /** Get budgets info */
        var budgetsNumArr = document.getElementsByName('budget_num_' + _id);
        var tasksArr = document.getElementsByName('budget-task-' + _id);
        var optionsArr = document.getElementsByName('budget-option-' + _id);
        var projectsArr = document.getElementsByName('budget-project-' + _id);
        var budgetsLen = budgetsNumArr.length;

        /** Front-end control */
        // for (var i = 0; i < budgetsLen; i++) {
        //     var budgetId = i + 1;
        //     var btn = document.getElementById('budget_btn_' + _id + '_' + budgetId);
        //     btn.remove();
        // }
        // var checkBtn = document.getElementById('confirm_' + _id);
        // checkBtn.remove();

        
        /** Build budgets array data structure */
        var budgetsArr = [];
        if (budgetsLen == 1) {
            budgetsArr.push({
                Number: budgetsNumArr[0].value,
                Split: "100%",
                Task: tasksArr[0].value,
                Option: optionsArr[0].value,
                Project: projectsArr[0].value
            });
        } else {
            for (var i = 0; i < budgetsLen; i++) {
                var num = budgetsNumArr[i].value;
                var perOrDolSel = document.getElementsByName('split_with_' + _id)[i];
                var perOrDolVal = perOrDolSel.options[perOrDolSel.selectedIndex].value;
                var splitVal = "";
                if (perOrDolVal == "amount") {
                    splitVal = "$" + document.getElementsByName('split_dollar_input_value_' + _id)[i].value;
                } else if (perOrDolVal == "percentage") {
                    splitVal = document.getElementsByName('split_percent_input_value_' + _id)[i].value + "%";
                }
                budgetsArr.push({
                    Number: num,
                    Split: splitVal,
                    Task: tasksArr[i].value,
                    Option: optionsArr[i].value,
                    Project: projectsArr[i].value
                });
            }
        }
        // console.log('budgets array:');
        // console.log(budgetsArr);
        
        var q = document.getElementById('quantity_' + _id).value;
        var u = document.getElementById('unit_price_' + _id).value;
        var amount = q * u;
        
        lineItems.push({
            id: _id,
            Expense: document.getElementById('expense_' + _id).value,
            Purpose: document.getElementById('purpose_' + _id).value,
            Category: document.getElementById('category_' + _id).value,
            Quantity: document.getElementById('quantity_' + _id).value,
            UnitPrice: document.getElementById('unit_price_' + _id).value,
            Budgets: budgetsArr,
            Amount: amount
        });

        // updateSummaryTable();
    }
}

/** Delete function */
function removeLineItem(_id) {
    var box = document.getElementById('lineItemBox_' + _id);
    box.remove();
    idFlags[_id] = false;
    // var summary = document.getElementById('summary_row_' + _id);
    // summary.remove();
    // var n = lineItems.length;
    // for (var i = 0; i < n; i++) {
    //     if (lineItems[i].id == _id) {
    //         lineItems.splice(i, 1);
    //     }
    // }
    // updateSummaryTable();
}

/** Init confirm button */
// $(document).on('click', '#confirm_1', function() {
//     confirmItem(1);
// });

/** Init delete button */
$(document).on('click', '#delete_1', function() {
    removeLineItem(1);
});

/** END: Confirm & Delete Line Item Controller */



/** 
 * BEGIN: Summary Table Display Controller
 * Every time when there is any change in lineItems,
 * this function will be called
 * Specifically, when users click confirm button and delete button
 * The update process are only related to the global variable lineItems
 */

function updateSummaryTable() {
    var len = lineItems.length;
    var itemTable = document.getElementById('summary_tbody');
    itemTable.innerHTML = '';
    for (var i = 0; i < len; i++) {
        var exp = lineItems[i].Expense;
        var pur = lineItems[i].Purpose;
        var cate = lineItems[i].Category;
        var budgetsArr = lineItems[i].Budgets;
        var quan = lineItems[i].Quantity;
        var unitPri = lineItems[i].UnitPrice;
        itemTable.appendChild(genNewLineItemRow(i + 1, exp, pur, cate, quan, unitPri, budgetsArr));
    }
}

/** 
 * Helper function: generate a table cell to display split budget 
 * @param {array} arr the budget number array
 */
function genBudgetsCell(arr) {
    var td = document.createElement('td');
    var n = arr.length;
    if (n == 1) {
        td.innerHTML = arr[0].Number;
        return td;
    }

    for (var i = 0; i < n; i++) {
        var p = document.createElement('p');
        p.setAttribute('style', 'border-bottom: 1px dashed #d9d9d9;');
        p.innerHTML = arr[i].Split + ' on ' + arr[i].Number;
        td.appendChild(p);
    }

    return td;
}

/**
 * Helper function: generate a new item summary row with given parameters
 * @param {int} _id line item id
 * @param {string} Expense content to fill in the expense cell
 * @param {string} Purpose content to fill in the purpose cell
 * @param {string} Category content to fill in the category cell
 * @param {table cell} Budgets a generated table cell which can be added to the table directly
 * @param {string} Amount content to fill in the amount cell
 */
function genNewLineItemRow(_id, Expense, Purpose, Category, Quantity, UnitPrice, Budgets) {

    var _id_td = document.createElement('td');
    _id_td.innerHTML = _id;

    var expense_purpose_td = document.createElement('td');
    var exp = document.createElement('p');
    exp.setAttribute('style', 'margin-bottom: 0;');
    exp.innerHTML = Expense;
    var pur = document.createElement('p');
    pur.setAttribute('style', 'margin-bottom: 0;');
    pur.innerHTML = Purpose;
    expense_purpose_td.appendChild(exp);
    expense_purpose_td.appendChild(pur);

    var category_td = document.createElement('td');
    category_td.innerHTML = Category;

    var quantity_td = document.createElement('td');
    quantity_td.innerHTML = Quantity;

    var price_td = document.createElement('td');
    price_td.innerHTML = UnitPrice;

    var budgets_td = genBudgetsCell(Budgets);

    var receipt_td = document.createElement('td');
    var viewBtn = document.createElement('button');
    var editBtn = document.createElement('button');
    viewBtn.setAttribute('class', 'btn btn-icon btn-flat-success');
    editBtn.setAttribute('class', 'btn btn-icon btn-flat-success');
    var viewIcon = document.createElement('i');
    var editIcon = document.createElement('i');
    viewIcon.className = 'feather icon-file';
    editIcon.className = 'feather icon-edit';
    viewBtn.appendChild(viewIcon);
    editBtn.appendChild(editIcon);
    receipt_td.appendChild(viewBtn);
    receipt_td.appendChild(editBtn);
    // if (Receipt == null) {
    //     receipt_td.appendChild(editBtn);
    // } else {
    //     receipt_td.appendChild(viewBtn);
    //     receipt_td.appendChild(editBtn);
    // }

    // create tr element
    var tr = document.createElement('tr');
    tr.setAttribute('id', 'summary_row_' + _id);
    tr.appendChild(_id_td);
    tr.appendChild(expense_purpose_td);
    tr.appendChild(category_td);
    tr.appendChild(quantity_td);
    tr.appendChild(price_td);
    tr.appendChild(budgets_td);
    tr.appendChild(receipt_td);

    return tr;
}

/** END: Summary Table Display Controller */


/** 
 * Deprecated 
 * File upload template wrote by Kalana
 */
$(document).on('click', '#confirm_item', function() {
    var formData = new FormData();

    var fileSelect = document.getElementById("fileField1");
    for(var x = 0; x < fileSelect.files.length; x++) {
        formData.append(fileSelect.files[x].name, fileSelect.files[x]);
    }
    formData.append("files", fileSelect.files[x]); //"files" should stay as it is, becuase this is how server can identify files from the JSON information, when it get this HTTP request"
    
    //here we just pass in the JSON object we need to pass to the server. "JSON_body" should stay as it is, becuase this is how server can identify files from the JSON information, when it get this HTTP request
    formData.set("JSON_body", JSON.stringify(JSON_toServer));
    
});



/***************************************************** END: Form Control **********************************************************/
