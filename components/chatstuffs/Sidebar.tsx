"use client";
import { useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/middleware/SessionContext";

interface UserSession {
  name: string;
  documentId: string;
  description: string;
}

export default function Sidebar() {
  const { setSessionId, sessionId,setSessionDetails } = useSession();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [newSessionUsername, setNewSessionUsername] = useState<string>("");
  const [newSessionDescription, setNewSessionDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL||"https://strapi-backend-71a0.onrender.com";

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get(`${apiUrl}/api/sessions`, {
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
  }, [apiUrl]);

  const createSession = async () => {
    try {
      const token = Cookies.get("jwt");
      const response = await axios.post(
        `${apiUrl}/api/sessions`,
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

  const handleSessionClick = (session: UserSession) => {
    setSessionId(session.documentId);
    setSessionDetails({ name: session.name, description: session.description });
    
  };

  return (
    <div>
      <div className="p-4 flex items-center gap-2 bg-gradient-to-r from-indigo-900 to-blue-500  mt-2 shadow-lg shadow-indigo-300">
        <FontAwesomeIcon icon={faUserGroup} size="lg" />
        <h2 className="text-2xl font-bold text-white ">Sessions</h2>
        <Button onClick={() => setIsModalOpen(true)} className="ml-auto bg-blue-400 text-white px-2 py-1 rounded-md hover:bg-blue-700">
          <FontAwesomeIcon icon={faPlus} size="xs" />
        </Button>
      </div>
      <div className="h-full  py-2 pb-20 pt-4 px-4">
        <ul>
          {sessions.map((session) => (
            <li key={session.documentId} className={`py-4 px-4 mb-4 rounded-md shadow-lg shadow-violet-700 h-24 
            sm:hover:scale-105 transition duration-300 cursor-pointer hover:bg-indigo-700   hover:text-white ${sessionId === session.documentId ? 'bg-indigo-700 text-white' : 'bg-blue-200'}`} onClick={() => handleSessionClick(session)}>
              <a className="block">
                <div className="font-mono font-extrabold text-xl">{session.name}</div>
                <div className=" text-xs ">{session.description}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg  mx-4 md:mx-0 ">
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