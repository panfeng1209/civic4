const superagent = require('superagent');
const ipQuery = 'https://httpbin.org/ip';

const getIP = () => superagent.get(ipQuery);

module.exports = getIP;
