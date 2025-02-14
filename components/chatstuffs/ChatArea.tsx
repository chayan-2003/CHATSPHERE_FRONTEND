"use client";
import { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@/middleware/SessionContext";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      try {
        const user = Cookies.get("user");
        console.log(user);
        const token = Cookies.get("jwt");
        const response = await axios.get(
          `http://localhost:1337/api/sessions/${sessionId}?populate[message][populate]=sender&populate[message][sort]=createdAt:asc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("entire response is:", response);
        setMessages(response.data.data.message || []);
        console.log(response.data.data.message);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    socket?.emit("joinRoom", sessionId);
    fetchMessages();
  }, [sessionId, socket, messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return;

    try {
      const token = Cookies.get("jwt");
      const sender=Cookies.get("user");

      if (!sender) {
        console.error("Sender is undefined");
        return;
      }
      socket?.emit("sendMessage", { message: newMessage, sender , sessionId });
      const senderObj = JSON.parse(sender);
      const response = await axios.post(
        `http://localhost:1337/api/messages`,
        {
          data: {
            Text: newMessage,
            sender: {
              id: senderObj.id,
              username: senderObj.username
            },
            session: sessionId,

          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [...prev, response.data.data.message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message: Message) => {
        console.log("new message received:", message);
        setMessages((prev) => [...prev, 
          {
            id: message.id||"",
            Text: message.Text||"",
            sender: {
              username: message.sender.username||"",
              id: message.sender.id||"",
            },
            publishedAt: message.publishedAt||""
          }
        ]);
      });
    }
  }, [socket, sessionId, messages]);
  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No session selected. Please select a session to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">No messages yet.</div>
        ) : (

          messages.map((message,index) => (
            message ? (
              <div key={index} className="mb-4">
                {message.sender ? (
                  <div className="text-sm text-gray-500">{message.sender.username}</div>
                ) : (
                  <div className="text-sm text-gray-500">Unknown User</div>
                )}
                {message.Text && (
                  <div className="bg-white p-2 rounded-lg shadow-md">{message.Text}</div>
                )}
                {message.publishedAt && (
                  <div className="text-xs text-gray-400">{new Date(message.publishedAt).toLocaleString()}</div>
                )}
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
        <Button onClick={sendMessage} className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Send
        </Button>
      </div>
    </div>
  );
}