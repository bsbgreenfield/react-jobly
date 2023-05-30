const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, isLoggedInAdmin } = require("../middleware/auth");

const jobNewSchema = require('../schemas/jobNew.json')
const jobUpdateSchema = require('../schemas/jobUpdate.json')
const Job = require('../models/job');
const { route } = require("./users");

const router = new express.Router();

router.post('/', isLoggedInAdmin, async (req, res, next) => {
    const validator = jsonschema.validate(req.body,jobNewSchema)
    console.log(validator.valid)
    try{
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const newJob = await Job.create(req.body)
        return res.status(201).json({"job": newJob})
    }
   catch(err){
    next(err)
   }
})

router.get('/', async (req, res, next) => {
    try {
        const filters = req.query
        const allJobs = await Job.getAll(filters);
        if (allJobs.length > 0) return res.json(allJobs)
        else return res.json({"message":"no jobs found with these parameters"})
    }
    catch(err){
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const job = await Job.get(req.params.id)
        return res.json(job)
    }
    catch(err){
        next(err)
    }
})

router.patch('/:id', isLoggedInAdmin, async (req, res, next) => {
    try{
        const data = req.body
        const validator = jsonschema.validate(data,jobUpdateSchema )
        if (!validator.valid){
            throw new BadRequestError(`${data} not valid input for update`, 401)
        }
        const job = await Job.update(req.params.id, data)
        return res.json(job)
    }
    catch(err){
        next(err)
    }
})

router.delete('/:id', isLoggedInAdmin, async (req, res, next) => {
    try{
        const job = await Job.remove(req.params.id)
        return res.json(job)
    }
    catch(err){
        next(err)
    }
})

module.exports = router