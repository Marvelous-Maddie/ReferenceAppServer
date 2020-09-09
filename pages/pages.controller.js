const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const Role = require("../_helpers/role");
const pageService = require("./page.service");

// routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authorize(Role.Admin), createSchema, create);
router.put("/:id", authorize(Role.Admin), updateSchema, update);
router.delete("/:id", authorize(Role.Admin), _delete);

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
    subtitle: Joi.string().allow(""),
    content: Joi.string().allow(""),
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
  const schema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    subtitle: Joi.string().allow(""),
    content: Joi.string().allow(""),
  });
  console.log("validate the update");
  validateRequest(req, next, schema);
  console.log("after validate the update");
}

function update(req, res, next) {
  console.log("update page");
  pageService
    .update(req.params.id, req.body)
    .then((page) => res.json(page))
    .catch(next);
}

function _delete(req, res, next) {
  pageService
    .delete(req.params.id)
    .then(() => res.json({ message: "Page deleted successfully" }))
    .catch(next);
}
