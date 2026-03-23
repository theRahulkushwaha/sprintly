import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Board from "../components/board/Board";

export default function BoardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <Board />
      </div>
    </div>
  );
}