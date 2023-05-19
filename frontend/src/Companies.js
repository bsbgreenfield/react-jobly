import React, { useState } from "react";
import CompanyCard from "./CompanyCard"

function Companies({companies, filterCompanies}){
    console.log(companies)
    const [keyword, setKeyword] = useState("apple")

    const handleSubmit = (e) => {
        e.preventDefault()
        filterCompanies(keyword)
    }

    const handleChange = (e) => {
        setKeyword(e.target.value)
    }
return(
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="filter">Keyword: </label>
            <input type="text" name="filter" id="filter" value={keyword} onChange={handleChange}/>
            <button type="submit">Submit</button>
        </form>
       
        {companies.map(c => <CompanyCard company = {c}/>)}
    </div>
)
}

export default Companies