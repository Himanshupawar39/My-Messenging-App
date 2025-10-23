import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profilePic, setProfilePic] = useState(null); // file
  const [preview, setPreview] = useState(null); // preview image
  const [error, setError] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isRegister ? "register" : "login";

      let res;

      if (isRegister) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        if (profilePic) formData.append("profilePic", profilePic);

        res = await axios.post(`http://localhost:5000/${url}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(`http://localhost:5000/${url}`, form);
      }

      setUser(res.data.user || res.data);
    } catch (err) {
      setError(err.response?.data?.error);
      //alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="font-dancing flex items-center justify-center h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg space-y-4 w-80"
      >
        <h2 className="text-xl font-semibold text-center">
          {isRegister ? "Register" : "Join Chat"}
        </h2>

        {isRegister && (
          <>
            <input
              className="w-full p-2 rounded bg-gray-700 outline-none text-white"
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <p className="font-md">PROFILE PIC</p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 text-sm text-gray-300 bg-gray-700"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full mx-auto border border-gray-600"
              />
            )}
          </>
        )}

        <input
          className="w-full p-2 rounded bg-gray-700 outline-none text-white"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-700 outline-none text-white"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="cursor-pointer flex items-center justify-center gap-1 h-10 w-full rounded-sm bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:bg-gradient-to-br focus:ring-purple-300 dark:focus:ring-purple-800">
          {isRegister ? "Register" : "Login"}
        </button>

        <p
          className="text-sm text-center cursor-pointer text-blue-400 hover:underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New user? Register"}
        </p>
      </form>

      {error &&
      <div role="alert" className="flex justify-center items-center gap-5 alert alert-error absolute top-10 cursor-pointer max-w-screen w-60">
        <span className="text-lg font-md">{error}</span>
        <svg onClick={()=> setError(null)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>}
    </div>
  );
}
