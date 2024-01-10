import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom'
import Card from './Card'
import '../css/general.css'
import '../css/patientHome.css'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function NotificationPane() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get(`${baseURL}/main/user/notifications`, {withCredentials:true})
            .then((response) => {
                setNotifications(response.data.notifs)
            })
            .catch((error) => {

            })
    }, [])

    return (
        <div className='main'>
            {
                notifications.length < 1 ?
                <p>No notifications.</p> 
                :
                <table>
                    <tr> {
                        notifications.map((notification, index) => {
                            <p key={index}>
                                <strong>{notification.title}</strong>
                                <br/>
                                {notification.message}
                            </p>
                        })
                    } </tr>
                </table>
            }  
        </div>
    )
}