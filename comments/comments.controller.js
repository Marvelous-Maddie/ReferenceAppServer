const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");

const authorize = require("_middleware/authorize");
const Role = require("_helpers/role");
const commentService = require("./comment.service");

// routes
router.get("/:pageId/", getAll);
router.post("/:pageId", createSchema, create);
router.put("/:pageId", updateSchema, update);
router.delete("/:pageId/:commentId", _delete); //   authorize(),

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
    _id: Joi.string().required(),
    content: Joi.string().required(),
  });

  // only admins can update role
  //if (req.user.role === Role.Admin) {
  //}

  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own account and admins can update any account
  /*   if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  } */
  const { pageId } = req.params;
  commentService
    .update(pageId, req.body)
    .then((comment) => res.json(comment))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own account and admins can delete any account
  /*   if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  } */
  const { pageId, commentId } = req.params;
  console.log(req.body);
  commentService
    .delete(pageId, commentId)
    .then(() => res.json({ message: "Comment deleted successfully" }))
    .catch(next);
}
