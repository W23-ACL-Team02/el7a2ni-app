import React, { useEffect, useState } from 'react'
import axios from 'axios'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function ConversationWindow({chatId, setChatId}) {
    const [messages, setMessages] = useState([]);
    let [messagesLoaded, setMessagesLoaded] = useState(false);

    // Get all previous messages, keep send button disabled until then
    useEffect(() => {

    }, [])

    return (
        <div>

        </div>
    )
}