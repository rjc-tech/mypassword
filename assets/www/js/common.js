// Wait for Cordova to load

if(typeof device === 'undefined'){
    document.addEventListener("deviceready", onDeviceReady, false);
}else{
    onDeviceReady();
}

// Cordova is ready
//
function onDeviceReady() {

console.log("■■■■■■■■■■■■■■■1");

  var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypasswordo", 200000);

console.log("■■■■■■■■■■■■■■■2");

  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS login_info (id integer primary key not null, pin text)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS site_info  (id integer not null, site_name text, account_id text, account_password text, site_url text, notes text, last_access_datetime integer)');

console.log("■■■■■■■■■■■■■■■3");

    tx.executeSql("INSERT INTO login_info (id, pin) VALUES (?,?)", [1, "0000"], function(tx, res) {
      console.log("insertId: " + res.insertId + " -- probably 1");
      console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
console.log("■■■■■■■■■■■■■■■4");

      db.transaction(function(tx) {
        tx.executeSql("select pin from login_info;", [], function(tx, res) {
          console.log("res.rows.length: " + res.rows.length + " -- should be 1");
          console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
        });
      });
console.log("■■■■■■■■■■■■■■■5");
    }, function(e) {
      console.log("ERROR: " + e.message);
    });
  });
}