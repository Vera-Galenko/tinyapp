const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const { validateUser, checkEmail, isUsersLink } = require('./helpers');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))


const urlDatabase2 = {
    b6UTxQ: {longURL: "https://www.tsn.ca", userID: "userRandomID" },
    i3BoGr: {longURL: "https://www.google.ca", userID: "user2RandomID" }
};

const hashedChickenPW = bcrypt.hashSync("purple-monkey-dinosaur", salt)
const hashedDimitriPW = bcrypt.hashSync("dishwasher-funk", salt)
 
const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: hashedChickenPW
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: hashedDimitriPW
    }
  };

console.log(users);
  

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

// MAIN PAGE****************************

app.get("/urls", (req, res) => {
    const id = req.cookies.Id;
    const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
    if (user) {
      let templateVars = { "urls": isUsersLink(urlDatabase2, id), username: req.cookies.userId };
      res.render("urls_index", templateVars);
    } else {
        res.render("register");
    }
    // if(req.cookies.Id )
    // const templateVars = { urls: urlDatabase2,
    //     username: req.cookies.userId };
    // res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
 const shortURL = generateRandomString();
  urlDatabase2[shortURL] = {};
  urlDatabase2[shortURL].longURL = req.body.longURL;
  urlDatabase2[shortURL].userID = req.session.user_id;
  console.log(urlDatabase2);
  res.redirect(`/urls/${shortURL}`);
});


app.post('/logout', (req, res) => {
    res.clearCookie('userId');
    res.redirect('/urls');
  });



// CREATE URL IF LOGGED IN**********************

app.get("/urls/new", (req, res) => {
    if(req.cookies.userId){
        const templateVars = { username: req.cookies.userId,
        username: req.cookies.userId  };
        res.render("urls_new", templateVars);
    } else{
       res.render("login");
    }
});

// NEW URL************************************************

//   app.get("/urls/new", (req, res) => {
//     const templateVars = { username: req.cookies.userId,
//         username: req.cookies.userId  };
//     res.render("urls_new", templateVars);
// });

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase2[req.params.shortURL].longURL,
        username: req.cookies.userId };
    console.log(urlDatabase2);  
    res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL', (req, res) => {
    console.log(req.params.shortURL);
    urlDatabase2[req.params.shortURL].longURL = req.body.longURL;
    urlDatabase2[req.params.shortURL].userID = req.cookies.Id;
    console.log(urlDatabase2);
    console.log(users);
    // res.redirect('/urls');
    res.render('/urls');
});


// DELETE URL**************************************************

app.post('/urls/:shortURL/delete', (req, res) => {
    delete urlDatabase2[req.params.shortURL];
    res.redirect('/urls');
});


// REGISTER FUNCTIONS**********************


app.get('/register', (req, res) => {
    const templateVars = { error: null }
    res.render("register", templateVars);
  });

app.post('/register', (req, res) => {
    const id = generateRandomString(6);
    const email = req.body.email;
    const prePassword = req.body.password;
    const password = bcrypt.hashSync(prePassword, salt);

    if (checkEmail(users, email, password)) {
        res.send('404');
      } else {
        const newUser = {
            id,
            email,
            password
        };
        users[id] = newUser;
        res.cookie('userId', email);
        res.cookie('Id', id);
        console.log('Password', password);
        // res.send('Cookie is set');
        res.redirect('/urls');
      }
});

// LOGIN FUNCTIONS******************************

app.get("/login", (req, res) => {
    const templateVars = { error: null }
    res.render("login", templateVars);
  });
 

const matchKey = function(obj, key){
    for (let item in obj){
        if(users[item].email === key)
        return users[item].id;
    }
}


app.post('/login', (req, res) => {
    console.log(req.body)
    // const id = generateRandomString(6); need to get the id from the user object
    const email = req.body.email;
    const password = req.body.password;
    if (validateUser(bcrypt, users, email, password)){
        const userId = req.body.email;
        const id = matchKey(users, userId);
        console.log('ID', id);
        res.cookie('userId', userId);
        res.cookie('Id', id);
        res.redirect('/urls');
    } else {
        res.send("Wrong data");
        res.redirect('/register');
    }
});

// *************************************************************************************

app.get("/u/:shortURL", (req, res) => {
    // const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

app.listen(PORT, () => {
    console.log( `Example app listening on port ${PORT}!`);
});


function generateRandomString() {
    let newURL = "";
    newURL = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
    return newURL;
}

