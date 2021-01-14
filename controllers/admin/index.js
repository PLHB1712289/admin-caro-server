const { keepNecessaryFields } = require("../../helpers/objectOperations");
const { responeToClient } = require("../../helpers/response");
const {
  getAllAdmins,
  getAdminByUsername,
  updateAdminByUsername,
  deleteAdminByUsername,
  createAdmin,
} = require("./services");

async function getAdmins(req, res) {
  // Trich xuat cac thong tin tu payload
  responeToClient(res, await getAllAdmins(req.query));
}

async function getAdmin(req, res) {
  responeToClient(res, await getAdminByUsername(req.params.username));
}

async function updateAdmin(req, res) {
  // Chi cho phep thay doi cac thong tin binh thuong
  const fieldWhiteList = [
    "name",
    "email",
    "username",
    "password",
    "isSuperAdmin",
  ];

  responeToClient(
    res,
    await updateAdminByUsername(
      req.params.username,
      keepNecessaryFields(req.body, fieldWhiteList)
    )
  );
}

async function deleteAdmin(req, res) {
  responeToClient(res, await deleteAdminByUsername(req.params.username));
}

async function createAdminAccount(req, res) {
  // Chi luu cac thong tin can luu
  const fieldWhiteList = [
    "name",
    "email",
    "username",
    "password",
    "isSuperAdmin",
  ];
  
  responeToClient(
    res,
    await createAdmin(keepNecessaryFields(req.body, fieldWhiteList))
  );
}

module.exports = {
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  createAdminAccount,
};
