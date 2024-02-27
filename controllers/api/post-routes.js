const router = require("express").Router();
const sequelize = require("../../config/connection");
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

//* GET all users
router.get("/", (req, res) => {
   Post.findAll({
      order: [["created_at", "DESC"]],
      attributes: ["id", "title", "content", "created_at"],
      include: [
         {
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
            include: {
               model: User,
               attributes: ["username"],
            },
         },
         {
            model: User,
            attributes: ["username"],
         },
      ],
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

//* GET by user ID
router.get("/:id", (req, res) => {
   Post.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "content", "created_at"],
      include: [
         {
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
            include: {
               model: User,
               attributes: ["username"],
            },
         },
         {
            model: User,
            attributes: ["username"],
         },
      ],
   })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

//* CREATE a POST
router.post("/", withAuth, (req, res) => {
   Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
         res.status(500).json({ message: "Post.create() failed", err: err });
      });
});

//* Update Posts title
router.put("/:id", withAuth, (req, res) => {
   Post.update(
      {
         title: req.body.title,
         content: req.body.content,
      },
      {
         where: {
            id: req.params.id,
         },
      }
   )
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id." });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(err).json(err);
      });
});

//* DELETE destroys a Post
router.delete("/:id", withAuth, (req, res) => {
   Post.destroy({ where: { id: req.params.id } })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id." });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
