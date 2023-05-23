import React, {useContext, useEffect, useState} from "react";
import {UserUpdateForm} from './UserForms'
import userContext from "./UserContext";
import JoblyApi from "./api";

function Profile(){
    const {currUser } = useContext(userContext)
 /*    let [userData, setUserData] = useState('')
    useEffect(()=> {
        async function getData(username){
            userData = await JoblyApi.getUser(username)
            setUserData(userData)
            console.log(userData)
        }
       if(currUser) getData(currUser.username)
    }, [currUser]) */
  
    if (!currUser){
        return <div>Loading...</div>
    }
    return(
        <UserUpdateForm userdata = {currUser.user} />
    )
}


export default Profile