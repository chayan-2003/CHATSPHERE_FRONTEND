import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUserPlus, faLock, faComments } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <main className="px-8 bg-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="left portion md:w-1/2 p-4">
          <div className="text-5xl font-bold text-black">
            CHAYAN GHOSH
          </div>
          <div className="text-5xl font-bold text-blue-400 mt-3">
            CHATSPHERE
          </div>
          <div className="text-xl mt-4 ">
            Experience seamless group communication with our modern chat platform.
            Connect with teams, friends, communities in real time and with
            advanced features like typing indicators and online stats.
          </div>
          <div className="mt-6">
            <div className="flex gap-4">
              <Link href="/register">
              <Button className="bg-blue-400 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:bg-blue-700">
                <FontAwesomeIcon icon={faUserPlus} />
                Get Started
              </Button >
              </Link>
              <Link href ="/login">
              <Button className="bg-white-400 flex items-center justify-center gap-2 px-4 py-2 text-blue-400 rounded-md hover:bg-blue-700">
                <FontAwesomeIcon icon={faRightToBracket} />
                Login
              </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="right portion md:w-1/2 p-4">
          <div className="w-full">
            <img
              src="https://img.freepik.com/premium-vector/chat-app-logo-sms-messenger-label-design-mobile-app-online-conversation-with-texting-message-ui-design-concept-vector-illustration_172533-1513.jpg?w=740"
              alt="chat app logo"
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="text-4xl text-center mx-auto mt-20">Powerful Features</div>
      <div className="text-xl text-center mx-auto mb-10  mt-2 text-gray-400">Everything you need for seamless team collaboration</div>
      <div className=" mb-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        <div className="bg-white shadow-xl  p-6 rounded-lg shadow-md hover:shadow-2xl transform hover:translate-y-1 ">
        <i className="fa-solid fa-lock fa-sm"></i>
          <h3 className="text-xl font-bold mb-2">Encrypted Communication</h3>
          <p className="text-gray-600">Ensure your conversations are secure with end-to-end encryption.</p>
        </div>
       < div className="bg-white shadow-xl  p-6 rounded-lg shadow-md hover:shadow-2xl transform hover:translate-y-1 ">
          <h3 className="text-xl font-bold mb-2">Real-time Communication</h3>
          <p className="text-gray-600">Experience seamless real-time communication with our advanced chat features.</p>
        </div>
        <div className="bg-white shadow-xl  p-6 rounded-lg shadow-md hover:shadow-2xl transform hover:translate-y-1 ">
          <h3 className="text-xl font-bold mb-2">Join Any Room</h3>
          <p className="text-gray-600">Join any room and start conversing with your friends and colleagues.</p>
        </div>
      </div>
    </main>
  );
}