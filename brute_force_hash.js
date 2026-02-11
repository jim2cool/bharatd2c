const crypto = require('crypto');

const targetHash = 'b35d69ced6bfcdf2d68bae17d02152040ecd9e88baa955951f5ed096330fc799a9dfa283b5b8206c12238ff6f0fbcb1a6891ff64949c2d47184bab5fbb7881fe';

const params = {
    key: 'rseLfg',
    salt: 'HAxRDDiBthcnAPbbUsmElUuYhPOJs9PT',
    txnid: 'TXN1770736402805CKDC3WY',
    amount: '2999.00',
    amountInt: '2999',
    productinfo: 'Test Product 2',
    firstname: 'Checking',
    email: 'shashwat.e4a@gmail.com',
    phone: '9999061580',
    status: 'success',
    udf1: '', udf2: '', udf3: '', udf4: '', udf5: '',
    udf6: '', udf7: '', udf8: '', udf9: '', udf10: ''
};

function check(name, str) {
    const h = crypto.createHash('sha512').update(str).digest('hex');
    if (h === targetHash) {
        console.log(`MATCH FOUND! [${name}]`);
        console.log(`String: ${str}`);
        process.exit(0);
    }
}

// 1. API v19 (Standard)
// salt|status|phone|...|udf1|email|firstname|productinfo|amount|txnid|key
// 22 pipes between status and amount?
// salt|status|phone|extra|cart|auto|key|token|u10|u9|u8|u7|u6|u5|u4|u3|u2|u1|email|first|prod|amt|txn|key
const v19_base = `${params.salt}|${params.status}|${params.phone}||||||||||||||||${params.email}|${params.firstname}|${params.productinfo}|${params.amount}|${params.txnid}|${params.key}`;
check('v19_standard', v19_base);

// 2. API v19 (No phone)
const v19_no_phone = `${params.salt}|${params.status}|||||||||||||||||${params.email}|${params.firstname}|${params.productinfo}|${params.amount}|${params.txnid}|${params.key}`;
check('v19_no_phone', v19_no_phone);

// 3. Classic (5 UDFs)
// salt|status||||||email|firstname|productinfo|amount|txnid|key
const classic_5 = `${params.salt}|${params.status}||||||${params.email}|${params.firstname}|${params.productinfo}|${params.amount}|${params.txnid}|${params.key}`;
check('classic_5', classic_5);

// 4. Classic (10 UDFs - assuming PayU might send empty 6-10 but hash calc expects them?)
const classic_10 = `${params.salt}|${params.status}|||||||||||${params.email}|${params.firstname}|${params.productinfo}|${params.amount}|${params.txnid}|${params.key}`;
check('classic_10', classic_10);

// 5. Classic (5 UDFs) + Amount Int
const classic_5_int = `${params.salt}|${params.status}||||||${params.email}|${params.firstname}|${params.productinfo}|${params.amountInt}|${params.txnid}|${params.key}`;
check('classic_5_int', classic_5_int);

// 6. Classic (5 UDFs) + Phone? (Where would phone go?)
// Sometimes phone is after email?
// salt|status||||||email|firstname|productinfo|amount|txnid|key|phone?? No standard formula covers this.

// 7. Try additional_charges just in case (as empty string)
// already tried empty string in v19.

console.log('No match found in common formats.');
