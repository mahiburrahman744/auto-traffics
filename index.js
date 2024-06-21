const puppeteer = require('puppeteer-extra');
const randomUseragent = require('random-useragent');
const proxyChain = require('proxy-chain');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const urls = [
  "https://www.highrevenuenetwork.com/iaqgtx69y1?key=14a1e46999747270c942f2634ef5306a",
];

const referrers = [
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.twitter.com/",
  "https://www.linkedin.com/",
  "https://www.instagram.com/",
  "https://www.pinterest.com/"
];


// New proxy configuration
const proxyUrl = "http://qqk9da986ugmo7q:gc3jjx3wsod6ytn@rp.proxyscrape.com:6060";

(async () => {
  while (true) {
    for (const url of urls) {
      const userAgent = randomUseragent.getRandom();
      const referrer = referrers[Math.floor(Math.random() * referrers.length)];
      const newProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);

      const browser = await puppeteer.launch({
        headless: true, // Use headless mode
        args: [
          `--proxy-server=${newProxyUrl}`,
          `--user-agent=${userAgent}`,
          '--disable-setuid-sandbox',
          '--no-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
        ],
        ignoreHTTPSErrors: true,
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 }); // Explicitly set the viewport dimensions
      await page.setExtraHTTPHeaders({ 'referer': referrer });

      try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log(`Visited ${url} with ${userAgent} from ${referrer}`);

        // Simulate human-like interactions
        await page.mouse.move(
          Math.random() * page.viewport().width,
          Math.random() * page.viewport().height
        );

        // Random scrolling
        await page.evaluate(() => {
          const getRandomInt = (min, max) => Math.floor(Math.random() * (min, max + 1)) + min;
          let totalHeight = 0;
          const distance = getRandomInt(100, 300);

          const scroll = () => {
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight < document.body.scrollHeight) {
              setTimeout(scroll, getRandomInt(200, 400));
            }
          };
          scroll();
        });

        // Simulate random clicks
        const links = await page.$$('a');
        if (links.length > 0) {
          const randomLink = links[Math.floor(Math.random() * links.length)];
          const clickablePoint = await randomLink.boundingBox();
          if (clickablePoint) {
            try {
              await randomLink.click();
              await page.waitForTimeout(Math.floor(Math.random() * 3000) + 1000); // Wait 1 to 3 seconds
            } catch (clickError) {
              console.log(`Failed to click element: ${clickError.message}`);
            }
          } else {
            console.log(`Element not clickable or not an HTMLElement: ${randomLink}`);
          }
        }

        // Wait for a random amount of time
        await page.waitForTimeout(Math.floor(Math.random() * 2000) + 3000); // Wait 3 to 5 seconds
      } catch (error) {
        console.error(`Error visiting ${url}:`, error);
      } finally {
        await browser.close();
        await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
      }

      // Wait between 1 and 5 seconds before the next visit
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 4000) + 1000));
    }
  }
})();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
