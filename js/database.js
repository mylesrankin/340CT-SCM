// Initialize the database
var Datastore = require('nedb');
db = new Datastore({ filename: 'db/items.db', autoload: true });

// Adds a person
exports.addItem = function(item_code, item_name, item_price, item_arrivalDate, item_minRestockQty, item_minRestockQty, item_qty, item_staffCheckName) {
  
  var item = {
    'item_code': item_code,
    'item_name': item_name,
    'item_price': item_price,
    'item_arrivalDate': item_arrivalDate,
    'item_minRestockQty': item_minRestockQty,
    'item_qty': item_qty,
    'item_minRestockQty': item_minRestockQty,
    'item_staffCheckName': item_staffCheckName
    };
 
  db.insert(item, function(err, newDoc) {
    // None
  });
};

// Returns all persons
exports.getItems = function(x) {

  // Get all persons from the database
  db.find({}, function(err, docs) {

    // Execute the parameter function
    x(docs);
  });
}

// Deletes a person
exports.deleteItem = function(id) {

  db.remove({ _id: id }, {}, function(err, numRemoved) {
    // Do nothing
  });
}


//
