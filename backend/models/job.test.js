"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('CREATE', function() {
    test('creates a new job', async function(){
        const newJob = {
            "title": "newJob",
            "salary": 999,
            "equity": 0.5,
            "companyHandle": 'c2'
        }
        let job = await Job.create(newJob)
        expect(job).toEqual({
            "title": "newJob",
            "salary": 999,
            "equity": "0.5",
            "company_handle": 'c2'
        })
        let sqlJob = await db.query(`
            SELECT * FROM jobs WHERE title = 'newJob'
            `)
        expect(sqlJob.rows[0].title).toEqual("newJob")
    })
})

describe('GET ALL', function(){
    test('returns all jobs with no filters', async function(){
        let allJobs = await Job.getAll()
        expect(allJobs).toEqual([
            {
                "title": "tester",
                "salary": 12345,
                "equity": "0.1",
                "company_handle": 'c1'
            },
            {
                "title": "manager",
                "salary": 999,
                "equity": "0.2",
                "company_handle": 'c1'
            },
            {
                "title": "janitor",
                "salary": 111,
                "equity": "0.1",
                "company_handle": 'c2'
            }]
        )
    })
    test("works filtering by title", async function(){
        let jobs = await Job.getAll({"title": "test"})
        expect(jobs).toEqual([  
            {
            "title": "tester",
            "salary": 12345,
            "equity": "0.1",
            "company_handle": 'c1'
        }])
    })
    test("works filtering by hasEquity", async function(){
            let jobs = await Job.getAll({"hasEquity": "true"})
            expect(jobs.length).toEqual(3)
    })
    test("works if no jobs found", async function(){
        let jobs = await Job.getAll({'title': "abcdefg"})
        console.log(jobs)
        expect(jobs.length).toEqual(0)
    })
    test("works if multiple paramters", async function(){
        let jobs = await Job.getAll({"hasEquity":"true", "minSalary": 10 })
        expect(jobs.length).toEqual(3)
    })
})

describe('get by id', function(){
    test('returns one job', async function(){
        let newJob = await db.query(`
            SELECT id
            FROM jobs WHERE title = 'tester'`)

        let job = await Job.get(newJob.rows[0].id)
        expect(job).toEqual( {
            "title": "tester",
            "salary": 12345,
            "equity": "0.1",
            "company_handle": 'c1'
        })
    })
})

describe('UPDATE job', function(){
    test('updates and returns job', async function(){
        let sqlJob = await db.query(`SELECT id FROM jobs WHERE title = 'tester'`)
        let updatedJob = await Job.update(sqlJob.rows[0].id, {'title': 'newTitle', 'salary': 987})
        expect(updatedJob).toEqual({
            "title": "newTitle",
            "salary": 987,
            "equity": "0.1",
            "companyHandle": 'c1'
        })
    })
    test('doesnt allow updating company_handle', async function(){
        try{
            let sqlJob = await db.query(`SELECT id FROM jobs WHERE title = 'tester'`)
            let updatedJob = await Job.update(sqlJob.rows[0].id, {'title': 'newTitle', 'companyHandle': 'c3'})
        }
       catch(err){
        expect(err instanceof BadRequestError).toBeTruthy()
       }
    })
})

describe('REMOVE job', function(){
    test('removes one job', async function(){
        let sqlJob = await db.query(`SELECT id FROM jobs WHERE title = 'tester'`)
        let gonerJob = await Job.remove(sqlJob.rows[0].id)
        expect(gonerJob).toEqual({'status': 'deleted'})
    })
})