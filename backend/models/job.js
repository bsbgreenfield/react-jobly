"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {filterCompanies, filterJobs} = require('../helpers/filter')

class Job{
    static async create({title, salary, equity, companyHandle}){
        let newJob = await db.query(`
                INSERT INTO jobs (title, salary, equity, company_handle)
                VALUES ($1, $2, $3, $4)
                RETURNING title, salary, equity, company_handle
        `, [title, salary, equity, companyHandle])
        return newJob.rows[0]
    }

    static async getAll(filters=null){
        if (filters == null || Object.keys(filters).length == 0){
            let allJobs = await db.query(`
            SELECT id, title, salary, equity, company_handle FROM jobs
            ORDER BY id`)
            return allJobs.rows
        }
        else {
          return await filterJobs(filters)
          }
        
    }

    static async get(id){
        let job = await db.query(`
        SELECT id, title, salary, equity, company_handle FROM jobs
        WHERE id = $1`, [id])
        return job.rows[0]
    }

    static async update(id, data){
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
              companyHandle: "company_handle"
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs
                              SET ${setCols} 
                              WHERE id = ${idVarIdx} 
                              RETURNING title, 
                                        salary, 
                                        equity, 
                                        company_handle AS "companyHandle"
                            `
        const result = await db.query(querySql, [...values, id]);
        if (!result.rows[0]) throw new NotFoundError('no such job', 404)
        return result.rows[0]
    }

    static async remove(id){
        let gonerJob = await db.query(
            `
            DELETE FROM jobs WHERE id = $1
            `, [id])
            return {'status': 'deleted'}
    }
    
}

module.exports = Job