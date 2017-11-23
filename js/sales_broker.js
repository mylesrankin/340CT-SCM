// Initialize the database
var Datastores = require('nedb');
dbs = new Datastores({ filename: 'db/sales.db', autoload: true });

// Adds a person
exports.addSale = function(ns_item_code, ns_item_price, ns_qty_sold, ns_total_price, ns_customer_name, ns_cashier_name, ns_sale_date) {

  var sale = {
      'item_code': ns_item_code,
      'item_price': ns_item_price,
      'qty_sold': ns_qty_sold,
      'total_price': ns_total_price,
      'customer_name': ns_customer_name,
      'cashier_name': ns_cashier_name,
      'sale_date': ns_sale_date
    };
 
  console.log(sale);

  dbs.insert(sale, function(err, newDoc) {
    // None
  });
};

// Returns all persons
exports.getSales = function(x) {
  // Get all persons from the database
  dbs.find({}, function(err, docs) {
    // Execute the parameter function
    x(docs);
  });
}

// Deletes a person
exports.deleteSale = function(id) {
  dbs.remove({ _id: id }, {}, function(err, numRemoved) {
    // Do nothing
  });
}

exports.getSale = function(id, callback){
  dbs.find({Sale_code: id}, function(err,docs){
    callback(null, docs);
  });
}

exports.getRevenueTotal = function(t){
  exports.getSales(function(sales){
    total = 0
    for (i = 0; i < sales.length; i++){
      total = +total + +sales[i].total_price;
    }
    t(total);
  })
}

exports.getRevenueTotal(function(t){
  console.log(t);
})
