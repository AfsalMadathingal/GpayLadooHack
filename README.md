# Google Pay Ladoo URL Search Script

This script searches for a specific type of URL redirect pattern using randomly generated URLs from Google Pay's shortened link domain (`https://gpay.app.goo.gl`). It uses `axios` to perform HTTP requests and filters for particular redirect patterns in responses. If a URL matching the desired criteria is found, it is saved to a text file (`saved_urls.txt`) with a unique ID for tracking.

## Features

- **Axios with custom headers and timeouts**: Configures `axios` with custom headers to mimic `Wget` requests, manage redirects, and handle timeout.
- **Randomized URL generation**: Generates random Google Pay URLs by appending short codes, mimicking real URL structures.
- **Redirect checking**: Follows redirects and filters based on specific criteria.
- **Multi-batch processing**: Searches URLs in batches with configurable concurrency to maximize efficiency.
- **Saving and logging**: Logs matching URLs and saves them with a unique ID.

## Requirements

- **Node.js** (recommended version 14+)
- **Axios**: HTTP client for making requests. Install with `npm install axios`.

## Configuration

You can configure the script’s behavior by adjusting the following settings:
- `CONCURRENT_BATCHES`: Number of concurrent batches processed at a time.
- `URLS_PER_BATCH`: Number of URLs processed in each batch.
- `timeout`: Timeout duration for each request in milliseconds.
- `maxRedirects`: Controls how many redirects the `axios` client follows.

## How to Use

1. Clone this repository and navigate to the folder in your terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the script:
   ```bash
   node <script_name>.js
   ```

The script will output each batch's status to the console, showing the number of URLs tested and any matches found. If a match is found, the script logs the matching URL to `saved_urls.txt` and stops further execution.

## Code Explanation

1. **Axios Configuration**: Sets default headers, timeout, and redirects.
2. **URL Generation**: The `generateShortCode` function generates a random string for each URL.
3. **URL Analysis**: The `analyzeRequest` function makes an HTTP request, checks for a redirect, and saves URLs with specific keywords (`item1` and `a+Laddoo+for+you`).
4. **Batch Processing**: The `processBatch` function initiates concurrent requests in batches, using `Promise.all` to handle multiple requests simultaneously.
5. **Concurrent Processing**: The main function `generateAndTestUrls` initiates batch processing until a matching URL is found.
6. **Error Handling**: Handles unhandled promise rejections to avoid abrupt script failures.

## Example Output

```bash
Starting concurrent URL search...
Starting search with 5 concurrent batches of 10 URLs each...
Tested 50 URLs so far...
✓ Found matching URL!
Original URL: https://gpay.app.goo.gl/ABC123
Saved URL: https://gpay.app.goo.gl/ABC123 with ID: G4j3KdL9
Success! Found after testing 120 URLs
```

## License

This script is licensed under the MIT License.