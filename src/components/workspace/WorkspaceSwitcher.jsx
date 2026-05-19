import {
  ChevronDown,
  Plus,
  Users,
  Check,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

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

  const wrapperRef =
    useRef(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside =
      (e) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(
            e.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative"
      >

        {/* SWITCHER BUTTON */}
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="
            w-full
            group
            relative
            overflow-hidden
            rounded-2xl
            border border-white/10
            bg-gradient-to-b
            from-white/[0.06]
            to-white/[0.03]
            hover:border-white/15
            hover:bg-white/[0.07]
            transition-all
            duration-300
            px-3
            py-3
          "
        >

          {/* GLOW */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className="relative flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">

              {/* ICON */}
              <div className="
                w-10
                h-10
                rounded-2xl
                bg-gradient-to-br
                from-indigo-500/20
                to-violet-500/20
                border border-indigo-500/20
                flex
                items-center
                justify-center
                text-indigo-400
                shrink-0
              ">
                <Users size={17} />
              </div>

              {/* TEXT */}
              <div className="text-left min-w-0">

                <p className="text-white text-[14px] font-semibold truncate">
                  {activeWorkspace
                    ?.name ||
                    "Select Team"}
                </p>

                <p className="text-white/35 text-[11px] mt-0.5">
                  Workspace
                </p>
              </div>
            </div>

            {/* ARROW */}
            <div className="
              w-8
              h-8
              rounded-xl
              flex
              items-center
              justify-center
              bg-white/[0.03]
              border border-white/5
              shrink-0
            ">
              <ChevronDown
                size={15}
                className={`text-white/40 transition-all duration-300 ${
                  open
                    ? "rotate-180"
                    : ""
                }`}
              />
            </div>
          </div>
        </button>

        {/* DROPDOWN */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.96,
              }}
              transition={{
                duration: 0.18,
              }}
              className="
                absolute
                top-full
                left-0
                right-0
                mt-2
                z-50
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-[#12141b]/95
                backdrop-blur-2xl
                shadow-2xl
                shadow-black/40
              "
            >

              {/* HEADER */}
              <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">

                <p className="text-white/80 text-xs font-semibold uppercase tracking-[0.15em]">
                  Your Workspaces
                </p>
              </div>

              {/* WORKSPACE LIST */}
              <div className="max-h-64 overflow-y-auto p-2 space-y-1">

                {workspaces.map(
                  (
                    workspace
                  ) => {
                    const isActive =
                      activeWorkspace?._id ===
                      workspace._id;

                    return (
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
                        className={`
                          w-full
                          flex
                          items-center
                          justify-between
                          gap-3
                          px-3
                          py-3
                          rounded-xl
                          text-left
                          transition-all
                          border
                          ${
                            isActive
                              ? "bg-indigo-500/10 border-indigo-500/20"
                              : "border-transparent hover:bg-white/[0.04]"
                          }
                        `}
                      >

                        {/* LEFT */}
                        <div className="flex items-center gap-3 min-w-0">

                          <div className={`
                            w-9
                            h-9
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            shrink-0
                            ${
                              isActive
                                ? "bg-indigo-500/20 text-indigo-400"
                                : "bg-white/[0.04] text-white/40"
                            }
                          `}>
                            <Users
                              size={15}
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="text-white text-[13px] font-medium truncate">
                              {
                                workspace.name
                              }
                            </p>

                            <p className="text-white/30 text-[11px] mt-0.5">
                              {
                                workspace
                                  .members
                                  ?.length
                              }{" "}
                              members
                            </p>
                          </div>
                        </div>

                        {/* ACTIVE */}
                        {isActive && (
                          <div className="
                            w-6
                            h-6
                            rounded-full
                            bg-indigo-500/20
                            flex
                            items-center
                            justify-center
                            text-indigo-400
                            shrink-0
                          ">
                            <Check
                              size={13}
                            />
                          </div>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {/* FOOTER */}
              <div className="p-2 border-t border-white/5 bg-white/[0.02]">

                <button
                  onClick={() => {
                    setShowModal(
                      true
                    );

                    setOpen(
                      false
                    );
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-indigo-400
                    hover:text-indigo-300
                    hover:bg-indigo-500/10
                    transition-all
                    text-sm
                    font-medium
                  "
                >

                  <div className="
                    w-8
                    h-8
                    rounded-xl
                    bg-indigo-500/10
                    border border-indigo-500/20
                    flex
                    items-center
                    justify-center
                  ">
                    <Plus size={15} />
                  </div>

                  Create Workspace
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
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