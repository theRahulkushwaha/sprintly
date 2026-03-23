import { Home, Layers, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass =
    "text-gray-500 hover:text-indigo-600 cursor-pointer";

  const activeClass = "text-indigo-600";

  return (
    <div className="w-20 bg-white flex flex-col items-center py-6 gap-6 shadow-sm">
      
      <div className="text-xl font-bold text-indigo-600">S</div>

      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <Home />
      </NavLink>

      <NavLink
        to="/board"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <Layers />
      </NavLink>

      <Settings className="text-gray-500 cursor-pointer" />

    </div>
  );
}