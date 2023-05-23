import React, { useContext } from "react";
import userContext from "./UserContext";


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
            {currUser.applications.includes(job.id) ? <button>Applied!!</button> :
             <button onClick={applyTo}>Apply</button>}
        </div>
    )
}

export default JobCard