import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { IconImages } from "../../Enums/Enums";
import { AnimatePresence } from "framer-motion";
import CustomInput from "../Controls/CustomInput";
import Button from "../Controls/Button";
import { IoArrowUp, IoHome } from "react-icons/io5";

const ChatBuddy = () => {
    const [message, setMessage] = useState("");
    const messengerRef = useRef(null)
    const [chat, setChat] = useState([
        { sender: "bot", text: "Hi there! 👋 How can we help you today?" },
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setChat([...chat, { sender: "user", text: message }]);
        setMessage("");

        setTimeout(() => {
            setChat((prev) => [
                ...prev,
                { sender: "bot", text: "Thanks for your message! Our team will reply shortly ⏳", time: new Date().toLocaleTimeString() },
            ]);
        }, 1000);
    };

    useEffect(() => {
        if (messengerRef.current) {
            messengerRef.current.scrollTop = messengerRef.current.scrollHeight;
        }
    }, [chat]);

    return (

        <div className="h-[350px] flex flex-col">
            <div ref={messengerRef} className="flex-1  scroll-smooth customScroll space-y-6 p-2">
                {chat.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`px-5 py-2 rounded-xl max-w-[75%] break-words  ${msg.sender === "user"
                                ? "bg-border/80 text-secondary rounded-br-none text-sm"
                                : "bg-transparent text-secondary rounded-bl-none text-base"
                                }`}
                        >
                            {msg.text} {msg.time && <span className="text-xs text-gray-500 block pt-2">{msg.time}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <form
                onSubmit={handleSend}
                className="flex items-center pt-3 gap-3 bg-primary"
            >

                <div className="bg-border/90 w-full h-[50px] p-2 rounded-full border gap-3  border-border/40 flex justify-between items-center">
                    <input placeholder="Ask anything" value={message} onChange={(e) => setMessage(e.target.value)} type="text" className="h-full flex-1 outline-none pl-6" />
                    <Button
                        disabled={!message.trim() ? true : false}
                        type="submit"
                        size='small'
                        corner="full"
                        variant='secondary'
                        label={<IoArrowUp size={20} />}
                        action={handleSend}
                        className='!h-[36px] !w-[36px] flex items-center justify-center !p-0'
                    />
                </div>
                {/* <CustomInput
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    placeholder="Type your message..."
                    // suffix={ }

                /> */}
            </form>
        </div>
    )
}

export default ChatBuddy;
