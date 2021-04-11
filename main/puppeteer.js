const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const sleep = require('../help/sleep');
const {clearCookie, random} = require('../help/util');
const options = require('../help/options');

puppeteer.use(StealthPlugin());

const page = async ({ url, selector, callback }, showX) => {
  console.log('start launch puppeteer ...', url, 'callback:', !!callback, 'selector:', selector)
  options.headless = !!showX;
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  try{
    await clearCookie(browser);
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    const randomTime = random(30, 50) * 10;
    await sleep(randomTime);
    console.log('load page down', url, randomTime);
  } catch(error) {
    console.error('-------------------------------------no! error', error);
  }
  if (callback) {
    await callback({page, selector});
  }
  const randomTime = random(20, 40) * 100 
  await sleep(randomTime);
  const pages = await browser.pages();
  const urls = [];
  for (let i = 1; i < pages.length; i++) {
    const page = pages[i];
    const url = page.url();
    urls.push(url)

  }
  browser.close();
  console.log(url, 'done~',urls.length, urls.toString(), randomTime);
}

const launch = async (lists, showX) => {
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];
    await page({...list}, showX);
  }
  console.log('task down~');
}

module.exports = launch;
