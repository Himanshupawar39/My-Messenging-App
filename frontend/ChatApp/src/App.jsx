import { useState, useEffect } from "react";
import io from "socket.io-client";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import TextType from './animatedcomponents/TextType';

const socket = io("http://localhost:5000");

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return <Login setUser={setUser} />;

  return (
    <div className="font-dancing flex h-screen bg-gray-900 text-white">
      {(!isMobile || !selectedUser) && (
        <Sidebar user={user} onSetUser={setUser} onSelectUser={setSelectedUser} socket={socket} />
      )}
      {selectedUser && (
        <ChatWindow
          socket={socket}
          user={user}
          selectedUser={selectedUser}
          onBack={() => setSelectedUser(null)}
          isMobile={isMobile}
        />
      )}
      {!selectedUser && !isMobile && (
        <div className="w-3/4 flex items-center justify-center bg-[rgb(33,37,41)]">
          <TextType
            text={["Hey! wellcome to let's chat", "Here you can text your friend anytime", "So select user and start messaging"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            className="font-bold text-3xl"
            cursorCharacter="|"
          />
        </div>
      )}
    </div>
  );
}
