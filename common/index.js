const puppeteer = require('puppeteer');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const getIP = require('./src/getIP');
const showAds = require('./src/showAds');
const devices = require('./src/deviceInfo');
const sleep = require('./src/sleep');

const EventEmitter = require('events').EventEmitter;
const event = new EventEmitter();

const options = {
  args: [
    '--disable-dev-shm-usage',
    '-–no-sandbox',
    '-–disable-setuid-sandbox',
    '--lang=en-US,en;q=0.9',
  ],
  ignoreHTTPSErrors: 'true',
  headless: false,
  timeout: 60000,
}

async function browserGo(urls, datas, time) {
  const browser = await puppeteer.launch(options);
  const length = urls.length;
  let count = 0;
  const deviceIndex = parseInt(Math.random() * devices.length, 10);
  const device = devices[deviceIndex];
  // console.log(device.name);
  for (let i = 0; i < length; i++) {
    await sleep(2000);
    browser.newPage()
      .then(async (page) => {
        await page.emulate(device);
        return page;
      })
      .then(page => {
        page.goto(urls[i], { timeout: 0 }).then(async () => {
          await showAds(page, device.name, time);
          const cookies = await page.cookies();
          for (let i = 0; i < cookies.length; i++) {
            await page.deleteCookie({ name: cookies[i].name });
          }
          count = count + 1;
          if (count === length) {
            browser.close();
            console.log('browser finish');
            setTimeout(() => {
              const urls = datas.pop();
              if (urls) {
                event.emit('taskEvent', _.partial(browserGo, urls, datas, time));
              } else {
                console.log('over');
              }
            }, 2000);
          }
        }).catch(async () => {
          await showAds(page, device.name, time);
          const cookies = await page.cookies();
          for (let i = 0; i < cookies.length; i++) {
            await page.deleteCookie({ name: cookies[i].name });
          }
          count = count + 1;
          if (count === length) {
            browser.close();
            console.log('finish');
            setTimeout(() => {
              const urls = datas.pop();
              if (urls) {
                event.emit('taskEvent', _.partial(browserGo, urls, datas, time));
              } else {
                console.log('over');
              }
            }, 2000);
          }
        })
      });
  }
};

async function fire({ CIType = 'travis', project, showIp = false, browserCount = 4, browserTabs = 4, time = 40000 }) {
  // const file = path.resolve(__dirname, `./data/${project}/data.json`);
  const files = fs.readdirSync(path.resolve(__dirname, `.${project}`));
  const randomIndex = _.random(files.length - 1);
  const randomKey = _.random(1);
  const file = path.resolve(__dirname, `.${project}`, files[randomIndex]);
  const source = randomKey ? JSON.parse(fs.readFileSync(file)) : JSON.parse(fs.readFileSync(file)).reverse();
  const datas = _.chunk(source, browserTabs);
  const res = showIp ? (await getIP()) : {};
  const ip = _.get(res, 'body.origin', 'ip is not get');
  event.setMaxListeners(browserCount)
  event.on('taskEvent', fn => fn());
  if (CIType === 'github') {
    options.headless = true;
  }
  console.log('source length:', source.length, 'ip is:', ip, 'file is:', file, 'isReverse:', randomKey);
  for (let i = 0; i < browserCount; i++) {
    const urls = datas.pop();
    if (_.isArray(urls)) {
      browserGo(urls, datas, time);
    }
  }
}

module.exports = fire;
