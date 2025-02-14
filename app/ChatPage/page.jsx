"use client"
import Sidebar from "@/components/chatstuffs/Sidebar";
import ChatArea from "@/components/chatstuffs/ChatArea";
import {SessionProvider} from "@/middleware/SessionContext"
export default function ChatPage() {
  return (
    <SessionProvider>
      <div className="flex h-screen">
        <div className="lg:w-1/4 md:w-0 ">
          <Sidebar />
        </div>
        <div className=" bg-white w-full">
          <ChatArea />
        </div>
      </div>
    </SessionProvider>
  );
}