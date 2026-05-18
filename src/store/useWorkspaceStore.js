import { create } from "zustand";

import API from "../services/api";

export const useWorkspaceStore =
  create((set) => ({
    workspaces: [],

    activeWorkspace:
      null,

    fetchWorkspaces:
      async () => {
        try {
          const res =
            await API.get(
              "/workspaces"
            );

          set({
            workspaces:
              res.data,
          });

          if (
            res.data.length >
            0
          ) {
            set({
              activeWorkspace:
                res.data[0],
            });
          }
        } catch (err) {
          console.log(err);
        }
      },

    setActiveWorkspace:
      (
        workspace
      ) => {
        set({
          activeWorkspace:
            workspace,
        });
      },
  }));