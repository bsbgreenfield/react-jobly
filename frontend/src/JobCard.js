import React, { useContext, useEffect, useState } from "react";
import userContext from "./UserContext";
import { Button } from "reactstrap";


function JobCard({job, currUser}){

    const {apply} = useContext(userContext)
    const applyTo = (e) => {
        setIsAppliedTo(true)
        e.target.innerText = "Applied!!"
        apply(currUser.user.username, job.id)
    }
    const [isAppliedTo, setIsAppliedTo] = useState(false)
    useEffect(() => {
        setIsAppliedTo(
            currUser.applications.includes(job.id))
    }, [currUser])
    return(
        <div className="Card-wrapper">
            <h3>Title: {job.title}</h3>
            <p>Salary: {job.salary}</p>
            <p>Equity: {job.equity}</p>
            {isAppliedTo ? <Button color="success">Applied!!</Button> :
             <Button onClick={applyTo} color="info">Apply</Button>}
        </div>
    )
}

export default JobCard