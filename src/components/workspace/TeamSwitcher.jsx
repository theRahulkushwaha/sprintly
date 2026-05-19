import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronDown, Check } from "lucide-react";
import API from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function TeamSwitcher({ selectedTeam, onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchUserTeams();
  }, []);

  const fetchUserTeams = async () => {
    try {
      const res = await API.get("/teams/my-teams");
      setTeams(res.data);
      if (res.data.length > 0 && !selectedTeam) {
        onSelectTeam(res.data[0]);
      }
    } catch (err) {
      console.error("Fetch teams error:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-2">
          <Users size={16} className="text-indigo-400" />
          <span className="text-white text-sm font-medium truncate">
            {selectedTeam?.name || "Select Team"}
          </span>
        </div>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              {teams.length === 0 ? (
                <div className="p-3 text-white/30 text-sm text-center">No teams assigned yet</div>
              ) : (
                teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() => {
                      onSelectTeam(team);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedTeam?._id === team._id
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "hover:bg-white/5 text-white/70"
                    }`}
                  >
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{team.name}</p>
                      <p className="text-xs text-white/30">{team.members?.length || 1} members</p>
                    </div>
                    {selectedTeam?._id === team._id && <Check size={14} className="text-indigo-400" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}