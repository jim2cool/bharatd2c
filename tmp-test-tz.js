const testDates = [
    '2026-02-28T20:00:00.000Z', // 1:30 AM IST the next day
    '2026-02-28T21:30:00.000Z', // 3:00 AM IST the next day
    '2026-02-28T08:00:00.000Z'  // 1:30 PM IST (should not trigger)
];

testDates.forEach(order_timestamp => {
    const orderDate = new Date(order_timestamp);
    // As written in the codebase
    const istString = orderDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const istTimeWrong = new Date(istString);
    const hourWrong = istTimeWrong.getHours();

    // Correct way
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        hourCycle: 'h23'
    });
    const parts = formatter.formatToParts(orderDate);
    const hourCorrect = parseInt(parts.find(p => p.type === 'hour').value, 10);

    console.log(`Original UTC: ${order_timestamp}`);
    console.log(`  istString: ${istString}`);
    console.log(`  istTimeWrong.getHours(): ${hourWrong} (Expected ${hourCorrect})`);
    console.log(`  hourCorrect: ${hourCorrect}`);
});
