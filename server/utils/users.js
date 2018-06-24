'use strict';

const Users = (() => { // IIFE
  let instance = null; // Singleton

  return () => { // Factory
    if (instance) return instance;
    const userList = []; // No Direct Access
    instance = Object.freeze({ // Frozen Methods
      get list() {
        return userList;
      },
      set list(users) {
        userList.push(...users);
      },
      addUser(id, name, room) { // Prohibit Duplicate
        if (this.getUser(id)) return null;
        const user = { id, name, room };
        userList.push(user);
        return user;
      },
      deleteUser(id) {
        // there should only be 1 element in the array
        const index = userList.findIndex(e => e.id === id);
        if (index !== -1) return userList.splice(index, 1)[0];
        return null;
      },
      getUser(id) {
        // there should only be 1 element in the array
        const user = userList.filter(e => e.id === id)[0];
        return user || null;
      },
      getUserList(room) {
        return userList.filter(e => e.room === room)
          .map(({ name }) => name);
      },
      getRoomList() {
        return [...new Set(userList.map(e => e.room))];
      },
    });
    return instance;
  };
})();

exports.Users = Users;
