const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://moonlit-pothos-562ab3.netlify.app/', { waitUntil: 'networkidle2' });
  
  // Wait a bit for React to render
  await new Promise(r => setTimeout(r, 3000));
  
  // Get text content
  const textContent = await page.evaluate(() => document.body.innerText);
  console.log(textContent);
  
  await browser.close();
})();
