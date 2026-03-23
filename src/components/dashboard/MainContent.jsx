import { useTaskStore } from "../../store/useTaskStore";

export default function MainContent() {
  const { tasks } = useTaskStore();
  const todo = tasks.filter((t) => t.columnId === "todo");
  const progress = tasks.filter((t) => t.columnId === "progress");
  const done = tasks.filter((t) => t.columnId === "done");
  const total = tasks.length || 1;

  return (
    <div className="flex-1 p-6 grid grid-cols-3 gap-6 overflow-y-auto">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold mb-4">Tasks Overview</h2>
        <p className="text-sm text-gray-600 mb-1">To Do: <span className="font-medium">{todo.length}</span></p>
        <p className="text-sm text-gray-600 mb-1">In Progress: <span className="font-medium">{progress.length}</span></p>
        <p className="text-sm text-gray-600">Done: <span className="font-medium">{done.length}</span></p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center">
        <p className="text-gray-400 text-sm">Charts Coming Soon</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold mb-4">Recent Tasks</h2>
        <div className="space-y-2">
          {tasks.slice(0, 3).map((t) => (
            <div key={t._id} className="bg-gray-100 p-2 rounded-lg text-sm">{t.title}</div>
          ))}
          {tasks.length === 0 && <p className="text-sm text-gray-400">No tasks yet</p>}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm col-span-3">
        <h2 className="font-semibold mb-4">Overall Progress</h2>
        <div className="h-3 bg-gray-200 rounded-full">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${(done.length / total) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{done.length} of {tasks.length} tasks done</p>
      </div>
    </div>
  );
}