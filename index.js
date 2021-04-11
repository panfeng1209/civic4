const launch = require('./main/puppeteer');
const { click } = require('./help/callbacks');

const glamourshub = require('./config/glamourshub');
const hawishub = require('./config/hawishub');

const resolveData = ({ datas, selector, callback = click }) => datas.map(i => ({ url: i, selector, callback }))

const go = async () => {
  const args = process.argv.splice(2);
  const [ hideX ] = args;
  const datas = [
    ...resolveData(hawishub),
    ...resolveData(glamourshub),
  ];
  launch(datas, hideX);
}

go();
