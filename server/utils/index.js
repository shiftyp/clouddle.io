const bindParseMessage = (fn) => {
	return (msg) => {
		let obj;

		console.log(typeof msg);

		try {
			obj = JSON.parse(msg);
		} catch(e) {
			return console.log(e.message);
		}

		return fn(obj);
	}
};

module.exports = {
	bindParseMessage
};
