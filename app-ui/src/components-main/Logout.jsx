import React from 'react'
import axios from 'axios'

import {useNavigate} from 'react-router-dom'

const baseURL = `http://localhost:3000`

export default function Logout() {
    const navigate = useNavigate();
        
    const onButtonClick = () => {
        // Make call to backend
        axios
            .get(`${baseURL}/private/user/logout`, {withCredentials:true})
            .then((response) => {
                navigate('/login')
            })
            .catch((error) => {

            })
    }

    return (
        <button onClick={onButtonClick}>Logout</button>
    )
}
