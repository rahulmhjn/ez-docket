const User = require("../../models/user");
const Product = require('../../models/product');

module.exports = {
    async showdashboard(req,res,next){
        console.log("rahullllllll");
        res.render('client/dashboard');
    }
}