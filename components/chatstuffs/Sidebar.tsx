"use client";
import { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faPlus, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/middleware/SessionContext";
import ChatArea from "./chatArea"; // Import ChatArea component

interface UserSession {
  name: ReactNode;
  documentId: string;
  description: string;
}

export default function Sidebar() {
  const { setSessionId, sessionId,socket } = useSession();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [newSessionUsername, setNewSessionUsername] = useState<string>("");
  const [newSessionDescription, setNewSessionDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get("http://localhost:1337/api/sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const createSession = async () => {
    try {
      const token = Cookies.get("jwt");
      const response = await axios.post(
        "http://localhost:1337/api/sessions",
        {
          data: {
            name: newSessionUsername,
            description: newSessionDescription,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSessions([...sessions, response.data.data]);
      setNewSessionUsername("");
      setNewSessionDescription("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    setSessionId(sessionId);
    setIsSidebarOpen(false); 
  };

  return (
    <div className="relative md:flex w-0">
      <div className="p-4 flex items-center gap-2 md:hidden">
        <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-blue-400 text-white px-2 py-1 rounded-md hover:bg-blue-700">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </Button>
      </div>
      <div className={`fixed inset-0 z-50 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-64`}>
        <div className="w-full h-full text-black bg-white shadow-lg md:shadow-none">
          <div className="p-4 flex items-center gap-2 shadow-lg">
            <FontAwesomeIcon icon={faUserGroup} size="lg" />
            <h2 className="text-2xl font-bold">Sessions</h2>
            <Button onClick={() => setIsModalOpen(true)} className="ml-auto bg-blue-400 text-white px-2 py-1 rounded-md hover:bg-blue-700">
              <FontAwesomeIcon icon={faPlus} size="xs" />
            </Button>
          
          </div>
          <div className="h-full overflow-y-scroll py-2 pb-20 pt-4 px-4">
            <ul>
              {sessions.map((session) => (
              <li key={session.documentId} className={`py-4 px-4 mb-4 rounded-lg h-24 w-full ${sessionId === session.documentId ? 'bg-blue-200' : 'bg-gray-200'}`} onClick={() => handleSessionClick(session.documentId)}>
                  <a className="block">
                    <div className="font-bold text-xl">{session.name}</div>
                    <div className="text-gray-500 text-sm">{session.description}</div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0 md:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Session</h2>
              <Button onClick={() => setIsModalOpen(false)} className="bg-transparent text-black">
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
            <Input
              type="text"
              placeholder="New session username"
              value={newSessionUsername}
              onChange={(e) => setNewSessionUsername(e.target.value)}
              className="mb-4"
            />
            <Input
              type="text"
              placeholder="New session description"
              value={newSessionDescription}
              onChange={(e) => setNewSessionDescription(e.target.value)}
              className="mb-4"
            />
            <Button onClick={createSession} className="w-full bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}