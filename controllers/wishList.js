const User = require('../models/user');
const Product = require('../models/product');
const Cart = require("../models/cart");



module.exports = {
    async showWishList(req, res, next) {
     

      if(req.user.wishList === undefined){
        return res.render("wishList.ejs",{});
      }
      else {

        const user = await User.findById(req.user._id);
        const wishList = user.wishList;
        // const { wishList } = req.user;
        // console.log(wishList);
        wishListArr = [];
    
        for (product_id in wishList.items) {
          wishListArr.push(product_id);
        }
    
        const products = await Product.find({ _id: { $in: wishListArr } })
          .populate({
            path: "author"
          })
          .exec();

        var wishListObj = {};
        products.map(product => {
          wishListObj[product._id] = 1;
        });
        // console.log(wishListObj);
    
        const wp = wishList.totalPrice;
        const wq = wishList.totalQty;
        return res.render("wishList.ejs",{wishListObj,wp,wq,wishList});
      }
      },


      async addToWishList(req, res, next) {
        const { p_id } = req.params;
        // console.log(req.user);
        let wishListConstructor = new Cart(
          req.user.wishList ? req.user.wishList : {}
        );
    
        const product = await Product.findById(p_id);
        const user = await User.findById(req.user._id);
    
        wishListConstructor.add(product, product._id);
        user.wishList = wishListConstructor;
    
        await user.save();
        console.log('saved product');
        req.flash('success', 'Product in wish list added successfully !!');
        return res.redirect("/wish-list");
      },


      async removeItemFromWishList(req, res, next) {
        if (!req.user || !req.user.wishList) {
          return res.redirect("back");
        }
        const user = await User.findById(req.user._id);
        let wishList = new Cart(req.user.wishList ? req.user.wishList : {});
    
        wishList.remove(req.params.p_id);
        user.wishList = wishList;
        await user.save();
        req.flash('success','product removed from Wishlist');
        res.redirect("/wish-list");
      }
}