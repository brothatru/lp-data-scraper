# Product Specifications

## Description

Given an excel file of part numbers (and some extra info), client would like to scrape data from https://www.lawsonproducts.com.

We can use the site's search form (https://www.lawsonproducts.com//catalog/search-results.jsp?question=12345), and pass in each part number to attempt to find the item by product id.

Edge Case 1: If the part number is too short or is a substring of another part, the search will return multiple products. If so, we will need to parse the html for the correct item/url to redirect to.

ie. 8699

Edge Case 2: No search results found

ie. 5P623

For now, the client would like the export to be in **Excel** format.

From the product description, the client would like to grab:
* Standard Pack

From the **Tech Specs** section, pull each spec as a separate column.

Different product categories return different specs, so if the spec doesn't already exist as a header column, then append it to the list of header columns.

For the product categories, I parsed the product page's breadcrumbs.

## Installation

#### Requirements

* [Node](https://nodejs.org/en/download/)
* NPM v5+ (comes installed with node)

#### Install Dependencies

```bash
npm install
```

#### Config

Here are the default config settings. Should be pretty straightforward. You can change these as needed.

```js
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
    export_filename: "product-list",

    /**
     * should be number representation of the "Parts Number" column
     * change as needed
     */
    PRODUCT_ID_COLUMN: 19,
}
```

#### Execute Scraper

Run the following command:

```bash
npm start
```

Or you can run from command line:

```bash
node index.js path_to_your_input_file
```


## Resources

Here's a list of resources that were helpful to me in this project:
* ~~[Scraping data in 3 minutes with Javascript](https://medium.com/data-scraper-tips-tricks/scraping-data-with-javascript-in-3-minutes-8a7cf8275b31)~~
* ~~[Cheerio.js](https://github.com/cheeriojs/cheerio)~~
* [Use JSDOM to scrape dynamically loaded content](https://github.com/jsdom/jsdom)
* [Reading Excel File Using JavaScript](https://codoid.com/reading-excel-file-using-javascript/)
* [Export data as csv](https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/)

