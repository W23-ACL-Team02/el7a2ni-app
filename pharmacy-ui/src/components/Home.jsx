import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Wallet from './home/Wallet';

const baseURL = process.env.REACT_APP_SERVER_URL

export default function Home() {
    const [user, setUser] = useState(null);
    let navigate = useNavigate();
    
    useEffect(()=> {
        axios.get(`${baseURL}/private/user/getSelfUser`, {withCredentials: true}).then((response) => {
            setUser(response.data)
            console.log(`User set.\n${response.data}`)
        }).catch((error) => {

        })
    }, [])

    return (
        <div className='container-home'>
            <h2>HOME</h2>
            <Wallet balance={user?.wallet ?? 0}></Wallet>
        </div>
    )
}