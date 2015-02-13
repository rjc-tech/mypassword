/** 詳細画面： 初期化 */
function initSiteDetail() {
	if ($("#detail_type").val() == "create") {
		// 新規作成画面

		$("#btn_area_edit").hide();
		$("#btn_copy_pw").hide();
		$("#btn_copy_id").hide();
	} else if ($("#detail_type").val() == "edit") {
		// サイト情報編集画面

		$("#btn_area_create").hide();

		var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
		db.transaction(function(tx) {
			var param = [];
			param.push($("#site_id").val());
			tx.executeSql("select site_name, account_id, account_password, site_url, notes from site_info where id = ?;", param, function(tx, res) {

				$("#site_name").val(res.rows.item(0).site_name);
				$("#login_id").val(res.rows.item(0).account_id);
				$("#password-pwd").val(res.rows.item(0).account_password);
				$("#password-txt").val(res.rows.item(0).account_password);
				$("#site_url").val(res.rows.item(0).site_url);
				$("#notes").val(res.rows.item(0).notes);
			});
		});

	} else {
		alert("Error: サイトタイプが異常です。");
	}
}

/** 詳細画面：クリックイベント */
$(function() {
	// パスワード コピーボタン
	$("#btn_copy_pw").on("touchend", function(e) {
		copyToClipboard(getPasswordId());
	});
	// パスワード 表示切替ボタン
	$("#btn_view_pw").on("touchend", function(e) {
		changeShowPassword();
	});
	// ログインID コピーボタン
	$("#btn_copy_id").on("touchend", function(e) {
		copyToClipboard('login_id');
	});
	// 更新ボタン
	$("#btn_detail_update").on("touchend", function(e) {
		updateDetail();
	});
	// 削除ボタン
	$("#btn_detail_delete").on("touchend", function(e) {
		deleteDetail();
	});
	// 作成ボタン
	$("#btn_detail_create").on("touchend", function(e) {
		insertDetail();
	});
});
// サイト情報 UPDATE文
const SQL_UPDATE_SITEINFO = "UPDATE site_info SET ";

function addUpdateSql(sql, columnName, param) {

	if (param) {
		if (sql != SQL_UPDATE_SITEINFO) {
			sql = sql + ",";
		}
		sql = sql + columnName + "=" + param;
	}

	return sql;
}


/** 詳細画面：クリップボードにコピー */
function copyToClipboard(id) {
	var obj = document.getElementById(id);
    if (obj.value) {
        window.clipboardManagerCopy(
			obj.value,
			function(r){alert('クリップボードにコピーしました。');}, //成功時
			function(e){alert('コピーに失敗しました。'); alert(e);} //失敗時
        );
    } else {
        alert('コピーするデータがありません。');
    }
}

/** 詳細画面：パスワードをコピー */
function copyPassword() {
	copyToClipboard(getPasswordId());
}

/** 詳細画面：パスワードのID取得 */
function getPasswordId() {
	if ($("#password-txt").css('display') == 'block') {
		return "password-txt";
	} else {
		return "password-pwd";
	}
}

/** 詳細画面：パスワード表示の切り替え */
function changeShowPassword() {
	if ($("#password-txt").css('display') == 'block') {
		$("#password-pwd").val($("#password-txt").val());
		$("#password-txt").hide();
		$("#password-pwd").show();
//		$("#btn_view_pw").attr("src", "images/unmask_pass.png");
	} else {
		$("#password-txt").val($("#password-pwd").val());
		$("#password-pwd").hide();
		$("#password-txt").show();
//		$("#btn_view_pw").attr("src", "images/mask_pass.png");
	}
}

/** 詳細画面：入力された内容でDBを更新する */
function updateDetail() {
	var sql = SQL_UPDATE_SITEINFO;
	var pwId = "$" + getPasswordId();

	if ( ! confirm("入力した内容で更新します。\nよろしいですか？")) {
		alert("更新がキャンセルされました。");
		return;
	}
	alert("更新しました。");
	return;

	// 【更新処理】
	// ログインID
	sql = addUpdateSql(sql, "id",               $("#login_id").val());
	// パスワード
	sql = addUpdateSql(sql, "account_password", $(pwId).val());
	// サイトURL
	sql = addUpdateSql(sql, "site_url",         $("#site_url").val());
	// 備考
	sql = addUpdateSql(sql, "notes",            $("#notes").val());

	queryUpdate(sql, param);
}

/** 詳細画面：入力された内容をDBに登録する */
function insertDetail() {
	var sql = "INSERT INTO site_info (id, site_name, account_id, account_password, site_url, notes, last_access_datetime) " +
			  "VALUES ((SELECT MAX(id) FROM site_info),?,?,?,?,?,datetime('now', 'localtime'))";
	var param = [];
	param.push($("#site_name").val());
	param.push($("#login_id").val());
	param.push($("$" + getPasswordId()).val());
	param.push($("#site_url").val());
	param.push($("#notes").val());

	queryInsert(sql, param);
	alert("サイト情報の登録が完了しました。");
}

/** 詳細画面：選択されたサイト情報を削除する */
function deleteDetail() {
	var sql = "DELETE FROM site_info WHERE account_id = ?";
	var param = [];
	param.push($("#login_id").val());
	queryDelete(sql, param);
}
