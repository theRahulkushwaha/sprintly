import {
  ChevronDown,
  Plus,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useWorkspaceStore,
} from "../../store/useWorkspaceStore";

import CreateWorkspaceModal from "./CreateWorkspaceModal";

export default function WorkspaceSwitcher() {
  const {
    workspaces,
    activeWorkspace,

    setActiveWorkspace,

    fetchWorkspaces,
  } =
    useWorkspaceStore();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <>
      <div className="relative">

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">

              <Users size={18} />
            </div>

            <div className="text-left">

              <p className="text-white text-sm font-medium">
                {activeWorkspace
                  ?.name ||
                  "Select Team"}
              </p>

              <p className="text-white/30 text-xs">
                Workspace
              </p>
            </div>
          </div>

          <ChevronDown
            size={16}
            className={`text-white/40 transition-transform ${
              open
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#16161f] border border-white/10 rounded-2xl overflow-hidden z-50">

            {/* WORKSPACES */}
            <div className="max-h-64 overflow-y-auto">

              {workspaces.map(
                (
                  workspace
                ) => (
                  <button
                    key={
                      workspace._id
                    }
                    onClick={() => {
                      setActiveWorkspace(
                        workspace
                      );

                      setOpen(
                        false
                      );
                    }}
                    className="w-full px-4 py-3 hover:bg-white/5 transition-all text-left border-b border-white/5 last:border-none"
                  >

                    <p className="text-white text-sm font-medium">
                      {
                        workspace.name
                      }
                    </p>

                    <p className="text-white/30 text-xs mt-1">
                      {
                        workspace
                          .members
                          ?.length
                      }{" "}
                      members
                    </p>
                  </button>
                )
              )}
            </div>

            {/* CREATE */}
            <button
              onClick={() => {
                setShowModal(
                  true
                );

                setOpen(
                  false
                );
              }}
              className="w-full px-4 py-3 flex items-center gap-2 text-indigo-400 hover:bg-indigo-500/10 transition-all"
            >

              <Plus size={16} />

              Create Team
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CreateWorkspaceModal
          onClose={() =>
            setShowModal(
              false
            )
          }
        />
      )}
    </>
  );
}