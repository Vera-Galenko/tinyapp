const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};



app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

// app.get("/hello", (req, res) => {
//     res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
    // for (let key in urlDatabase) {
    //     let userID = urlDatabase[key].userID
    //     if (req.session.user_id === userID) {
    //       myUrls[key] = urlDatabase[key];
        
    // const templateVars = { urls: urlDatabase };
    const templateVars = { urls: urlDatabase,
        username: req.cookies.userId };
    res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
    console.log('posted')
    // console.log(req.body);  // Log the POST request body to the console
    // res.send("Ok");
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
    // res.redirect('/urls');
    
    // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
    const templateVars = { username: req.cookies.userId,
        username: req.cookies.userId  };
    res.render("urls_new", templateVars);
});

app.post('/login', (req, res) => {
    const userId = req.body.username;
    res.cookie('userId', userId); // set the cookie's key and value
    res.redirect('/urls');
});

app.post('/logout', (req, res) => {
    res.clearCookie('userId');
    res.redirect('/urls');
  });


app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
        username: req.cookies.userId };
    res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls')
})

app.post('/urls/:shortURL', (req, res) => {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    res.redirect('/urls');
})

app.get("/login", (req, res) => {
    const templateVars = { error: null }
    res.render("login", templateVars);
  });

app.post('/login', (req, res) => {
    console.log(req.body);
    // urlDatabase[req.params.shortURL] = req.body.longURL;
    res.render('login')
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

