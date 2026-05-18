import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";

import Board from "../components/board/Board";

import {
  useProjectStore,
} from "../store/useProjectStore";

export default function BoardPage() {
  const {
    activeProject,
  } =
    useProjectStore();

  return (
    <div className="h-screen bg-[#0f0f13] overflow-hidden">

      {/* MAIN LAYOUT */}
      <div className="flex h-full w-full overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* TOPBAR */}
          <div className="shrink-0">

            <Topbar
              title={
                activeProject?.name ||
                "Board"
              }
            />
          </div>

          {/* BOARD AREA */}
          <div className="flex-1 overflow-hidden">

            <Board />
          </div>
        </div>
      </div>
    </div>
  );
}