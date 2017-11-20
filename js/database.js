// Initialize the database
var Datastore = require('nedb');
db = new Datastore({ filename: 'db/items.db', autoload: true });

// Adds a person
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
 
  console.log(item);

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
/*
var test2 = '';

function checkItem(ic, callback){  
  db.find({ item_code: ic}, function(err, docs){
    if(err) return callback(err)
    if(docs.length > 0){
      return callback(null, true)
    }else{
      return callback(null, false)
    }
  });

}

ic = String(1)


var test = (checkItem('1', function(err, isItem){
    return(isItem)
}))(); */

exports.getItem = function(id, callback){
  db.find({item_code: id}, function(err,docs){
    callback(null, docs);
  });
}

/*
      if(docs.length > 0){
        callback = true
      }else{
        callback = false
      }




      */