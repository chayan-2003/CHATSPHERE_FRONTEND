import Cookies from "js-cookie";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface SessionContextProps {
 sessionId: string | null;
  setSessionId: (id: string) => void;
  socket: Socket | null;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const jwt = Cookies.get("jwt") || "";
  console.log("jwt is:", jwt);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(apiUrl, {
      transports: ["websocket", "polling"],
      query: {
        token: jwt,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket.IO connection established:", newSocket);

   
    });

    setSocket(newSocket);
    newSocket.off("disconnect");

    
  }, [jwt]);

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId, socket }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};