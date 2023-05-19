import React, { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom'
import Companies from "./Companies";
import Jobs from "./Jobs";
import Profile from "./Profile";
import Login from "./Login";
import Signup from "./Signup";
import Homepage from "./Homepage";
import JoblyApi from "./api";

function Router() {
    const [companies, setCompanies] = useState([])

    useEffect(() => {
        async function getDataOnLoad(){
            let c = await JoblyApi.getAllCompanies()
            setCompanies(c.companies)
        }
        getDataOnLoad()
    },[])

    const filterCompanies = async(name) => {
        let filteredResults = await JoblyApi.getAllCompanies({name : name})
        setCompanies(filteredResults.companies)
    }
    return (
        <Routes>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/companies" element={<Companies companies={companies} filterCompanies = {filterCompanies}/>} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/*" element={<Homepage />} />
        </Routes>
    )
}

export default Router
