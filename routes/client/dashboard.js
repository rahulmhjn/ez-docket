const express = require("express"),
  router = express.Router(),
  {
    asyncErrorHandler,
    isLoggedIn,
    isClient
  } = require("../../controllers/auth"),

  {
    showdashboard
  } = require('../../controllers/client/dashboard');



  router.get(
    "/showDashboard",
    isLoggedIn,
    isClient,
    asyncErrorHandler(showdashboard)
  );

  module.exports = router;