const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");

const path = require("path"); // path module utility to work w/ file and directory paths
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;

// const fileUpload = require("express-fileupload");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
   secret: "SecretSecretSecret",
   cookie: {
      expires: 300000,
   },
   resave: false,
   saveUninitialized: true,
   store: new SequelizeStore({
      db: sequelize,
   }),
};

const exphbs = require("express-handlebars"); // to set up handlebars as the app's template engine of choice
const hbs = exphbs.create({ helpers }); // pass the helpers to the express handlebars method
app.engine("handlebars", hbs.engine); // sets express engine 'handlebars' from handlebars' engine
app.set("view engine", "handlebars"); // sets 'view engine' from app.engine

// Middleware
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// * New Express FileUpload Middleware
// app.use(fileUpload());

// turn on routes LAST, after adding middle ware above.
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: true }).then(() => {
   app.listen(PORT, () => console.log(`Now listening at ${PORT}`));
});
