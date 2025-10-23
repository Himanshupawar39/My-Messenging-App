import { useState, useEffect, useRef } from "react";
import { BsFillSendFill } from "react-icons/bs";

export default function ChatWindow({ socket, user, selectedUser, onBack, isMobile }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
  }, [selectedUser]);


  const sendMessage = () => {
    if (!text) return;
    const msg = { from: user.email, to: selectedUser.email, message: text };
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  useEffect(() => {
    const handler = (data) => {
      if (
        (data.from === user.email && data.to === selectedUser.email) ||
        (data.from === selectedUser.email && data.to === user.email)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.off("receive_message");
    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, [socket, selectedUser, user.email]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 bg-[rgb(113,105,105)]">
      {isMobile && (
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1 h-10 w-full rounded-sm bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:bg-gradient-to-br focus:ring-purple-300 dark:focus:ring-purple-800"
        >
          Back
        </button>
      )}

      <div className="p-3 bg-[rgb(45,46,46)] flex items-center">
        <img
          src={selectedUser.profilePic || "https://via.placeholder.com/48"}
          alt="user"
          className="w-12 h-12 rounded-full border-2 border-blue-600 mr-3"
        />

        <p className="font-bold">{selectedUser.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`mb-2 p-3 rounded-2xl max-w-xs break-words shadow-md
              ${m.from === user.email ? "bg-blue-600 self-end text-white" : "bg-gray-700 self-start text-white"}
            `}
          >
            {m.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 gap-2 bg-[rgb(113,105,105)] flex items-center flex-wrap">
        <input
          class="flex-1 bg-[rgb(56,53,53)] max-w-screen px-4 py-2 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
          name="text"
          placeholder="type something...."
          type="text"
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={sendMessage} className="cursor-pointer flex items-center justify-center gap-1 h-10 w-20 rounded-sm bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:bg-gradient-to-br focus:ring-purple-300 dark:focus:ring-purple-800">
           <BsFillSendFill />
           <p className="font-bold text-sm">SEND</p>
        </button>
      </div>
    </div>
  );
}
