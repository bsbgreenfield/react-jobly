const { SECRET_KEY } = require("../config");
const {sqlForPartialUpdate} = require("./sql")

describe('sqlForPartialUpdate() function test', () => {
    test('test partial update', async function(){
        const jsToSql =  {
            numEmployees: "num_employees",
            logoUrl: "logo_url",
          }
        const data = {
            "numEmployees" : 999,
            "logoUrl" : "blahblah.com"
        }
        const result = sqlForPartialUpdate(data, jsToSql)
        expect(result).toEqual({
            "setCols": "\"num_employees\"=$1, \"logo_url\"=$2",
            "values": [999,"blahblah.com"]
        })
    })
})