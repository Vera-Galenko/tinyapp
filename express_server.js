const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const { validateUser, checkEmail } = require('./helpers')
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

const urlDatabase2 = {
    b6UTxQ: { shortUrl:"b2xVn2", longURL: "https://www.tsn.ca", userID: "aJ48lW" },
    i3BoGr: { shortURL: "9sm5xK", longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  };



app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

// MAIN PAGE****************************

app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase,
        username: req.cookies.userId };
    res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
    console.log('posted')
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
});


app.post('/logout', (req, res) => {
    res.clearCookie('userId');
    res.redirect('/urls');
  });

// NEW URL************************************************

//   app.get("/urls/new", (req, res) => {
//     const templateVars = { username: req.cookies.userId,
//         username: req.cookies.userId  };
//     res.render("urls_new", templateVars);
// });

app.get("/urls/new", (req, res) => {
    if(req.cookies.userId){
        const templateVars = { username: req.cookies.userId,
        username: req.cookies.userId  };
        res.render("urls_new", templateVars);
    } else{
       res.render("login");
    }
});



app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
        username: req.cookies.userId };
    res.render("urls_show", templateVars);
});

// DELETE URL**************************************************

app.post('/urls/:shortURL/delete', (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
    urlDatabase[req.params.shortURL] = req.body.longURL;
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
    const password = req.body.password;

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
        console.log(users);
        res.redirect('/urls');
      }
});

// LOGIN FUNCTIONS******************************

app.get("/login", (req, res) => {
    const templateVars = { error: null }
    res.render("login", templateVars);
  });

app.post('/login', (req, res) => {
    console.log(req.body)
    const id = generateRandomString(6);
    const email = req.body.email;
    const password = req.body.password;

    if (validateUser(users, email, password)){
        const userId = req.body.email;
        res.cookie('userId', userId); // set the cookie's key and value
        res.redirect('/urls');
    } else {
        res.send("Wrong data");
    }
})



app.get("/u/:shortURL", (req, res) => {
    // const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
    let newURL = "";
    newURL = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
    return newURL;
}

