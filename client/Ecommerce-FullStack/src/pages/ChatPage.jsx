import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
    transports: ['websocket']
})

const ChatPage = () => {
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        socket.on('messageLogs', (data) => {
            setMessages((prevMessages) => [...prevMessages, data])
        })

        const getUserEmail = async () => {
            const { value: email } = await Swal.fire({
                title: 'Your email',
                input: 'text',
                text: 'Please enter your email to chat',
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to enter an email to chat'
                    }
                    return null
                },
                allowOutsideClick: false
            })

            if (email) {
                setUser(email)
            }
        }

        getUserEmail()

        return () => {
            socket.off('messageLogs')
        }
    }, [])

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (user && message.trim().length > 0) {
            // Envía el mensaje al servidor
            socket.emit('message', { user, message })
            setMessage('')
        }
    };

    return (
        <div className='mx-auto mt-4 w-full flex flex-col items-center'>
            <h1 className='text-bold text-xl my-4'>Welcome! Here you can chat!</h1>
            <div>
                <form onSubmit={handleSendMessage} >
                    <input
                        id='chatBox'
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className='border-2 rounded-md border-zinc-900 p-2'
                    />
                    <button type="submit" className='bg-zinc-600 rounded-md text-white p-2 ml-2'>Send</button>
                </form>
            </div>
            <div>
                <div id="messageLogs" className='my-2 bg-red-200 p-2 rounded-md'>
                    {messages.map((data, index) => (
                        <p key={index} className="border-b border-gray-600 pb-2 m-1">{data.user}: {data.message.message}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChatPage;
