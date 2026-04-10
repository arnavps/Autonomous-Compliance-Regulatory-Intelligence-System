
const axios = require('axios');

async function test() {
    console.log("Starting Axios path resolution tests...");
    
    const client = axios.create({
        baseURL: 'http://localhost:8000/api'
    });

    // Test with leading slash
    // Axios behavior: if url starts with /, it's relative to the origin of baseURL
    // So http://localhost:8000 + /api/ask = http://localhost:8000/api/ask
    
    const url1 = '/api/ask';
    console.log(`baseURL: 'http://localhost:8000/api', url: '${url1}'`);
    // We can't actually see the final URL easily without a request, but we can intercept it
    client.interceptors.request.use(config => {
        console.log(`Resulting full URL: ${config.baseURL}${config.url}`);
        // Wait, Axios doesn't just concatenate if baseURL is set.
        // It uses new URL(url, baseURL).
        try {
            const combined = new URL(config.url, config.baseURL).href;
            console.log(`Resolved URL (via native URL): ${combined}`);
        } catch(e) {
            console.log("URL resolution failed");
        }
        return config;
    });

    try { await client.get(url1); } catch(e) {}
}

test();
