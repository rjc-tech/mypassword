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
    }
	if(pinValues.length >= 2){
    	elements[1].value = pinValues[1];
    }
	if(pinValues.length >= 3){
    	elements[2].value = pinValues[2];
    }
	if(pinValues.length >= 4){
	    elements[3].value = pinValues[3];

	    //ページ遷移
	    //window.location.hash = '#site_list';
	    //window.location.hash.refresh();
	    //alert(window.location.hash);
	    //display('#site_list');
	    //window.location.hash = "#site_list";
	    location.href="file:///android_asset/www/index.html#site_list"
	    //initSiteList();
	    //alert("成功！");
    }

}

