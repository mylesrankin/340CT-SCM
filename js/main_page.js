// Includes
const stock_broker = require('./js/stock_broker')
const sales_broker = require('./js/sales_broker')
const notification_broker = require('./js/notification_broker')
const { remote } = require('electron')
const path = require('path')
const url = require('url')


// Main event listeners
window.onload = function() {

    // First load debug tools
    document.addEventListener('keydown', function (e) {
    if (e.which === 123) {
        remote.getCurrentWindow().webContents.openDevTools();
      } else if (e.which === 116) {
        location.reload();
      }
    });

    // Populate initial dynamic HTML
    populateItemTable();
  	populateSelectList();
    populateSalesHistoryTable();
    populateNotificationTable();

  	// Set add new sale date input to todays date
  	var sale_date = document.getElementById('ns_sale_date')
	  var today = new Date();
    var dd = today.getDate();
	  var mm = today.getMonth()+1; //January is 0!
  	var yyyy = today.getFullYear();
  	if(dd<10){
  	    dd='0'+dd;
  	} 
  	if(mm<10){
  	    mm='0'+mm;
  	} 

	  var today = yyyy+'-'+mm+'-'+dd;
  	sale_date.value = today

    // NEW SALE ACTION
  document.getElementById('add_ns').addEventListener('click', () => { // New sale broker event listener
    // Grab form inputs
    var ns_item_code = document.getElementById('ns_item_code');
    var ns_item_price = document.getElementById('ns_item_price');
    var ns_qty_sold = document.getElementById('ns_qty_sold');
    var ns_total_price = document.getElementById('ns_total_price');
    var ns_customer_name = document.getElementById('ns_customer_name');
    var ns_cashier_name = document.getElementById('ns_cashier_name');
    var ns_sale_date = document.getElementById('ns_sale_date');

    var ns_notificationBox = document.getElementById('ns_notificationBox');

    // Validate form input
    if(ns_item_code.value && ns_item_price.value && ns_qty_sold.value && ns_total_price.value && ns_customer_name.value && ns_cashier_name.value && ns_sale_date.value){
      console.log('Sale added')
      // Send input to brokers
      sales_broker.addSale(ns_item_code.value, ns_item_price.value, ns_qty_sold.value, ns_total_price.value, ns_customer_name.value, ns_cashier_name.value, ns_sale_date.value);
      notification_broker.displayUINotification('Success! Sale recorded.', 'success', 'ns_notificationBox');

      // Reset input fields
      ns_item_code.value = '';
      ns_item_price.value = '';
      ns_qty_sold.value = '';
      ns_total_price.value = '';
      ns_customer_name.value = '';
      ns_cashier_name.value = '';
      ns_sale_date.value = '';

      // Re populate dynamic content (because it changed after new sale added)
      populateSalesHistoryTable()
    }else{
      notification_broker.displayUINotification('One or more fields are empty!', 'warning', 'ns_notificationBox');
    }

  });

  // STOCK BROKER ACTION
  document.getElementById('add').addEventListener('click', () => { // Bind event listener to new stock addition
    // Grab form inputs
    var item_code = document.getElementById('item_code');
    var item_name = document.getElementById('item_name');
    var item_price = document.getElementById('item_price');
    var item_arrivalDate = document.getElementById('item_arrivalDate');
    var item_minRestockQty = document.getElementById('item_minRestockQty');
    var item_qty = document.getElementById('item_qty');
    var item_maxStockQty = document.getElementById('item_maxStockQty');
    var item_staffCheckName = document.getElementById('item_staffCheckName');
    var errorBox = document.getElementById('errorBox');
    var sucessBox = document.getElementById('successBox');
    var x = document.getElementById("formDiv");

    // Validate
    if(item_code.value && item_name.value && item_price.value && item_arrivalDate.value && item_minRestockQty.value && item_maxStockQty.value && item_qty.value && item_staffCheckName.value){
      errorBox.innerHTML = '';

      stock_broker.getItem(item_code.value, function(err, docs){ // Call stock broker, check if item exists
          if(docs.length>0){
            console.log("Item exists");
            successBox.innerHTML = '';
            errorBox.innerHTML = '<div class="alert alert-warning"><strong>Error!</strong> The item with item_code value:  "'+ item_code.value + '" already exists!</div>';
            $("#errorBox").fadeTo(2000, 500).slideUp(500, function(){
              $("#errorBox").slideUp(500);
            });
          }else{ // Add item if it doesn't exist
            temp_notifcontent = ' New item has "'+ item_code.value + '" been added';
            notification_broker.displayUINotification(temp_notifcontent, 'success', 'successBox');
            stock_broker.addItem(item_code.value, item_name.value, item_price.value, item_arrivalDate.value, item_minRestockQty.value, item_qty.value, item_maxStockQty.value, item_staffCheckName.value);
            $("#successBox").fadeTo(2000, 500).slideUp(500, function(){
              $("#successBox").slideUp(500);
            });
            // reset fields
            item_code.value = '';
            item_name.value = '';
            item_price.value = '';
            item_arrivalDate.value = '';
            item_minRestockQty.value = '';
            item_maxStockQty.value = '';
            item_staffCheckName.value = '';
            item_qty.value = '';
            $('#addnewitem').collapse('hide');
            // Repopulate dynamic content upon new item event
            populateItemTable();
            populateSelectList();
          }
      });

    }else{
      successBox.innerHTML = '';
      notification_broker.displayUINotification('One or more fields are empty!', 'warning', 'errorBox');

    };

  });

  document.getElementById('ns_item_code').addEventListener('change', () => { // Event listener checks for new sale item code input changes
  	var item_code = document.getElementById('ns_item_code')
  	var item_name = document.getElementById('ns_item_name')
  	var item_price = document.getElementById('ns_item_price')
  	
  	stock_broker.getItem(item_code.value, function(err,docs){
  		item_name.value = docs[0].item_name; // find item name and set doc input to this for user
  		item_price.value = docs[0].item_price // set item price in form input
  	});

    });

  document.getElementById('ns_qty_sold').addEventListener('change', () => {
  	var qty_sold = document.getElementById('ns_qty_sold')
  	var item_price = document.getElementById('ns_item_price')
  	var total_price = document.getElementById('ns_total_price')

  	total_price.value = item_price.value * qty_sold.value

  });
}


function updateItem(){
  // Update UI and call broker update on current selected item
	var item_code = document.getElementById('updateitem_code').value;
  var item_name = document.getElementById('updateitem_name').value;
  var item_price = document.getElementById('updateitem_price').value;
  var item_arrivalDate = document.getElementById('updateitem_arrivalDate').value;
  var item_minRestockQty = document.getElementById('updateitem_minRestockQty').value;
  var item_qty = document.getElementById('updateitem_qty').value;
  var item_maxStockQty = document.getElementById('updateitem_maxStockQty').value;
  var item_staffCheckName = document.getElementById('updateitem_staffCheckName').value;

  	var item = {
	    'item_code': item_code,
	    'item_name': item_name,
	    'item_price': item_price,
	    'item_arrivalDate': item_arrivalDate,
	    'item_minRestockQty': item_minRestockQty,
	    'item_qty': item_qty,
	    'item_maxStockQty': item_maxStockQty,
	    'item_staffCheckName': item_staffCheckName
    	};

   	var ic = String(item_code)
    stock_broker.updateItem(ic, item);
    console.log('item updated')
    modalName = '#modal' + item_code
    $(modalName).modal('hide');
    populateItemTable()

}



    var ns_item_code = document.getElementById('ns_item_code');
    var ns_item_price = document.getElementById('ns_item_price');
    var ns_qty_sold = document.getElementById('ns_qty_sold');
    var ns_total_price = document.getElementById('ns_total_price');
    var ns_customer_name = document.getElementById('ns_customer_name');
    var ns_cashier_name = document.getElementById('ns_cashier_name');
    var ns_sale_date = document.getElementById('ns_sale_date');



function populateSalesHistoryTable(){ // Populates dynamic ui content
  // Get all sales
  sales_broker.getSales(function(sales){ // get data
    // Generate the table body
    var tableBody = ''; // table body
    for (i = 0; i < sales.length; i++) { // Loop through data and generate html rows
      tableBody += '<tr>';
      tableBody += '  <td>' + sales[i]._id + '</td>';
      tableBody += '  <td>' + sales[i].item_code + '</td>';
      tableBody += '  <td>' + sales[i].qty_sold + '</td>';
      tableBody += '  <td>' + sales[i].total_price + '</td>';
      tableBody += '  <td>' + sales[i].customer_name + '</td>';
      tableBody += '  <td>' + sales[i].cashier_name + '</td>';
      tableBody += '  <td>' + sales[i].sale_date + '</td>';
      tableBody += '</tr>';
    }

    // Fill the table content
    document.getElementById('salestbody').innerHTML = tableBody
    // Update sales data/displays
    sales_broker.getRevenueTotal(function(t){
      document.getElementById('totalRevenue').innerHTML = 'Total Sales Revenue: £'+t;
    });

  });
}

function populateNotificationTable(){ // Populates dynamic ui content for notifications
  // Get all sales
  notification_broker.getNotificationLog(function(notifLogs){ 
    // Generate the table body
    var tableBody = '';
    for (i = 0; i < notifLogs.length; i++) { // Loop through data and generate html rows
      tableBody += '<tr>';
      tableBody += '  <td>' + notifLogs[i]._id + '</td>';
      tableBody += '  <td>' + notifLogs[i].notification_type + '</td>';
      tableBody += '  <td>' + notifLogs[i].notification_content + '</td>';
      tableBody += '  <td>' + notifLogs[i].notification_datetime + '</td>';
      tableBody += '</tr>';
    }

    // Fill the table content
    document.getElementById('notificationlogstable').innerHTML = tableBody

  });
}

function populateItemTable() { // Populates dynamic ui content for stock items
  // Retrieve the persons
  stock_broker.getItems(function(items) {
    // Generate the table body
    var tableBody = '';
    for (i = 0; i < items.length; i++) { // Loop through data and generate html rows
      var status = 'Normal';
      if(items[i].item_qty<items[i].item_minRestockQty){
        status = 'Stock Low: Restock Needed';
        notification_broker.create('Stock_Level:Event','Stock level is low for item' + items[i].item_code +'/' + items[i].item_name + '. Notify logistics to re-order this stock.')
        // Re-order stock function would go here, see event notification above
      }
      tableBody += '<tr>';
      tableBody += '  <td>' + items[i].item_code + '</td>';
      tableBody += '  <td>' + items[i].item_name + '</td>';
      tableBody += '  <td>' + items[i].item_price + '</td>';
      tableBody += '  <td>' + items[i].item_qty + '</td>';
      tableBody += '  <td>' + items[i].item_arrivalDate + '</td>';
      tableBody += '  <td>' + items[i].item_minRestockQty + '</td>';
      tableBody += '  <td>' + items[i].item_maxStockQty + '</td>';
      tableBody += '  <td>' + status + ' </td>';
      tableBody += '  <td>' + items[i].item_staffCheckName + '</td>';
      tableBody += '  <td><button type="button" class="btn" value="Delete" onclick="deleteItem(\'' + items[i]._id + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</button></td>';
      tableBody += '  <td><button type="button" class="btn" data-toggle="modal" onclick="showUpdate(\'' + items[i].item_code + '\')" data-target="#modal'+ items[i].item_code + '"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Update</button></td>'; 
      tableBody += '  <td><div id="update'+ items[i].item_code +'"></div></td>';
      tableBody += '</tr>';
    }

    // Fill the table content
    document.getElementById('itemtbody').innerHTML = tableBody;
  });
}


function showUpdate(id){ // Shows update ui form when update button is pressed on stock page
	var upd = 'update'+ id
	var mdl = 'modal'+ id
	var updatediv = document.getElementById(upd)
	updatediv.innerHTML += '<td>\
                                  <!-- Trigger the modal with a button -->\
                            \
                            <!-- Modal -->\
                            <div id="modal' + id + '" class="modal fade" role="dialog">\
                              <div class="modal-dialog">\
                                <!-- Modal content-->\
                                <div class="modal-content">\
                                  <div class="modal-header">\
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>\
                                    <h4 class="modal-title">Update Item: ' + id + '</h4>\
                                  </div>\
                                  <div class="modal-body">\
                                  \ <!-- Modal Content --> \
                                  <div id="addnewitem" style="width:100%"> <!-- form div -->\
                                      <div id="errorBox"></h4></div>\
                                    <!-- <div class="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4"> -->\
                                     <div class="panel-body">\
                                     <div id="updatnotification"></div>\
                                        <form role="form">\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_Code</label>\
                                                <input type="number" name="item_code" id="updateitem_code" class="form-control input-sm" placeholder="Item_Code" disabled>\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_Name</label>\
                                                <input type="text" name="item_name" id="updateitem_name" class="form-control input-sm" placeholder="Item_Name">\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_Price</label>\
                                                <input type="number" name="item_price" id="updateitem_price" class="form-control input-sm" placeholder="Item_Price">\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_ArrivalDate</label>\
                                               <input type="date" name="item_arrivalDate" id="updateitem_arrivalDate" class="form-control input-sm" placeholder="Item_ArrivalDate">\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_MinRestockQty</label>\
                                                <input type="number" name="item_minRestockQty" id="updateitem_minRestockQty" class="form-control input-sm" placeholder="Item_MinRestockQty">\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_MaxStockQty</label>\
                                                <input type="number" name="item_maxStockQty" id="updateitem_maxStockQty" class="form-control input-sm" placeholder="Item_MaxStockQty" required="true">\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_StaffCheckName</label>\
                                                <input type="text" name="item_staffCheckName" id="updateitem_staffCheckName" class="form-control input-sm" placeholder="Item_StaffCheckName">\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-4 col-sm-4 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Item_Qty</label>\
                                                <input type="number" name="item_qty" id="updateitem_qty" class="form-control input-sm" placeholder="Item_Qty">\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <input type="button" id="add" value="Update Item" onclick="updateItem()" class="btn btn-info btn-block">\
                                        </form>\
                                      </div>\
                                    <!-- </div> -->\
                                    </div> <!-- end of form div? -->\
                                  </div>\
                                  <div class="modal-footer">\
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                                  </div>\
                                </div>\
                            \
                              </div>\
                            </div>\
                            \
                      </td>';
                      stock_broker.getItem(id, function(err,docs){
                      	document.getElementById('updateitem_code').value = docs[0].item_code
                      	document.getElementById('updateitem_name').value = docs[0].item_name
                      	document.getElementById('updateitem_price').value = docs[0].item_price
                      	document.getElementById('updateitem_arrivalDate').value = docs[0].item_arrivalDate
                      	document.getElementById('updateitem_minRestockQty').value = docs[0].item_minRestockQty
                      	document.getElementById('updateitem_maxStockQty').value = docs[0].item_maxStockQty
                      	document.getElementById('updateitem_staffCheckName').value = docs[0].item_staffCheckName
                      	document.getElementById('updateitem_qty').value = docs[0].item_qty
                      })        
}

// Deletes an item
function deleteItem(id) {

  // Delete the item from the database
  stock_broker.deleteItem(id);
  var notiftemp = 'Item with ID: ' + id + ' has been deleted.';
  notification_broker.displayUINotification(notiftemp, 'danger', 'successBox');
  populateItemTable();
}



function populateSelectList(){ // Populates dynamic select drop down on add sales page
	var selectListHTML = '<option value="" disabled selected> Select an Item_Code </option>';
	stock_broker.getItems(function(items){
		for (i = 0; i < items.length; i++) { // Loop through data and generate html rows
			selectListHTML+= '<option>'+ items[i].item_code +'</option>'
		};
	var selectList = document.getElementById('ns_item_code')
	selectList.innerHTML = selectListHTML;
	});
}

function test(){ // For testing purposes
	console.log("Test");
}