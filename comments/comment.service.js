const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("_helpers/send-email");
const db = require("_helpers/db");
const Role = require("_helpers/role");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll(pageId) {
  const page = await db.Pages.findById(pageId);
  if (!page) return [];
  return page.comments.map((x) => basicDetails(x));
}

async function getById(pageId, commentId) {
  const page = await getPage(pageId);
  const comment = await getComment(page, commentId);
  return basicDetails(comment);
}

async function create(pageId, comment) {
  const page = await getPage(pageId);
  page.comments.push(comment);

  // save account
  await page.save();

  return basicDetails(comment);
}

async function update(pageId, commentId, commentText) {
  const page = await getPage(pageId);
  const comment = getComment(page, commentId);
  comment.content = commentText;

  await page.save();

  return basicDetails(comment);
}

async function _delete(pageId, commentId) {
  const page = await getPage(pageId);
  page.comments = page.comments.filter(x._id !== commentId);

  await page.save();
}

// helper functions

async function getPage(id) {
  if (!db.isValidId(id)) throw "Page not found";
  const page = await db.Page.findById(id);
  if (!page) throw "Page not found";
  return page;
}

async function getComment(page, commentId) {
  const comment = page.comments.find((x) => x.id === id);
  if (!comment) throw "Comment not found";
  return comment;
}

function basicDetails(comment) {
  const { _id, content, userName, userId, updated } = comment;
  return { _id, content, userName, userId, updated };
}
