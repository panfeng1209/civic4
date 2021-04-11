const clearCookie = async (browser) => {
  const pages = await browser.pages();
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const cookies = await page.cookies()
    for (let j = 0; j < cookies.length; j++) {
      await page.deleteCookie({ name: cookies[j].name });
    }
  }
}

const clearOtherPags = async (browser) => {
  const pages = await browser.pages()
  for (let i = 1; i < pages.length - 1; i++) {
    const page = pages[i];
    const url = page.url();
    await page.close();
    console.log('destory:', url);
  }
}

function group2(list) {
  let temp1 = [];
  let temp2 = [];
  list.forEach((item, index) => {
    if (index % 2) {
      temp1.push(item)
    } else {
      temp2.push(item)
    }
  })
  return [temp1, temp2];
}

const random = (min, max) => (Math.floor(Math.random() * (max - min + 1) + min))

module.exports = { clearCookie, clearOtherPags, group2, random };
