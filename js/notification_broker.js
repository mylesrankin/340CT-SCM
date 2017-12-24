// Initialize the database
var Datastoren = require('nedb');
dbn = new Datastoren({ filename: 'db/notificationLog.db', autoload: true });

// Creates a notification log entry
exports.create = function(notif_type, notif_content) {
  var now = new Date();
  console.log(now);
  now = String(now);
  var notification = {
      'notification_type': notif_type,
      'notification_content': notif_content,
      'notification_datetime': now
    };

  dbn.insert(notification, function(err, newDoc) {
    populateNotificationTable();
  });
};

// Returns all notification log data
exports.getNotificationLog = function(x) {
  dbn.find({}, function(err, docs) {
    x(docs);
  });
}

// Returns all notifications to view
exports.getNoficationLog = function(x) {
  // Get all notifications from the database
  dbs.find({}, function(err, docs) {
    x(docs); // Callback the search result
  });
}

exports.displayUINotification = function(notification, type, divID){
  try{
    var notifDiv = document.getElementById(divID);
  }catch(err){
    console.log(err);
  }
  if (type==='clear'){
    notifDiv.innerHTML = '';
  }else if (type === 'success'){
    notification_broker.create('User_Alert:Success', 'User success occured: <i>' + notification + '</i>');
    notifDiv.innerHTML = '<div class="alert alert-success"><strong>Success! </strong>'+ notification +'</div>';
  }else if (type === 'warning'){
    notification_broker.create('User_Alert:Error', 'User error occured: <i>' + notification + '</i>');
    notifDiv.innerHTML = '<div class="alert alert-warning"><strong>Error: </strong>'+ notification +'</div>';
  }else if (type === 'danger'){
    notification_broker.create('User_Alert:Error', 'Deletion occured: <i>' + notification + '</i>');
    notifDiv.innerHTML = '<div class="alert alert-danger"><strong>Deletion: </strong>'+ notification +'</div>';
  }
      //
    $("#"+divID).fadeTo(2000, 500).slideUp(500, function(){
      $("#"+divID).slideUp(500);
    });
    //
}
