import { useEffect, useState } from "react";
import axios from "axios";
import { BiLogOut } from "react-icons/bi";
import GradientText from '../animatedcomponents/GradientText'


export default function Sidebar({ user, onSelectUser, socket, onSetUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/users").then((res) => {
      const filtered = res.data.filter((u) => u.email !== user.email);
      setUsers(filtered);
    });
    socket.emit("register_user", user.email);
  }, [user.email, socket]);

  function handleLogin() {
    onSetUser(null);
  }

  return (
    <div className="w-90 bg-[rgb(15,15,15)] flex flex-col p-3 overflow-y-auto shadow-2xl">
      <div className="flex justify-between">
        <div class="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Let's Chat
        </div>

        <button onClick={handleLogin} className="cursor-pointer flex items-center justify-center gap-1 h-10 w-25 rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:bg-gradient-to-br focus:ring-purple-300 dark:focus:ring-purple-800">
          <BiLogOut className="text-xl" />
          <p className="font-bold text-sm">LOGOUT</p>
        </button>
      </div>

      <input
        class="mt-5 mb-5 bg-[#222630] px-4 py-2 outline-none max-w-screen text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
        name="text"
        placeholder="search user...."
        type="text"
      />

      {users.map((u) => (
        <div
          key={u.email}
          className="flex items-center mt-1 p-2 mb-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
          onClick={() => onSelectUser(u)}
        >
          <img
            src={u.profilePic || "https://via.placeholder.com/48"}
            alt={u.name}
            className="w-12 h-12 rounded-full border-2 border-blue-600 mr-3"
          />
          <span className="text-white font-medium">{u.name}</span>
        </div>
      ))}
    </div>
  );
}
