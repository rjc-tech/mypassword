/** 詳細画面： 初期化 */
function initSiteDetail() {
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
		$("#password-txt").hide();
		$("#password-pwd").val($("#password-txt").val());
		$("#password-pwd").show();
		$("#password-btn").attr("src", "images/unmask_pass.png");
	} else {
		$("#password-pwd").hide();
		$("#password-txt").val($("#password-pwd").val());
		$("#password-txt").show();
		$("#password-btn").attr("src", "images/mask_pass.png");
	}
}
