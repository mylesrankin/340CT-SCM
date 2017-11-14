const database = require('./js/database');

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
    
    if(item_code.value && item_name.value && item_price.value && item_arrivalDate.value && item_minRestockQty.value && item_minRestockQty.value && item_qty.value && item_staffCheckName.value){
      successBox.innerHTML = '<div class="alert alert-success"><strong>Success!</strong> New item has been added.</div>';
      errorBox.innerHTML = '';
      database.addItem(item_code.value, item_name.value, item_price.value, item_arrivalDate.value, item_minRestockQty.value, item_minRestockQty.value, item_qty.value, item_staffCheckName.value);
      // reset fields
      item_code.value = '';
      item_name.value = '';
      item_price.value = '';
      item_arrivalDate.value = '';
      item_minRestockQty.value = '';
      item_maxStockQty.value = '';
      item_staffCheckName.value = '';
      item_qty.value = '';
      x.style.display = "none";
      populateTable();
    }else{
      successBox.innerHTML = '';
      errorBox.innerHTML = '<div class="alert alert-warning"><strong>Error:</strong> One or more fields are empty!</div>';
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
      tableBody += '  <td><input type="button" value="Delete" onclick="deleteItem(\'' + items[i]._id + '\')"></td>'
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
