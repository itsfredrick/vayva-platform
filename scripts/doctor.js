const fs = require('fs');
const path = require('path');
const net = require('net');

const REQUIRED_PORTS = [3000, 3001, 3002, 3003];
const APPS = [
    { name: 'Merchant Admin', port: 3000 },
    { name: 'Storefront', port: 3001 },
    { name: 'Marketplace', port: 3002 },
    { name: 'Ops Console', port: 3003 }
];

console.log('\x1b[1m\x1b[36m%s\x1b[0m', '🩺 Vayva Doctor: Checking System Health...\n');

let issues = 0;

// 1. Check Environment Variables
console.log('\x1b[1m%s\x1b[0m', '1. Environment Configuration');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ .env file found');
} else {
    console.log('⚠️  .env file missing (Using system env or defaults)');
    // Not strictly fatal if system envs are set, but worth noting
}

// 2. Check Node Version
console.log('\n\x1b[1m%s\x1b[0m', '2. Node.js Environment');
const nodeVersion = process.version;
console.log(`ℹ️  Current Node Version: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
    console.log('❌ Node version must be >= 18.x');
    issues++;
} else {
    console.log('✅ Node version compatible');
}

// 3. Port Availability
console.log('\n\x1b[1m%s\x1b[0m', '3. Port Availability');

const checkPort = (port, name) => {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`⚠️  Port ${port} (${name}) is already in use.`);
                // This is a warning because it might be the app itself running
            } else {
                console.log(`❌ Error checking port ${port}: ${err.message}`);
                issues++;
            }
            resolve();
        });
        server.once('listening', () => {
            // Port is free
            console.log(`✅ Port ${port} (${name}) is available.`);
            server.close();
            resolve();
        });
        server.listen(port);
    });
};

const runPortChecks = async () => {
    for (const app of APPS) {
        await checkPort(app.port, app.name);
    }
};

// Main Execution
(async () => {
    await runPortChecks();

    console.log('\n-----------------------------------');
    if (issues === 0) {
        console.log('\x1b[32m%s\x1b[0m', '✅ System looks healthy! You are ready to start.');
    } else {
        console.log('\x1b[31m%s\x1b[0m', `❌ Found ${issues} potential issues. Please review above.`);
    }
})();
