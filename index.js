const launch = require('./main/puppeteer');
const { click } = require('./help/callbacks');

const data = require('./config/data');

const resolveData = ({ datas, selector, callback = click }) => datas.map(i => ({ url: i, selector, callback }))

const go = async () => {
  const args = process.argv.splice(2);
  const [ hideX ] = args;
  const datas = [
    ...resolveData(data),
  ];
  launch(datas, hideX);
}

go();
