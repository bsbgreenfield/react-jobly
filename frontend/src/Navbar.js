import React, { useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "./UserContext";
import { Nav, NavItem, NavLink } from 'reactstrap'

function Navbar() {
    const { currUser } = useContext(userContext)
  
    return (
        <Nav pills>
            <NavItem>
                <NavLink tag={Link} to={"/Homepage"}>Jobly</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag= {Link} to={"/companies"}>Companies</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag= {Link} to={"/jobs"}>Jobs</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag= {Link} to={"/Signup"}>Signup</NavLink>
            </NavItem>
            <NavItem>
                {currUser ? <NavLink tag= {Link} to={"/logout"}>logout</NavLink> :
                    <NavLink tag= {Link} to={"/Login"}>Login</NavLink>}
            </NavItem>
            <NavItem>
                <NavLink tag= {Link} to={"/profile"}>Profile</NavLink>
            </NavItem>

        </Nav>
    )
}

export default Navbar