const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

//* GET comment routes
router.get("/", (req, res) => {
   Comment.findAll({
      attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
   })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
         console.log(err);
         res.status(500).send(err);
      });
});

//* POST routes for posting comments
router.post("/", withAuth, (req, res) => {
   //* Check the session data
   console.log("next route of comment_text:", req.body.comment_text);
   if (req.session) {
      Comment.create({
         comment_text: req.body.comment_text,
         post_id: req.body.post_id,
         user_id: req.session.user_id, //* use the id from the sesh
      })
         .then((dbCommentData) => res.json(dbCommentData))
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   }
});

//* DELETE route for deleting comments
router.delete("/:id", withAuth, (req, res) => {
   Comment.destroy({ where: { id: req.params.id } })
      .then((dbCommentData) => {
         if (!dbCommentData) {
            res.status(404).json({ message: "No comment found with this id." });
            return;
         }
         res.json(dbCommentData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
