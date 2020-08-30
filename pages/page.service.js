const db = require("_helpers/db");
const Role = require("_helpers/role");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const page = await db.Page.find();
  return page.map((x) => basicDetails(x));
}

async function getById(id) {
  const page = await getPage(id);
  return basicDetails(page);
}

async function create(page) {
  const newPage = await db.Page.create(page);
  return basicDetails(newPage);
}

async function update(id, page) {
  const pageToUpdate = await getPage(id);
  pageToUpdate = { ...page };
  await pageToUpdate.save();
  return basicDetails(pageToUpdate);
}

async function _delete(id) {
  const page = await getPage(id);
  await page.remove();
}

// helper functions

async function getPage(id) {
  if (!db.isValidId(id)) throw "Page not found";
  const page = await db.Page.findById(id);
  if (!page) throw "Page not found";
  return page;
}

function basicDetails(page) {
  const { _id, title, slug, subtitle, content, comments } = account;
  return { _id, title, slug, subtitle, content, comments };
}
