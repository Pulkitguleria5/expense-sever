const User = require("../model/users");

const userDao = {
  findByEmail: async (email) => {
    const user = await User.findOne({ email });
    return user;
  },

  create: async (userData) => {
    try {
      return await User.create(userData);
    } catch (error) {
      if (error.code === 11000) {
        const err = new Error("User already exists");
        err.code = "USER_EXIST";
        throw err;
      } else {
        const err = new Error("Internal server error");
        err.code = "INTERNAL_SERVER_ERROR";
        throw err;
      }
    }
  },
};

module.exports = userDao;
