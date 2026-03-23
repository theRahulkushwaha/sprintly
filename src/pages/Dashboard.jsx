import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MainContent from "../components/dashboard/MainContent";
import RightPanel from "../components/dashboard/RightPanel";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <MainContent />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}