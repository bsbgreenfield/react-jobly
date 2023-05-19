import React from "react";
import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav>
            <Link to= {"/Homepage"}>Jobly</Link>
            <Link to= {"/Companies"}>Companies</Link>
            <Link to= {"/Jobs"}>Jobs</Link>
            <Link to= {"/Signup"}>Signup</Link>
            <Link to= {"/Login"}>Login</Link>
        </nav>
    )
}

export default Navbar