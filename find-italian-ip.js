const axios = require("axios");
const _ = require("lodash");

const apiUrl = "http://ip-api.com/batch";
const chunkSize = 100;
const ipList = require("./MOCK_DATA.json");
const matchingCriteria = { country: "Italy" };

async function start() {
  _.chunk(ipList, chunkSize).forEach(async chunk => {
    const postData = preparePostData(chunk);
    const parsedIpList = await batchParse(postData);
    const matchingIpList = parsedIpList.filter(
      ip => ip.country === matchingCriteria.country
    );

    console.log(matchingIpList);
    console.log(`Found ${matchingIpList.length} ip addresses from Italy`);
  });
}

function preparePostData(slicedList) {
  return slicedList.map(ip => {
    return { query: ip.ip_address, fields: "country,query" };
  });
}

function batchParse(ipList) {
  return axios
    .post(apiUrl, ipList)
    .then(res => res.data)
    .catch(err => console.error(err));
}

start().catch(err => {
  err.bootstrap = true;
  console.error(err);
  process.exit(1);
});
