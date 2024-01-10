import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import ConversationWindow from '../components-main/chat/ConversationWindow'
import AllChats from '../components-main/chat/AllChats'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function ChatPage() {
    const [chatId, setChatId] = useState(null)

    return (
        <div>
            {(chatId === null) ? <ConversationWindow chatId={chatId} setChatId={setChatId}/> : <AllChats setChatId={setChatId}/>}
        </div>
    )
}