import {
  MessageSquare,
  Clock3,
  FolderKanban,
  Send,
  AlertTriangle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useTaskStore,
} from "../store/useTaskStore";

import Sidebar from "../components/layout/Sidebar";

export default function CommentsPage() {
  const {
    tasks,
    fetchTasks,
    addReply,
  } = useTaskStore();

  const [
    replyInputs,
    setReplyInputs,
  ] = useState({});

  const [
    openReply,
    setOpenReply,
  ] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const commentedTasks =
    tasks.filter(
      (task) =>
        task.comments &&
        task.comments.length > 0
    );

  const handleReply =
    async (
      taskId,
      commentId
    ) => {
      const key = `${taskId}-${commentId}`;

      const text =
        replyInputs[key];

      if (!text?.trim())
        return;

      await addReply(
        taskId,
        commentId,
        text
      );

      setReplyInputs(
        (prev) => ({
          ...prev,
          [key]: "",
        })
      );

      setOpenReply(null);
    };

  return (
    <div className="flex h-screen bg-[#0a0c11] overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">

        {/* BG EFFECT */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-4 sm:p-6 lg:p-7">

          {/* HEADER */}
          <div className="mb-6">

            <div className="flex items-center justify-between gap-4 flex-wrap">

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-14
                    h-14
                    rounded-3xl
                    bg-gradient-to-br
                    from-indigo-500/20
                    to-violet-500/20
                    border
                    border-indigo-500/20
                    flex
                    items-center
                    justify-center
                    text-indigo-300
                    shadow-lg
                    shadow-indigo-500/10
                  "
                >

                  <MessageSquare
                    size={24}
                  />
                </div>

                <div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">

                    Comments Hub
                  </h1>

                  <p className="text-sm text-white/35 mt-1">

                    Team discussions & task conversations
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div
                className="
                  px-4
                  py-2.5
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  backdrop-blur-xl
                "
              >

                <p className="text-[11px] text-white/30 uppercase tracking-wider">

                  Total Discussions
                </p>

                <h3 className="text-xl font-bold text-white mt-1">

                  {
                    commentedTasks.length
                  }
                </h3>
              </div>
            </div>
          </div>

          {/* EMPTY */}
          {commentedTasks.length ===
            0 && (
            <div
              className="
                rounded-3xl
                border
                border-dashed
                border-white/10
                bg-[#12151d]
                py-24
                text-center
              "
            >

              <div
                className="
                  w-20
                  h-20
                  rounded-full
                  bg-white/[0.03]
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-5
                "
              >

                <MessageSquare
                  size={34}
                  className="text-white/10"
                />
              </div>

              <h3 className="text-lg text-white/60 font-medium">

                No comments yet
              </h3>

              <p className="text-sm text-white/25 mt-2">

                Team conversations will appear here
              </p>
            </div>
          )}

          {/* TASKS */}
          <div className="space-y-5">

            {commentedTasks.map(
              (task) => (
                <div
                  key={task._id}
                  className="
                    rounded-3xl
                    border
                    border-white/[0.06]
                    bg-[#12151d]/95
                    backdrop-blur-xl
                    overflow-hidden
                    shadow-2xl
                    shadow-black/20
                  "
                >

                  {/* TASK HEADER */}
                  <div
                    className="
                      px-5
                      py-4
                      border-b
                      border-white/[0.05]
                      bg-white/[0.02]
                    "
                  >

                    <div className="flex items-center justify-between gap-4 flex-wrap">

                      <div>

                        <h2 className="text-base font-semibold text-white">

                          {task.title}
                        </h2>

                        <div className="flex items-center gap-4 mt-2 text-[11px] text-white/35">

                          <div className="flex items-center gap-1.5">

                            <FolderKanban
                              size={11}
                            />

                            <span>
                              {
                                task.columnId
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">

                            <MessageSquare
                              size={11}
                            />

                            <span>
                              {
                                task
                                  .comments
                                  .length
                              }{" "}
                              comments
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ISSUE */}
                      <button
                        className="
                          flex
                          items-center
                          gap-2
                          px-3.5
                          py-2
                          rounded-2xl
                          bg-red-500/10
                          border
                          border-red-500/20
                          text-red-300
                          text-xs
                          hover:bg-red-500/20
                          transition-all
                        "
                      >

                        <AlertTriangle
                          size={13}
                        />

                        Raise Issue
                      </button>
                    </div>
                  </div>

                  {/* COMMENTS */}
                  <div className="divide-y divide-white/[0.04]">

                    {task.comments.map(
                      (
                        comment
                      ) => {
                        const key = `${task._id}-${comment._id}`;

                        return (
                          <div
                            key={
                              comment._id
                            }
                            className="px-5 py-5"
                          >

                            <div className="flex gap-3">

                              {/* AVATAR */}
                              <div
                                className="
                                  w-9
                                  h-9
                                  rounded-2xl
                                  bg-gradient-to-br
                                  from-indigo-500
                                  to-violet-500
                                  flex
                                  items-center
                                  justify-center
                                  text-white
                                  text-xs
                                  font-semibold
                                  shrink-0
                                  shadow-lg
                                  shadow-indigo-500/20
                                "
                              >

                                {comment.authorName?.[0] ||
                                  "U"}
                              </div>

                              {/* CONTENT */}
                              <div className="flex-1 min-w-0">

                                {/* TOP */}
                                <div className="flex items-center gap-2 flex-wrap">

                                  <p className="text-sm text-white font-medium">

                                    {
                                      comment.authorName
                                    }
                                  </p>

                                  <div className="flex items-center gap-1 text-[10px] text-white/30">

                                    <Clock3
                                      size={10}
                                    />

                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* COMMENT */}
                                <div
                                  className="
                                    mt-3
                                    rounded-2xl
                                    bg-white/[0.025]
                                    border
                                    border-white/[0.04]
                                    px-4
                                    py-3
                                  "
                                >

                                  <p className="text-[13px] text-white/65 leading-6 break-words">

                                    {
                                      comment.text
                                    }
                                  </p>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex items-center gap-5 mt-3">

                                  <button
                                    onClick={() =>
                                      setOpenReply(
                                        openReply ===
                                          key
                                          ? null
                                          : key
                                      )
                                    }
                                    className="
                                      text-[11px]
                                      text-indigo-300
                                      hover:text-indigo-200
                                      transition-all
                                    "
                                  >
                                    Reply
                                  </button>

                                  <button
                                    className="
                                      text-[11px]
                                      text-red-300
                                      hover:text-red-200
                                      transition-all
                                    "
                                  >
                                    Report
                                  </button>
                                </div>

                                {/* REPLY INPUT */}
                                {openReply ===
                                  key && (
                                  <div className="mt-4 flex gap-2">

                                    <input
                                      value={
                                        replyInputs[
                                          key
                                        ] ||
                                        ""
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        setReplyInputs(
                                          (
                                            prev
                                          ) => ({
                                            ...prev,
                                            [key]:
                                              e
                                                .target
                                                .value,
                                          })
                                        )
                                      }
                                      placeholder="Write a reply..."
                                      className="
                                        flex-1
                                        h-11
                                        rounded-2xl
                                        bg-white/[0.03]
                                        border
                                        border-white/[0.06]
                                        px-4
                                        text-sm
                                        text-white
                                        placeholder:text-white/20
                                        outline-none
                                        focus:border-indigo-500/30
                                      "
                                    />

                                    <button
                                      onClick={() =>
                                        handleReply(
                                          task._id,
                                          comment._id
                                        )
                                      }
                                      className="
                                        w-11
                                        h-11
                                        rounded-2xl
                                        bg-indigo-600
                                        hover:bg-indigo-500
                                        flex
                                        items-center
                                        justify-center
                                        text-white
                                        transition-all
                                        shadow-lg
                                        shadow-indigo-600/20
                                      "
                                    >

                                      <Send
                                        size={
                                          15
                                        }
                                      />
                                    </button>
                                  </div>
                                )}

                                {/* REPLIES */}
                                {comment
                                  .replies
                                  ?.length >
                                  0 && (
                                  <div className="mt-4 pl-4 border-l border-indigo-500/20 space-y-3">

                                    {comment.replies.map(
                                      (
                                        reply,
                                        i
                                      ) => (
                                        <div
                                          key={
                                            i
                                          }
                                          className="
                                            rounded-2xl
                                            bg-[#1a1f2a]
                                            border
                                            border-white/[0.04]
                                            px-4
                                            py-3
                                          "
                                        >

                                          <div className="flex items-center gap-2 mb-2">

                                            <p className="text-[11px] text-indigo-300 font-medium">

                                              {
                                                reply.authorName
                                              }
                                            </p>

                                            <span className="text-[10px] text-white/20">

                                              replied
                                            </span>
                                          </div>

                                          <p className="text-[12px] text-white/60 leading-5">

                                            {
                                              reply.text
                                            }
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}