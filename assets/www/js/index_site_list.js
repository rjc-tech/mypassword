/** 一覧画面： 初期化 */
function initSiteList() {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
    db.transaction(function(tx) {
        tx.executeSql("select id, site_name from site_info order by last_access_datetime;", [], function(tx, res) {
            $("#siteList").text("");
            for(var i = 0; i < res.rows.length; i++){
                console.log(res.rows.item(i).id);
                console.log(res.rows.item(i).site_name);

                $("#siteList").append("<li class='widget uib_w_20' data-uib='app_framework/listitem' data-ver='1' ><a href='?id=" + res.rows.item(i).id + "#site_detail'>" + res.rows.item(i).site_name + "</li>");
            }
        });
    });
}
