import React, { useContext } from "react";
import userContext from "./UserContext";
import { useNavigate } from "react-router-dom";


function Logout(){
    const {logoutUser} = useContext(userContext)
    const navigate = useNavigate()
    const doLogout = () => {
        logoutUser()
        navigate('/')
    }
    return(
        <button onClick={doLogout}>Click to log out</button>
    )
}

export default Logout