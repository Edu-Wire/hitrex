const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.4t1nynz.mongodb.net', (err, addresses) => {
    if (err) {
        console.error("SRV Lookup failed:", err);
        return;
    }
    console.log("SRV Addresses:", JSON.stringify(addresses, null, 2));

    addresses.forEach(addr => {
        dns.resolve4(addr.name, (err, ips) => {
            if (err) {
                console.error(`Failed to resolve ${addr.name}:`, err);
            } else {
                console.log(`${addr.name} -> ${ips.join(', ')}`);
            }
        });
    });
});
