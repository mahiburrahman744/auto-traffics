const puppeteer = require('puppeteer-extra');
const randomUseragent = require('random-useragent');
const proxyChain = require('proxy-chain');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const urls = [
  "https://www.trickadsagencyltd.com",
  "https://www.trickadsagencyltd.com/2023/07/3d-cards-bypass-termux-introduction-to.html",
  "https://www.trickadsagencyltd.com/2023/07/bangladesh-job-circular-2024.html",
  "https://www.trickadsagencyltd.com/2023/08/bin-list-american-express-debit-cards.html",
  "https://www.trickadsagencyltd.com/2023/08/facebook-prepaid-loaded-code-and.html",
  "https://www.trickadsagencyltd.com/2023/08/for-nurul-haq-noor-politics-is-not-just.html",
  "https://www.trickadsagencyltd.com/2023/08/how-to-set-up-facebook-auto-pay-with.html",
  "https://www.trickadsagencyltd.com/2023/08/trick-ads-agency-ltd-and-facebook-auto.html",
  "https://www.trickadsagencyltd.com/2023/09/earn-easy-money-from-home-with.html",
  "https://www.trickadsagencyltd.com/2023/09/free-7-domain-hosting-providers-online.html",
  "https://www.trickadsagencyltd.com/2023/09/optimizing-your-facebook-ad-campaign.html",
  "https://www.trickadsagencyltd.com/2023/10/blog-post.html",
  "https://www.trickadsagencyltd.com/2023/10/tool-for-finding-facebook-ads-auto-pay.html",
  "https://www.trickadsagencyltd.com/2024/02/exploring-business-services-in-usa.html",
  "https://www.trickadsagencyltd.com/2024/02/insuring-your-peace-of-mind.html",
  "https://www.trickadsagencyltd.com/2024/02/streamline-your-finances-with-easily.html",
  "https://www.trickadsagencyltd.com/2024/03/automated-traffic-solutions-drive.html",
  "https://www.trickadsagencyltd.com/2024/03/non-sk-premium-checker-for-adsbinfree.html",
  "https://www.trickadsagencyltd.com/2024/03/temporary-email-generator-for-trick-ads.html",
  "https://www.trickadsagencyltd.com/2024/04/join-freelancing-telegram-channel.html",
  "https://www.trickadsagencyltd.com/2024/04/new-batch-of-live-classes-fb-auto-pay.html",
  "https://www.trickadsagencyltd.com/megamenu/recent",
  "https://www.trickadsagencyltd.com/p/amex-bin-information-for-trick-ads.html",
  "https://www.trickadsagencyltd.com/p/bin-lookup.html",
  "https://www.trickadsagencyltd.com/p/card-extractor.html",
  "https://www.trickadsagencyltd.com/p/credit-card-checker-for-trick-ads.html",
  "https://www.trickadsagencyltd.com/p/easily-pay-account-onboarding-form.html",
  "https://www.trickadsagencyltd.com/p/face-generator.html",
  "https://www.trickadsagencyltd.com/p/privacy-policy.html",
  "https://www.trickadsagencyltd.com/p/stripe-secret-key-checker.html",
  "https://www.trickadsagencyltd.com/p/welcome-to-trick-ads-agency-ltd.html",
  "https://www.trickadsagencyltd.com/search",
  "https://www.trickadsagencyltd.com/search/label/blogging",
  "https://www.trickadsagencyltd.com/search/label/Dark%20Web%20Markets%20links"
];


const referrers = [
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.twitter.com/",
  "https://www.linkedin.com/",
  "https://www.instagram.com/",
  "https://www.pinterest.com/"
];

// Proxy configuration
const proxyUrl = "http://iekqsuzp-rotate:q5zrpgr2jx5g@p.webshare.io:80";

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
          await randomLink.click();
          await page.waitForTimeout(Math.floor(Math.random() * 3000) + 1000); // Wait 1 to 3 seconds
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
