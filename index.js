const Excel = require('exceljs')
const config = require('./config')
const DataScraper = require('./src/data-scraper/data-scraper')

let filename;

/**
 * Use filename from command line if provided
 * @example node index.js /full_path_to_your_filename
 * @see https://stackoverflow.com/a/4351548/4364074
 */
process.argv.forEach(function (val, index, array) {
    if (index === 2 && val) {
        filename = val;
    }
})

// filepath to input excel file (prioritizes command line argument)
filename = filename || config.import_filepath;

/**
 * Main Function
 *
 * Uses exceljs to parse and create excel files
 * @see https://github.com/guyonroche/exceljs
 */
(async function main(){
    const workbook = new Excel.Workbook();
    const scraper = new DataScraper();
    const products = [];
    const columnHeaders = [];

    // open input file
    await workbook.xlsx.readFile(filename)
    const worksheet = workbook.getWorksheet(1)
    let rowCount = worksheet.lastRow.number

    // parse each row for product id (part number)
    for (let i = 1; i <= rowCount; i++) {
        const row = worksheet.getRow(i)
        let productId = row.getCell(config.PRODUCT_ID_COLUMN).value;

        if (productId && productId !== '' && productId !== 'Part Number') {
            // handle edge cases
            if (typeof productId === 'object') {
                if ('result' in productId) {
                    productId = productId.result
                } else if ('text' in productId) {
                    productId = productId.text;
                }
            }

            // scrape data using product id
            console.log(i)
            console.log(`Attempting to scrape product ${productId}`)
            let product = await scraper.getProductInfoById(productId)

            // sanitize column key
            // add column header (if doesn't exist)
            // prepare row for insertion
            if (product) {
                console.log(`Preparing product for insert: ${productId}`)
                const rowToInsert = {}
                for (let header in product) {
                    let key = header.trim().replace(/ /g, '_').toLowerCase()
                    if (key == '') continue
                    if (!columnHeaders.map(column => column.key).includes(key)) {
                        const column = { header: header.trim(), key }
                        columnHeaders.push(column)
                    }
                    rowToInsert[key] = product[header]
                }
                products.push(rowToInsert)
            } else {
                console.log(`Failed scraping product ${productId}`)
                products.push({ id: productId })
            }
        }
    }

    // console.log(products)
    console.log(columnHeaders)

    /**
     * add row via column key
     * (don't use the actual header name)
     */
    const outfile = new Excel.Workbook();
    const sheet = outfile.addWorksheet('Product List')
    sheet.columns = columnHeaders
    try {
        for (let row of products) {
            sheet.addRow(row)
        }
        await outfile.xlsx.writeFile(`output/${config.export_filename}.xlsx`)
        console.log(`File created in output/${config.export_filename}.xlsx !`)
    } catch (e) {
        console.log(e)
    }


})()

