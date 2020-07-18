const child_process = require('child_process');
const os = require("os")
const number = os.cpus().length >= 4 ? 4 : os.cpus().length + 2;
console.log('cpus number', number);

const CIType = process.argv[2];

for (let i = 0; i < number; i++) {
  const worker_process = child_process.fork('index.js', [CIType]);
  worker_process.on('close', function (code) {
    console.log('child_process exit, code:' + code);
  });
}