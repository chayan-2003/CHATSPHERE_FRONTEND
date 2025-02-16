"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@/middleware/SessionContext";
import { FaSpinner } from 'react-icons/fa';

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
  const { sessionId, socket } = useSession();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    const token = Cookies.get("jwt");
    const sender = Cookies.get("user");

    if (!sender) {
      console.error("Sender is undefined");
      return;
    }

    const senderObj = JSON.parse(sender);
    const newMsg = {
      id: Date.now().toString(),
      Text: newMessage,
      sender: {
        id: senderObj.id,
        username: senderObj.username,
      },
      publishedAt: new Date().toISOString(),
    };

 
    socket?.emit("sendMessage", { recievedText: newMessage, sender: JSON.stringify(senderObj), sessionId });

  
  };

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (res: any) => {
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
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRe-vEclWO4EukVKcYgW8stlX60KUUCkPZCQ&s=10"
            alt="chat"
            className="w-20 h-20"
          />
          No session selected. Please select a session to start chatting.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full mb-20">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
        {loading ? (
          <div className="flex justify-center items-center mt-60">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500 text-center">No messages yet.</div>
        ) : (
          messages.map((message, index) => (
            message ? (
              <div key={index} className={`mb-4 ${message.sender?.id === user?.id ? "flex justify-start " : "flex justify-end "}`}>
                <div className="flex-col">
                  {message.sender ? (
                    <div className="text-sm text-gray-500 mb-1">{message.sender.username}</div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-1">Unknown User</div>
                  )}

                  {message.Text && (
                    <div className={` p-2  shadow-md   
                   ${message.sender?.id === user?.id ? "bg-blue-400 rounded-2xl text-white shadow-2xl shadow-blue-300 px-3" : "bg-green-400 shadow-2xl shadow-green-400 rounded-2xl px-3 "}`}>{message.Text}</div>
                  )}
                  {message.publishedAt && (
                    <div className="text-xs text-gray-400 
                  justify-end mt-2">{new Date(message.publishedAt).toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
            ) : null
          ))
        )}
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex">
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 mr-2 text-black"
        />
        <Button onClick={sendMessage} className="bg-white hover:bg-blue-200">
          <img src="https://img.icons8.com/m_rounded/512w/filled-sent.png" alt="send" className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}