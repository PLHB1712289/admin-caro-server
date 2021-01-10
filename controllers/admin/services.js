const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { adminModel } = require("../../models");

async function getAllAdmins(requestPayload = {}) {
  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.name ||
      requestPayload.username ||
      requestPayload.email ||
      requestPayload.right) &&
    keepNecessaryFields(requestPayload, ["name", "username", "email", "right"]);
  // Loc ket qua truong ao `right`
  if (filtering && filtering.right) {
    filtering.isSuperAdmin = null;
    if ("super admin".includes(filtering.right)) filtering.isSuperAdmin = true;
    if ("admin".includes(filtering.right.toLowerCase()))
      delete filtering.isSuperAdmin;

    delete filtering.right;
  }

  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({
      ...obj,
      [key]:
        typeof filtering[key] === "boolean"
          ? filtering[key]
          : new RegExp(filtering[key], "i"),
    }),
    {}
  );

  if (requestPayload.sortby === "right") {
    requestPayload.sortby = "isSuperAdmin";
  }
  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  const admins =
    filtering && filtering.isSuperAdmin === null
      ? []
      : await adminModel
          .find(filteringRegEx, null, {
            sort: sorting,
            skip: (paging.page - 1) * paging.perpage,
            limit: +paging.perpage,
          })
          .exec();
  const adminCount =
    filtering && filtering.isSuperAdmin === null
      ? 0
      : await adminModel.count(filteringRegEx);

  return { data: { admins, paging, sorting, total: adminCount } };
}

async function getAdminByUsername(username) {
  const admin = await adminModel.findOne({ username }).exec();
  if (admin) return { data: { admin } };
  return { error: true, message: "This user does not exist" };
}

async function updateAdminByUsername(username, info) {
  const admin = await adminModel
    .findOneAndUpdate({ username }, info, {
      new: true,
    })
    .exec();
  if (admin) return { data: { admin } };
  return { error: true, message: "This user does not exist" };
}

async function deleteAdminByUsername(username) {
  const admin = await adminModel.findOneAndDelete({ username }).exec();
  if (admin) return { data: { admin } };
  return { error: true, message: "This user does not exist" };
}

async function createAdmin(info) {
  // TODO: ma hoa mat khau
  try {
    const admin = await adminModel.create(info);
    return { data: { admin } };
  } catch (_) {
    return { error: true, message: "Cannot create this user" };
  }
}

module.exports = {
  getAllAdmins,
  getAdminByUsername,
  updateAdminByUsername,
  deleteAdminByUsername,
  createAdmin,
};
