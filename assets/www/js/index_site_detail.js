/** 詳細画面： 初期化 */
function initSiteDetail() {
	if ($("#detail_type").val() == "create") {
		// 新規作成画面

		// ボタン 表示／非表示
		$("#btn_area_create").show();
		$("#btn_area_edit").hide();
		$("#btn_copy_pw").hide();
		$("#btn_copy_id").hide();
		$("#password-pwd").show();
		$("#password-txt").hide();

		// 値のクリア
		$("#site_name").val("");
		$("#login_id").val("");
		$("#password-pwd").val("");
		$("#password-txt").val("");
		$("#site_url").val("");
		$("#notes").val("");
	} else if ($("#detail_type").val() == "edit") {
		// サイト情報編集画面

		// ボタン 表示／非表示
		$("#btn_area_create").hide();
		$("#btn_area_edit").show();
		$("#btn_copy_pw").show();
		$("#btn_copy_id").show();
		$("#password-pwd").show();
		$("#password-txt").hide();

		// DBからサイト情報を読み込み
		var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
		db.transaction(function(tx) {
			var param = [];
			param.push($("#site_id").val());
			tx.executeSql("select site_name, account_id, account_password, site_url, notes from site_info where id = ?;", param, function(tx, res) {

				// 取得した値を反映
				$("#site_name").val(res.rows.item(0).site_name);
				$("#login_id").val(res.rows.item(0).account_id);
				$("#password-pwd").val(decode(res.rows.item(0).account_password));
				$("#password-txt").val(decode(res.rows.item(0).account_password));
				$("#site_url").val(res.rows.item(0).site_url);
				$("#notes").val(res.rows.item(0).notes);

				$("#org_site_name").val(res.rows.item(0).site_name);
				$("#org_login_id").val(res.rows.item(0).account_id);
				$("#org_password").val(res.rows.item(0).account_password);
				$("#org_site_url").val(res.rows.item(0).site_url);
				$("#org_notes").val(res.rows.item(0).notes);

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
	// URLを開くボタン
	$("#btn_connect_url").on("touchend", function(e) {
		var url = $("#site_url").val();

		// http始まりではない場合、http://を付与
		if (0 != url.indexOf("http")) {
			url = "http://" + url;
		}
		var win = window.open(encodeURI(url), '_system', 'location=yes');
	});
});

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
		$("#btn_view_pw").removeClass("button widget uib_w_41 d-margins icon remove gray btn_detail")
		$("#btn_view_pw").addClass("button widget uib_w_41 d-margins icon add gray btn_detail")
	} else {
		$("#password-txt").val($("#password-pwd").val());
		$("#password-pwd").hide();
		$("#password-txt").show();
		$("#btn_view_pw").removeClass("button widget uib_w_41 d-margins icon add gray btn_detail")
		$("#btn_view_pw").addClass("button widget uib_w_41 d-margins icon remove gray btn_detail")
	}
}

/** 詳細画面：入力された内容でDBを更新する */
function updateDetail() {
	if (!validateSiteDetail()) {
		return;
	}
	var sql = SQL_UPDATE_SITEINFO;
	var pwId = "#" + getPasswordId();

	if ( ! confirm("入力した内容で更新します。\nよろしいですか？")) {
		alert("更新がキャンセルされました。");
		return;
	}

	var param = [];
	// 【更新処理】
	// サイト名
	if ($("#site_name").val() != $("#org_site_name").val()) {
		sql = sql + 'site_name = ?,';
		param.push($("#site_name").val());
	}

	// ログインID
	if ($("#login_id").val() != $("#org_login_id").val()) {
		sql = sql + "account_id = ?,";
		param.push($("#login_id").val());
	}

	// パスワード
	if ($(pwId).val() != $("#org_password").val()) {
		sql = sql + 'account_password = ?,';
		param.push(encode($(pwId).val()));
	}

	// サイトURL
	if ($("#site_url").val() != $("#org_site_url").val()) {
		sql = sql + 'site_url = ?,';
		param.push($("#site_url").val());
	}

	// 備考
	if ($("#notes").val() != $("#org_notes").val()) {
		sql = sql + 'notes = ?,';
		param.push($("#notes").val());
	}

	// 条件
	sql = sql + "last_access_datetime = datetime('now', 'localtime') where id = ?";
	param.push($("#site_id").val());

	if (!queryUpdate(sql, param)) {
		alert("更新に失敗しました。");
		return;
	}
	alert("更新しました。");

	// サイト一覧画面に遷移
	forwardPage("#site_list");
}
//サイト情報 UPDATE文
const SQL_UPDATE_SITEINFO = "UPDATE site_info SET ";

/** 詳細画面：UPDATE文 パラメータ更新命令を追加 */
function addUpdateSql(sql, columnName, param, arrParam) {

	if (param) {
		if (sql != SQL_UPDATE_SITEINFO) {
			sql = sql + ",";
		}
		sql = sql + columnName + "= ?";
		arrParam.push(param);
	}

	return sql;
}

/** 詳細画面：入力された内容をDBに登録する */
function insertDetail() {
	if (!validateSiteDetail()) {
		return;
	}
	var sql = "INSERT INTO site_info (site_name, account_id, account_password, site_url, notes, last_access_datetime) " +
			  "VALUES (?,?,?,?,?,datetime('now', 'localtime'))";
	var param = [];
	param.push($("#site_name").val());
	param.push($("#login_id").val());
	param.push(encode($("#" + getPasswordId()).val()));
	param.push($("#site_url").val());
	param.push($("#notes").val());


	if (!queryInsert(sql, param)) {
		alert("サイト情報の登録に失敗しました。");
		return;
	}

	alert("サイト情報の登録が完了しました。");

	// サイト一覧画面に遷移
	forwardPage("#site_list");
}

/** 詳細画面：選択されたサイト情報を削除する */
function deleteDetail() {

	if ( ! confirm($("#site_name").val() + "を削除します。\nよろしいですか？")) {
		alert("キャンセルされました。");
		return;
	}

	var sql = "DELETE FROM site_info WHERE id = ?";
	var param = [];
	param.push($("#site_id").val());

	if (!queryDelete(sql, param)) {
		alert("削除に失敗しました。");
		return;
	}
	alert("削除しました。");

	// サイト一覧画面に遷移
	forwardPage("#site_list");
}

/** バリデーション（return true:valid, false:invalid） */
function validateSiteDetail() {
	var exclusionURLCharacters = "\"|<|>|\\[|\\\\|\\]|\\^|`|\\{|\\}";
	// URLの検査（禁止文字の使用有無）
	if ($("#site_url").val().match(exclusionURLCharacters)) {
		alert("URLに使用できない文字が含まれています。");
		return false;
	}
	return true;
};