// Sales broker core functionality
// Initialize the db
var Datastores = require('nedb');
dbs = new Datastores({ filename: 'db/sales.db', autoload: true });

// Adds a sale record
exports.addSale = function(ns_item_code, ns_item_price, ns_qty_sold, ns_total_price, ns_customer_name, ns_cashier_name, ns_sale_date) {
  var sale = { // Create sale object entity
      'item_code': ns_item_code,
      'item_price': ns_item_price,
      'qty_sold': ns_qty_sold,
      'total_price': ns_total_price,
      'customer_name': ns_customer_name,
      'cashier_name': ns_cashier_name,
      'sale_date': ns_sale_date
    };
  dbs.insert(sale, function(err, newDoc) {
    stock_broker.updateItemStock(ns_item_code,ns_qty_sold);
    // Register event notification log
    notification_broker.create('Sales_Broker:Event','New sale has been added. A total of '+ ns_qty_sold +' "ITEM_CODE' + ns_item_code + '" have been sold.');
  });
};

// Returns all sales
exports.getSales = function(x) {
  // Get all persons from the database
  dbs.find({}, function(err, docs) {
    // Execute the parameter function
    x(docs);
  });
}

// Calculates total revenue of sales from sales records
exports.getRevenueTotal = function(t){
  exports.getSales(function(sales){
    total = 0
    for (i = 0; i < sales.length; i++){
      total = +total + +sales[i].total_price;
    }
    t(total); // Return total revenue to main_page.js through a callback
  })
}
// Make above function availible simply
exports.getRevenueTotal(function(t){
})


// Other sales broker functionality that was useful for testing 
// but may also be useful for future development

// Deletes a sale
exports.deleteSale = function(id) {
  dbs.remove({ _id: id }, {}, function(err, numRemoved) {
    // Do nothing
  });
}

// Gets record for a single sale
exports.getSale = function(id, callback){
  dbs.find({Sale_code: id}, function(err,docs){
    callback(null, docs);
  });
}
