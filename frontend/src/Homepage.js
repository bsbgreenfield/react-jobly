import React, { useContext } from "react";
import userContext from "./UserContext";

function Homepage(){
    const {currUser} = useContext(userContext)
return(
    <div>
        Welcome
        {currUser ? <strong>   {currUser.user.username}</strong>  : <p>please log in</p>}
    </div>
)
}

export default Homepage