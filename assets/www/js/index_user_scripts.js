var pinValues = [];

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

