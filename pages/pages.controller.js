const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../comments/node_modules/_middleware/validate-request");
const authorize = require("../comments/node_modules/_middleware/authorize");
const Role = require("../comments/node_modules/_helpers/role");
const pageService = require("./page.service");

// routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authorize(), createSchema, create);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
  pageService
    .getAll()
    .then((page) => res.json(page))
    .catch(next);
}

function getById(req, res, next) {
  pageService
    .getById(req.params.id)
    .then((page) => (page ? res.json(page) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    subtitle: Joi.string(),
    content: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  pageService
    .create(req.body)
    .then((page) => res.json(page))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    title: Joi.string().required(),
    slug: Joi.string().required(),
    subtitle: Joi.string(),
    content: Joi.string(),
  };
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  pageService
    .update(req.params.id, req.body)
    .then((page) => res.json(page))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own account and admins can delete any account
  pageService
    .delete(req.params.id)
    .then(() => res.json({ message: "Page deleted successfully" }))
    .catch(next);
}
