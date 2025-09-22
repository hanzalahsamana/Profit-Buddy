import React, { useEffect, useRef, useState } from "react";
import { IoArrowUp } from "react-icons/io5";
import Button from "../Controls/Button";
import { aiChatStream } from "../../Apis/AiChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBuddy = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { sender: "bot", text: "Hi there! 👋 How can we help you today?" },
    ]);
    const messengerRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const onMessageChunk = (chunk) => {
        setChat((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.sender === 'bot') {
                // update last bot message
                const newChat = [...prev];
                newChat[newChat.length - 1].text = chunk;
                return newChat;
            } else {
                // first bot message
                return [...prev, { sender: 'bot', text: chunk }];
            }
        });
    };

    const handleSend = async (e) => {
        try {
            e.preventDefault();
            if (!message.trim()) return;

            const userMessage = message.trim();
            setChat((prev) => [...prev, { sender: 'user', text: userMessage }]);
            setMessage('');
            setLoading(true);

            setChat((prev) => [...prev, { sender: 'bot', text: '' }]);

            const response = await aiChatStream({ message: userMessage })

            if (!response.body) throw new Error('No stream available');

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');



            let botMessage = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');

                for (let line of lines) {
                    if (line.startsWith('data: ')) {
                        const text = line.replace('data: ', '').trim();
                        if (text === '[DONE]') break;

                        botMessage += ` ${text}`;

                        if (onMessageChunk) {
                            onMessageChunk(botMessage); // callback to update React state
                        }
                    }
                }
            }
        } catch (error) {
            if (onMessageChunk) onMessageChunk('Oops! Something went wrong.');
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (messengerRef.current) {
            messengerRef.current.scrollTop = messengerRef.current.scrollHeight;
        }
    }, [chat]);

    return (
        <div className="h-[350px] flex flex-col">
            <div
                ref={messengerRef}
                className="flex-1 scroll-smooth customScroll space-y-6 p-2"
            >

                {chat.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-5 py-2 rounded-xl  break-words ${msg.sender === "user"
                                ? "bg-border/80 text-secondary rounded-br-none text-sm max-w-[75%]"
                                : "bg-transparent text-secondary/70 rounded-bl-none text-sm"
                                }`}
                            style={{ whiteSpace: "pre-wrap" }} // keep line breaks
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            {msg.time && (
                                <span className="text-xs text-gray-500 block pt-2">{msg.time}</span>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2">
                        <div className="w-[15px] h-[15px] rounded-full border-[1.5px] border-t-secondary/40 border-border/50 animate-spin"></div>
                        <p className="text-xs text-secondary/50">Generating ...</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="flex items-center pt-3 gap-3 bg-primary">
                <div className="bg-border/90 w-full h-[50px] p-2 rounded-full border gap-3 border-border/40 flex justify-between items-center">
                    <input
                        placeholder="Ask anything"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className="h-full flex-1 outline-none pl-6"
                    />
                    <Button
                        disabled={!message.trim() || loading}
                        type="submit"
                        size="small"
                        corner="full"
                        variant="secondary"
                        label={<IoArrowUp size={20} />}
                        action={handleSend}
                        className="!h-[36px] !w-[36px] flex items-center justify-center !p-0"
                    />
                </div>
            </form>
        </div>
    );
};

export default ChatBuddy;
