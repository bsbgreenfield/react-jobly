const db = require('../db')
const {BadRequestError } = require('../expressError')

async function filterCompanies(filters){
        // create additional WHERE clauses
        let filterText = 'WHERE '
        // check that min is not less than max
        if (filters.minEmployees && filters.maxEmployees) {
          if (Number(filters.minEmployees) > Number(filters.maxEmployees)) {
            throw new BadRequestError('max employees cannot be less than min employees', 400)
          }
        }
        // loop through filters, adding appropriate WHERE clauses
        for (let [key, value] of Object.entries(filters)) {
          if (key == 'name') {
            filterText += `${key} ILIKE '%${value}%'`
          }
          else if (key == 'minEmployees') {
            filterText += `num_employees >= ${value}`
          }
          else if (key == 'maxEmployees') {
            filterText += `num_employees <= ${value}`
          }
          else {
            throw new BadRequestError(`${key} cannot be used to filter: valid filter are: "name", "maxEmployees" and "minEmployees, 400`)
          } 
          filterText += ' AND '
        }
        // remove last AND from string and make query
        let textLength = filterText.length - 1
        console.log(filterText.substring(0, textLength - 3))
        const companiesRes = await db.query(
          `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           ${filterText.substring(0, textLength - 3)}
           ORDER BY name`);
        filterText.substring()
        return companiesRes.rows;
}

async function filterJobs(filters){
        // create additional WHERE clauses
        let filterText = 'WHERE '
    
        // loop through filters, adding appropriate WHERE clauses
        for (let [key, value] of Object.entries(filters)) {
          if (key == 'title') {
            filterText += `${key} ILIKE '%${value}%'`
          }
          else if (key == 'minSalary') {
            filterText += `salary >= ${value}`
          }
          else if (key == 'hasEquity') {
            if (value == "true"){
                filterText += `equity > 0`
            }
            else if (value == "false"){
                filterText += `equity = 0`
            }
            else{
                throw new BadRequestError("equity must have a value of 'true' or 'false'", 401)
            }
          }
          else {
            throw new BadRequestError(`${key} cannot be used to filter: valid filter are: "title", "minSalary" and "hasEquity`, 401)
          } 
          filterText += ' AND '
        }
        // remove last AND from string and make query
        let textLength = filterText.length - 1
        const companiesRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle 
           FROM jobs
           ${filterText.substring(0, textLength - 3)}
           ORDER BY title`);
        filterText.substring()
        return companiesRes.rows;
}

module.exports = {
    filterJobs,
    filterCompanies
}