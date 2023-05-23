import React from "react";
import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav>
            <Link to= {"/Homepage"}>Jobly</Link>
            <Link to= {"/companies"}>Companies</Link>
            <Link to= {"/jobs"}>Jobs</Link>
            <Link to= {"/Signup"}>Signup</Link>
            <Link to= {"/Login"}>Login</Link>
            <Link to={"/profile"}>Profile</Link>
        </nav>
    )
}

export default Navbar