const path = require("path"); // path module utility to work w/ file and directory paths
const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const session = require("express-session");
const helpers = require("./utils/helpers");

const fileUpload = require("express-fileupload");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
   secret: "SecretSecretSecret",
   cookie: {},
   resave: false,
   saveUninitialized: true,
   store: new SequelizeStore({
      db: sequelize,
   }),
};

const exphbs = require("express-handlebars"); // to set up handlebars as the app's template engine of choice
const hbs = exphbs.create({ helpers }); // pass the helpers to the express handlebars method

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sess));

// * New Express FileUpload Middleware
app.use(fileUpload());

app.engine("handlebars", hbs.engine); // sets express engine 'handlebars' from handlebars' engine
app.set("view engine", "handlebars"); // sets 'view engine' from app.engine

// turn on routes LAST, after adding middle ware above.
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: true }).then(() => {
   app.listen(PORT, () => console.log(`Now listening at ${PORT}`));
});
