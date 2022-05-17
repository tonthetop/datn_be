const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
var results = [];
const rawFileLink = path.join(__dirname, 'giay_copy___1215364529.csv');
const newFileLink = path.join(__dirname, 'giay.json');
const convertProductBySize = (array) => {
    return array.map((e) => {
        return {
            size: e,
            amount: Math.round(Math.random() * 10),
        };
    });
};

function saveToFile(payload) {
    const data = JSON.stringify(payload);
    fs.writeFile(newFileLink, data, () => {
        /* Silent error */
    });
}
fs.createReadStream(rawFileLink)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results = results.map((item) => {
            return {
                name: item.title,
                brand: item.brand,
                productType: 'GIAY',
                imgList: [item.img1, item.img2],
                price: Number(item.price.slice(0, item.price.length - 1).split('.').join('')),
                discountIds: [],
                productBySize: convertProductBySize(item.status.split('|')),
            };
        });
        saveToFile(results);
    });