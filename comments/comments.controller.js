const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");

const authorize = require("_middleware/authorize");
const Role = require("_helpers/role");
const commentService = require("./comment.service");

// routes
router.get("/:pageId/", getAll);
router.get("/:pageId/:commentId", getById);
router.post("/:pageId", authorize(), createSchema, create);
router.put("/:pageId/:commentId", authorize(), updateSchema, update);
router.delete("/:pageId/:commentId", authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
  const { pageId } = req.params;
  commentService
    .getAll(pageId)
    .then((comments) => res.json(comments))
    .catch(next);
}

function getById(req, res, next) {
  const { pageId, commentId } = req.params;
  commentService
    .getById(pageId, commentId)
    .then((comment) => (comment ? res.json(comment) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    content: Joi.string().required(),
    by: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  commentService
    .create(req.body)
    .then((account) => res.json(account))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    content: Joi.string().required(),
  };

  // only admins can update role
  if (req.user.role === Role.Admin) {
  }

  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own account and admins can update any account
  /*   if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  } */
  const { pageId, commentId } = req.params;
  commentService
    .update(pageId, commentId, req.body)
    .then((comment) => res.json(comment))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own account and admins can delete any account
  /*   if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  } */
  const { pageId, commentId } = req.params;
  commentService
    .delete(pageId, commentId)
    .then(() => res.json({ message: "Account deleted successfully" }))
    .catch(next);
}
