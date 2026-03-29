import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MainContent from "../components/dashboard/MainContent";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Dashboard" />
        <MainContent />
      </div>
    </div>
  );
}