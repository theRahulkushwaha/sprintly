import {
  Home,
  Layers,
  Settings,
  LogOut,
  Zap,
  Plus,
  FolderKanban,
  Users,
  Menu,
  X,
  Activity,
   MessageSquare,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuthStore,
} from "../../store/useAuthStore";

import {
  useProjectStore,
} from "../../store/useProjectStore";

import {
  useEffect,
  useState,
} from "react";

import NewProjectModal from "../projects/NewProjectModal";

import WorkspaceSwitcher from "../workspace/WorkspaceSwitcher";

import {
  useWorkspaceStore,
} from "../../store/useWorkspaceStore";

export default function Sidebar() {
  const {
    logout,
    user,
  } = useAuthStore();

  const {
    projects,
    fetchProjects,
    activeProject,
    setActiveProject,
  } = useProjectStore();

  const {
    activeWorkspace,
  } =
    useWorkspaceStore();

  const navigate =
    useNavigate();

  const [
    showNewProject,
    setShowNewProject,
  ] = useState(false);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout =
    () => {
      logout();
      navigate("/");
    };

  const closeMobile =
    () => {
      setMobileOpen(false);
    };

  const navItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
    },

    {
      to: "/board",
      icon: Layers,
      label: "Board",
    },

    {
  to: "/comments",
  icon: MessageSquare,
  label: "Comments",
},

    {
      to: "/activity",
      icon: Activity,
      label: "Activity",
    },

    {
      to: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">

            <Zap
              size={16}
              className="text-white"
              fill="white"
            />
          </div>

          <div>
            <h1 className="text-white font-semibold text-sm">
              Sprintly
            </h1>

            <p className="text-white/30 text-[10px]">
              Workspace
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMobileOpen(true)
          }
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={
            closeMobile
          }
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:relative
          top-0 left-0
          z-50
          h-screen
          overflow-hidden
          w-[300px]
          bg-[#0a0a0f]
          border-r border-white/5
          transition-transform
          duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* MAIN CONTAINER */}
        <div className="h-full flex flex-col min-h-0">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 shrink-0">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">

                <Zap
                  size={16}
                  className="text-white"
                  fill="white"
                />
              </div>

              <div>
                <h1 className="text-white font-semibold text-lg tracking-tight">
                  Sprintly
                </h1>

                <p className="text-white/30 text-[11px]">
                  Team Workspace
                </p>
              </div>
            </div>

            {/* MOBILE CLOSE */}
            <button
              onClick={
                closeMobile
              }
              className="lg:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* WORKSPACE SWITCHER */}
          <div className="p-2 border-b border-white/2 shrink-0">

            <WorkspaceSwitcher />
          </div>

          {/* ACTIVE WORKSPACE */}
          {activeWorkspace && (
            <div className="px-4 py-2 border-b border-white/5 shrink-0">

              <div className="flex items-center gap-2 mb-2">

                <Users
                  size={13}
                  className="text-indigo-400"
                />

                <span className="text-white/40 text-[8px] uppercase tracking-[0.15em]">
                  Workspace
                </span>
              </div>

              <h2 className="text-white font-medium text-[15px] truncate">
                {
                  activeWorkspace.name
                }
              </h2>

              <p className="text-white/30 text-[11px] mt-0.5">
                {
                  activeWorkspace
                    ?.members
                    ?.length || 0
                }{" "}
                members
              </p>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="px-2 py-2 space-y-2 shrink-0">

            {navItems.map(
              ({
                to,
                icon: Icon,
                label,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={
                    closeMobile
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    text-[14px]
                    transition-all
                    ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400 font-medium border border-indigo-500/10"
                        : "text-white/35 hover:text-white/80 hover:bg-white/[0.04]"
                    }
                  `
                  }
                >
                  <Icon size={20} />

                  <span>
                    {label}
                  </span>
                </NavLink>
              )
            )}
          </div>

          {/* PROJECTS */}
          <div className="px-2 flex-1 flex flex-col min-h-0 overflow-hidden">

            {/* PROJECT HEADER */}
            <div className="flex items-center justify-between px-3 mb-2 shrink-0">

              <div className="flex items-center gap-2">

                <FolderKanban
                  size={13}
                  className="text-indigo-400"
                />

                <span className="text-white/25 text-[11px] font-semibold uppercase tracking-[0.12em]">
                  Projects
                </span>
              </div>

              <button
                onClick={() =>
                  setShowNewProject(
                    true
                  )
                }
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/5 transition-all"
              >
                <Plus
                  size={14}
                />
              </button>
            </div>

            {/* PROJECT LIST */}
            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                overflow-x-hidden
                space-y-1.5
                pr-1
                pb-6
              "
            >

              {projects.length ===
                0 && (
                <button
                  onClick={() =>
                    setShowNewProject(
                      true
                    )
                  }
                  className="w-full flex items-center gap-2 px-3 py-3 text-white/20 hover:text-white/40 text-xs rounded-xl hover:bg-white/[0.03] transition-all"
                >
                  <Plus
                    size={12}
                  />

                  Create your first
                  project
                </button>
              )}

              {projects.map(
                (p) => (
                  <button
                    key={p._id}
                    onClick={() => {
                      setActiveProject(
                        p
                      );

                      navigate(
                        "/board"
                      );

                      closeMobile();
                    }}
                    className={`
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-left
                      border
                      transition-all
                      ${
                        activeProject?._id ===
                        p._id
                          ? "bg-white/[0.06] border-white/10 text-white shadow-lg shadow-black/20"
                          : "bg-transparent border-transparent text-white/35 hover:text-white/80 hover:bg-white/[0.03]"
                      }
                    `}
                  >

                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        background:
                          p.color,
                      }}
                    />

                    <div className="flex-1 min-w-0">

                      <p className="truncate font-medium text-[13px]">
                        {p.name}
                      </p>

                      <p className="text-[10px] text-white/25 truncate mt-0.5">
                        {
                          p.members
                            ?.length || 0
                        }{" "}
                        members
                      </p>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* USER */}
          <div className="border-t border-white/5 p-2.5 shrink-0 bg-[#0a0a0f]">

            <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-white/[0.03] border border-white/5">

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">

                {user?.name?.[0] ||
                  "U"}
              </div>

              <div className="flex-1 min-w-0">

                <p className="text-white/80 text-[13px] font-medium truncate">
                  {user?.name}
                </p>

                <p className="text-white/30 text-[11px] truncate">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={
                  handleLogout
                }
                title="Logout"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
              >
                <LogOut
                  size={15}
                />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP SPACE */}
      <div className="h-16 lg:hidden shrink-0" />

      {/* MODAL */}
      {showNewProject && (
        <NewProjectModal
          onClose={() =>
            setShowNewProject(
              false
            )
          }
        />
      )}
    </>
  );
}