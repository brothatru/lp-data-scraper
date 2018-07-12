/**
 * Data Scraper Module
 */
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const LAWSON_HOME_URL = 'https://www.lawsonproducts.com/'
const PRODUCT_SEARCH_URL = 'https://www.lawsonproducts.com/catalog/search-results.jsp?question='
const PRODUCT_DETAILS_CLASSNAME = '.pdp-details'
const TECH_SPECS_CLASSNAME = '.pdp-specs'

class DataScraper {

    async getProductInfoById(id) {
        const result = {}
        result.id = id

        // waits until entire page is loaded
        let dom = await JSDOM.fromURL(PRODUCT_SEARCH_URL + id);
        // console.log(dom.serialize())

        let document = dom.window.document

        // Determine type of response by h2 page title
        const h2 = document.querySelector('h2').textContent

        // handle edge cases
        if (h2 === 'No Search Results Found') {
            return null
        }
        else if (h2 === 'Products') {
            // if searchform return multiple results
            // need to parse for correct product, and
            // re-load dom for new product
            document = await this.getDOMfromProducts(document, id)
            if (!document) return null
        }

        // scrape product details
        const productDetails = document.querySelector(PRODUCT_DETAILS_CLASSNAME)
        for (let i in productDetails.children) {
            let node = productDetails.children[i]
            if (node.tagName === "DT" && node.textContent.indexOf('Standard Pack') > -1) {
                result['Standard Pack'] = productDetails.children[parseInt(i) + 1].textContent.replace(/\n|\t|\r/g, "")
                break
            }
        }

        // scrape tech specs
        let techSpecs = document.querySelector(TECH_SPECS_CLASSNAME)
        if (techSpecs) techSpecs = techSpecs.children
        for (let i = 0; i < techSpecs.length-1; i++) {
            if (i.className === "clear") break
            if (i % 2 === 0) {
                let specName = techSpecs[i].textContent.replace(/\n|\t|\r|:/g, "")
                let specValue = techSpecs[parseInt(i) + 1].textContent.replace(/\n|\t|\r/g, "")
                result[specName] = specValue
                i++
            }
        }

        return result
    }

    /**
     * Attempts to load a new document
     * @param params
     * @return document || null
     */
    async getDOMfromProducts(document, id) {
        let items = document.querySelectorAll('.item-sku > a')
        if (items) {
            for (let item of items) {
                if (item.href.indexOf(`/${id}.lp`) > -1) {
                    let dom = await JSDOM.fromURL(item.href)
                    if (dom) return dom.window.document
                }
            }
        }
        return null
    }
}

module.exports = DataScraper;