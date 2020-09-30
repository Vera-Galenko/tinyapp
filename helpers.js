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



const validateUser = ( db, email, password ) => {
  for (const id in db) {
    const currentUser = db[id];
    if (email === currentUser.email && password === currentUser.password){
      return true;
    }
  }
  return false;
}
  module.exports = { checkEmail, validateUser }