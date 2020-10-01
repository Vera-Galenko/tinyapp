const checkEmail = ( db, email, password ) => {
    for (const id in db) {
      const currentUser = db[id];
      if (email === "" || password === "" || currentUser.email === email) {
        console.log('email & password are empty');
        return true;
      }
    }
    return false;
  };



const validateUser = (bcrypt, db, email, password ) => {
  for (const id in db) {
    const currentUser = db[id];
    if (email === currentUser.email){
      console.log('email matching');
      if (bcrypt.compareSync(password, currentUser.password)) {
        console.log('password matching');
        return currentUser;
    } else {
      return null
    }
  } else {
    console.log('email not matching')
  }
}
return null
}
  


const isUsersLink = function (object, id) {
  let usersObject = {};
  for (let key in object) {
    if (object[key].userID === id) {
      usersObject[key] = object[key];
      console.log('key', object[key]);
    }
  }
  return usersObject;
}

// const matchKey = function(obj, key){
//   for (let item in obj){
//       if(users[item].email === key)
//       return users[item].id;
//   }
// }

  module.exports = { checkEmail, validateUser, isUsersLink }