const fs = require('fs');

const fire = require('./common');
const {name: projectName, browserTabs = 4} = JSON.parse(fs.readFileSync('./package.json'));

const options = {
  showIp: false,
  project: `/data/${projectName}`,
  browserTabs,
}

options.CIType = process.argv[2];

fire(options);
