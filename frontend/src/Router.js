import React, { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom'
import Companies from "./Companies";
import Jobs from "./Jobs";
import Profile from "./Profile";
import Login from "./Login";
import Signup from "./Signup";
import Homepage from "./Homepage";
import JoblyApi from "./api";
import CompanyDetail from "./CompanyDetail";

function Router() {
    const [companies, setCompanies] = useState([])
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        async function getDataOnLoad() {
            let c = JoblyApi.getAllCompanies()
            let j =  JoblyApi.getAllJobs()
            let companies = await c;
            let jobs = await j;
            setCompanies(companies)
            setJobs(jobs)
        }
        getDataOnLoad()
    }, [])

    const filterCompanies = async (name) => {
        let filteredResults = await JoblyApi.getAllCompanies({ name: name })
        setCompanies(filteredResults)
    }

    const filterJobs = async (title) => {
        let filteredResults = await JoblyApi.getAllJobs({ title: title })
        setJobs(filteredResults)
    }

    
    return (
        <Routes>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/companies"
                element={<Companies
                    companies={companies}
                    filterCompanies={filterCompanies} />} />
            <Route path="/companies/:company" element={<CompanyDetail />} />
            <Route path="/jobs" element={<Jobs jobs ={jobs} filterJobs={filterJobs}/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/*" element={<Homepage />} />
        </Routes>
    )
}

export default Router
