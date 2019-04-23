const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const passport = require('passport');


const app = express();

// load routes
const amis = require('./routes/amis');
const evenements = require('./routes/evenements');
const info = require('./routes/info');
const users = require('./routes/users');

require('./config/passport')(passport);



// Connect to mongoose
mongoose.connect("mongodb+srv://todoapp:lixiang1997@cluster0-ftfdx.gcp.mongodb.net/test?retryWrites=true", {useNewUrlParser: true})
        .then(() => {
            console.log("MongoDB connected....");
        })
        .catch(err => {
            console.log(err);
        });



// import models
require("./models/Amis");
require("./models/Evenements");
require("./models/Info");
require('./models/User');
const User = mongoose.model('users');
const Ami = mongoose.model("amis");
const Evenement = mongoose.model("evenements");
const Info = mongoose.model("info");

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// method-override middleware
app.use(methodOverride('_method'));

// session & flash middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// global variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Router settings
app.get('/', (req, res) => {
    const title = "Carnet d'adresse";
    res.render("index", {
        title:title
    });
});


// use routes
app.use("/info", info);
app.use("/evenements", evenements);
app.use("/amis", amis);
app.use("/users", users);


const port = 5000;

app.listen(port, () => {
   console.log(`Server started on ${port}`);
});
