import React, { useContext } from "react";
import userContext from "./UserContext";
import { Link } from "react-router-dom";

function Homepage(){
    const {currUser} = useContext(userContext)
return(
    <div>
        Welcome
        {currUser ? <strong>   {currUser.user.username}</strong>  : 
        <p>please <Link to={"/login"}>log in</Link></p>}
    </div>
)
}

export default Homepage