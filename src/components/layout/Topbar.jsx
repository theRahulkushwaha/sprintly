import { useNavigate } from "react-router-dom";
export default function Topbar() {

  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white flex items-center justify-between px-6 shadow-sm">
      
      <div className="flex gap-3">
        {["Today", "This Week", "This Month"].map((item) => (
          <button
            key={item}
            className={`px-4 py-1 rounded-full text-sm ${
              item === "This Month"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
     

      <input
        placeholder="Search..."
        className="w-80 px-4 py-2 bg-gray-100 rounded-full outline-none"
      />

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div>
          <p className="text-sm font-medium">Rahul</p>
          <p className="text-xs text-gray-500">Project Manager</p>
        </div>
      </div>
    </div>
  );
}