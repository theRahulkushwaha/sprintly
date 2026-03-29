import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Board from "../components/board/Board";

export default function BoardPage() {
  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Board" />
        <Board />
      </div>
    </div>
  );
}