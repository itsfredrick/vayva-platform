const autocannon = require('autocannon');

const run = (label, url) => {
    return new Promise((resolve, reject) => {
        console.log(`\nStarting Load Test: ${label} [${url}]`);
        const instance = autocannon({
            url,
            connections: 50, // 50 concurrent users
            duration: 10,    // 10 seconds per test (short burst for local)
            pipelining: 1,
        }, (err, result) => {
            if (err) {
                return reject(err);
            }
            console.log(`\n--- Results: ${label} ---`);
            console.log(`Requests/sec: ${result.requests.mean}`);
            console.log(`Latency (avg): ${result.latency.mean} ms`);
            console.log(`Latency (p99): ${result.latency.p99} ms`);
            console.log(`Errors: ${result.errors}`);
            console.log(`Timeouts: ${result.timeouts}`);
            console.log(`2xx Responses: ${result["2xx"]}`);
            console.log(`Non-2xx Responses: ${result.non2xx}`);
            resolve(result);
        });

        autocannon.track(instance, { renderProgressBar: true });
    });
};

async function main() {
    try {
        // 1. Analytics API (Cached)
        await run('API: Analytics (Cached)', 'http://localhost:3000/api/analytics/summary');

        // 2. Customers API (Search)
        await run('API: Customer Search', 'http://localhost:3000/api/customers?query=a');

        // 3. SSR Page (Dashboard)
        await run('SSR: Dashboard', 'http://localhost:3000/dashboard');

        console.log("\nLoad Test Complete.");
    } catch (e) {
        console.error("Load Test Failed", e);
    }
}

main();
