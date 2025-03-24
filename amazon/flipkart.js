const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

/**
 * Scrapes product information from Flipkart based on the given search query
 * @param {string} product - Search query for products
 * @returns {Promise<Array>} Array of product objects with name, price, and image
 */
module.exports = function flipkartScraper(product) {
  return new Promise((resolve, reject) => {
    // Array to store scraped product information
    const productResults = [];

    // Default headers to mimic a browser request
    const headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Connection': 'keep-alive',
      'Host': 'www.flipkart.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Sec-Ch-Ua-Platform': 'Windows',
      'Upgrade-Insecure-Requests': 1
    };

    // Construct search URL
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(product)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;

    // Fetch search results
    axios.get(searchUrl, { headers })
      .then((response) => {
        // Use JSDOM to parse HTML
        const { document } = (new JSDOM(response.data)).window;

        // Select and process product cards
        document.querySelectorAll('._2kHMtA').forEach((productCard) => {
          try {
            const nameElement = productCard.querySelector('._4rR01T');
            const priceElement = productCard.querySelector('._25b18c');
            const imageElement = productCard.querySelector('._396cs4');

            // Only add product if all elements exist
            if (nameElement && priceElement && imageElement) {
              productResults.push({
                pname: nameElement.textContent.trim(),
                pprice: priceElement.textContent.slice(0, 7).trim(),
                pimg: imageElement.src
              });
            }
          } catch (error) {
            // Log individual parsing errors without breaking the entire process
            console.error('Error parsing product:', error.message);
          }
        });
      })
      .catch((error) => {
        // Reject the promise if there's a network or request error
        reject(error);
      })
      .finally(() => {
        // Resolve with results after a short delay to ensure all products are captured
        setTimeout(() => {
          resolve(productResults);
        }, 7000);
      });
  });
};