"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUserPlus, faLock, faComments, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const text = "Experience seamless group communication with our modern chat platform. Connect with teams, friends, and communities in real time with advanced features like typing indicators and online stats.";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        setTimeout(() => {
          setDisplayedText("");
          setCurrentIndex(0);
        }, 300000000);
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [currentIndex, text]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="bg-gray-100 py-10">
      <div className={`px-4 md:mt-24 ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mt-14">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
            <h1 className="font-serif animate-pulse text-blue-600 text-4xl sm:text-5xl md:text-6xl">
              CHATSPHERE
            </h1>
            <p className="font-mono text-lg sm:text-xl mt-6 text-gray-700">
              {displayedText}
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/register">
                <Button className="bg-blue-500 flex items-center justify-center gap-2 px-5 py-3 text-white rounded-md hover:bg-blue-700">
                  <FontAwesomeIcon icon={faUserPlus} />
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-white border border-blue-400 flex items-center justify-center gap-2 px-5 py-3 text-blue-500 rounded-md hover:bg-blue-700 hover:text-white">
                  <FontAwesomeIcon icon={faRightToBracket} />
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/3 p-4 flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm sm:hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl shadow-blue-400 hover:shadow-blue-600">
              <img
                src="https://i.postimg.cc/fRC2jrnD/Screenshot-2025-02-16-022159.png"
                alt="Screenshot"
                className="w-full rounded-lg cursor-pointer"
                onClick={handleImageClick}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col items-center text-center mt-36">
          <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
          <p className="text-lg sm:text-xl text-gray-500 mt-2">
            Everything you need for seamless team collaboration
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transform sm:hover:translate-y-1">
              <FontAwesomeIcon icon={faLock} className="text-blue-500 text-3xl mb-3" />
              <h3 className="text-xl font-bold">Encrypted Communication</h3>
              <p className="text-gray-600">
                Ensure your conversations are secure with end-to-end encryption.
              </p>
            </div>
            <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transform sm:hover:translate-y-1">
              <FontAwesomeIcon icon={faComments} className="text-blue-500 text-3xl mb-3" />
              <h3 className="text-xl font-bold">Real-time Communication</h3>
              <p className="text-gray-600">
                Experience seamless real-time communication with our advanced chat features.
              </p>
            </div>
            <div className="bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transform sm:hover:translate-y-1">
              <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-3xl mb-3" />
              <h3 className="text-xl font-bold">Join Any Room</h3>
              <p className="text-gray-600">
                Join any room and start conversing with your friends and colleagues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <img
              src="https://i.postimg.cc/fRC2jrnD/Screenshot-2025-02-16-022159.png"
              alt="Screenshot"
              className="w-full max-w-3xl rounded-lg"
            />
          </div>
        </div>
      )}
    </main>
  );
}