import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom'
import Card from './Card'
import Logout from './Logout';
import '../css/general.css'
import '../css/patientNavbar.css'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function PharmacistNavBar() {
    let navigate = useNavigate()

    return (
        <div className='bar'>
            <button className='nav-button' style={{width: 140, paddingLeft: 8, paddingRight: 8, marginLeft: 'auto', fontWeight: 800, fontSize: 30, marginLeft: 10}} onClick={() => {navigate('/home')}}>
                El7a2ni
            </button>
            <div className='search'>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input className='search-input' placeholder='Search'></input>
            </div>
            <button className='nav-button' style={{width: 180, paddingLeft: 8, paddingRight: 8, marginLeft: 'auto'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Chat With Us
            </button>
            <button className='nav-button' style={{width: 140, paddingLeft: 8, paddingRight: 8}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Account
            </button>
            <Logout></Logout>
            <button className='nav-button' style={{width: 40, paddingLeft: 8, paddingRight: 8, marginLeft: 10}} onClick={() => {navigate('/notifications')}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
            </button>
        </div>
    )
}
