import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Board from "../components/board/Board";
import { useProjectStore } from "../store/useProjectStore";

export default function BoardPage() {
  const { activeProject } = useProjectStore();
  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={activeProject?.name || "Board"} />
        <Board />
      </div>
    </div>
  );
}