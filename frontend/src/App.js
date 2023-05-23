import React, {useEffect, useState} from "react";
import { BrowserRouter} from "react-router-dom";
import Router from "./Router";
import Navbar from "./Navbar";
import userContext from "./UserContext";
import JoblyApi from "./api";
import jwt_decode from "jwt-decode"
import { useLocalStorage } from "./Hooks";

function App() {
const [token, setToken] = useLocalStorage()
const [currUser, setCurrUser] = useState(null)

const registerUser = async (token) => {
  let userToken = await JoblyApi.register(token)
  setToken(userToken)
}

const loginUser = async token => {
  let userToken = await JoblyApi.loginUser(token)
  setToken(userToken)
}

const logoutUser =  () => {
  setToken('')
  setCurrUser(null)
}

const updateUser = async (username, data) => {
 await JoblyApi.updateUser(username, data)
}

const apply = async (username, jobId) => {
  await JoblyApi.apply(username, jobId)
}
useEffect(() => {
  const setUser = async () => {
    if(token){
      JoblyApi.token = token
      let user = jwt_decode(token)
      let currUser = await JoblyApi.getUser(user.username)
      setCurrUser(currUser.user)
    }
  }
  setUser()
}, [token])
  return (
    <div className="App">
      <userContext.Provider value={{currUser, registerUser, loginUser, logoutUser, updateUser, apply}}>
        <BrowserRouter>
          <Navbar/>
          <Router/>
        </BrowserRouter>
      </userContext.Provider>
    
    </div>
  );
}

export default App;
