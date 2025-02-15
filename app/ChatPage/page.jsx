"use client";
import Sidebar from "@/components/chatstuffs/Sidebar";
import ChatArea from "@/components/chatstuffs/ChatArea";
import { SessionProvider, useSession } from "@/middleware/SessionContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ChatContent() {
  const { sessionId, setSessionId } = useSession();
  const user = Cookies.get('user');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="flex h-screen">
      <div className={`overflow-y-auto ${sessionId ? 'hidden lg:block' : 'block w-full lg:w-1/4'}`}>
        <Sidebar />
      </div>
      <div className={`bg-white ${sessionId ? 'w-full lg:w-3/4' : 'hidden lg:block w-full'} relative`}>
        {sessionId && (
          <button
            onClick={() => setSessionId(null)}
            className="absolute top-4 left-4 lg:hidden bg-blue-400 text-white p-2 rounded-full"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <ChatArea />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <SessionProvider>
      <ChatContent />
    </SessionProvider>
  );
}