const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

//* GET /api/users
router.get("/", (req, res) => {
   User.findAll({ attributes: { exclude: ["password"] } }) //* acccess User model and run .findAll()
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
         console.log(err);
         res.status(500).send(err);
      });
});

//* GET /api/users/1
router.get("/:id", (req, res) => {
   User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: req.params.id },
      include: [
         {
            model: Post,
            attributes: ["id", "title", "content", "created_at"],
         },
         {
            model: Comment,
            attributes: ["id", "comment_text", "created_at"],
            include: {
               model: Post,
               attributes: ["title"],
            },
         },
      ],
   })
      .then((dbUserData) => {
         if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id." });
            return;
         }
         res.json(dbUserData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

//*POST /api/users
router.post("/", (req, res) => {
   console.log("created user", req.body);
   User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
   })
      .then((dbUserData) => {
         req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
         });
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

router.post("/login", (req, res) => {
   console.log("inside login", req.body.email);
   User.findOne({
      where: {
         email: req.body.email,
      },
   }).then((dbUserData) => {
      if (!dbUserData) {
         res.status(400).json({ message: "No user found with that email." });
         return;
      }

      const validPassword = dbUserData.checkPassword(req.body.password); //* verify user
      if (!validPassword) {
         res.status(400).json({ message: "Invalid password." });
         return;
      }

      req.session.save(() => {
         //* Sesh variables
         req.session.user_id = dbUserData.id;
         req.session.username = dbUserData.username;
         req.session.loggedIn = true;

         res.json({ user: dbUserData, message: "Now logged in." });
      });
   });
});

router.post("/logout", (req, res) => {
   if (req.session.loggedIn) {
      req.session.destroy(() => {
         res.status(204).end();
      });
   } else {
      res.status(404).end();
   }
});

//* PUT /api/users/1
router.put("/:id", (req, res) => {
   User.update(req.body, {
      individualHooks: true,
      where: {
         id: req.params.id,
      },
   })
      .then((dbUserData) => {
         if (!dbUserData[0]) {
            res.status(404).json({ message: "No user found with this id." });
            return;
         }
         res.json(dbUserData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

//* DELETE /api/users/1
router.delete("/:id", (req, res) => {
   User.destroy({
      where: { id: req.params.id },
   })
      .then((dbUserData) => {
         if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id." });
            return;
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
