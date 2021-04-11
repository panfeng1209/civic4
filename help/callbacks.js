const sleep = require('./sleep');

const click = async ({page, selector}) => {
  try {
    if (selector) {
      await page.click(selector, {
        delay: 500
      })
    }
  } catch (error) {
    console.error(error);
  }
}

const hover = async ({page, selector}) => {
  try {
    await page.waitForSelector(selector, {timeout: 3000});
    await page.hover(selector, {
      delay: 500
    })
    await sleep(3 * 1000);
  } finally {
    console.log('no selector: ', selector);
  }  
}

module.exports = {click, hover};
