import React, { useContext } from "react";
import JobCard from "./JobCard";
import SearchForm from "./SearchForm";
import {v4 as uuid} from 'uuid'
import userContext from "./UserContext";

function Jobs({jobs, filterJobs}){
   const {currUser} = useContext(userContext)
if (currUser && jobs.length){
   return(
      <div>
          <SearchForm filter={filterJobs}/>
        {jobs ?
        jobs.map(job => <JobCard key = {uuid()} job = {job} currUser={currUser}/>)
        : <div>Loading...</div>
        }
      </div>
   )
}
 else if (jobs.message){
   return(
      <>
       <SearchForm filter={filterJobs}/>
         <div> No Jobs found</div>
      </>
     
   ) 
}

else{
   return <div>Must be logged in</div>
}

}

export default Jobs