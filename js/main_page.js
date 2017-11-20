const database = require('./js/database');
const { remote } = require('electron')
const path = require('path')
const url = require('url')

window.onload = function() {
  populateTable();

  document.getElementById('add').addEventListener('click', () => {
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

    if(item_code.value && item_name.value && item_price.value && item_arrivalDate.value && item_minRestockQty.value && item_maxStockQty.value && item_qty.value && item_staffCheckName.value){
      errorBox.innerHTML = '';

      database.getItem(item_code.value, function(err, docs){
          if(docs.length>0){
            console.log("exists")
            successBox.innerHTML = '';
            errorBox.innerHTML = '<div class="alert alert-warning"><strong>Error!</strong> The item with item_code value:  "'+ item_code.value + '" already exists!</div>';
            $("#errorBox").fadeTo(2000, 500).slideUp(500, function(){
              $("#errorBox").slideUp(500);
            });
          }else{
            successBox.innerHTML = '<div class="alert alert-success"><strong>Success!</strong> New item has "'+ item_code.value + '" been added.</div>';
            database.addItem(item_code.value, item_name.value, item_price.value, item_arrivalDate.value, item_minRestockQty.value, item_qty.value, item_maxStockQty.value, item_staffCheckName.value);
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
            populateTable();
          }
      });

    }else{
      successBox.innerHTML = '';
      errorBox.innerHTML = '<div class="alert alert-warning"><strong>Error:</strong> One or more fields are empty!</div>';
    }

  });
/*
 document.getElementById('page2').addEventListener('click', () => {
    console.log("Go page2");
    remote.getCurrentWindow().loadURL(url.format({
        pathname: path.join(__dirname, 'page2.html'),
        protocol: 'file:',
        slashes: true
        })
    );
  }); 
*/
  document.addEventListener('keydown', function (e) {
    if (e.which === 123) {
        remote.getCurrentWindow().webContents.openDevTools();
      } else if (e.which === 116) {
        location.reload();
      }
    });
}

function populateTable() {
  // Retrieve the persons
  database.getItems(function(items) {
    // Generate the table body
    var tableBody = '';
    for (i = 0; i < items.length; i++) {
      var status = 'Normal';
      if(items[i].item_qty<items[i].item_minRestockQty){
        status = 'Stock Low: Restock Needed';
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
      tableBody += '  <td><button type="button" class="btn" value="Delete" onclick="deleteItem(\'' + items[i]._id + '\')">Delete</button></td>';
      tableBody += '  <td>\
                                  <!-- Trigger the modal with a button -->\
                            <button type="button" class="btn" data-toggle="modal" data-target="#'+ items[i].item_name + '">Update</button>\
                            \
                            <!-- Modal -->\
                            <div id="'+ items[i].item_name + '" class="modal fade" role="dialog">\
                              <div class="modal-dialog">\
                            \
                                <!-- Modal content-->\
                                <div class="modal-content">\
                                  <div class="modal-header">\
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>\
                                    <h4 class="modal-title">Update Item: ' + items[i].item_name + '</h4>\
                                  </div>\
                                  <div class="modal-body">\
                                  \ <!-- Modal Content --> \
                                  <div id="addnewitem" style="width:100%"> <!-- form div -->\
                                      <div id="errorBox"></h4></div>\
                                    <!-- <div class="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4"> -->\
                                     <div class="panel-body">\
                                        <form role="form">\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                                <input type="number" name="item_code" id="1item_code" class="form-control input-sm" placeholder="Item_Code" value="' + items[i].item_code + '">\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                                <input type="text" name="item_name" id="1item_name" class="form-control input-sm" placeholder="Item_Name" value="' + items[i].item_name + '">\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                                <input type="number" name="item_price" id="1item_price" class="form-control input-sm" placeholder="Item_Price" value="' + items[i].item_price + '">\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                               <input type="date" name="item_arrivalDate" id="item_arrivalDate" class="form-control input-sm" placeholder="Item_ArrivalDate" value="' + items[i].item_arrivalDate + '">\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                                <input type="number" name="item_minRestockQty" id="1item_minRestockQty" class="form-control input-sm" placeholder="Item_MinRestockQty" value="' + items[i].item_minRestockQty + '">\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                                <input type="number" name="item_maxStockQty" id="item_maxStockQty" class="form-control input-sm" placeholder="Item_MaxStockQty" required="true" value="' + items[i].item_maxStockQty + '">\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <div class="row">\
                                            <div class="col-xs-6 col-sm-6 col-md-6">\
                                              <div class="form-group">\
                                                <input type="text" name="item_staffCheckName" id="item_staffCheckName" class="form-control input-sm" placeholder="Item_StaffCheckName" value="' + items[i].item_staffCheckName + '">\
                                              </div>\
                                            </div>\
                                            <div class="col-xs-4 col-sm-4 col-md-6">\
                                              <div class="form-group">\
                                              <label for="item_qty">Email address</label>\
                                                <input type="number" name="item_qty" id="item_qty" class="form-control input-sm" placeholder="Item_Qty" value="' + items[i].item_qty + '" required>\
                                              </div>\
                                            </div>\
                                          </div>\
                                          <input type="button" id="add2" value="Update Item" class="btn btn-info btn-block">\
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
      tableBody += '</tr>';
    }

    // Fill the table content
    document.getElementById('itemtbody').innerHTML = tableBody;
  });
}

// Deletes a person
function deleteItem(id) {

  // Delete the person from the database
  database.deleteItem(id);

  // Repopulate the table
  populateTable();
}
