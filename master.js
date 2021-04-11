
const child_process = require('child_process');
const os = require('os')

const number = os.cpus().length * 3;
console.log('cpus number', number);
const args = process.argv.splice(2);
const [ hideX ] = args;

for (let i = 0; i < number; i++) {
  setTimeout(() => {
    const worker_process = child_process.fork('index.js', [hideX]);
    worker_process.on('close', function (code) {
      console.log('child_process exit, code:' + code);
    });
  }, i * 3000)
}