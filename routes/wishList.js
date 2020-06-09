const express = require('express'),
 router = express.Router(),
 {
     isLoggedIn,
     asyncErrorHandler
     
 } = require('../controllers/auth'),

 {
     showWishList,
     addToWishList,
     removeItemFromWishList

 } = require('../controllers/wishList');

 //@Route    GET '/wish-list'
//@desc     Show all wish list items of current user
//@access   Private

router.get('/', isLoggedIn, showWishList);

 //@Route    GET '/wish-list/add-to-wishList/:p_id'
//@desc     Add item to wishlist
//@access   Private

router.get(
    '/add-to-wishList/:p_id',
    isLoggedIn,
    asyncErrorHandler(addToWishList)
  );


  router.get(
    '/remove/:p_id',
    isLoggedIn,
    asyncErrorHandler(removeItemFromWishList)
  );


  module.exports = router;