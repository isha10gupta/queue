import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const context = useContext(ThemeContext);
  if (!context) return <div className="text-red-500 p-4">⚠️ ThemeContext not available!</div>;

  const { dark, setDark } = context;

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <header className={`shadow p-4 flex items-center justify-between ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/5/5a/Ramaiah_Institutions_Logo.png"
            alt="MSRIT Logo"
            className="w-16 h-auto"
          />
        </Link>
        <button
          onClick={() => setDark(!dark)}
          className={`px-4 py-2 rounded font-medium ${dark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
        >
          {dark ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;