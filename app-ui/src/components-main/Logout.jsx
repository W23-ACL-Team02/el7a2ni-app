import React from 'react'
import axios from 'axios'

import {useNavigate} from 'react-router-dom'

const baseURL = process.env.REACT_APP_SERVER_URL;

export default function Logout() {
    const navigate = useNavigate();
        
    const onButtonClick = () => {
        // Make call to backend
        axios
            .get(`${baseURL}/clinic/private/user/logout`, {withCredentials:true})
            .then((response) => {
                navigate('/login')
            })
            .catch((error) => {

            })
    }

    return (
        <button style= {{width: 200, height: 120, background:'#880808',borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}}onClick={onButtonClick}>Logout</button>
    )
}
