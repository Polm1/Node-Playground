const axios = require('axios');
const _ = require('lodash');
const ipList = require('./MOCK_DATA.json');

const _API_URL = 'http://ip-api.com/batch';
const _CHUNK_SIZE = 100;
const matchingCriteria = { country: 'Italy' };

async function start() {
	const matchingIpPromises = _.chunk(ipList, _CHUNK_SIZE).map(async chunk => {
		const postData = preparePostData(chunk);
		const parsedIpList = await batchParse(postData);

		return parsedIpList.filter(ip => ip.country === matchingCriteria.country);
	});

	const matchingIpList = _.flatten(await Promise.all(matchingIpPromises));
	checkResults(matchingIpList);
}

function preparePostData(slicedList) {
	return slicedList.map(ip => {
		return { query: ip.ip_address, fields: 'country,query' };
	});
}

function batchParse(ipList) {
	return axios
		.post(_API_URL, ipList)
		.then(res => res.data)
		.catch(err => console.error(err));
}

function checkResults(matchingIpList) {
	const results = matchingIpList.filter(
		matchIp => matchIp.country === matchingCriteria.country
	);

	console.log(results);
	console.log(
		`Found ${results.length} ip addresses from ${matchingCriteria.country}`
	);
}

start().catch(err => {
	console.error(err);
	process.exit(1);
});

process.on('exit', code => console.log(`Process terminated with code ${code}`));
