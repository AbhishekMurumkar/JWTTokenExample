const UserModal                = require("../schemas/user");
const { getUserNameFromToken } = require("../../middlewares/auth");

const userFieldsToBeShown = {
  _id     : 0,
  password: 0,
  __v     : 0,
  active  : 0
};
// let users = [
//     {
//         username : 'u1',
//         password : 'p1',
//         firstname: 'n1',
//         lastname : 'l1',
//         email    : "e1"
//     }
// ];

const getCurrentUserProfileModal = (headers) => {
  return new Promise((resolve) => {
    try {
      let currentEmail = getUserNameFromToken(headers);
      console.log("currentEmail", currentEmail);
      return getUserByEmail(currentEmail.message.data);
    } catch (err) {
      resolve({
        status : 500,
        message: err.toString(),
      });
    }
  });
};

const getUserByEmail = (username) => {
  return new Promise((resolve) => {
    UserModal.findOne(
      {
        email: username,
      },
      userFieldsToBeShown
    )
      .then((resp) => {
        console.log(resp);
        if (!resp.active) {
          resolve({
            status : 405,
            message: "User is already deleted",
          });
        }
        resp["dateOfBirth"] = new Date(resp["dateOfBirth"]).toISOString();
        resolve({
          status : 200,
          message: resp,
        });
      })
      .catch((err) => {
        resolve({
          status : 500,
          message: err.toString(),
        });
      });
  });
};

const saveUser = (user) => {
  return new Promise((resolve) => {
    user
      .save()
      .then((newUser) => {
        console.log("Updated User", newUser);
        resolve({ success: true });
      })
      .catch((err) => {
        if (err.name == "ValidationError") {
          console.log("err from validations", err);
          resolve({
            success: false,
            status : 400,
            message: err.toString(),
          });
        } else {
          resolve({
            success: false,
            status : 500,
            message: err.toString(),
          });
        }
      });
  });
};

const updateUserDetailsModal = (headers, body) => {
  if (body.confirmPassword) {
    return new Promise((resolve) => {
      // get username from token
      let currentEmail = getUserNameFromToken(headers);
      if (currentEmail.status == 200) {
        //get details of user from username
        UserModal.findOne({
          email: currentEmail.message.data,
        }).then((user) => {
          if (!user.active) {
            resolve({
              status : 405,
              message: "User is already deleted",
            });
          }
          let isCorrectUser = user.comparePassword(
            body.confirmPassword,
            user.password
          );
          if (isCorrectUser) {
            //update
            delete user["confirmPassword"];
            for (let i of Object.keys(body)) {
              user[i] = body[i];
            }
            console.log(user);
            saveUser(user).then((resp) => {
              resolve({
                status : resp.success ? 204                   : resp.status,
                message: resp.success ? "Updation was Success": resp.message,
              });
            });
          } else {
            resolve({
              status : 401,
              message: "Authentication failure",
            });
          }
        });
      }
    });
  } else {
    return {
      status : 400,
      message: 'missing key "confirmPassword" in body',
    };
  }
};

const deleteCurrentUserModal = (headers, body) => {
  if (body.confirmPassword) {
    return updateUserDetailsModal(headers, { ...body, active: false });
  } else {
    return {
      status : 400,
      message: 'missing key "confirmPassword" in body',
    };
  }
};

const createNewUserModal = (formdata) => {
  return new Promise((resolve, reject) => {
    UserModal.findOne({
      email: formdata.email,
    }).then((resp) => {
        console.log(resp)
      if (!resp) {
        let newUser = new UserModal({ ...formdata, active: true, role: "USER" });
        saveUser(newUser).then((resp) => {
            resolve({
              status : resp.success ? 200                 : resp.status,
              message: resp.success ? "Signup was Success": resp.message,
            });
          });
      } else {
        resolve({
          status : 400,
          message: "Email Already Booked.",
        });
      }
    });
  });
};

module.exports = {
  // users,
  getCurrentUserProfileModal,
  updateUserDetailsModal,
  deleteCurrentUserModal,
  getUserByEmail,
  createNewUserModal,
};
