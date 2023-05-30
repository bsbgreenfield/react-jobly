import React, { useContext} from "react";
import CompanyCard from "./CompanyCard"
import {v4 as uuid } from 'uuid'
import SearchForm from "./SearchForm";
import userContext from "./UserContext";


function Companies({companies, filterCompanies}){
    const {currUser} = useContext(userContext)
    console.log(companies)
    if (currUser && companies.length){
        return(
            <div className="CompanyList">
                <SearchForm filter = {filterCompanies}/>
            <div className="CompanyWrapper" >
                {companies.length ?
                companies.map(c => <CompanyCard key = {uuid()} company = {c} />) 
                : <div> loading... </div>
                }
            </div>
            
            </div>
        )
    }
    else if (companies.length === 0){
        return(
            <div className="CompanyList">
                <SearchForm filter = {filterCompanies}/>
                <div>No Companies Found</div>
            </div>
          
        )
    }
    else{
        return(
            <div>You must be logged in</div>
        )
    }
    
    
}

export default Companies