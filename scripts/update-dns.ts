
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.GODADDY_API_KEY;
const API_SECRET = process.env.GODADDY_API_SECRET;
const DOMAIN = 'easy-d2c.com';
const IP = '46.225.117.86';

if (!API_KEY || !API_SECRET) {
    console.error('Missing GoDaddy credentials in .env.local');
    process.exit(1);
}

const headers = {
    'Authorization': `sso-key ${API_KEY}:${API_SECRET}`,
    'Content-Type': 'application/json',
};

async function updateDNS() {
    try {
        // Add Wildcard A Record
        console.log(`Adding wildcard A record for *.${DOMAIN} -> ${IP}`);
        await axios.put(
            `https://api.godaddy.com/v1/domains/${DOMAIN}/records/A/*`,
            [
                {
                    data: IP,
                    ttl: 600,
                },
            ],
            { headers }
        );
        console.log('Successfully updated wildcard record.');

    } catch (error: any) {
        console.error('Error updating DNS:', error.response?.data || error.message);
    }
}

updateDNS();
