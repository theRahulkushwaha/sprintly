import { useState } from "react";

import {
  X,
  Users,
  Mail,
  Plus,
} from "lucide-react";

import API from "../../services/api";

import {
  useWorkspaceStore,
} from "../../store/useWorkspaceStore";

export default function CreateWorkspaceModal({
  onClose,
}) {
  const {
    fetchWorkspaces,
  } =
    useWorkspaceStore();

  const [
    name,
    setName,
  ] = useState("");

  const [
    memberEmail,
    setMemberEmail,
  ] = useState("");

  const [
    members,
    setMembers,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const addMember =
    () => {
      if (
        !memberEmail.trim()
      )
        return;

      if (
        members.includes(
          memberEmail
        )
      )
        return;

      setMembers([
        ...members,
        memberEmail,
      ]);

      setMemberEmail("");
    };

  const removeMember =
    (email) => {
      setMembers(
        members.filter(
          (m) =>
            m !== email
        )
      );
    };

  const createWorkspace =
    async () => {
      try {
        setLoading(true);

        await API.post(
          "/workspaces",
          {
            name,
            members,
          }
        );

        await fetchWorkspaces();

        onClose();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-lg bg-[#111118] border border-white/10 rounded-3xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">

              <Users size={18} />
            </div>

            <div>

              <h2 className="text-white font-semibold">
                Create Team
              </h2>

              <p className="text-white/30 text-sm">
                Create workspace and invite members
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* TEAM NAME */}
          <div>

            <label className="text-white/40 text-sm block mb-2">
              Team Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Design Team"
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* ADD MEMBER */}
          <div>

            <label className="text-white/40 text-sm block mb-2">
              Invite Members
            </label>

            <div className="flex gap-2">

              <div className="relative flex-1">

                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  value={
                    memberEmail
                  }
                  onChange={(e) =>
                    setMemberEmail(
                      e.target.value
                    )
                  }
                  placeholder="member@gmail.com"
                  className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              <button
                onClick={
                  addMember
                }
                className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* MEMBERS */}
          <div className="space-y-2 max-h-52 overflow-y-auto">

            {members.map(
              (email) => (
                <div
                  key={email}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/5"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-semibold uppercase">

                      {email[0]}
                    </div>

                    <div>

                      <p className="text-white text-sm">
                        {email}
                      </p>

                      <p className="text-white/30 text-xs">
                        Team Member
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeMember(
                        email
                      )
                    }
                    className="text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-5 border-t border-white/5 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 h-11 rounded-2xl bg-white/5 text-white/60 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            disabled={
              loading ||
              !name
            }
            onClick={
              createWorkspace
            }
            className="px-5 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium"
          >
            {loading
              ? "Creating..."
              : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
}