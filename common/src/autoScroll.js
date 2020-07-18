async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const scrollHeight = window.innerHeight * 0.7;
      const timer = setInterval(() => {
        const distance = 100 * Math.random();
        window.scrollBy({
          top: distance,
          behavior: 'smooth'
        });
        totalHeight = totalHeight + distance;
        if (document.documentElement.scrollTop > 12000) {
          window.scrollBy({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
          clearInterval(timer);
          resolve();
        }
        if (totalHeight >= scrollHeight) {
          window.scrollBy({
            top: distance,
            behavior: 'smooth'
          });
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = autoScroll;
