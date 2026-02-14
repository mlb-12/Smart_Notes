import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md px-8 py-4 flex justify-between items-center transition-colors duration-300">

      {/* Logo */}
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-2xl font-bold text-blue-600 cursor-pointer"
      >
        SmartNotes 🚀
      </h1>

      <div className="flex items-center gap-6">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-gray-300"
        >
          🌙
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Profile
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 transition-all duration-200">
              
              <p className="text-sm mb-2 dark:text-white">
                {auth.currentUser?.email}
              </p>

              <button
                onClick={() => navigate("/dashboard")}
                className="block w-full text-left text-sm py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Dashboard
              </button>
              <button
  onClick={() => navigate("/gamification")}
  className="hover:text-purple-600 transition"
>
  🎮 XP
</button>

            <div
  onClick={() => navigate("/explore")}
  className="cursor-pointer hover:text-blue-600 mb-2"
>
  Explore 🌍
</div>


              <button
                onClick={handleLogout}
                className="block w-full text-left text-sm py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;

