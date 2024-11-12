const axios = require('axios');
const fs = require('fs'); 


// Configure axios instance with default settings
const axiosInstance = axios.create({
    maxRedirects: 0,
    timeout: 5000,
    validateStatus: function (status) {
        return status >= 200 && status < 400;
    },
    headers: {
        'User-Agent': 'Wget/1.21.4',
        'Accept': '*/*',
        'Accept-Encoding': 'identity',
        'Connection': 'Keep-Alive'
    }
});

// Function to save the original URL with a random ID to a text file
function saveUrl(originalUrl) {
    const randomId = generateShortCode(8); // Generate a random ID of 8 characters
    const entry = `ID: ${randomId}, URL: ${originalUrl}\n`; // Prepare the entry
    fs.appendFile('saved_urls.txt', entry, (err) => { // Append to the file
        if (err) {
            console.error('Error saving URL:', err);
        } else {
            console.log(`Saved URL: ${originalUrl} with ID: ${randomId}`);
        }
    });
}

async function analyzeRequest(url) {
    try {
        const initialResponse = await axiosInstance.get(url).catch(error => {
            if (error.response) return error.response;
            throw error;
        });

        const locationUrl = initialResponse.headers.location;

//change the filter according to what you are looking for
        if (locationUrl && locationUrl.includes('item1') && locationUrl.includes('a+Laddoo+for+you')) {
            console.log('\x1b[32m%s\x1b[0m', '✓ Found matching URL!');
            console.log('Original URL:', url);
            
            // Save the original URL
            saveUrl(url);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error with URL:', url, error.message);
        return false;
    }
}

function generateShortCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortCode = '';
    for (let i = 0; i < length; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortCode;
}

async function processBatch(batchSize) {
    const urls = Array(batchSize).fill().map(() => {
        const shortCode = generateShortCode();
        return `https://gpay.app.goo.gl/${shortCode}`;
    });

    const results = await Promise.all(
        urls.map(url => analyzeRequest(url))
    );

    return results.some(result => result === true);
}

async function generateAndTestUrls() {
    const CONCURRENT_BATCHES = 5;  // Number of concurrent batches
    const URLS_PER_BATCH = 10;     // URLs to test in each batch
    let totalTested = 0;
    
    console.log(`Starting search with ${CONCURRENT_BATCHES} concurrent batches of ${URLS_PER_BATCH} URLs each...`);

    while (true) {
        const batchPromises = Array(CONCURRENT_BATCHES)
            .fill()
            .map(() => processBatch(URLS_PER_BATCH));

        const batchResults = await Promise.all(batchPromises);
        totalTested += CONCURRENT_BATCHES * URLS_PER_BATCH;

        console.log(`Tested ${totalTested} URLs so far...`);

        if (batchResults.some(result => result === true)) {
            console.log('\nSuccess! Found after testing', totalTested, 'URLs');
            break;
        }

        // Add a small delay between batches to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Error handling for the main process
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the search
console.log('Starting concurrent URL search...');
generateAndTestUrls().catch(console.error);
