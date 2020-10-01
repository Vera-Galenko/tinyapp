const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const { validateUser, checkEmail, isUsersLink } = require('./helpers');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));


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

  

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

// MAIN PAGE***************************************************************

//render the URLs list based on the login----------------------------------

app.get("/urls", (req, res) => {
    const id = req.session.id;
    const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
    if (user) {
      let templateVars = { "urls": isUsersLink(urlDatabase2, id), username: req.session.email };
      res.render("urls_index", templateVars);
    } else {
        res.render("login");
    }

});



//login out---------------------------------------------------------

app.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/urls');
  });



// CREATE/EDIT URL IF LOGGED IN****************************************************************

//creating new URL and putting them to the DB----------------------

app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
     urlDatabase2[shortURL] = {};
     urlDatabase2[shortURL].longURL = req.body.longURL;
     urlDatabase2[shortURL].userID = req.session.id;
     res.redirect(`/urls/${shortURL}`);
   });

//render form for creation------------------------------------------

app.get("/urls/new", (req, res) => {
    if(req.session.id){
        const templateVars = { 
        username: req.session.email };
        res.render("urls_new", templateVars);
    } else{
       res.render("login");
    }
});
//render the page with a single URL with editing URLs button--------------------------------

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase2[req.params.shortURL].longURL,
        username: req.session.email };
    res.render("urls_show", templateVars);
});

//editing exsisting URLs----------------------------------------------

app.post('/urls/:shortURL', (req, res) => {
    if(urlDatabase2[req.params.shortURL].userID === req.session.id){
        urlDatabase2[req.params.shortURL].longURL = req.body.longURL;
        res.redirect('/urls');
    } else {
        res.render("login");
    }
      
    });
    


// DELETE URL*********************************************************************************

app.post('/urls/:shortURL/delete', (req, res) => {
    if(urlDatabase2[req.params.shortURL].userID === req.session.id){
        delete urlDatabase2[req.params.shortURL];
        res.redirect('/urls');
    } else {
        res.render("login");
    }
  
});


// REGISTER FUNCTIONS************************************************************************


//rendering registration page--------------------------------------

app.get('/register', (req, res) => {
    const templateVars = { error: null }
    res.render("register", templateVars);
  });

//regestration process---------------------------------------------------

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
        req.session.email = email;
        req.session.id = id;
        res.redirect('/urls');
      }
});

// LOGIN FUNCTIONS*****************************************************************

//rendering login page-----------------------------------------------

app.get("/login", (req, res) => {
    const templateVars = { error: null }
    res.render("login", templateVars);
  });
 
//*do not touch or move!!!! It is magic!---------

const matchKey = function(obj, key){
    for (let item in obj){
        if(users[item].email === key)
        return users[item].id;
    }
};
//------------------------------------------------

//login process--------------------------------------------------

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (validateUser(bcrypt, users, email, password)){
        const id = matchKey(users, email);
        req.session.email = email;
        req.session.id = id;
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

