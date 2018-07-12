const Excel = require('exceljs')

const workbook = new Excel.Workbook();

const sheet = workbook.addWorksheet('Product List')

sheet.columns = [{
        header: 'Id',
        key: 'id',
        width: 10
    },
    {
        header: 'Name',
        key: 'name',
        width: 32
    },
    {
        header: 'D.O.B.',
        key: 'DOB',
        width: 10,
        outlineLevel: 1
    }
]

console.log(sheet.getColumn('id'))
try {
    // console.log(sheet.getColumn('test'))
    sheet.addRow({
        'id': 123,
        'test': 'hello world'
    })


} catch (e) {
    console.log(e.message)
    if (e.message.indexOf('Invalid column') > -1) {
        console.log('Attempting to add column')
        sheet.columns.push({
            header: 'Test',
            key: 'test'
        })
        console.log(sheet.getColumn('test'))
    }
}

(async function(){
    const result = await workbook.xlsx.writeFile('output/test.xlsx')
    console.log('done!')
})()
