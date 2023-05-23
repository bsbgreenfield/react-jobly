import React, { useContext } from "react";
import userContext from "./UserContext";
import { Button } from "reactstrap";


function JobCard({job, currUser}){

    const {apply} = useContext(userContext)
    const applyTo = (e) => {
        e.target.innerText = "Applied!!"
        apply(currUser.user.username, job.id)
    }
    return(
        <div className="Card-wrapper">
            <h3>{job.title}</h3>
            <p>{job.salary}</p>
            <p>{job.equity}</p>
            {currUser.applications.includes(job.id) ? <Button color="success">Applied!!</Button> :
             <Button onClick={applyTo} color="info">Apply</Button>}
        </div>
    )
}

export default JobCard