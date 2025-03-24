const amazon = require('./amazon');
const flipkart = require('./flipkart');

/**
 * Combines product data from Amazon and Flipkart
 * @param {string} product - The product search term
 * @returns {Promise<Object>} Object containing arrays of Amazon and Flipkart results
 */
module.exports = async function add(product) {
    // Initialize arrays to store results
    const amazonResults = [];
    const flipkartResults = [];

    try {
        // Fetch and process Amazon data
        const amazonData = await amazon(product);
        amazonResults.push(amazonData);

        // Fetch and process Flipkart data
        const flipkartData = await flipkart(product);
        flipkartResults.push(flipkartData);

        // Return combined results
        return {
            amazon: amazonResults,
            flipkart: flipkartResults
        };
    } catch (error) {
        // Handle any errors from the scraping functions
        throw new Error(`Failed to fetch product data: ${error.message}`);
    }
};