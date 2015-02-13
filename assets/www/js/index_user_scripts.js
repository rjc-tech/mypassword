var pinValues = [];
var PIN_ERROR = "PINコードが違います。再入力してください";

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
**  ナンバーボタンクリック
**************************************************/
function kakunin(btnNo){


	switch (btnNo){
		case 0:
			//alert("0");
		    break;
		case 1:
			//alert("1");
		    break;
		case 2:
			//alert("2");
		    break;
		case 3:
			//alert("3");
		    break;
		case 4:
			//alert("4");
		    break;
		case 5:
			//alert("5");
		    break;
		case 6:
			//alert("6");
		    break;
		case 7:
			//alert("7");
		    break;
		case 8:
			//alert("8");
		    break;
		case 9:
			//alert("9");
		    break;
		case 'BS':
			//alert("BS");
		    break;
	}


}

/*************************************************
**  表示情報修正
**************************************************/
function chgDispValue(btnNo){

	//値の設定確認
	pinValues.push(btnNo);
	//値の変更
//	alert("追加"+btnNo);
//	alert("配列"+pinValues);

	chgDispRef();

	// PINコードに4桁入力された場合
	if(pinValues.length > 3){
		// 入力パスワード確認
		if(checkPin()){
			// メッセージ初期化
			$("#label_summary").find("p").text("");
			pinValues = [];
			chgDispRef();

			// TODO OK:一覧画面に遷移

		}else{
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

	//alert("配列1 "+pinValues[0]);
	//alert("配列2 "+pinValues[1]);
	//alert("配列3 "+pinValues[2]);
	//alert("配列4 "+pinValues[3]);

    var elements = document.getElementsByName("inputPINno");
	    //alert(elements.length+"個の要素を取得しました");

	    //elements.value = pinValues[0];
	    //alert(elements[0].value);
	    //alert(elements[1].value);
	    //alert(elements[2].value);
	    //alert(elements[3].value);

	    elements[0].value = pinValues[0];
	    elements[1].value = pinValues[1];
	    elements[2].value = pinValues[2];
	    elements[3].value = pinValues[3];



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
		//	alert("データ取得件数 ： " + retCnt);
		//	for(var i = 0; i < res.rows.length; i++){
		//		console.log(res.rows.item(i).id);
		//		console.log(res.rows.item(i).pin);
		//	}
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