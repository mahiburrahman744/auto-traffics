const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
const axios = require('axios');

// Add stealth plugin to minimize bot detection
puppeteer.use(StealthPlugin());

// List of common viewport sizes
const viewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1600, height: 900 },
    { width: 1280, height: 800 },
    { width: 1280, height: 720 },
];

// List of referer URLs to simulate traffic from different sources
const referers = [
    'https://www.facebook.com/',
    'https://www.youtube.com/',
    'https://www.google.com/',
    'https://www.twitter.com/',
    'https://www.instagram.com/',
    'https://www.linkedin.com/',
    'https://www.reddit.com/',
    'https://www.tiktok.com/',
    'https://www.pinterest.com/',
    'https://www.quora.com/',
    'https://www.medium.com/',
    'https://www.tumblr.com/',
    'https://www.flickr.com/',
    'https://www.dailymotion.com/',
    'https://www.vimeo.com/',
    'https://www.weibo.com/',
    'https://www.qq.com/',
    'https://www.whatsapp.com/',
    'https://www.telegram.org/',
    'https://www.snapchat.com/',
    'https://www.line.me/',
    'https://www.vk.com/',
    'https://www.odnoklassniki.ru/',
    'https://www.bing.com/',
    'https://www.yahoo.com/',
];

// Function to get a random user agent
const getRandomUserAgent = () => {
    return randomUseragent.getRandom();
};

// Function to get a random viewport size
const getRandomViewport = () => {
    return viewports[Math.floor(Math.random() * viewports.length)];
};

// Function to get a random referer
const getRandomReferer = () => {
    return referers[Math.floor(Math.random() * referers.length)];
};

// Function to get a random geolocation
const getRandomGeolocation = () => {
    const randomLatitude = (Math.random() * 180 - 90).toFixed(4); // Generates a latitude between -90 and 90
    const randomLongitude = (Math.random() * 360 - 180).toFixed(4); // Generates a longitude between -180 and 180
    return { latitude: parseFloat(randomLatitude), longitude: parseFloat(randomLongitude) };
};

// Function to get country from geolocation
const getCountryFromGeolocation = async (latitude, longitude) => {
    try {
        const response = await axios.get(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
        if (response.data && response.data.country) {
            return response.data.country;
        } else {
            console.error('Geocode API error:', response.data);
            return 'Unknown';
        }
    } catch (error) {
        console.error('Error fetching country:', error);
        return 'Unknown';
    }
};

// Function to generate a random device profile
const generateRandomDeviceProfile = async (page) => {
    const userAgent = getRandomUserAgent();
    const viewport = getRandomViewport();
    const referer = getRandomReferer();
    const geolocation = getRandomGeolocation();
    const country = await getCountryFromGeolocation(geolocation.latitude, geolocation.longitude);

    await page.setUserAgent(userAgent);
    await page.setViewport(viewport);
    await page.setExtraHTTPHeaders({ referer });
    await page.setGeolocation(geolocation);

    console.log(`Using referer: ${referer}`);
    console.log(`Using geolocation: Latitude ${geolocation.latitude}, Longitude ${geolocation.longitude}, Country: ${country}`);
};

// Function to add random mouse movements to simulate human behavior
const addMouseMovements = async (page) => {
    await page.mouse.move(
        Math.random() * page.viewport().width,
        Math.random() * page.viewport().height
    );
    await page.waitForTimeout(1000 + Math.random() * 2000); // Random delay between 1 and 3 seconds
};

// Function to log browser fingerprinting information
const logFingerprint = async (page) => {
    const userAgent = await page.evaluate(() => navigator.userAgent);
    const platform = await page.evaluate(() => navigator.platform);
    const language = await page.evaluate(() => navigator.language);
    console.log(`Browser fingerprint: User Agent: ${userAgent}, Platform: ${platform}, Language: ${language}`);
};

// Function to scroll down the page
const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
};

// Function to visit the page and perform actions
async function visitAndInteract() {
    while (true) {
        let page, browser;
        try {
            // Launch browser without proxy
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            });
            page = await browser.newPage();

            // Generate random device profile for the initial visit
            await generateRandomDeviceProfile(page);

            // Log browser fingerprint
            await logFingerprint(page);

            // Increase the navigation timeout
            await page.setDefaultNavigationTimeout(120000); // 120 seconds

            // Visit the page
            await page.goto('https://toolfuz.com/checker/', { waitUntil: 'networkidle2' });

            // Add random mouse movements
            await addMouseMovements(page);

            // Scroll down the page
            await autoScroll(page);

            // Click the 'Learn More' button
            await page.waitForSelector('a.btn.btn-primary.btn-lg', { timeout: 30000 });
            await page.click('a.btn.btn-primary.btn-lg');
            console.log('Clicked: Learn More button');

            // Wait for a few seconds
            await page.waitForTimeout(3000);

            // Click 'Get Number' buttons with different device profiles
            const getNumberButtons = await page.$$('button.btn.btn-primary');
            let buttonIndex = 1;
            for (const button of getNumberButtons) {
                // Generate a new random device profile for each button click
                await generateRandomDeviceProfile(page);
                await button.click();
                console.log(`Clicked: Get Number button ${buttonIndex}`);
                buttonIndex++;
                await page.waitForTimeout(3000); // Wait for 3 seconds between clicks

                // Add random mouse movements
                await addMouseMovements(page);
            }

            // Click 'Play Video' button with a new device profile
            await generateRandomDeviceProfile(page);

            // Scroll to the 'Play Video' button before clicking
            await page.evaluate(() => {
                const playVideoButton = document.querySelector('button[onclick="showAd(\'masuda\')"]');
                if (playVideoButton) {
                    playVideoButton.scrollIntoView();
                }
            });

            // Wait for the 'Play Video' button to be visible
            await page.waitForSelector('button[onclick="showAd(\'masuda\')"]', { visible: true, timeout: 30000 });

            // Check for the 'Play Video' button before clicking
            const playVideoButton = await page.$('button[onclick="showAd(\'masuda\')"]');
            if (playVideoButton) {
                await playVideoButton.click();
                console.log('Clicked: Play Video button');
            } else {
                console.log('Play Video button not found.');
            }

            // Wait for 10 seconds before repeating
            await page.waitForTimeout(10000);

            console.log('Page visited successfully.');

            await browser.close();

        } catch (error) {
            console.error('An error occurred:', error);
            if (page) {
                const html = await page.content();
                console.log(html);
            }
            if (browser) {
                await browser.close();
            }
        }
    }
}

visitAndInteract();
