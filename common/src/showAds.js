const autoScroll = require('./autoScroll');
const sleep = require('./sleep');

async function showAds(page, device, time) {
  let count = 0;
  await page.evaluate(() => window.scrollTo({ top: 0 }));
  const frames = await page.$$('.adsbygoogle');
  const { height } = page.viewport();
  const url = page.url();
  let timeout = 0;
  const start = Date.now();
  while (timeout < time) {
    const all = frames.map((frame) => frame.boundingBox());
    const frameIn = (await Promise.all(all)).filter(i => i)
      .find(i => i.y > 0 && (i.y + i.height < height));
    flag = !(await Promise.all(all)).filter(i => i).every(i => (i.y <= height));
    if (frameIn) {
      count = count + 1;
      await sleep(3000);
    }
    await autoScroll(page);
    const end = Date.now()
    timeout = end - start;
  }
  await sleep(3000);
  console.log(device, url, 'show', count, 'time:', (timeout) / 1000);
}

module.exports = showAds;
