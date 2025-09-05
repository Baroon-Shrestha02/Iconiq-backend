const express = require("express");
const {
  adminLogin,
  adminLogout,
  signOut,
  adminMe,
} = require("../Controllers/adminLogin");

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", signOut);
router.get("/me", adminMe);

module.exports = router;
