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
const products = [];
const columnHeaders = [];

(async function main(){
    await workbook.xlsx.readFile(filename)
    const worksheet = workbook.getWorksheet(1)
    let rowCount = worksheet.lastRow.number

    for (let i = 1; i <= rowCount; i++) {
        const row = worksheet.getRow(i)
        if (i >= 10) break
        let productId = row.getCell(PRODUCT_ID_COLUMN).value;
        if (productId && productId !== '' && productId !== 'Part Number') {
            if (typeof productId === 'object') {
                if (typeof productId.result !== 'undefined') {
                    productId = productId.result
                } else if (typeof productId.text !== 'undefined') {
                    productId = productId.text;
                }
            }
            console.log(i, productId)

            // scrape data using product id
            let product = await scraper.getProductInfoById(productId)

            if (product) {
                const rowToInsert = {}
                for (let header in product) {
                    // sanitize column key
                    let key = header.trim().replace(/ /g, '_').toLowerCase()
                    if (key == '') continue
                    // add column header, if it doesn't exist
                    if (!columnHeaders.map(column => column.key).includes(key)) {
                        const column = {
                            header: header.trim(),
                            key
                        }
                        columnHeaders.push(column)
                    }
                    rowToInsert[key] = product[header]
                }
                products.push(rowToInsert)
            }
        }
    }

    console.log(products)
    console.log(columnHeaders)

    /**
     * @todo
     * add row using unique column key
     * (don't use the actual header name)
     */
    // const outfile = new Excel.Workbook();
    // const sheet = outfile.addWorksheet('Product List')
    // outfile.columns = columnHeaders
    // try {
    //     sheet.addRow()
    // }


})()

