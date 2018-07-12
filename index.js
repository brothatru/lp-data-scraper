const Excel = require('exceljs')
const DataScraper = require('./src/data-scraper/data-scraper')

let arg2;

/**
 * Use filename from command line if provided
 * @example node index.js /full_path_to_your_filename
 * @see https://stackoverflow.com/a/4351548/4364074
 */
process.argv.forEach(function (val, index, array) {
    if (index === 2 && val) {
        arg2 = val;
    }
})

/**
 * Input Excel filename
 * @default files/Vendor-Management-Inventory-Horizontal.xlsx
 */
let filename = arg2 || './files/Vendor-Management-Inventory-Horizontal.xlsx';

/**
 * should be number representation of the "Parts Number" column
 * change as needed
 */
const PRODUCT_ID_COLUMN = 19;

/**
 * Begin Heavy Lifting
 */
const workbook = new Excel.Workbook();
const scraper = new DataScraper();

/**
 * @async
 *
 */
// (async function(){
//     let content = await scraper.getProductInfoById('5P623')
//     // let content = await scraper.getProductInfoById(8699)
//     // let content = await scraper.getProductInfoById(3564)
//     console.log(content)
// })()

// read excel file
workbook.xlsx.readFile(filename)
    .then(function() {

        const worksheet = workbook.getWorksheet(1); // or getWorksheet("Wall Inventory")

        worksheet.eachRow(function(row, rowNumber) {
            let productId = row.getCell(PRODUCT_ID_COLUMN).value;
            if (productId) {
                if (typeof productId === 'object' && typeof productId.result === 'number') {
                    // console.log(`${typeof productId} ${productId}`)
                    productId = productId.result;
                }

                /**
                 * @todo
                 * Scrape Data Here using product id
                 */
                console.log(`Scraping data for part # ${productId}`)
                (async function () {
                    let product = await scraper.getProductInfoById(productId)
                    console.log(product)

                    /**
                     * @todo
                     * parse through product object keys
                     * check if column exists in worksheet
                     * if not, add column
                     * need to set unique key for each column
                     * ie. replace spaces with underscore, lowercase, etc.
                     */

                     /**
                      * @todo
                      * add row using unique column key
                      * (don't use the actual header name)
                      */
                })()
            }
        })
    });


