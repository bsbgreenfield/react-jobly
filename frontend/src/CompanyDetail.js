import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "./api";
import JobCard from './JobCard'
import {v4 as uuid } from 'uuid'
import userContext from "./UserContext";

function CompanyDetail(){
    const {currUser} = useContext(userContext)

    const [currCompany, setCurrCompany] = useState(null)
    const params = useParams()

    useEffect(() => {
        async function getCompanyDetail(params){
          let company =  await  JoblyApi.getCompany(params.company)
          setCurrCompany(company)
        }
        
        getCompanyDetail(params)
    }, [])



    if (currUser){
        if (currCompany == null){
            return <div>Loading...</div>
        } else if (currCompany != null){
            console.log(currCompany)
            return(
                <div className="CompanyDetail">
                    <h3>{currCompany.company.name}</h3>
                    <h4>{currCompany.company.description}</h4>
                    {currCompany.jobs.map(job => <JobCard key = {uuid()} job={job} currUser = {currUser}/>)}
                </div>
            )
        }
    }
    else return <div>Must be logged in</div>
   
}

export default CompanyDetail