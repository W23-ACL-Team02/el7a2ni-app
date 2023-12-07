import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const baseURL = `http://localhost:3000`

export default function Home() {
    const [user, setUser] = useState(null);
    let navigate = useNavigate();
    
    useEffect(()=> {
        axios.get(`${baseURL}/private/user/getSelfUser`, {withCredentials: true}).then((response) => {
            setUser(response.data)
            console.log(`User set.`)
        }).catch((error) => {

        })
    }, [])

    return (
        <h2>HOME</h2>
    )
}