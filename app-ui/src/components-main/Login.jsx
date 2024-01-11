import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom'
import '../App'
const baseURL = process.env.REACT_APP_SERVER_URL

export default function Login({loggedIn, setLoggedIn, setUserType}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState([])
    let navigate = useNavigate()
        
    const onButtonClick = () => {
        // Make call to backend
        axios
            .post(`${baseURL}/clinic/public/user/login`, {username, password}, {withCredentials:true})
            .then((response) => {
                setErrors([]);
                setLoggedIn(true);
                setUserType(response.data?.type);
                localStorage.setItem('currUser', response.body);
                if(response.data?.pendingContract === 'pendingcontract'){
                    navigate('/Contract');
                } else if(response.data?.pendingContract === 'rejected'){
                    setErrors('This account was rejected');
                }else{
                    navigate('/home');
                }
                
                
                
            })
            .catch((error) => {
                setErrors(error.response?.data?.errors)
            })
    }

    useEffect(() => {
        console.log('Type of setLoggedIn:', typeof setLoggedIn);
        setLoggedIn(false);
    }, [])

    return (
        <fieldset className={"container-main"}>
            <legend className={"container-title"}>
                <div>Login</div>
            </legend>
            <br />
            <div className={"container-input"}>
                <input
                    value={username}
                    type='text'
                    placeholder="Enter your username here"
                    onChange={e => setUsername(e.target.value)}
                    className={"inputBox"} />
            </div>
            <br />
            <div className={"container-input"}>
                <input
                    value={password}
                    type='password'
                    placeholder="Enter your password here"
                    onChange={e => setPassword(e.target.value)}
                    className={"inputBox"} />
            </div>
            <ErrorBox errors={errors}></ErrorBox>
            <br />
            <div className={"container-input"}>
                <input
                    className={"button-input"}
                    type="button"
                    onClick={onButtonClick}
                    value={"Log in"} />
            </div>
            <a onClick={() => {navigate('/VerifyEmail')}}> forgot password?</a>
            <p>Dont have an account?</p> 
            <button style={{width:'100px', height:'30px'}} onClick={() => navigate('/Register')}>Sign Up</button>
        </fieldset>
    )
}
