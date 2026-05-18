import User from "../models/User.js";

export const createNotification =
  async (userId, text) => {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          notifications: {
            text,
          },
        },
      }
    );
  };