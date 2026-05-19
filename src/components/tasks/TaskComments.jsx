import { useState } from "react";

import {
  MessageSquare,
  Send,
  Trash2,
  CornerDownRight,
} from "lucide-react";

import API from "../../services/api";

export default function TaskComments({
  task,
  refreshTask,
}) {
  const [comment, setComment] =
    useState("");

  const [replyText, setReplyText] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  /* ADD COMMENT */
  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);

      await API.post(
        `/tasks/${task._id}/comments`,
        {
          text: comment,
        }
      );

      setComment("");

      refreshTask();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ADD REPLY */
  const addReply = async (
    commentId
  ) => {
    const text =
      replyText[commentId];

    if (!text?.trim()) return;

    try {
      await API.post(
        `/tasks/${task._id}/comments/${commentId}/replies`,
        {
          text,
        }
      );

      setReplyText((prev) => ({
        ...prev,
        [commentId]: "",
      }));

      refreshTask();
    } catch (err) {
      console.log(err);
    }
  };

  /* DELETE COMMENT */
  const deleteComment =
    async (commentId) => {
      try {
        await API.delete(
          `/tasks/${task._id}/comments/${commentId}`
        );

        refreshTask();
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="mt-6 border-t border-white/10 pt-6">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">

        <MessageSquare
          size={18}
          className="text-indigo-400"
        />

        <h3 className="text-white font-semibold text-sm">
          Comments
        </h3>
      </div>

      {/* ADD COMMENT */}
      <div className="space-y-3 mb-6">

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Write a comment..."
          rows={3}
          className="
            w-full
            rounded-2xl
            bg-white/5
            border border-white/10
            px-4
            py-3
            text-sm
            text-white
            outline-none
            resize-none
            focus:border-indigo-500/50
          "
        />

        <div className="flex justify-end">

          <button
            onClick={addComment}
            disabled={loading}
            className="
              h-10
              px-4
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-500
              text-white
              text-sm
              font-medium
              transition-all
              flex items-center gap-2
            "
          >

            <Send size={14} />

            {loading
              ? "Posting..."
              : "Comment"}
          </button>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="space-y-4">

        {task.comments?.length ===
          0 && (
          <div className="text-center py-10 text-white/30 text-sm">
            No comments yet
          </div>
        )}

        {task.comments?.map(
          (c) => (
            <div
              key={c._id}
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                p-4
              "
            >

              {/* COMMENT */}
              <div className="flex items-start justify-between gap-3">

                <div className="flex gap-3">

                  <div className="
                    w-9 h-9
                    rounded-full
                    bg-indigo-500/20
                    flex items-center justify-center
                    text-indigo-400
                    text-sm
                    font-semibold
                    uppercase
                    shrink-0
                  ">
                    {c.authorName?.[0]}
                  </div>

                  <div>

                    <p className="text-white text-sm font-medium">
                      {c.authorName}
                    </p>

                    <p className="text-white/70 text-sm mt-1">
                      {c.text}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    deleteComment(
                      c._id
                    )
                  }
                  className="
                    text-white/20
                    hover:text-red-400
                    transition-all
                  "
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* REPLIES */}
              <div className="mt-4 ml-12 space-y-3">

                {c.replies?.map(
                  (reply) => (
                    <div
                      key={reply._id}
                      className="
                        flex gap-3
                        rounded-xl
                        bg-black/20
                        border border-white/5
                        p-3
                      "
                    >

                      <CornerDownRight
                        size={16}
                        className="text-indigo-400 mt-1"
                      />

                      <div>

                        <p className="text-white text-xs font-medium">
                          {
                            reply.authorName
                          }
                        </p>

                        <p className="text-white/70 text-sm mt-1">
                          {reply.text}
                        </p>
                      </div>
                    </div>
                  )
                )}

                {/* REPLY INPUT */}
                <div className="flex gap-2">

                  <input
                    value={
                      replyText[
                        c._id
                      ] || ""
                    }
                    onChange={(e) =>
                      setReplyText(
                        (
                          prev
                        ) => ({
                          ...prev,
                          [c._id]:
                            e.target
                              .value,
                        })
                      )
                    }
                    placeholder="Reply..."
                    className="
                      flex-1
                      h-10
                      rounded-xl
                      bg-white/5
                      border border-white/10
                      px-3
                      text-sm
                      text-white
                      outline-none
                      focus:border-indigo-500/50
                    "
                  />

                  <button
                    onClick={() =>
                      addReply(
                        c._id
                      )
                    }
                    className="
                      h-10
                      px-3
                      rounded-xl
                      bg-white/5
                      hover:bg-white/10
                      text-white
                      transition-all
                    "
                  >
                    <Send
                      size={14}
                    />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}