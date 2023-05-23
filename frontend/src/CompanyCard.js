import React from "react";
import "./Card.css"
import { useNavigate } from "react-router-dom";
function  CompanyCard({company}) {
    const navigate = useNavigate()

    const seeDetails = () => {
        navigate(`/companies/${company.handle}`)
    }

    return(
        <div className="Card-wrapper" onClick={seeDetails}>
            <h4>{company.handle}</h4>
            <p>{company.description}</p>
            <img src={company.logoUrl} alt="company-logo"/>
            <h6>{company.name}</h6>
        </div>
    )
}

export default CompanyCard