const db = require("_helpers/db");
const Role = require("_helpers/role");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getPage,
};

async function getAll() {
  console.log("load All");
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
  const updatedPage = await db.Page.findByIdAndUpdate(id, page, {
    new: true,
  });

  return basicDetails(updatedPage);
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
  const {
    _id,
    title,
    slug,
    subtitle,
    content,
    comments,
    ownerName,
    ownerId,
  } = page;
  return { _id, title, slug, subtitle, content, comments, ownerName, ownerId };
}
