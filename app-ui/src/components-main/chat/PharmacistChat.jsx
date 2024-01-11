import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import socket from '../../socketManager'
import Card from '../Card'

const baseURL = process.env.REACT_APP_SERVER_URL



export default function PharmacistChat({userType}) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Set up event listeners for incoming messages
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    const sendMessage = () => {
        socket.emit('chat message', {message: message, userType: userType});
        setMessage('');
    };

    return (
        <Card>
            <ul>
                {messages.map((msg, index) => (
                <li key={index} style={{textAlign: msg.userType === "patient" ? "right":"left"}}>{msg.message}</li>
                ))}
            </ul>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </Card>
    );
}