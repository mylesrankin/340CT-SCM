// Initialize the database
var Datastore = require('nedb');
db = new Datastore({ filename: 'db/sales.db', autoload: true });

// Adds a person
exports.addSale = function(item_code, item_name, item_price, qty_sold, total_price, customer_name, cashier_name, sale_date) {

  var sale = {
      'item_code': item_code,
      'item_name': item_name,
      'item_price': item_price,
      'qty_sold': qty_sold,
      'total_price': total_price,
      'customer_name': customer_name,
      'cashier_name': cashier_name,
      'sale_date': sale_date
    };
 
  console.log(sale);

  db.insert(sale, function(err, newDoc) {
    // None
  });
};

// Returns all persons
exports.getSales = function(x) {
  // Get all persons from the database
  db.find({}, function(err, docs) {
    // Execute the parameter function
    x(docs);
  });
}

// Deletes a person
exports.deleteSale = function(id) {
  db.remove({ _id: id }, {}, function(err, numRemoved) {
    // Do nothing
  });
}

exports.getSale = function(id, callback){
  db.find({Sale_code: id}, function(err,docs){
    callback(null, docs);
  });
}
