import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom'
import '../../css/general.css'
import '../../css/patientHome.css'
import Card from '../Card'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function NotificationPane() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get(`${baseURL}/main/private/user/notifications`, {withCredentials:true})
            .then((response) => {
                setNotifications(response.data.notifs)
                console.log(response.data)
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
                <div>
                    {
                        notifications.map((notification, index) => (
                            <Card>
                                <strong>{notification.title}</strong> <br />
                                {notification.message}
                            </Card>
                        ))
                    }
                </div>
            }  
        </div>
    )
}