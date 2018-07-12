/**
 * Config file for datascraper / exporter
 */
module.exports = {

    /**
     * Input Excel file
     * path to file to grab part numbers
     * default: files/Vendor-Management-Inventory-Horizontal.xlsx
     */
    import_filepath: "./files/Vendor-Management-Inventory-Horizontal.xlsx",

    /**
     * output file name
     * creates file in output/{filename}.xlsx
     */
    export_filename: "test",

    /**
     * should be number representation of the "Parts Number" column
     * change as needed
     */
    PRODUCT_ID_COLUMN: 19,
}