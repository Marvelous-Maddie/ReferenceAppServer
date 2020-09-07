const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("_helpers/send-email");
const db = require("_helpers/db");
const Role = require("_helpers/role");
const pageService = require("../pages/page.service");

module.exports = {
  getAll,
  getOne,
  create,
  update,
  delete: _delete,
};

async function getAll(pageId) {
  const page = await pageService.getPage(pageId);
  if (!page) return [];
  return page.comments.map((x) => basicDetails(x));
}

async function getOne(pageId, commentId) {
  const page = await pageService.getPage(pageId);
  if (!page) return null;
  return page.comments.find((x) => x._id == commentId);
}

async function create(pageId, comment) {
  console.log(pageId);
  const page = await pageService.getPage(pageId);
  page.comments.push(comment);

  // save account
  await page.save();

  const newComment = page.comments[page.comments.length - 1];

  return basicDetails(newComment);
}

async function update(pageId, comment) {
  const page = await pageService.getPage(pageId);

  const ucomment = await page.comments.id(comment._id);

  ucomment.content = comment.content;

  await page.save();

  console.log(ucomment);

  return basicDetails(ucomment);
}

async function _delete(pageId, commentId) {
  console.log(commentId);
  const page = await getPage(pageId);
  const delComment = await page.comments.id(commentId);
  console.log(delComment);
  delComment.remove();
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
  const comment = page.comments.find((x) => x.id === commentId);
  if (!comment) throw "Comment not found";
  return comment;
}

function basicDetails(comment) {
  console.log(comment);
  const { _id, content, userName, userId, updatedAt, createdAt } = comment;
  return { _id, content, userName, userId, updatedAt, createdAt };
}
