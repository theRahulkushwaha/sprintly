export default function Navbar() {
  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-indigo-600">Sprintly</h1>
      <div className="flex items-center gap-4">
        <input
          placeholder="Search..."
          className="px-3 py-1 border rounded-lg"
        />
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}