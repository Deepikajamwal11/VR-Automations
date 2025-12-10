
var express = require('express');
var router = express.Router();
const admin = require("../controller/adminController");



router.post("/create", admin.create);
router.get("/userlist", admin.userList);
router.post('/userstatus', admin.status);
router.post('/trigger-sync', admin.triggerSync); // Manual sync trigger

module.exports = router;