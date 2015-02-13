// Wait for Cordova to load

if(typeof device === 'undefined'){
    document.addEventListener("deviceready", onDeviceReady, false);
}else{
    onDeviceReady();
}

// Cordova is ready
//
function onDeviceReady() {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS login_info (id integer primary key not null, pin text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS site_info  (id integer primary key autoincrement, site_name text, account_id text, account_password text, site_url text, notes text, last_access_datetime integer)');
    });
}

function queryInsert(sql, param) {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
    db.transaction(function(tx) {
        // tx.executeSql("INSERT INTO login_info (id, pin) VALUES (?,?)", [1, "0000"], function(tx, res) {
        tx.executeSql(sql, param, function(tx, res) {
            console.log("insertId: " + res.insertId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        }, function(e) {
            console.log("ERROR: " + e.message);
        });
    });
}

function queryUpdate() {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
    db.transaction(function(tx) {
        // tx.executeSql("UPDATE login_info SET pin=? WHERE id=?", ["xxxxx", 1], function(tx, res) {
        tx.executeSql(sql, param, function(tx, res) {
            console.log("updateId: " + res.updateId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        }, function(e) {
            console.log("ERROR: " + e.message);
        });
    });
}
function queryDelete() {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
    db.transaction(function(tx) {
        // tx.executeSql("DELETE FROM login_info WHERE id = ?", [1], function(tx, res) {
        tx.executeSql(sql, param, function(tx, res) {
            console.log("deleteId: " + res.deleteId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        }, function(e) {
            console.log("ERROR: " + e.message);
        });
    });
}
