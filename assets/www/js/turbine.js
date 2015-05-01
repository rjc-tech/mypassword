function encode(target) {
	var key = "0123456789ABCDEF0123456789ABCDEF";
	return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(target), key).toString();
}
function decode(target) {
	var key = "0123456789ABCDEF0123456789ABCDEF";
	return CryptoJS.AES.decrypt(target, key).toString(CryptoJS.enc.Utf8);
}
