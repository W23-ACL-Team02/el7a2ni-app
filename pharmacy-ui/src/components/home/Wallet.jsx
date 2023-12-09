import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const baseURL = `http://localhost:3000`

export default function Wallet({balance}) {
    return (
        <div className='container-main'>
            <p>Balance: {balance}</p>
        </div>
    )
}