"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u3Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('/POST', function(){
    test('creates a new job if admin', async function(){
        const resp = await request(app).post('/jobs')
        .send({"title": "testjob", "salary": 777, "equity": 0.3, 'companyHandle' : 'c1'})
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.body).toEqual({'job': {"title": "testjob", "salary": 777, "equity": "0.3", 'company_handle' : 'c1'}})
    });
    test('doesnt work for non admin', async function(){
        const resp = await request(app).post('/jobs')
        .send({"title": "testjob", "salary": 777, "equity": 0.3, 'companyHandle' : 'c1'})
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401)
    });
    test('doesnt work for anon', async function(){
        const resp = await request(app).post('/jobs')
        .send({"title": "testjob", "salary": 777, "equity": 0.3, 'companyHandle' : 'c1'});
    expect(resp.statusCode).toEqual(401)
    });
})

describe('/GET', function(){
    test('gets all jobs if admin', async function(){
        const resp = await request(app).get('/jobs')
        .set("authorization", `Bearer ${u3Token}`);
        expect(resp.body).toEqual([
            {
                "title": 'j1',
                "salary": 123,
                "equity": "0.1",
                "company_handle" :'c1'
            },
            {
                "title": 'j2',
                "salary": 456,
                "equity":  "0.1",
                "company_handle" :'c1'
            },
            {
                "title": 'j3',
                "salary": 789,
                "equity": "0.1",
                "company_handle" :'c2'
            }
        ])
    })
    test('works for anons', async function(){
        const resp = await request(app).get('/jobs');
        const sqljobs = await db.query(`SELECT * FROM jobs`)
        expect(resp.body).toEqual([
            {
                "title": 'j1',
                "salary": 123,
                "equity": "0.1",
                "company_handle" :'c1'
            },
            {
                "title": 'j2',
                "salary": 456,
                "equity":  "0.1",
                "company_handle" :'c1'
            },
            {
                "title": 'j3',
                "salary": 789,
                "equity": "0.1",
                "company_handle" :'c2'
            }
        ])
    })
})

describe('/GET/:id', function() {
    test('works for admins', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).get(`/jobs/${sqlJob1.rows[0].id}`)
        .set("authorization", `Bearer ${u3Token}`)
        expect(resp.body).toEqual({
                "title": 'j1',
                "salary": 123,
                "equity": "0.1",
                "company_handle" :'c1'
        })
    })
    test('works for anon', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).get(`/jobs/${sqlJob1.rows[0].id}`)
        expect(resp.body).toEqual({
                "title": 'j1',
                "salary": 123,
                "equity": "0.1",
                "company_handle" :'c1'
        })
    })
})

describe('/PATCH/:id', function(){
    test('patial update job as admin', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).patch(`/jobs/${sqlJob1.rows[0].id}`)
        .send({"title": "newTitle"})
        .set("authorization", `Bearer ${u3Token}`);
        expect(resp.body).toEqual({
            "title": 'newTitle',
            "salary": 123,
            "equity": "0.1",
            "companyHandle" :'c1'
        })
    })
    test('wrong data type fails', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).patch(`/jobs/${sqlJob1.rows[0].id}`)
        .send({"title": "newTitle", "salary": "hello"})
        .set("authorization", `Bearer ${u3Token}`);
        expect(resp.status).toEqual(400)
    })
    test('fails for non-admin ', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).patch(`/jobs/${sqlJob1.rows[0].id}`)
        .send({"title": "newTitle", "salary": 123})
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.status).toEqual(401)
    })
    test('fails for admin', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).patch(`/jobs/${sqlJob1.rows[0].id}`)
        .send({"title": "newTitle", "salary": 123})
        expect(resp.status).toEqual(401)
    })
})

describe('/delete/:id', function(){
    test('deletes one job', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).delete(`/jobs/${sqlJob1.rows[0].id}`)
        .set("authorization", `Bearer ${u3Token}`);
        expect(resp.body).toEqual({"status":"deleted"})
        let foundJob = await db.query(`SELECT * FROM jobs WHERE title = 'j1'`)
        let allJobs = await db.query(`SELECT * FROM jobs`)
        expect(foundJob.rows.length).toEqual(0)
        expect(allJobs.rows.length).toEqual(2)
    })
    test('doesnt work for non-admin', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).delete(`/jobs/${sqlJob1.rows[0].id}`)
        expect(resp.status).toEqual(401)

    })
    test('doesnt work for anon', async function(){
        const sqlJob1 = await db.query(`SELECT id FROM jobs WHERE title = 'j1'`)
        const resp = await request(app).delete(`/jobs/${sqlJob1.rows[0].id}`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.status).toEqual(401)

    })
})




