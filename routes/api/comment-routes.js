const router = require('express').Router();
const {
    addComment,
    removeComment,
    addReply,
    removeReply
  } = require('../../controllers/comment-controller');

// /api/comments/:pizzaId
router.route('/:pizzaId').post(addComment);

// /api/comments/:pizzaId/:commentId
router.route('/:pizzaId/:commentId')
//  This is a PUT route because technically we're not creating a new reply resource
.put(addReply)
.delete(removeComment);

router.route('/:pizzaId/:commentId/:replyId')
.delete(removeReply);


module.exports = router;

