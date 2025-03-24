const axios = require('axios');
const { JSDOM } = require('jsdom');

/**
 * Scrapes product information from Amazon India search results
 * @param {string} product - The product search term
 * @returns {Promise<Array>} Array of product objects with image, name, and price
 */
module.exports = function amazon(product) {
  return new Promise((resolve, reject) => {
    // Array to store product data
    const products = [];

    // Amazon search URL with product query
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(product)}&crid=1SDPXMBEFQSD6&sprefix=${encodeURIComponent(product)}%2Caps%2C316&ref=nb_sb_noss_2`;

    // Make HTTP request to Amazon
    axios.get(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Sec-Ch-Ua-Platform': 'windows'
      }
    })
      .then((response) => {
        // Parse HTML response using JSDOM
        const { document } = new JSDOM(response.data).window;

        // Extract product information from each card
        document.querySelectorAll('.s-card-container').forEach((card) => {
          try {
            const priceElement = card.querySelector('.a-price-whole');
            if (priceElement && priceElement.textContent) {
              const productData = {
                image: card.querySelector('.s-image')?.src || '',
                name: card.querySelector('h2')?.textContent.trim() || '',
                price: priceElement.textContent.trim()
              };
              products.push(productData);
            }
          } catch (error) {
            // Silently handle individual card parsing errors
            // Consider logging to a file in production instead of console
          }
        });

        // Resolve promise with results after delay
        setTimeout(() => {
          resolve(products);
        }, 6000);
      })
      .catch((error) => {
        reject(new Error(`Failed to fetch Amazon data: ${error.message}`));
      });
  });
};