import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import { useTaskStore } from "../store/useTaskStore";

import {
  Activity,
  Calendar,
  User,
  MessageSquare,
  CheckCircle2,
  Clock3,
} from "lucide-react";

export default function ActivityPage() {
  const { tasks } =
    useTaskStore();

  const allActivities =
    tasks
      .flatMap((task) =>
        (
          task.activity || []
        ).map((a) => ({
          ...a,
          taskTitle:
            task.title,
        }))
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );

  const getActivityIcon =
    (type) => {
      switch (type) {
        case "comment":
          return (
            <MessageSquare
              size={16}
            />
          );

        case "completed":
          return (
            <CheckCircle2
              size={16}
            />
          );

        default:
          return (
            <Clock3
              size={16}
            />
          );
      }
    };

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Activity Logs" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">

            {/* HEADER */}
            <div className="mb-8">

              <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">

                <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">

                  <Activity size={26} />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Workspace Activity
                  </h1>

                  <p className="text-white/40 text-sm mt-1">
                    Track task updates,
                    comments, assignments,
                    and workspace actions.
                  </p>
                </div>
              </div>
            </div>

            {/* EMPTY STATE */}
            {allActivities.length ===
              0 && (
              <div className="border border-white/10 bg-white/[0.03] rounded-[32px] p-10 md:p-16 text-center">

                <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-5">

                  <Activity
                    size={36}
                    className="text-white/20"
                  />
                </div>

                <h2 className="text-white text-xl font-semibold mb-2">
                  No Activity Yet
                </h2>

                <p className="text-white/35 text-sm max-w-md mx-auto leading-relaxed">
                  Your workspace
                  activity will appear
                  here when team members
                  create tasks, comment,
                  move cards, or update
                  workflows.
                </p>
              </div>
            )}

            {/* ACTIVITY LIST */}
            {allActivities.length >
              0 && (
              <div className="space-y-4">

                {allActivities.map(
                  (
                    activity,
                    index
                  ) => (
                    <div
                      key={index}
                      className="group border border-white/8 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/15 rounded-3xl p-5 transition-all duration-300"
                    >

                      <div className="flex gap-4">

                        {/* ICON */}
                        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">

                          {getActivityIcon(
                            activity.type
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">

                          {/* TOP */}
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                            <div className="min-w-0">

                              <h3 className="text-white font-medium leading-relaxed break-words">
                                {activity.message ||
                                  "Task activity updated"}
                              </h3>

                              <p className="text-indigo-400 text-sm mt-1 truncate">
                                {
                                  activity.taskTitle
                                }
                              </p>
                            </div>

                            {/* DATE */}
                            <div className="flex items-center gap-2 text-white/30 text-xs shrink-0">

                              <Calendar
                                size={13}
                              />

                              <span>
                                {new Date(
                                  activity.createdAt
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* USER */}
                          <div className="flex items-center gap-3 mt-4">

                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">

                              {activity.userName?.[0] ||
                                "U"}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-white/50 min-w-0">

                              <User
                                size={13}
                              />

                              <span className="truncate">
                                {activity.userName ||
                                  "Workspace User"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}