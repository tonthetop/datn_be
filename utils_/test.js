const fs = require('fs');
const path = require('path');
// const rawFileLink = path.join(__dirname, 'products_Origin.json');
const newFileLink = path.join(__dirname, 'newProduct2.json');
// tesstttttt
async function saveToFile(payload) {
    const data = JSON.stringify(payload);
    return fs.writeFile(newFileLink, data, () => {
        /* Silent error */
    });
}
let json = require('./products_Origin.json');
// json = json.map((e) => {
//     const item = JSON.parse(JSON.stringify(e));
//     if (item.productBySize[0].size === 'sold_out') {
//         item.productBySize[0].size = Math.floor(
//             Math.random() * (49 - 32 + 1) + 32
//         );
//         item.productBySize[0].amount = 0;
//     }
//     return item;
// });

json = json.map((e) => {
    let item = JSON.parse(JSON.stringify(e));
    item.productBySize = item.productBySize.map(e => {
        return {...e, size: e.size.toString() }
    })

    return item;
});
saveToFile(json);