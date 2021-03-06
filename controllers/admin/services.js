const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { adminModel } = require("../../models");
const bcrypt = require("bcryptjs");
const config = require("../../config");

async function getAllAdmins(requestPayload = {}) {
  const paging = {
    page: requestPayload.page || 1,
    perpage: requestPayload.perpage || 10,
  };
  const filtering =
    (requestPayload.name || requestPayload.username || requestPayload.email) &&
    keepNecessaryFields(requestPayload, ["name", "username", "email"]);
  // Loc ket qua truong ao `right`
  let defaultFiltering = {};
  // Xu ly truong `isSuperAdmin`
  if (typeof requestPayload.isSuperAdmin !== "undefined") {
    defaultFiltering = { isSuperAdmin: requestPayload.isSuperAdmin };
  }

  const filteringRegEx = Object.keys(filtering || {}).reduce(
    (obj, key) => ({ ...obj, [key]: new RegExp(filtering[key], "i") }),
    defaultFiltering
  );

  const sorting = {
    [requestPayload.sortby || "_id"]: requestPayload.sortmode || "desc",
  };
  const admins = await adminModel
    .find(filteringRegEx, null, {
      sort: sorting,
      skip: (paging.page - 1) * paging.perpage,
      limit: +paging.perpage,
    })
    .exec();
  const adminCount = await adminModel.count(filteringRegEx);

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
    const hashPassword = bcrypt.hashSync(info.password, config.SECRET_KEY_BCRYPT);
    info.password=hashPassword;
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
