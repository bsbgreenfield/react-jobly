import React, {useContext, useState} from "react";
import userContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import JoblyApi from "./api";


function SignupForm(){
    const navigate = useNavigate()

    const {registerUser} = useContext(userContext)

    const initialState = {
    username: '', 
    password: '', 
    firstName: '',
    lastName: '', 
    email: ''
}
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        registerUser(formData)
        navigate('/')
    }

    return(
        <form onSubmit={handleSubmit} >
            <label htmlFor="username">Username: </label>
            <input 
            type="text" 
            name="username" 
            id="username" 
            onChange={handleChange}
            value={formData.username}/>
            <label htmlFor="password">Password: </label>
            <input 
            type="password" 
            name="password" 
            id="password" 
            onChange={handleChange}
            value={formData.password}/>
            <label htmlFor="firstName">First Name: </label>
            <input 
            type="text" 
            name="firstName" 
            id="firstName" 
            onChange={handleChange}
            value={formData.firstName}/>
            <label htmlFor="lastName">Last Name: </label>
            <input 
            type="text" 
            name="lastName" 
            id="lastName" 
            onChange={handleChange}
            value={formData.lastName}/>
            <label htmlFor="email">Email: </label>
            <input 
            type="email" 
            name="email" 
            id="email" 
            onChange={handleChange}
            value={formData.email}/>
          {/*   <label htmlFor="is_admin">Admin: </label>
            <select onChange={handleChange}>
                <option value={false}>  </option>
                <option value={true}>true</option>
                <option value={false}>false</option>
            </select> */}

            <button type="submit">Submit</button>
        </form>
    )
}

function LoginForm(){
    const {loginUser} = useContext(userContext)
    const navigate = useNavigate()

    const initialState = {
        username: '', 
        password: '', 
    }
        const [formData, setFormData] = useState(initialState)
    
        const handleChange = (e) => {
            const {name, value} = e.target
            setFormData({...formData, [name]: value})
        }
    
        const handleSubmit = e => {
            e.preventDefault()
            loginUser(formData)
            navigate('/')
        }

        return(
            <form onSubmit={handleSubmit} >
                <label htmlFor="username">Username: </label>
                <input 
                type="text" 
                name="username" 
                id="username" 
                onChange={handleChange}
                value={formData.username}/>
                <label htmlFor="password">Password: </label>
                <input 
                type="password" 
                name="password" 
                id="password" 
                onChange={handleChange}
                value={formData.password}/>
                <button type="submit">Submit</button>
            </form>
            )
}


function UserUpdateForm({userdata}){
    
    const {updateUser} = useContext(userContext)

    const navigate = useNavigate()
    const initialState = {
    username: userdata.username, 
    password: "", 
    firstName: userdata.firstName,
    lastName: userdata.lastName, 
    email: userdata.email
}
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        updateUser(userdata.username, {
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                email:formData.email })
        navigate('/')
    }

    return(
        <form onSubmit={handleSubmit} >
            <label htmlFor="username">Username: </label>
            <input 
            type="text" 
            name="username" 
            id="username" 
            value={formData.username}
            onChange={handleChange}
            readOnly/>
            <label htmlFor="password">Password: </label>
            <input 
            type="password" 
            name="password" 
            id="password" 
            onChange={handleChange}
            value={formData.password}/>
            <label htmlFor="firstName">First Name: </label>
            <input 
            type="text" 
            name="firstName" 
            id="firstName" 
            onChange={handleChange}
            value={formData.firstName}/>
            <label htmlFor="lastName">Last Name: </label>
            <input 
            type="text" 
            name="lastName" 
            id="lastName" 
            onChange={handleChange}
            value={formData.lastName}/>
            <label htmlFor="email">Email: </label>
            <input 
            type="email" 
            name="email" 
            id="email" 
            onChange={handleChange}
            value={formData.email}/>
          {/*   <label htmlFor="is_admin">Admin: </label>
            <select onChange={handleChange}>
                <option value={false}>  </option>
                <option value={true}>true</option>
                <option value={false}>false</option>
            </select> */}

            <button type="submit">Submit</button>
        </form>
    )
}

export {SignupForm, LoginForm, UserUpdateForm}