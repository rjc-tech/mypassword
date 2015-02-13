function getQueryString(url) {
    var result = {};
    var query = url.substring(1, url.indexOf("#"));

    // クエリの区切り記号 (&) で文字列を配列に分割する
    var parameters = query.split( '&' );

    for( var i = 0; i < parameters.length; i++ ) {
        // パラメータ名とパラメータ値に分割する
        var element = parameters[ i ].split( '=' );

        var paramName = decodeURIComponent( element[ 0 ] );
        var paramValue = decodeURIComponent( element[ 1 ] );

        // パラメータ名をキーとして連想配列に追加する
        result[ paramName ] = paramValue;
    }
    return result;
}

/** index.html内のページ遷移を行う
 *  href: 遷移したいアンカー */
function forwardPage(href) {
	var a = document.createElement("a");
	a.setAttribute("href", href);
	a.addEventListener("click",clickHandler,false);
	$(a).trigger("click");
}