const currentUsers = [];

// joins the user to the specific chatroom
function join_User(id, username, roomname) {
  const newUser = { id, username, roomname };

  currentUsers.push(newUser);
  console.log(currentUsers, "users");

  return newUser;
}

console.log("user out", currentUsers);

// Gets a particular user id to return the current user
function get_Current_User(id) {
  return currentUsers.find((oldUser) => oldUser.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = currentUsers.findIndex((oldUser) => oldUser.id === id);

  if (index !== -1) {
    return currentUsers.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
};
