"use client";
import { useEffect, useState,useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@/middleware/SessionContext";
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

interface Message {
  id: string;
  Text: string;
  sender: {
    username: string | null;
    id: string;
  };
  publishedAt: string;
}

export default function ChatArea() {
  const { sessionId, socket,sessionDetails } = useSession();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://strapi-backend-71a0.onrender.com";

  useEffect(() => {
    if (socket && sessionId) {
      socket.emit("joinRoom", sessionId);
    }
    return () => {
      socket?.off("joinRoom");
    };
  }, [socket, sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get(
          `${apiUrl}/api/sessions/${sessionId}?populate[message][populate]=sender&populate[message][sort]=createdAt:asc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data.data.message || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [apiUrl, sessionId]);

  const sendMessage = (e:React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    const sender = Cookies.get("user");

    if (!sender) {
      console.error("Sender is undefined");
      return;
    }

    const senderObj = JSON.parse(sender);
    socket?.emit("sendMessage", { recievedText: newMessage, sender: JSON.stringify(senderObj), sessionId });
    setNewMessage("");
    try
    {
      axios.post(`${apiUrl}/api/messages`, {
        data: {
          Text: newMessage,
          sender: senderObj.id,
          session: sessionId,
        },
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
    }
    catch(e)
    {
      console.error("Error sending message:", e);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  }
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (res: { id: string; recievedText: string; sender: string; publishedAt: string }) => {
        const parsedSender = JSON.parse(res.sender);
        setMessages((prev) => [
          ...prev,
          {
            id: res.id || "",
            Text: res.recievedText || "",
            sender: {
              username: parsedSender.username || null,
              id: parsedSender.id || null,
            },
            publishedAt: res.publishedAt || new Date().toISOString(),
          },
        ]);
      });
    }
    return () => {
      socket?.off("newMessage");
    };
  }, [socket, sessionId]);

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRe-vEclWO4EukVKcYgW8stlX60KUUCkPZCQ&s=10"
            alt="chat"
            width={80}
            height={80}
          />
          No session selected. Please select a session to start chatting.
        </div>
      </div>
    );
  }



  return (
    <div className="flex flex-col h-full mb-20  ">
      <div className=" mt-2 p-2  bg-gradient-to-l from-blue-300 via-blue-500 to-indigo-600 text-white flex items-center justify-between  shadow-lg shadow-blue-900 ">
      < div className="ml-10  py-2 flex   items-center justify-center text-white font-bold font-mono text-xl">
      {sessionDetails?.name} 
      </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 mt-2 
     text-white">
        {loading ? (
          <div className="flex justify-center items-center mt-60">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500 text-center">No messages yet.</div>
        ) : (
         
          messages.map((message, index) => (
            message ? (
              <div key={index} className={`mb-4 ${message.sender?.id === user?.id ? "flex justify-end " : "flex justify-start "}`}>
                <div className="flex-col">
                  {message.sender ? (
                    <div className="text-sm text-black font mb-1">{message.sender.username}</div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-1">Unknown User</div>
                  )}

                  {message.Text && (
                    <div className={` p-2  shadow-md   
                   ${message.sender?.id === user?.id ? "bg-purple-500 rounded-2xl text-white shadow-xl shadow-purple-800 px-3" : "bg-indigo-500 shadow-xl shadow-indigo-700 rounded-2xl px-3  "}`}>{message.Text}</div>
                  )}
                  {message.publishedAt && (
                    <div className="text-xs text-black 
                  justify-end mt-2">{new Date(message.publishedAt).toLocaleTimeString()}</div>
                  )}
                </div >
              </div>
            ) : null
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-indigo-200  text-white flex">
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 mr-2 text-black border-cyan-100 bg-blue-100"
        />
        <Button onClick={sendMessage} className="bg-white hover:bg-blue-200">
          <Image src="https://img.icons8.com/m_rounded/512w/filled-sent.png" alt="send" width={24} height={24} />
        </Button>
      </div>
    </div>
  );
}