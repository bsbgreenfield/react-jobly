import React, {useContext} from "react";
import {UserUpdateForm} from './UserForms'
import userContext from "./UserContext";

function Profile(){
    const {currUser } = useContext(userContext)
  
    if (!currUser){
        return <div>Please Log In</div>
    }
    return(
        <UserUpdateForm userdata = {currUser.user} />
    )
}


export default Profile