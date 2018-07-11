const Excel = require('exceljs')

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
 * aka Parts Number Column
 * should be number representation of column
 * change as needed
 */
const PRODUCT_ID_COLUMN = 19;

const workbook = new Excel.Workbook();

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
                console.log(productId)
            }
        })
    });


