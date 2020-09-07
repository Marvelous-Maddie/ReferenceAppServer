const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");

const authorize = require("_middleware/authorize");
const Role = require("_helpers/role");
const commentService = require("./comment.service");

// routes
router.get("/:pageId/", getAll);
router.post("/:pageId", authorize(), createSchema, create);
router.put("/:pageId", authorize(), updateSchema, update);
router.delete("/:pageId/:commentId", authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
  const { pageId } = req.params;
  commentService
    .getAll(pageId)
    .then((comments) => res.json(comments))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    content: Joi.string().required(),
    userName: Joi.string().required(),
    userId: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  const { pageId } = req.params;
  console.log(req.body);
  commentService
    .create(pageId, req.body)
    .then((comment) => res.json(comment))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    content: Joi.string().required(),
  });

  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own comments and admins can update any comment
  if (req.body.userId !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { pageId } = req.params;
  commentService
    .update(pageId, req.body)
    .then((comment) => res.json(comment))
    .catch(next);
}

function _delete(req, res, next) {
  const { pageId, commentId } = req.params;
  const comment = commentService.getOne(pageId, commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  // users can delete their own comments and admins can delete any comment
  if (comment.userId !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(req.body);
  commentService
    .delete(pageId, commentId)
    .then(() => res.json({ message: "Comment deleted successfully" }))
    .catch(next);
}
