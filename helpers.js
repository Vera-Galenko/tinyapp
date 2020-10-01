const checkEmail = ( db, email, password ) => {
      if (email === "" || password === "") {
        console.log('email & password are empty');
        return true;
      }
    return false;
  };
  

  const getUserByEmail = function(email, db) {
    for (const id in db) {
      const currentUser = db[id];
    if(currentUser.email === email){
      return true;
    }
    return false;
  }
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
    return false;
  }
}
return null
};
  


const isUsersLink = function (object, id) {
  let usersObject = {};
  for (let key in object) {
    if (object[key].userID === id) {
      usersObject[key] = object[key];
    }
  }
  return usersObject;
};




  module.exports = { checkEmail, validateUser, isUsersLink, getUserByEmail }