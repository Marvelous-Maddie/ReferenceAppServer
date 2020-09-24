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
    subtitle: Joi.string().allow(""),
    content: Joi.string().allow(""),
    ownerName: Joi.string().required(),
    ownerId: Joi.string().required(),
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
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own pages and admins can update any page
  const pageId = req.params.id;
  const page = pageService.getById(pageId);
  if (!page) return res.status(404).json({ message: "Page not found" });

  if (page.ownerId !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  pageService
    .update(pageId, req.body)
    .then((page) => res.json(page))
    .catch(next);
}

function _delete(req, res, next) {
  const pageId = req.params.id;
  const page = pageService.getById(pageId);
  if (!page) return res.status(404).json({ message: "Page not found" });

  if (page.ownerId !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  pageService
    .delete(pageId)
    .then(() => res.json({ message: "Page deleted successfully" }))
    .catch(next);
}
