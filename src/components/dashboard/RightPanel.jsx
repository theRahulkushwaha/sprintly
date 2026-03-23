export default function RightPanel() {
  return (
    <div className="w-80 p-4 space-y-4 overflow-y-auto shrink-0">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold mb-3">My Meetings</h2>
        <p className="text-sm text-gray-600">App Project — 6:45 PM</p>
        <p className="text-sm text-gray-600">User Research — 7:30 PM</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold mb-3">Open Tickets</h2>
        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded-xl text-sm">Need new features</div>
          <div className="bg-gray-100 p-3 rounded-xl text-sm">Mobile UI update</div>
        </div>
      </div>
    </div>
  );
}