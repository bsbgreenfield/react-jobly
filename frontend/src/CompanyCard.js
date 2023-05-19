import React from "react";
import "./Card.css"
function  CompanyCard({company}) {
    return(
        <div className="Card-wrapper">
            <h4>{company.handle}</h4>
            <p>{company.description}</p>
            <img src={company.logoUrl}/>
            <h6>{company.name}</h6>
        </div>
    )
}

export default CompanyCard