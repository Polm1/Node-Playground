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
	console.log(ipList[0].ip_address);
	batchParse(ipList[0].ip_address)
		.then(res => console.log(res.data))
		.catch(err => console.error(err));
}

function batchParse(ipSlice) {
	console.log('ipSlice', ipSlice);
	return axios.post('http://ip-api.com/batch', [
		{
			query: ipSlice,
			fields: 'country',
		},
	]);
}
