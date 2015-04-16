/** 画面状態：未定義 */
var PAGE_STATUS_UNDEFINED = -1;
/** 画面状態：サインアップ（初回登録） */
var PAGE_STATUS_SING_UP = 1;
/** 画面状態：サインイン */
var PAGE_STATUS_SING_IN = 2;
/** 画面状態：PINコード変更 */
var PAGE_STATUS_PIN_UPDATE = 3;

var PIN_CONF = "PINコードを確認します。再入力してください";
var PIN_ERROR = "PINコードが違います。再入力してください";
var PIN_ERROR_CONF = "PINコードが一致しません。再入力してください";
var PIN_UPDATE = "新しいPINコードを入力してください";

var pageStatus = PAGE_STATUS_UNDEFINED;
var pinValues = [];
var pinNo = ""; //PINコード文字列
var registPinNo = ""; // PINコード（初回登録・更新用）
var oldPinNo = ""; //旧PINコード（更新用）

(function()
{
 "use strict";
 /*
   hook up event handlers
 */
 function register_event_handlers()
 {

	$("#btn_pin_update").on("click", function(){
		alert(1);
		pageStatus = PAGE_STATUS_PIN_UPDATE;
	});
 }
 $(document).ready(register_event_handlers);





})();


/*************************************************
**  表示情報修正
**************************************************/
function chgDispValue(btnNo){

	//値の設定確認
	if(btnNo == "BS"){
		pinValues.pop(btnNo);
	}else{
		pinValues.push(btnNo);
	}

	chgDispRef();

	// PINコードに4桁入力された場合
	if(pinValues.length > 3){

		if (pageStatus == PAGE_STATUS_UNDEFINED) {
			if (isFirstTime()) {
				pageStatus = PAGE_STATUS_SING_UP;
			} else {
				pageStatus = PAGE_STATUS_SING_IN;
			}
		}

		if (pageStatus == PAGE_STATUS_SING_UP) {
			// サインアップ
			singUp();
		} else if (pageStatus == PAGE_STATUS_SING_IN) {
			// サインイン
			singIn();
		} else if (pageStatus == PAGE_STATUS_PIN_UPDATE) {
			// PINコード変更
			pinUpdate();
		}
	}
}

/*************************************************
**  サインアップ（初回サインイン）
**************************************************/
function singUp() {
	if (registPinNo == "") {
		registPinNo = pinNo;
		$("#label_summary").find("p").text(PIN_CONF);

		// 初期化＆再表示
		pinValues = [];
		chgDispRef();
	} else {
		if (registPinNo == pinNo) {

			// PINコードを登録してサインイン
			insertPin();
			registPinNo = "";
			pageStatus = PAGE_STATUS_SING_IN;
			singIn();
		} else {
			// エラーメッセージ設定
			$("#label_summary").find("p").text(PIN_ERROR_CONF);

			// 初期化＆再表示
			registPinNo = "";
			pinValues = [];
			chgDispRef();
		}
	}
}

/*************************************************
**  サインイン
**************************************************/
function singIn() {
	// 入力パスワード確認
	if(checkPin()){
		// メッセージ初期化
		$("#label_summary").find("p").text("");
		pinValues = [];
		chgDispRef();

		// TODO OK:一覧画面に遷移
		$("#switch_site_list").click();
		pageStatus = PAGE_STATUS_SITE_LIST;

	} else {
		// エラーメッセージ設定
		$("#label_summary").find("p").text(PIN_ERROR);

		// 初期化＆再表示
		pinValues = [];
		chgDispRef();
	}
}

/*************************************************
**  PINコード変更
**************************************************/
function pinUpdate() {
	if (oldPinNo == "") {
		if (checkPin()) {
			oldPinNo = pinNo;
			$("#label_summary").find("p").text(PIN_UPDATE);
		} else {
			$("#label_summary").find("p").text(PIN_ERROR);
		}

		// 初期化＆再表示
		pinValues = [];
		chgDispRef();
	} else {
		if (registPinNo == "") {
			registPinNo = pinNo;
			$("#label_summary").find("p").text(PIN_CONF);

			// 初期化＆再表示
			pinValues = [];
			chgDispRef();
		} else {
			if (registPinNo == pinNo) {

				// PINコードを更新してサインイン
				updatePin();
				registPinNo = "";
				oldPinNo = "";
				pageStatus = PAGE_STATUS_SING_IN;
				alert("更新しました。");
				singIn();
			} else {
				// エラーメッセージ設定
				$("#label_summary").find("p").text(PIN_ERROR_CONF);

				// 初期化＆再表示
				registPinNo = "";
				pinValues = [];
				chgDispRef();
			}
		}
	}
}

/*************************************************
**  表示情報更新
**************************************************/
function chgDispRef(){

    var elements = document.getElementsByName("inputPINno");

	elements[0].value = "";
	elements[1].value = "";
	elements[2].value = "";
	elements[3].value = "";


	if(pinValues.length >= 1){
    	elements[0].value = pinValues[0];
    	pinNo = "";
    	pinNo = pinNo + pinValues[0];
    }
	if(pinValues.length >= 2){
    	elements[1].value = pinValues[1];
    	pinNo = pinNo + pinValues[1];
    }
	if(pinValues.length >= 3){
    	elements[2].value = pinValues[2];
    	pinNo = pinNo + pinValues[2];
    }
	if(pinValues.length >= 4){
	    elements[3].value = pinValues[3];
    	pinNo = pinNo + pinValues[3];
    }

}

/*************************************************
**  初回判定（初回ならtrue）
**************************************************/
function isFirstTime() {
	var result = false;
	var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
	db.transaction(function(tx) {
		tx.executeSql("select id, pin from login_info ;", [], function(tx, res) {
			result = 0 >= res.rows.length;
		});
	});
	return result;
}

/***********************************
** Pin登録処理 **
***********************************/
function insertPin() {

    queryInsert("INSERT INTO login_info (pin) VALUES (?)", [pinNo]);
    //テスト用（登録内容を表示する）
    //testSel();
    //alert("登録値pin" + pinNo);
}

/***********************************
** Pin変更処理 **
***********************************/
function updatePin() {
	queryUpdate("UPDATE login_info SET pin = ? WHERE pin = ? ", [pinNo, oldPinNo]);
}

/* テスト用 */
function testSel() {
	var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
	db.transaction(function(tx) {
		tx.executeSql("select id, pin from login_info ;", [], function(tx, res) {
			$("#siteList").text("");
			for(var i = 0; i < res.rows.length; i++){
				console.log(res.rows.item(i).id);
				console.log(res.rows.item(i).pin);
				alert("pin" + res.rows.item(i).pin);
			}
		});
	});
}

/*****************************************************************
 * ログイン画面に入力されたPINコード（4桁）をキーにDBを参照する。
 * 参照した結果に応じて要求元に結果を返す。
 * ・一致するPINコードが存在した場合：trueを返却する。
 * ・一致するPINコードが存在しない場合：falseを返却する。
 ****************************************************************/
function checkPin(){
	var judgeFlg = false;
	var retCnt = 0;
	var sql = "";
	var inputPin = String(pinValues[0]) + String(pinValues[1]) + String(pinValues[2]) + String(pinValues[3]);
	// alert("PINコード" + inputPin);

	// 取得したPWがDBのPW一覧に存在するかを確認する。
	var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mypassword", 200000);
	db.transaction(function(tx) {
		// データ登録用（登録処理の実装が終わったら消す予定）
		// tx.executeSql("insert into login_info (id, pin) values (001, 0000);", [], function(tx, res) {
		// });
		tx.executeSql("select id, pin from login_info where pin = " + inputPin + ";", [], function(tx, res) {
			retCnt = res.rows.length;
        //    alert("データ取得件数 ： " + retCnt);
        //    for(var i = 0; i < res.rows.length; i++){
        //        console.log(res.rows.item(i).id);
        //        console.log(res.rows.item(i).pin);
        //    }
		});
	});

	// 取得件数0件
	if(0 == retCnt){
		// NG：flase設定
		judgeFlg = false;
	}else{
		// OK：true設定
		judgeFlg = true;
	}

	return judgeFlg;
}
