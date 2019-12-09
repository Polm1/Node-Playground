const axios = require('axios');

const ipList = require('./MOCK_DATA.json');

init().catch(err => {
	err.bootstrap = true;
	console.error(err);
	process.exit(1);
});

async function init() {
	config = process.env;
	//ipList.filter((ip) => )
	// console.log(ipList[0].ip_address);

	const slicedList = ipList.slice(1, 99);

	const postData = preparePostData(slicedList);
	batchParse(postData)
		.then(res => console.log(res.data))
		.catch(err => console.error(err));
}

function preparePostData(slicedList) {
	const mappedList = slicedList.map(ip => {
		return { query: ip.ip_address, fields: 'country' };
	});
	return mappedList;
}

function batchParse(ipList) {
	return axios.post('http://ip-api.com/batch', ipList);
}
