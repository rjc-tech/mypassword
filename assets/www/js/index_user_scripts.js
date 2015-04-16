var pinValues = [];
var PIN_CONF = "PINコードを確認します。再入力してください";
var PIN_ERROR = "PINコードが違います。再入力してください";
var PIN_ERROR_CONF = "PINコードが一致しません。再入力してください";
var pinNo = ""; //PINコード文字列
var registPinNo = ""; // PINコード（初回登録・更新用）

(function()
{
 "use strict";
 /*
   hook up event handlers
 */
 function register_event_handlers()
 {


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

		// 初回判定
		if (isFirstTime()) {
			if (registPinNo == "") {
				registPinNo = pinNo;
				$("#label_summary").find("p").text(PIN_CONF);

				// 初期化＆再表示
				pinValues = [];
				chgDispRef();
				return;
			} else {
				if (registPinNo == pinNo) {
					insertPin();
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

		// 入力パスワード確認
		if(checkPin()){
			// メッセージ初期化
			$("#label_summary").find("p").text("");
			pinValues = [];
			chgDispRef();

			// TODO OK:一覧画面に遷移
			$("#switch_site_list").click();

		} else {
			// エラーメッセージ設定
			$("#label_summary").find("p").text(PIN_ERROR);

			// 初期化＆再表示
			pinValues = [];
			chgDispRef();
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
