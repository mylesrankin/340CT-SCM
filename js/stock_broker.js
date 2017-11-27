// Initialize the db
var Datastore = require('nedb');
db = new Datastore({ filename: 'db/items.db', autoload: true });

// Adds an individual stock item
exports.addItem = function(item_code, item_name, item_price, item_arrivalDate, item_minRestockQty, item_qty, item_maxStockQty, item_staffCheckName) {
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
  db.insert(item, function(err, newDoc) {
    notification_broker.create('Stock_Broker:Event','New stock item "' + item_name + '" has been added by user'); // Register event notification log
  });
};

// Return all stock item records
exports.getItems = function(x) {
  db.find({}, function(err, docs) {
  //  notification_broker.create('Stock_Broker:Event','User has retrieved all stock records'); // Register event notification log
    x(docs); // Use callback to return record data to main_page.js
  });
}

exports.updateItemStock = function(id, newqty){
  db.update({item_code: id},{$inc: {item_qty: newqty}}, function(err, num){
    notification_broker.create('Stock_Broker:Event','SYSTEM has updated item stock level with ID: ' + id); // Register event notification log
  });
}

// Deletes a stock item from database
exports.deleteItem = function(id) {
  db.remove({ _id: id }, {}, function(err, numRemoved) {
    notification_broker.create('Stock_Broker:Event','User has deleted the item with ID: ' + id); // Register event notification log
  });
}

// Updates a specific item
exports.updateItem = function(item_code, newdata){
  db.update({item_code: item_code}, newdata, function(err,numReplaced){
    notification_broker.create('Stock_Broker:Event','User has updated records of item with ID: ' + item_code); // Register event notification log
  });
}

// Get the records of an individual item
exports.getItem = function(id, callback){
  db.find({item_code: id}, function(err,docs){
    notification_broker.create('Stock_Broker:Event','Uses has retrieved records of item with ID: '+ id ); // Register event notification log
    callback(null, docs);
  });
}
