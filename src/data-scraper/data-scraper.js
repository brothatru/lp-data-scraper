/**
 * Data Scraper Module
 */
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const LAWSON_HOME_URL = 'https://www.lawsonproducts.com/'
const PRODUCT_SEARCH_URL = 'https://www.lawsonproducts.com/catalog/search-results.jsp?question='
const PRODUCT_DETAILS_CLASSNAME = '.pdp-details'
const TECH_SPECS_CLASSNAME = '.pdp-specs'

class LawsonDataScraper {

    /**
     * Scrape product info and tech specs
     * @async
     * @param {number|string} id
     * @return object|null
     */
    async getProductInfoById(id) {
        const result = {}
        result.id = id

        // waits until entire page is loaded
        let dom = await JSDOM.fromURL(PRODUCT_SEARCH_URL + id)
        let document = dom.window.document

        // handle edge cases
        // determine type of response by h2 page title
        const h2 = document.querySelector('h2').textContent
        if (h2 === 'No Search Results Found') {
            return null
        }
        else if (h2 === 'Products') {
            // if searchform return multiple results, attempt to reload dom for correct product
            document = await this.getDOMfromProducts(document, id)
            if (!document) return null
        }

        // scrape product details
        this.getProductDetails(document, result)
        this.getProductTechSpecs(document, result)
        this.getProductCategories(document, result)

        return result
    }

    /**
     * Attempts to load a new document
     * @param {document} document
     * @param {number|string} id
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

    /**
     * Get product details by scraping
     * @param {document} document
     * @param {object} result
     * @return void
     */
    getProductDetails(document, result) {
        const productDetails = document.querySelector(PRODUCT_DETAILS_CLASSNAME)
        for (let i in productDetails.children) {
            let node = productDetails.children[i]
            if (node.tagName === "DT" && node.textContent.indexOf('Standard Pack') > -1) {
                result['Standard Pack'] = productDetails.children[parseInt(i) + 1].textContent.replace(/\n|\t|\r/g, "")
                break
            }
        }
    }

    /**
     * Get product tech specs by scraping dt list
     * @param {document} document
     * @param {object} result
     * @return void
     */
    getProductTechSpecs(document, result) {
        let techSpecs = document.querySelector(TECH_SPECS_CLASSNAME)
        if (techSpecs && 'children' in techSpecs) techSpecs = techSpecs.children
        if (!techSpecs) {
            console.log(`Missing Specs ${result.id}`)
            return
        }
        for (let i = 0; i < techSpecs.length - 1; i++) {
            if (i.className === "clear") break
            if (i % 2 === 0) {
                let specName = techSpecs[i].textContent.replace(/\n|\t|\r|:/g, "")
                let specValue = techSpecs[parseInt(i) + 1].textContent.replace(/\n|\t|\r/g, "")
                result[specName] = specValue
                i++
            }
        }
    }

    /**
     * Get product categories by scraping breadcrumbs
     * @param {document} document
     * @param {object} result
     * @return void
     */
    getProductCategories(document, result) {
        let breadcrumbs = document.querySelectorAll('#breadcrumb .center > a')
        if (breadcrumbs) {
            for (let i in breadcrumbs) {
                if (!breadcrumbs[i].textContent || breadcrumbs[i].textContent.match(/home/i)) continue
                result[`Product Category ${i}`] = breadcrumbs[i].textContent
            }
        }
    }
}

module.exports = LawsonDataScraper;